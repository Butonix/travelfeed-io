import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import getSlug from 'speakingurl';
import { APP_VERSION } from '../../config';
import json2md from '../../helpers/json2md';
import md2json from '../../helpers/md2json';
import {
  getImageList,
  getLinkList,
  getMentionList,
} from '../../helpers/parsePostContents';
import { getUser } from '../../helpers/token';
import EasyEditor from './EasyEditor';
import PublishBtn from './PublishBtn';

const CommentEditor = props => {
  const defVal = props.defaultValue ? md2json(props.defaultValue) : undefined;
  const [content, setContent] = useState(defVal ? defVal.json : '');
  const [publishThis, setPublishThis] = useState(undefined);

  const handleEditorChange = value => {
    setContent(value);
  };

  const triggerPublish = () => {
    const title = '';
    const parentAuthor = props.parent_author;
    const parentPermlink = props.parent_permlink;
    const commenttime = getSlug(new Date().toJSON()).replace(/-/g, '');
    const permlink =
      (props.editMode && props.permlink) ||
      `re-${parentPermlink}-${commenttime}`;
    const body = json2md(content);
    const jsonMetadata = {};
    jsonMetadata.tags = ['travelfeed'];
    jsonMetadata.app = APP_VERSION;
    jsonMetadata.community = 'travelfeed';
    // Parse comment for images. Todo: Parse links
    const imageList = getImageList(body);
    const linkList = getLinkList(body);
    const mentionList = getMentionList(body);
    if (imageList.length > 0) jsonMetadata.image = imageList;
    if (linkList.length > 0) jsonMetadata.links = linkList;
    if (mentionList.length > 0) jsonMetadata.users = mentionList;
    const author = getUser();
    setPublishThis({
      author,
      title,
      body,
      parentPermlink,
      parentAuthor,
      jsonMetadata: JSON.stringify(jsonMetadata),
      permlink,
      commentOptions: undefined,
    });
  };

  const pastPublish = res => {
    if (res.success) {
      if (props.editMode) {
        props.onCommentEdit({
          body: publishThis.body,
        });
      } else {
        props.onCommentAdd({
          body: publishThis.body,
          permlink: publishThis.permlink,
        });
      }
    }
    if (!props.editMode && res.success) props.onClose();
  };

  return (
    <Fragment>
      <div className="border textPrimary postcontent pl-2">
        <EasyEditor
          holderId={`${props.editMode ? 're' : 'edit'}_${props.parent_author}_${
            props.parent_permlink
          }`}
          onChange={handleEditorChange}
          data={content}
          placeholder="Reply"
          defaultValue={props.defaultValue}
        />
      </div>
      <PublishBtn
        publishThis={publishThis}
        pastPublish={res => pastPublish(res)}
        triggerPublish={triggerPublish}
        disabled={content.length < 1}
        label={(props.editMode && 'Edit') || 'Reply'}
      />
    </Fragment>
  );
};

CommentEditor.defaultProps = {
  editMode: false,
  onCommentAdd: undefined,
  onClose: undefined,
  defaultValue: '',
  permlink: '',
};

CommentEditor.propTypes = {
  permlink: PropTypes.string,
  defaultValue: PropTypes.string,
  onCommentAdd: PropTypes.func,
  onCommentEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  editMode: PropTypes.bool,
  parent_author: PropTypes.string.isRequired,
  parent_permlink: PropTypes.string.isRequired,
};

export default CommentEditor;
