import api from './steemConnectAPI';
import { getScToken, getUser } from './token';

export const post = args => {
  const {
    author,
    title,
    body,
    parentPermlink,
    parentAuthor,
    jsonMetadata,
    permlink,
    commentOptions,
  } = args;
  if (window && window.steem_keychain) {
    const comment_options =
      !commentOptions || commentOptions === '' ? '' : commentOptions;
    return new Promise(resolve => {
      window.steem_keychain.requestPost(
        author,
        title,
        body,
        parentPermlink,
        parentAuthor,
        jsonMetadata,
        permlink,
        comment_options,
        res => {
          if (res.success) {
            resolve({
              success: true,
              message: 'Post was published successfully',
            });
          } else {
            resolve({
              success: false,
              message: `Post could not be published: ${res.message}`,
            });
          }
        },
      );
    });
  }
  api.setAccessToken(getScToken());
  return new Promise(resolve => {
    const commentop = [
      'comment',
      {
        parent_author: parentAuthor,
        parent_permlink: parentPermlink,
        author,
        permlink,
        title,
        body,
        json_metadata: jsonMetadata,
      },
    ];
    let ops;
    if (commentOptions && commentOptions !== '') {
      ops = [commentop, ['comment_options', commentOptions]];
    } else ops = [commentop];
    api.broadcast(ops, (err, res) => {
      if (err) {
        resolve({
          success: false,
          message: `Could not post${(typeof err === 'string' && `: ${err}`) ||
            (err.error_description && `: ${err.error_description}`)}`,
        });
      }
      if (res) {
        resolve({
          success: true,
          message: 'Post was published successfully',
        });
      }
    });
  });
};

export const vote = async (author, permlink, weight) => {
  api.setAccessToken(getScToken());
  const voter = getUser();
  return new Promise(resolve => {
    api.vote(voter, author, permlink, weight, (err, res) => {
      if (err) {
        resolve({
          success: false,
          message: `Could not vote${(typeof err === 'string' && `: ${err}`) ||
            (err.error_description && `: ${err.error_description}`)}`,
        });
      }
      if (res) {
        resolve({ success: true });
      }
    });
  });
};

export const comment = async (
  parentAuthor,
  parentPermlink,
  permlink,
  title,
  body,
  jsonMetadata,
  type,
) => {
  api.setAccessToken(getScToken());
  const author = getUser();
  return new Promise(resolve => {
    api.comment(
      parentAuthor,
      parentPermlink,
      author,
      permlink,
      title,
      body,
      jsonMetadata,
      (err, res) => {
        if (err) {
          resolve({
            success: false,
            message: `${(type === 'comment' && 'Comment') ||
              'Post'} could not be published${(typeof err === 'string' &&
              `: ${err}`) ||
              (err.error_description && `: ${err.error_description}`)}`,
          });
        }
        if (res) {
          resolve({
            success: true,
            message: `${(type === 'comment' && 'Comment') ||
              'Post'} was published successfully`,
          });
        }
      },
    );
  });
};

export const follow = async following => {
  api.setAccessToken(getScToken());
  const follower = getUser();
  return new Promise(resolve => {
    api.follow(follower, following, (err, res) => {
      if (err) {
        resolve({
          success: false,
          message: `Could not follow user${(typeof err === 'string' &&
            `: ${err}`) ||
            (err.error_description && `: ${err.error_description}`)}`,
        });
      }
      if (res) {
        resolve({ success: true });
      }
    });
  });
};

export const unfollow = async unfollowing => {
  api.setAccessToken(getScToken());
  const unfollower = getUser();
  return new Promise(resolve => {
    api.unfollow(unfollower, unfollowing, (err, res) => {
      if (err) {
        resolve({
          success: false,
          message: `Could not unfollow user${(typeof err === 'string' &&
            `: ${err}`) ||
            (err.error_description && `: ${err.error_description}`)}`,
        });
      }
      if (res) {
        resolve({ success: true });
      }
    });
  });
};

export const customJson = async (payload, id) => {
  api.setAccessToken(getScToken());
  const author = getUser();
  const requiredAuths = [];
  const requiredPostingAuths = [author];
  const json = JSON.stringify(payload);
  return new Promise(resolve => {
    api.customJson(
      requiredAuths,
      requiredPostingAuths,
      id,
      json,
      (err, res) => {
        if (err) {
          resolve({
            success: false,
            message: `Could not write custom_json to Blockchain${(typeof err ===
              'string' &&
              `: ${err}`) ||
              (err.error_description && `: ${err.error_description}`)}`,
          });
        }
        if (res) {
          resolve({
            success: true,
            message: 'Curation action was broadcasted sucessfully',
            transactionId: res.result.id,
          });
        }
      },
    );
  });
};

export const broadcastActiveUser = async () => {
  api.setAccessToken(getScToken());
  const author = getUser();
  const id = 'active_user';
  const requiredAuths = [];
  const requiredPostingAuths = [author];
  const json = JSON.stringify({ app: 'travelfeed' });
  return api.customJson(requiredAuths, requiredPostingAuths, id, json);
};
