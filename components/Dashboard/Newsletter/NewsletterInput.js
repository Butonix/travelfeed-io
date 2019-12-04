import TextField from '@material-ui/core/TextField';
import React from 'react';
import PostSelector from './PostSelector';

const NewsletterInput = props => {
  const {
    title,
    setTitle,
    intro,
    setIntro,
    updates,
    setUpdates,
    posts,
    setPosts,
    loading,
    setLoading,
  } = props;

  return (
    <>
      <TextField
        margin="dense"
        value={title}
        onChange={event => setTitle(event.target.value)}
        label="Title"
        fullWidth
      />
      <TextField
        margin="dense"
        value={intro}
        onChange={event => setIntro(event.target.value)}
        label="Intro"
        fullWidth
        multiline
      />
      Updates input (todo) Featured posts
      <PostSelector
        posts={posts}
        setPosts={setPosts}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default NewsletterInput;
