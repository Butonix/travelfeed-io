/* eslint-disable */
'use strict';

self.addEventListener('push', function(event) {
  if (event.data) {
    var data = event.data.json();
    var { body, title, actions, icon, badge, image } = data;
    var notificationOptions = { body };

    if (actions) notificationOptions.actions = actions;
    if (image) notificationOptions.image = image;
    if (icon) notificationOptions.icon = icon;
    if (badge) notificationOptions.badge = badge;

    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, notificationOptions),
        console.log('Received push message'),
      ]),
    );
  }
});
