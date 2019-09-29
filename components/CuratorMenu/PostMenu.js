import React, { useEffect, useState } from 'react';
import { getRoles } from '../../helpers/token';
import AuthorBlacklist from './Actions/AuthorBlacklist';
import CustomJson from './Actions/CustomJson';
import JsonAndContest from './Actions/JsonAndContest';
import JsonAndMutate from './Actions/JsonAndMutate';
import PostBlacklist from './Actions/PostBlacklist';
import CuratorMenu from './CuratorMenu';

const BlogMenu = props => {
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  const { author, permlink, isTf } = props;

  return (
    <>
      {isCurator && (
        <CuratorMenu
          component={
            <>
              {// Give contest rewards only if post has been posted through TravelFeed
              (isTf && (
                <>
                  <JsonAndContest
                    author={author}
                    permlink={permlink}
                    action="curate"
                    title="Are you sure that you want to curate this post?"
                    desc="This post will be upvoted with 100% by @travelfeed and it's curation trail, resteemed and will receive a congratulation comment."
                  />
                  <JsonAndContest
                    author={author}
                    permlink={permlink}
                    action="honour"
                    title="Are you sure that you want to honour this post?"
                    desc="This post will be upvoted with 50% by @travelfeed and will receive a congratulation comment."
                  />
                </>
              )) || (
                <>
                  <CustomJson
                    author={author}
                    permlink={permlink}
                    action="curate"
                    title="Are you sure that you want to curate this post?"
                    desc="This post will be upvoted with 100% by @travelfeed and it's curation trail, resteemed and will receive a congratulation comment."
                  />
                  <CustomJson
                    author={author}
                    permlink={permlink}
                    action="honour"
                    title="Are you sure that you want to honour this post?"
                    desc="This post will be upvoted with 50% by @travelfeed and will receive a congratulation comment."
                  />
                </>
              )}
              <JsonAndMutate
                author={author}
                permlink={permlink}
                action="short"
                title="Are you sure that you want to mark this post as too short?"
                desc="This post will be blacklisted and receive a comment."
                reason="Post is under the threshold of 250 words."
              />
              <JsonAndMutate
                author={author}
                permlink={permlink}
                action="language"
                title="Are you sure that you want to mark this post as having less than 250 words in English?"
                desc="This post will be blacklisted and receive a comment."
                reason="Post is under the threshold of 250 English words."
              />
              <JsonAndMutate
                author={author}
                permlink={permlink}
                action="copyright"
                title="Are you sure that you want to mark this post as violating copyright?"
                desc="This post will be blacklisted and receive a comment."
                reason="Post is violating copyright."
              />
              <PostBlacklist author={author} permlink={permlink} />
              <AuthorBlacklist author={author} />
            </>
          }
        />
      )}
    </>
  );
};

export default BlogMenu;
