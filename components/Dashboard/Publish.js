import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import PublishIcon from '@material-ui/icons/ChevronRight';
import SaveIcon from '@material-ui/icons/SaveAlt';
import EditIcon from '@material-ui/icons/Update';
import WarnIcon from '@material-ui/icons/Warning';
import { useTheme } from '@material-ui/styles';
import Router from 'next/router';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Mutation } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import getSlug from 'speakingurl';
import { APP_VERSION, ROOTURL } from '../../config';
import { post } from '../../helpers/actions';
import categoryFinder from '../../helpers/categoryFinder';
import { SAVE_DRAFT } from '../../helpers/graphql/drafts';
import json2md from '../../helpers/json2md';
import md2json from '../../helpers/md2json';
import parseBody from '../../helpers/parseBody';
import {
  getImageList,
  getLinkList,
  getMentionList,
} from '../../helpers/parsePostContents';
import postExists from '../../helpers/postExists';
import { invalidPermlink } from '../../helpers/regex';
import { getUser } from '../../helpers/token';
import BeneficiaryInput from '../Editor/BeneficiaryInput';
import Checks from '../Editor/Checks';
import DetailedExpansionPanel from '../Editor/DetailedExpansionPanel';
import EasyEditor from '../Editor/EasyEditor';
import EditorPreview from '../Editor/EditorPreview';
import FeaturedImageUpload from '../Editor/FeaturedImageUpload';
import HtmlEditor from '../Editor/HTMLEditor';
import LanguageSelector, { languages } from '../Editor/LanguageSelector';
import LocationPicker from '../Editor/LocationPicker';
import PayoutTypeSelector from '../Editor/PayoutTypeSelector';
import PermlinkInput from '../Editor/PermlinkInput';
import SwitchEditorModeButton from '../Editor/SwitchEditorModeButton';
import TagPicker from '../Editor/TagPicker';
import TitleEditor from '../Editor/TitleEditor';

