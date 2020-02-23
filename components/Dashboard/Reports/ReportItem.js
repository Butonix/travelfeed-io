import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { parseBody } from 'tf-post-parser';
import { SET_AS_REPORT_REVIEWED } from '../../../helpers/graphql/reports';
import { GET_POST } from '../../../helpers/graphql/singlePost';
import graphQLClient from '../../../helpers/graphQLClient';
import parseHtmlToReact from '../../../helpers/parseHtmlToReact';
import DetailedExpansionPanel from '../../Editor/DetailedExpansionPanel';
import PostContent from '../../Post/PostContent';
import BlacklistMenu from '../Curation/BlacklistMenu';
import ConfirmBtn from '../Newsletter/ConfirmBtn';

const redTheme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const ReportItem = props => {
  const { author, permlink, reason, details, reporter } = props.report;

  const [show, setShow] = useState(true);
  const [blacklistOpen, setBlacklistOpen] = useState(false);

  const handleMarkAsReviewed = () => {
    graphQLClient(SET_AS_REPORT_REVIEWED, { author, permlink }).then(
      ({ setAsReportReviewed }) => {
        console.log(setAsReportReviewed);
      },
    );
    setBlacklistOpen(false);
    setShow(false);
  };

  const { data } = useQuery(GET_POST, {
    variables: { author, permlink },
    ssr: true,
  });

  let postContent = <div>Loading...</div>;

  if (data && data.post) {
    const {
      post_id,
      body,
      json,
      category,
      isTf,
      display_name,
      created_at,
      country_code,
      subdivision,
      tags,
      curation_score,
      title,
      img_url,
    } = data.post;
    const htmlBody = parseBody(body, {});
    const sanitized = sanitize(htmlBody, { allowedTags: [] });
    const readtime = readingTime(sanitized);
    const reactParsed = parseHtmlToReact(htmlBody, {
      hideimgcaptions: !isTf,
    });
    const { bodyText } = reactParsed;
    const bodycontent = (
      // eslint-disable-next-line react/no-danger
      <div className="textPrimary postcontent postCardContent postanchors">
        <Typography gutterBottom variant="h2">
          {title}
        </Typography>
        {bodyText}
      </div>
    );

    postContent = (
      <PostContent
        showWordCount
        author={author}
        id={post_id}
        body={body}
        json={json}
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
    );
  }

  return (
    <>
      {show && (
        <DetailedExpansionPanel
          fullWidth
          title={reason}
          selector={
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-9 col-md-10 col-sm-12 col-12">
                  Reported by{' '}
                  <strong>{reporter ? `@${reporter}` : 'anonymous'}</strong>:{' '}
                  <em>{details}</em>
                  {postContent}
                </div>
              </div>
            </div>
          }
          actions={
            <>
              <MuiThemeProvider theme={redTheme}>
                <Button
                  className="m-1"
                  variant="contained"
                  onClick={() => setBlacklistOpen(true)}
                  color="primary"
                >
                  Blacklist Post
                </Button>
              </MuiThemeProvider>
              <ConfirmBtn
                btnText="Discard report"
                dialogText="Discard this report?"
                onConfirm={handleMarkAsReviewed}
              />
            </>
          }
        />
      )}
      <BlacklistMenu
        open={blacklistOpen}
        onConfirm={handleMarkAsReviewed}
        onCancel={() => setBlacklistOpen(false)}
        author={author}
        permlink={permlink}
      />
    </>
  );
};

export default ReportItem;
