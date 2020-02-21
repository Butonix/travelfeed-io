import { teal } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { getAccount } from '../../helpers/steem';
import Link from '../../lib/Link';
import HeaderCard from '../General/HeaderCard';
import PhotoHeader from '../General/PhotoHeader';
import PostGrid from '../Grid/PostGrid';
import Head from '../Header/Head';
import Header from '../Header/Header';

const Community = props => {
  const [coverImage, setCoverImage] = useState('');

  const {
    name,
    title,
    about,
    flag_text,
    description,
    team,
    subscribers,
    num_authors,
  } = props.community;

  useEffect(() => {
    getAccount(props.community.name).then(profile => {
      if (profile.cover_image) setCoverImage(profile.cover_image);
      else
        setCoverImage(
          'https://steemitimages.com/p/vM1pGHgNcyCbeeHc87msUy15a6gssa8TxcCWDULWJwXbLzzTNUCuGN3v6fTG1Cxa3iA7dj2rixvqQw5FRuewtFGmCt4r68CcjssuoSnko5jXFk1x2hcHhcFRVCJFWE3Jf3rfCez',
        );
    });
  }, [props]);

  return (
    <>
      <Head title={title} image={coverImage} description={about} />
      <Header active="community" subheader={title} />
      <PhotoHeader
        hideButtons
        communityTag
        title={title}
        description={about}
        image={coverImage}
        query={{}}
        tag={name}
      />
      <div className="pb-3 container-fluid" id="containerInvisibleOnMobile">
        <div className="row">
          <div className="col-xl-9 col-lg-8 col-md-12 col-sm-12 col-12">
            <PostGrid
              active="topic"
              query={{
                tags: [name],
                orderby: 'curation_score DESC, total_votes',
                limit: 9,
              }}
              grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
              cardHeight={200}
              poststyle="grid"
            />
          </div>
          <div className="col-xl-3 col-lg-4 d-xl-block d-lg-block d-md-none d-xm-none d-none">
            <div className="pt-3">
              <HeaderCard
                nobottomborder
                title="About"
                titlesize="h5"
                background={teal[600]}
                content={
                  <>
                    <Typography variant="body1">
                      {description.replace(
                        'This community is part of TravelFeed. TravelFeed, the number one travel community on Steem, has stepped up the game with the launch of our own platform TravelFeed.io back in June, 2019. We curate all posts from this community, however, you can double your upvotes by posting through TravelFeed.io.',
                        '',
                      ) || about}
                    </Typography>
                    <Divider className="mt-3 mb-3" />
                    <div className="container pb-2">
                      <div className="row">
                        <div className="col-6 text-center">
                          <Typography variant="h4">{subscribers}</Typography>{' '}
                          <Typography variant="subtitle2">members</Typography>
                        </div>
                        <div className="col-6 text-center">
                          <Typography variant="h4">{num_authors}</Typography>{' '}
                          <Typography variant="subtitle2">authors</Typography>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
            <div className="pt-3">
              <HeaderCard
                nobottomborder
                title="Moderators"
                titlesize="h5"
                background={teal[600]}
                content={
                  <>
                    <Typography variant="body1">
                      <ul className="list-unstyled">
                        {team.map(member => {
                          if (member[1] === 'admin' || member[1] === 'mod')
                            return (
                              <li>
                                <Link
                                  color="textPrimary"
                                  as={`/@${member[0]}`}
                                  href="/[author]"
                                >
                                  <Typography color="primary" display="inline">
                                    @{member[0]}
                                  </Typography>
                                </Link>{' '}
                                <span className="badge badge-info">
                                  {member[2]}
                                </span>
                              </li>
                            );
                          return <></>;
                        })}
                      </ul>
                    </Typography>
                  </>
                }
              />
            </div>
            {flag_text && (
              <div className="pt-3">
                <HeaderCard
                  nobottomborder
                  title="Rules"
                  titlesize="h5"
                  background={teal[600]}
                  content={
                    <>
                      <Typography variant="body1">
                        <ol>
                          {flag_text.split(/\n/).map(rule => {
                            return <li>{rule}</li>;
                          })}
                        </ol>
                      </Typography>
                    </>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
    </>
  );
};

export default Community;