const PostEditor = props => {
  const user = getUser();

  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [primaryTag, setPrimaryTag] = useState(undefined);
  const [completed, setCompleted] = useState(true);
  const [location, setLocation] = useState(undefined);
  const [locationCategory, setLocationCategory] = useState(undefined);
  const [codeEditor, setCodeEditor] = useState(false);
  const [saved, setSaved] = useState(true);
  const [featuredImage, setFeaturedImage] = useState(undefined);
  const [permlink, setPermlink] = useState('');
  const [permlinkValid, setPermlinkValid] = useState(true);
  const [id, setId] = useState(
    `${user}-${getSlug(new Date().toJSON()).replace(/-/g, '')}`,
  );
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [poweredUp, setPoweredUp] = useState(false);
  const [language, setLanguage] = useState('en');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [tagRecommendations, setTagRecommendations] = useState([]);

  const editMode = props.edit.editmode === 'true';

  let defaultTag = primaryTag;
  if (!primaryTag) {
    defaultTag = language === 'en' ? 'travelfeed' : `${language}-travelfeed`;
  }

  useEffect(() => {
    if (
      !(
        Object.entries(props.edit).length === 0 &&
        props.edit.constructor === Object
      )
    ) {
      const json =
        props.edit.json && props.edit.json !== 'undefined'
          ? JSON.parse(props.edit.json)
          : undefined;
      if (props.edit.title) setTitle(props.edit.title);
      if (props.edit.permlink && props.edit.permlink !== 'undefined')
        setPermlink(props.edit.permlink);
      if (props.edit.body) {
        setContent(
          props.edit.isCodeEditor === 'false'
            ? JSON.parse(props.edit.body)
            : props.edit.body,
        );
        if (props.edit.isCodeEditor !== 'false') setCodeEditor(true);
      }
      if (json) {
        if (json.tags && json.tags.length > 0) {
          if (editMode) setPrimaryTag(json.tags.splice(0, 1));
          setTags(json.tags);
        }
        if (json.location && json.location.longitude && json.location.latitude)
          setLocation(json.location);
        if (json.locationCategory) setLocationCategory(json.locationCategory);
        if (json.featuredImage) setFeaturedImage(json.featuredImage);
        if (json.beneficiaries) setBeneficiaries(json.beneficiaries);
        if (json.poweredUp) setPoweredUp(json.poweredUp);
        if (json.language) setLanguage(json.language);
      }
      if (props.edit.id) setId(props.edit.id);
    }
    setMounted(true);
    // Save draft every 20 seconds
    const interval = setInterval(() => setSaved(false), 20000);

    return () => {
      // "will unmount": stop saving drafts
      clearInterval(interval);
    };
  }, []);

  const handleTagClick = taglist => {
    setTags(taglist);
  };

  const handleEditorChange = value => {
    setContent(value);
  };

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const changeEditorMode = () => {
    if (!codeEditor) setContent(json2md(content));
    else {
      const md = md2json(content);
      if (!md.success) {
        newNotification({
          success: false,
          message: 'Editor mode could not be changed',
        });
        return;
      }
      setContent(md.json);
    }
    setCodeEditor(!codeEditor);
  };

  const sanitized = sanitize(
    parseBody(codeEditor ? content : json2md(content), {
      lazy: false,
      hideimgcaptions: true,
    }),
    { allowedTags: [] },
  );
  const readingtime = content
    ? readingTime(sanitized)
    : { words: 0, text: '0 min' };

  const checklist = [
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to set a title
        </span>
      ),
      hide: title !== '',
      checked: title !== '',
    },
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to set a valid permlink
        </span>
      ),
      hide:
        permlink === ''
          ? getSlug(title).length > 1 && !getSlug(title).match(invalidPermlink)
          : permlink.length > 1 && !permlink.match(invalidPermlink),
      checked:
        permlink === ''
          ? getSlug(title).length > 1 && !getSlug(title).match(invalidPermlink)
          : permlink.length > 1 && !permlink.match(invalidPermlink),
    },
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to write more than 250 words
        </span>
      ),
      hide: readingtime.words > 250,
      checked: readingtime.words > 250,
    },
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to select at least 1 more tag
        </span>
      ),
      hide: tags.length > 0,
      checked: tags.length > 0,
    },
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to set a location. If your post is not about a specific
          country/region/place (e.g. &quot;What to pack for travelling&quot;),
          please select &quot;traveladvice&quot; as tag
        </span>
      ),
      hide: location || tags.indexOf('traveladvice') !== -1,
      checked: location || tags.indexOf('traveladvice') !== -1,
    },
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You cannot set an existing permlink
        </span>
      ),
      hide: permlinkValid,
      checked: permlinkValid,
    },
    {
      label:
        'If you are using any media or text that are not your own, please make sure to get permission from the owner and name the source in the post',
    },
    {
      label:
        'You must post in the language selected, without the use of translation tools',
    },
    {
      label: 'Your post must not be a repost of your previous TravelFeed posts',
    },
  ];

  const publishPost = () => {
    setCompleted(false);
    if (
      !checklist[0].checked ||
      !checklist[1].checked ||
      !checklist[2].checked ||
      !checklist[3].checked ||
      !checklist[4].checked
    ) {
      newNotification({
        message:
          'Your post does not meet the requirements. Refer to the checklist for details.',
        success: false,
      });
      setCompleted(true);
      return;
    }
    const username = user;
    let perm = permlink;
    if (editMode) {
      perm = props.edit.permlink;
    }
    if (perm === '') perm = getSlug(title);
    postExists(username, perm).then(res => {
      if (res && !editMode) {
        setPermlinkValid(false);
        newNotification({
          message:
            'The permlink of your post has been used in a previous post. Please change it.',
          success: false,
        });
        setCompleted(true);
      } else {
        const parentAuthor = '';
        let parentPermlink;
        if (defaultTag) {
          parentPermlink = defaultTag;
        } else {
          parentPermlink =
            language === 'en' ? 'travelfeed' : `${language}-travelfeed`;
        }
        let body = content;
        if (!codeEditor) body = json2md(content);
        let imageList = getImageList(body);
        if (featuredImage) imageList = [featuredImage].concat(imageList);
        const linkList = getLinkList(body);
        const mentionList = getMentionList(body);
        const metadata = {};
        const taglist = [`${defaultTag}`, ...tags];
        metadata.tags = taglist;
        metadata.app = APP_VERSION;
        metadata.community = 'travelfeed';
        if (imageList.length > 0) metadata.image = imageList;
        if (linkList.length > 0) metadata.links = linkList;
        if (mentionList.length > 0) metadata.users = mentionList;
        if (!editMode) {
          body += `\n\n---\n\nView this post [on TravelFeed](https://travelfeed.io/@${username}/${perm}) for the best experience.`;
        }
        if (location) {
          metadata.location = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          if (location !== props.edit.location) {
            body += `\n\n[//]:# (!steemitworldmap ${location.latitude} lat ${location.longitude} long  d3scr)`;
          }
        }
        if (locationCategory) {
          metadata.location.category = locationCategory;
        }
        let commentOptions = '';
        if (beneficiaries.length > 0 || poweredUp) {
          let percent_steem_dollars = 10000;
          if (poweredUp) percent_steem_dollars = 0;
          const extensions = [];
          if (beneficiaries) {
            const bfs = [];
            beneficiaries.forEach(b => {
              bfs.push({ account: b.username, weight: b.percentage * 100 });
            });
            extensions.push([0, { beneficiaries: bfs }]);
          }
          commentOptions = {
            author: user,
            permlink: perm,
            allow_votes: true,
            allow_curation_rewards: true,
            max_accepted_payout: '1000000.000 SBD',
            percent_steem_dollars,
            extensions,
          };
        }
        post(
          user,
          title,
          body,
          parentPermlink,
          parentAuthor,
          metadata,
          perm,
          commentOptions,
        ).then(msg => {
          setCompleted(true);
          if (msg) {
            newNotification(msg);
            if (msg.success) setSuccess(true);
          } else
            newNotification({
              message: 'Post could not be posted',
              success: false,
            });
        });
      }
    });
  };

  if (completed && success) {
    const url = `${ROOTURL}/@${user}/${permlink}`;
    Router.push(url);
  }

  return (
    <Fragment>
      <Mutation
        mutation={SAVE_DRAFT}
        variables={{
          id,
          title,
          body: codeEditor ? content : JSON.stringify(content),
          json: JSON.stringify({
            tags,
            location,
            locationCategory,
            featuredImage,
            beneficiaries,
            poweredUp,
            language,
          }),
          isCodeEditor: codeEditor,
        }}
      >
        {saveDraft => {
          if (!saved) {
            setTagRecommendations(categoryFinder(sanitized));
            if ((readingtime.words > 0 || title !== '') && !editMode) {
              saveDraft();
            }
            setSaved(true);
          }
          return (
            <div className="container-fluid p-4">
              <div className="row">
                <div className="col-12 p-1">
                  <Card>
                    <CardContent>
                      <TitleEditor data={title} onChange={setTitle} />
                    </CardContent>
                  </Card>
                </div>
                <div className="col-xl-12 col-md-12 p-1">
                  <Card>
                    <CardContent>
                      <div>
                        {(codeEditor && mounted && (
                          <Fragment>
                            <HtmlEditor data={content} onChange={setContent} />
                          </Fragment>
                        )) || (
                          <div>
                            {mounted && (
                              <EasyEditor
                                onChange={handleEditorChange}
                                data={content}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <SwitchEditorModeButton
                          switchMode={() => changeEditorMode()}
                          codeEditor={codeEditor}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-12 p-1">
                  <DetailedExpansionPanel
                    expanded
                    title="Featured Image"
                    description="The featured image will be used as the post thumbail and as background at the top of your post"
                    helper="We recommend selecting an image that is not in your post."
                    value={featuredImage ? 'Uploaded' : 'None'}
                    selector={
                      <FeaturedImageUpload
                        featuredImage={featuredImage}
                        setFeaturedImage={setFeaturedImage}
                        placeholder="By default, the first image in your post is used. To choose a custom featured image, drag 'n' drop an image here, or click to select one!"
                      />
                    }
                  />
                </div>
                <div className="col-12 p-1">
                  <DetailedExpansionPanel
                    expanded
                    title="Location"
                    description="Drag the marker, use the search field or click on the GPS icon to pick a location"
                    helper="The location you set makes it easier for readers to find your post and gives you a chance for extra rewards."
                    value={
                      location &&
                      `${location.latitude}, ${location.longitude} ${
                        locationCategory ? `[${locationCategory}]` : ''
                      }`
                    }
                    selector={
                      <div className="w-100">
                        <LocationPicker
                          dark={theme.palette.type === 'dark'}
                          locationCategory={locationCategory}
                          setLocationCategory={setLocationCategory}
                          setLocation={setLocation}
                          value={location}
                        />
                      </div>
                    }
                  />
                </div>
                {editMode === false && (
                  <div className="col-12 p-1">
                    <DetailedExpansionPanel
                      title="Language"
                      description="Only one language can be selected. We encourage you to write separate posts for each language instead of bilingual posts since bilingual posts are often hard to read"
                      helper="The use of automated translation tools is not allowed. Currently, only English posts are displayed on TravelFeed, but we are working on introducing new languages soon. Currently, only English and Polish posts are curated - if you would like to run a curation team for your language, please contact us."
                      value={
                        languages.find(lang => lang.code === language).name
                      }
                      selector={
                        <LanguageSelector
                          onChange={setLanguage}
                          value={language}
                        />
                      }
                    />
                  </div>
                )}
                <div className="col-12 p-1">
                  <DetailedExpansionPanel
                    expanded
                    title="Tags"
                    description="You can set up to 10 custom tags here. Only lowercase letters, numbers and dashes are permitted"
                    helper="The first tag is set automatically based on your language selection. Selected tribe tags are highlighted. Use the space key to separeate tags. We do not recommend setting location-based tags since locations are indexed based on your location setting, not by tags."
                    value={`${defaultTag}${tags &&
                      tags.map((t, i) => `${i > 0 ? ' ' : ', '}${t}`)}`}
                    selector={
                      <TagPicker
                        recommendations={tagRecommendations}
                        defaultTags={[defaultTag]}
                        value={tags}
                        onTagChange={handleTagClick}
                      />
                    }
                  />
                </div>
                {!editMode && (
                  <Fragment>
                    <div className="col-12 p-1">
                      <DetailedExpansionPanel
                        title="Payout Options"
                        description="Choose how to receive your reward"
                        helper="This is an advanced option for experienced Steem-users."
                        value={
                          poweredUp
                            ? '100% Steem Power'
                            : '50% liquid SBD/STEEM and 50% Steem Power'
                        }
                        selector={
                          <PayoutTypeSelector
                            onChange={setPoweredUp}
                            value={poweredUp}
                          />
                        }
                      />
                    </div>
                    <div className="col-12 p-1">
                      <DetailedExpansionPanel
                        title={
                          !permlinkValid ? (
                            <span>
                              <WarnIcon />
                              {'  '}Permlink
                            </span>
                          ) : (
                            'Permlink'
                          )
                        }
                        description="Only lowercase letter, numbers and dash and a length of 2-255 chracters is permitted"
                        helper="Set a custom permlink here if you are unhappy with the long default permlink or if your permlink is conflicting with an existing post."
                        value={`https://travelfeed.io/@${user}/${permlink ||
                          getSlug(title)}`}
                        selector={
                          <PermlinkInput
                            onChange={pl => {
                              setPermlink(pl);
                              setPermlinkValid(true);
                            }}
                            data={permlink}
                            placeholder={getSlug(title)}
                          />
                        }
                      />
                    </div>
                    <div className="col-12 p-1">
                      <DetailedExpansionPanel
                        title="Beneficiaries"
                        description="If you would like to share your rewards for this post with someone else, you can include their username and the percentage they will receive from your author rewards here."
                        helper="This is an advanced option for experienced Steem-users. You will receive less rewards if you set beneficiaries. Only set beneficiaries if you know what you are doing!"
                        value={
                          beneficiaries.length === 0
                            ? 'None'
                            : `${beneficiaries.length} Beneficiar${
                                beneficiaries.length === 1 ? 'y' : 'ies'
                              } set`
                        }
                        selector={
                          <BeneficiaryInput
                            onChange={setBeneficiaries}
                            value={beneficiaries}
                          />
                        }
                      />
                    </div>
                  </Fragment>
                )}
                <div className="col-12 p-1">
                  <DetailedExpansionPanel
                    withBg
                    noPadding
                    fullWidth
                    title="Preview"
                    value="See how your post will look on TravelFeed"
                    selector={
                      <EditorPreview
                        img_url={featuredImage}
                        title={title}
                        permlink={permlink}
                        readtime={readingtime}
                        content={codeEditor ? content : json2md(content)}
                        latitude={location ? location.latitude : undefined}
                        longitude={location ? location.longitude : undefined}
                        tags={tags}
                      />
                    }
                  />
                </div>
                <div className="col-12 p-1">
                  <DetailedExpansionPanel
                    fullWidth
                    expanded
                    title="Publish"
                    value="Publish your post"
                    selector={
                      <Fragment>
                        <Checks checklist={checklist} />
                        <div className="row">
                          <div className="col-6">
                            {!editMode && (
                              <Button
                                onClick={() => {
                                  if (readingtime.words > 0 || title !== '') {
                                    setSaved(false);
                                    newNotification({
                                      message: 'Draft has been saved',
                                      success: true,
                                    });
                                  } else {
                                    newNotification({
                                      message:
                                        'There is nothing to save. Enter a title or start writing!',
                                      success: false,
                                    });
                                  }
                                }}
                                variant="contained"
                                color="secondary"
                              >
                                <span>
                                  Save Draft <SaveIcon />
                                </span>
                              </Button>
                            )}
                          </div>
                          <div className="col-6 text-right">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => publishPost()}
                              disabled={!completed}
                            >
                              {(editMode && (
                                <span>
                                  Update Post <EditIcon />
                                </span>
                              )) || (
                                <span>
                                  Publish Now
                                  <PublishIcon />
                                </span>
                              )}
                            </Button>
                            {!completed && (
                              <CircularProgress
                                className="p-1"
                                size={35}
                                thickness={5}
                              />
                            )}
                          </div>
                        </div>
                      </Fragment>
                    }
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Mutation>
    </Fragment>
  );
};

PostEditor.defaultProps = {
  edit: {},
};

PostEditor.propTypes = {
  edit: PropTypes.objectOf(PropTypes.any),
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(PostEditor);
