import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  GET_NEWSLETTER_DRAFT,
  SAVE_NEWSLETTER,
} from '../../helpers/graphql/weeklypost';
import graphQLClient from '../../helpers/graphQLClient';
import ConfirmClearBtn from './Newsletter/ConfirmClearBtn';
import NewsletterInput from './Newsletter/NewsletterInput';
import NewsletterPreview from './Newsletter/NewsletterPreview';

const Newsletter = props => {
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [updates, setUpdates] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const saveDraft = () => {
    const variables = {
      title,
      intro,
      updates: JSON.stringify(updates),
      posts: JSON.stringify(posts),
    };
    graphQLClient(SAVE_NEWSLETTER, variables).then(res => {
      if (res.saveNewsletter) newNotification(res.saveNewsletter);
    });
  };

  const sendTestNewsletter = () => {};
  const sendNewsletter = () => {};
  const savePostDraft = () => {};

  const onClear = () => {
    setTitle('');
    setIntro('');
    setUpdates([]);
    setPosts([]);
  };

  useEffect(() => {
    graphQLClient(GET_NEWSLETTER_DRAFT).then(res => {
      if (res && res.newsletterDraft) {
        setTitle(res.newsletterDraft.title);
        setIntro(res.newsletterDraft.intro);
        setUpdates(res.newsletterDraft.updates);
        setPosts(res.newsletterDraft.posts);
      }
    });
  }, []);

  return (
    <>
      <div className="container pb-3">
        <div className="row row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-md-10 col-sm-11 col-12">
            <NewsletterInput
              title={title}
              setTitle={setTitle}
              intro={intro}
              setIntro={setIntro}
              updates={updates}
              setUpdates={setUpdates}
              posts={posts}
              setPosts={setPosts}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="col-xl-6 col-lg-6 col-md-10 col-sm-11 col-12">
            <NewsletterPreview
              title={title}
              intro={intro}
              updates={updates}
              posts={posts}
              loading={loading}
            />
          </div>
          <div className="col-12">
            <ConfirmClearBtn onClear={onClear} />
            <Button
              className="m-1"
              variant="contained"
              onClick={saveDraft}
              color="primary"
            >
              Save draft
            </Button>
            <Button
              className="m-1"
              variant="contained"
              onClick={sendTestNewsletter}
              color="primary"
            >
              Send Test Newsletter
            </Button>
            <Button
              className="m-1"
              variant="contained"
              onClick={sendNewsletter}
              color="primary"
            >
              Send Newsletter
            </Button>
            <Button
              className="m-1"
              variant="contained"
              onClick={savePostDraft}
              color="primary"
            >
              Generate post draft
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withSnackbar(Newsletter);
