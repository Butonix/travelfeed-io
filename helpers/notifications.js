import { Client } from 'busyjs';
import { NOTIFY_URL, WEB_PUSH_PUB } from '../config';

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

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then(registration => {
          console.log('SW registered: ', registration);
          if (Notification.permission === 'granted') {
            console.log('Notifications are enabled');
            const subscribeOptions = {
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(WEB_PUSH_PUB),
            };
            registration.pushManager
              .subscribe(subscribeOptions)
              .then(pushSubscription => {
                console.log(JSON.stringify(pushSubscription));
              });
          } else console.log('Notifications are disabled');
        })
        .catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};
