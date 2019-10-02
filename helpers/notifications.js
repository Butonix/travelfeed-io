import { Client } from 'busyjs';
import { NOTIFY_URL } from '../config';

const notificationTypes = {
  FOLLOW: 'follow',
  REPLY: 'reply',
  VOTE: 'vote',
  MENTION: 'mention',
};

export const getNotificationContent = data => {
  let message = {};

  switch (data.type) {
    case notificationTypes.VOTE:
      message = {
        message: `Your post has been chosen by the TravelFeed curation team!`,
      };
      break;

    case notificationTypes.REPLY:
      message = { message: `${data.author} replied to your post.` };
      break;

    case notificationTypes.FOLLOW:
      message = { message: `${data.follower} followed you.` };
      break;

    case notificationTypes.MENTION:
      message = {
        message: `${data.author} mentioned you in a 
        ${data.is_root_post ? 'post.' : 'comment.'}`,
      };
      break;

    default:
      return {};
  }

  return message;
};

const createNotifyAPI = () => {
  const client = new Client(NOTIFY_URL);

  client.sendAsync = (message, params) =>
    new Promise((resolve, reject) => {
      client.call(message, params, (err, result) => {
        if (err !== null) return reject(err);
        return resolve(result);
      });
    });

  return client;
};

export const getUserNotifications = username => {
  const notifyApi = createNotifyAPI();
  return new Promise(resolve => {
    notifyApi.sendAsync('get_notifications', [username]).then(res => {
      resolve(res);
    });
  });
};
