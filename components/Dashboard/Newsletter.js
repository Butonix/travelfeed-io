import React, { useState } from 'react';
import NewsletterInput from './Newsletter/NewsletterInput';
import NewsletterPreview from './Newsletter/NewsletterPreview';

const Newsletter = () => {
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [updates, setUpdates] = useState([]);
  const [posts, setPosts] = useState([]);

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
            />
          </div>
          <div className="col-xl-6 col-lg-6 col-md-10 col-sm-11 col-12">
            <NewsletterPreview
              title={title}
              intro={intro}
              updates={updates}
              posts={posts}
            />
          </div>
          <div className="col-12">
            Send newsletter (todo) | Generate post html
          </div>
        </div>
      </div>
    </>
  );
};

export default Newsletter;
