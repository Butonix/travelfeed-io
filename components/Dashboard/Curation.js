import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { Query } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { GET_CURATION_AUTHOR_NOTES } from '../../helpers/graphql/curation';
import { GET_POSTS } from '../../helpers/graphql/posts';
import graphQLClient from '../../helpers/graphQLClient';
import parseBody from '../../helpers/parseBody';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import PostContent from '../Post/PostContent';
import EditAuthorNotesDialog from './Curation/EditAuthorNotesDialog';

const Curation = () => {
  const [posts, setPosts] = useState([]);
  const [postPosition, setPostPosition] = useState(0);
  const [curationAuthorNotes, setCurationAuthorNotes] = useState([]);

  const handleFetchedPosts = fetchedPosts => {
    setPosts(fetchedPosts);
    const newPosts = fetchedPosts;
    const authors = [];
    fetchedPosts.forEach((post, i) => {
      authors.push(post.author);
      fetch(`https://blacklist.usesteem.com/user/${post.author}`)
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res.blacklisted.length > 0)
            newPosts[i].blacklisted = res.blacklisted;
        });
    });
    setPosts(newPosts);
    graphQLClient(GET_CURATION_AUTHOR_NOTES, { authors }).then(
      ({ getCurationAuthorNotes }) => {
        if (getCurationAuthorNotes && getCurationAuthorNotes.length > 0) {
          setCurationAuthorNotes(getCurationAuthorNotes);
        }
      },
    );
  };

  const handleNext = () => {
    const newPostPosition = postPosition + 1;
    if (posts.length > newPostPosition) setPostPosition(newPostPosition);
  };

  const handleBack = () => {
    const newPostPosition = postPosition - 1;
    if (newPostPosition >= 0) setPostPosition(newPostPosition);
  };

  return (
    <>
      <Query
        query={GET_POSTS}
        variables={{
          orderby: 'created_at',
          min_curation_score: 0,
          limit: 10,
        }}
      >
        {({ data }) => {
          if (data && data.posts) handleFetchedPosts(data.posts);
          if (posts.length < postPosition) return <>No more posts </>;
          if (posts && posts.length > 0) {
            const {
              author,
              post_id,
              body,
              json,
              latitude,
              longitude,
              category,
              permlink,
              display_name,
              created_at,
              country_code,
              subdivision,
              tags,
              curation_score,
              title,
              img_url,
              app,
              blacklisted,
            } = posts[postPosition];
            const isTf = app && app.split('/')[0] === 'travelfeed';
            const htmlBody = parseBody(body, {});
            const sanitized = sanitize(htmlBody, { allowedTags: [] });
            const readtime = readingTime(sanitized);
            const bodyText = parseHtmlToReact(htmlBody, {
              cardWidth: 800,
              hideimgcaptions: !isTf,
              lazy: false,
            });
            const bodycontent = (
              // eslint-disable-next-line react/no-danger
              <div className="textPrimary postcontent postCardContent">
                {bodyText}
              </div>
            );
            let notes;
            let attentionColor;
            let attentionLevel;
            if (curationAuthorNotes.length > 0) {
              let index;
              curationAuthorNotes.forEach((note, i) => {
                if (note.author === author) index = i;
              });
              if (index) {
                notes = curationAuthorNotes[index].notes;
                attentionLevel = curationAuthorNotes[index].attentionLevel;
                if (attentionLevel === '1') attentionColor = 'bg-success';
                else if (attentionLevel === '2') attentionColor = 'bg-warning';
                else if (attentionLevel === '3') attentionColor = 'bg-danger';
              }
            }
            return (
              <>
                <Card>
                  <CardContent>
                    <div className="container">
                      <div className="row">
                        <div
                          className={`col ${
                            blacklisted && blacklisted.length > 0
                              ? 'bg-danger'
                              : attentionColor
                          }`}
                        >
                          Author notes:
                          <p>{notes}</p>
                          <p>
                            {blacklisted && blacklisted.length > 0
                              ? `Blacklisted by ${blacklisted}`
                              : ''}{' '}
                          </p>
                          <EditAuthorNotesDialog
                            author={author}
                            initialAttentionLevel={attentionLevel}
                            initialNotes={notes}
                          />
                        </div>
                        <div className="col">Author score</div>
                        <div className="col">Author posts submitted</div>
                        <div className="col">
                          Copy full text (plagiarism check)
                        </div>
                        <div className="col">Reply (from own acc/ from tf)</div>
                        <div className="col">
                          <Button
                            onClick={handleBack}
                            color="primary"
                            variant="contained"
                          >
                            Back{' '}
                          </Button>
                        </div>
                        <div className="col">
                          <Button
                            onClick={handleNext}
                            color="primary"
                            variant="contained"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item lg={8} md={10} sm={11} xs={12} className="pb-4">
                    <Card>
                      <PostContent
                        author={author}
                        id={post_id}
                        body={body}
                        json={json}
                        latitude={latitude}
                        longitude={longitude}
                        category={category}
                        isTf={isTf}
                        permlink={permlink}
                        display_name={display_name}
                        created_at={created_at}
                        readtime={readtime}
                        content={bodycontent}
                        country_code={country_code}
                        subdivision={subdivision}
                        tags={tags}
                        curationScore={curation_score}
                        title={title}
                        img_url={img_url}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </>
            );
          }
          return <>Loading...</>;
        }}
      </Query>
    </>
  );
};

export default Curation;
