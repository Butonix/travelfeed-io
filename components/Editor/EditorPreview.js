import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import parseBody from '../../helpers/parseBody';
import { getUser } from '../../helpers/token';
import PostContent from '../Post/PostContent';
import PostTitle from '../Post/PostTitle';

const EditorPreview = props => {
  let htmlBody = { __html: <br /> };
  if (props.content && props.content.length > 1) {
    htmlBody = { __html: parseBody(props.content, { lazy: false }) };
  }
  return (
    <div>
      <Grid container spacing={0} alignItems="center" justify="center">
        <PostTitle img_url={props.img_url} title={props.title} />
        <Grid item lg={7} md={8} sm={11} xs={12} className="pb-4">
          <Card>
            <PostContent
              author={getUser()}
              permlink={props.permlink}
              display_name={getUser()}
              created_at={Date.now()}
              readtime={props.readtime}
              content={
                <div
                  className="textPrimary postcontent"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={htmlBody}
                />
              }
              latitude={props.latitude}
              longitude={props.longitude}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

EditorPreview.defaultProps = {
  img_url: '',
  content: '',
  title: '',
  permlink: '',
  latitude: undefined,
  longitude: undefined,
};

EditorPreview.propTypes = {
  readtime: PropTypes.arrayOf(PropTypes.any).isRequired,
  img_url: PropTypes.string,
  content: PropTypes.string,
  title: PropTypes.string,
  permlink: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};

export default EditorPreview;
