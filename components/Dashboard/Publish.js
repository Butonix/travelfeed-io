// Todo: Image upload.
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputBase from '@material-ui/core/InputBase';
// import { UPLOAD_IMAGE } from "../../helpers/graphql/upload";
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Router from 'next/router';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import getSlug from 'speakingurl';
import { APP_VERSION, ROOTURL } from '../../config';
import { getImageList } from '../../helpers/getImage';
import { SAVE_DRAFT } from '../../helpers/graphql/drafts';
import json2Html from '../../helpers/json2Html';
import { getUser } from '../../helpers/token';
import Editor from '../Editor/Editor';
// import dynamic from "next/dynamic";
import HtmlEditor from '../Editor/HTMLEditor';
import HtmlEditorPreview from '../Editor/HTMLEditorPreview';
import LocationPicker from '../Editor/LocationPickerButton';
import PostPreview from '../Editor/PostPreview';
import TagPicker from '../Editor/TagPicker';
// import { debounce } from "lodash";
import PostMap from '../Maps/PostMap';

class PostEditor extends Component {
  state = {
    title: '',
    content: undefined,
    htmlContent: undefined,
    tags: undefined,
    completed: 0,
    location: undefined,
    codeEditor: false,
    saved: true,
    // codeEditor: true
  };

  newNotification(notification) {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      this.props.enqueueSnackbar(notification.message, { variant });
      if (notification.success === true) {
        this.setState({ success: true });
      }
    }
  }

  changeToHtmlEditor() {
    let htmlContent = '';
    if (this.state.content) {
      htmlContent = json2Html(this.state.content);
    }
    // Generate new ID to not overwrite the current draft
    const id = `${getUser()}-${getSlug(new Date().toJSON()).replace(/-/g, '')}`;
    this.setState({ htmlContent, codeEditor: true, id });
  }

  handleTitleEditorChange = title => {
    this.setState({ title: title.target.value });
  };

  // onEditorChange = content => {
  //   this.setState({ content });
  //   console.log(content)
  // };
  handleEditorChange = content => {
    // console.log(content);
    this.setState({ content });
  };

  handleHtmlEditorChange = htmlContent => {
    // console.log(htmlContent);
    this.setState({ htmlContent });
  };

  handleTagsEditorChange(tags) {
    this.setState({ tags: tags.target.value });
  }

  onLocationPick = ({ latitude, longitude }) => {
    // console.log({ latitude, longitude });
    this.setState({ location: { latitude, longitude } });
  };

  componentDidMount() {
    const json = this.props.edit.json
      ? JSON.parse(this.props.edit.json)
      : undefined;
    const title = this.props.edit.title ? this.props.edit.title : '';
    const content =
      this.props.edit.body && this.props.edit.isCodeEditor === false
        ? this.props.edit.body
        : {
            time: 1554920381017,
            blocks: [
              {
                type: 'header',
                data: {
                  text: 'Hello Editor.js',
                  level: 2,
                },
              },
            ],
            version: '2.12.4',
          };
    const htmlContent =
      this.props.edit.body && this.props.edit.isCodeEditor === true
        ? this.props.edit.body
        : undefined;
    const tags = json && json.tags ? json.tags : ['travelfeed'];
    const location = json && json.location ? json.location : undefined;
    const id = this.props.edit.id
      ? this.props.edit.id
      : `${getUser()}-${getSlug(new Date().toJSON()).replace(/-/g, '')}`;
    const mounted = true;
    const codeEditor = this.props.edit.isCodeEditor
      ? this.props.edit.isCodeEditor
      : false;
    this.setState({
      title,
      content,
      htmlContent,
      tags,
      location,
      id,
      mounted,
      codeEditor,
    });
    // Save draft every 20 seconds
    this.interval = setInterval(() => this.setState({ saved: false }), 20000);
  }

  componentWillUnmount() {
    // Stop saving drafts
    clearInterval(this.interval);
  }

  progress = () => {
    // Publish animation
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  async success() {
    const sleep = milliseconds => {
      // eslint-disable-next-line no-undef
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
    await sleep(10000);
    clearInterval(this.timer);
    this.setState({ completed: 0 });
  }

  handleTagClick = op => {
    this.setState(op);
  };

  publishPost() {
    let parentAuthor = '';
    let parentPermlink = 'travelfeed';
    const { title } = this.state;
    let permlink = getSlug(title);
    let body = this.state.content;
    const { location } = this.state;
    const imageList = getImageList(body);
    const metadata = {};
    metadata.tags = this.state.tags;
    metadata.app = APP_VERSION;
    metadata.community = 'travelfeed';
    if (imageList !== null) {
      metadata.image = imageList;
    }
    if (!this.props.editMode) {
      body += `<hr /><center>View this post <a href="https://travelfeed.io/@${username}/${permlink}">on the TravelFeed dApp</a> for the best experience.</center>`;
    }
    if (location !== undefined) {
      metadata.coordinates = [location.latitude, location.longitude];
      if (!this.props.editMode || location !== this.props.edit.location) {
        body += `\n\n[//]:# (!steemitworldmap ${location.latitude} lat ${
          location.longitude
        } long  d3scr)`;
      }
    }
    // Todo: Parse body for images and links and include them in the json_metadata
    let username = getUser();
    if (this.props.type == 'comment') {
      const commenttime = getSlug(new Date().toJSON()).replace(/-/g, '');
      permlink = `re-${this.props.parent_permlink}-${commenttime}`;
      parentAuthor = this.props.parent_author;
      parentPermlink = this.props.parent_permlink;
    }
    if (this.props.editMode) {
      permlink = this.props.edit.permlink;
    }
    this.timer = setInterval(this.progress, 60);
    this.setState({ user: username, permlink });
    console.log(
      parentAuthor,
      parentPermlink,
      permlink,
      title,
      body,
      JSON.stringify(metadata),
      'post',
    );
    // comment(
    // parentAuthor,
    // parentPermlink,
    // permlink,
    // title,
    // body,
    // metadata,
    // this.props.type
    // ).then(result => {
    //   this.newNotification(result);
    // });
  }

  render() {
    const bodyText = 'aaaa';
    const sanitized = sanitize(bodyText, { allowedTags: [] });
    let wordCount = '';
    let readTime = '';
    if (this.state.codeEditor) {
      const readingtime = this.state.htmlContent
        ? readingTime(this.state.htmlContent)
        : { words: 0, text: '0 min' };
      wordCount = readingtime.words;
      readTime = readingtime.text;
    } else {
      let html = '';
      this.state.content &&
        this.state.content.blocks &&
        this.state.content.blocks.forEach(b => {
          if (b.type === 'paragraph' || b.type === 'header') {
            html += `${b.data.text} `;
          }
        });
      const readingtime = readingTime(html);
      wordCount = readingtime.words;
      readTime = readingtime.text;
    }
    const { location } = this.state;
    if (this.state.completed == 100 && this.state.success == true) {
      this.success();
      const url = `${ROOTURL}/@${this.state.user}/${this.state.permlink}`;
      Router.push(url);
    }

    // else if (this.state.mounted == true) {
    //   // Todo: If no id  is provided, make fresh id (constant!). Or work with own ID format (author-jsonstring) instead of mongo IDs?
    //   editor = (
    //   );
    // }
    const publishTooltip =
      wordCount < 250 || this.state.title === ''
        ? 'You need to write at least 250 words and set a title before you can publish your post'
        : 'Once published, your post cannot be deleted';
    return (
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col-12 p-1 pt-3">
              <Card>
                <CardContent>
                  <InputBase
                    autoFocus
                    inputProps={{
                      maxLength: 100,
                    }}
                    multiline
                    className="font-weight-bold inputtitle"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={this.handleTitleEditorChange}
                    fullWidth
                  />
                </CardContent>
              </Card>
            </div>
            <div className="col-xl-12 col-md-12 p-1">
              <Card>
                <CardContent>
                  <CardHeader
                    action={
                      <Fragment>
                        <span className="badge badge-secondary m-1 p-1 pl-2 pr-2 rounded">
                          {`${wordCount} words`}
                        </span>
                        <span className="badge badge-secondary m-1 p-1 pl-2 pr-2 rounded">
                          {readTime}
                        </span>
                      </Fragment>
                    }
                  />
                  <Mutation
                    mutation={SAVE_DRAFT}
                    variables={{
                      id: this.state.id,
                      title: this.state.title,
                      body:
                        (this.state.codeEditor && this.state.htmlContent) ||
                        JSON.stringify(this.state.content),
                      json: JSON.stringify({
                        tags: this.state.tags,
                        location: this.state.location,
                      }),
                      isCodeEditor: this.state.codeEditor,
                    }}
                  >
                    {saveDraft => {
                      if (!this.state.saved) {
                        if (wordCount > 1) saveDraft();
                        console.log('saving');
                        this.setState({ saved: true });
                      }
                      return (
                        <div>
                          {(this.state.codeEditor && (
                            <Fragment>
                              <HtmlEditor
                                data={this.state.htmlContent}
                                onChange={this.handleHtmlEditorChange}
                              />
                              {(this.state.htmlContent && (
                                <Tooltip title="Once you start typing, the only way to switch back for this post is to restore a previous draft">
                                  <span className="font-weight-bold font-size-8 cpointer text-muted">
                                    Switch to TravelFeed editor
                                  </span>
                                </Tooltip>
                              )) || (
                                <span
                                  className="font-weight-bold font-size-8 cpointer"
                                  onClick={() =>
                                    this.setState({ codeEditor: false })
                                  }
                                >
                                  Switch to TravelFeed editor
                                </span>
                              )}
                              <HtmlEditorPreview
                                preview={this.state.htmlContent}
                              />
                            </Fragment>
                          )) || (
                            <div>
                              <Editor
                                holder="editorjs-container"
                                onChange={this.handleEditorChange}
                                data={this.state.content}
                              />
                              <span
                                className="font-weight-bold font-size-8 cpointer"
                                onClick={() => this.changeToHtmlEditor()}
                              >
                                Switch to HTML+Markdown editor
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Mutation>
                </CardContent>
              </Card>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-xl-3 col-md-6 col-sm-12 p-1">
                  <Card>
                    <CardContent>
                      {this.state.tags && (
                        <TagPicker
                          initialValue={this.state.tags}
                          onChange={this.handleTagClick}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="col-xl-3 col-md-6 col-sm-12 p-1">
                  <Card>
                    <CardContent>
                      <label htmlFor="raised-button-file">
                        <Button
                          variant="contained"
                          color="secondary"
                          component="span"
                        >
                          Upload
                        </Button>
                      </label>
                      <TextField label="Featured image" margin="normal" />
                    </CardContent>
                  </Card>
                </div>
                <div className="col-xl-3 col-md-6 col-sm-12 p-1">
                  <Card>
                    <CardContent>
                      <h5 className="text-center">
                        Location
                        {this.state.location &&
                          `: ${this.state.location.latitude}, ${
                            this.state.location.longitude
                          }`}
                      </h5>
                      {location && (
                        <PostMap
                          location={{
                            coordinates: {
                              lat: this.state.location.latitude,
                              lng: this.state.location.longitude,
                            },
                          }}
                        />
                      )}
                      <div className="text-center p-1">
                        <LocationPicker
                          onPick={this.onLocationPick}
                          isChange={this.state.location}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-xl-3 col-md-6 col-sm-12 text-center p-1">
                  <Card>
                    <CardContent>
                      <PostPreview />
                      <Tooltip title={publishTooltip}>
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.publishPost()}
                            disabled={
                              wordCount < 250 || this.state.title === ''
                            }
                          >
                            {(this.props.editMode && 'Edit') || 'Publish'}
                          </Button>
                        </div>
                      </Tooltip>
                      {this.state.completed !== 0 && (
                        <CircularProgress
                          variant="determinate"
                          value={this.state.completed}
                          className="p-1"
                          size={35}
                          thickness={5}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

PostEditor.defaultProps = {
  initialValue: '',
  edit: {},
};

PostEditor.propTypes = {
  id: PropTypes.string,
  editMode: PropTypes.bool,
  comment: PropTypes.object,
  initialValue: PropTypes.string,
  edit: PropTypes.object,
  mode: PropTypes.string,
  type: PropTypes.string,
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(PostEditor);
