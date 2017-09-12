self.addEventListener('push', function(event) {  
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(function(subscription) {
      var notificationsPath = 'https://pushpad.xyz/notifications?endpoint=' + encodeURIComponent(subscription.endpoint);
      var headers = new Headers();
      headers.append('Accept', 'application/json');
      return fetch(notificationsPath, {headers: headers}).then(function(response) {
        if (response.status !== 200) {  
          throw new Error('The API returned an error. Status Code: ' + response.status);
        }
        return response.json().then(function(notifications) {
          return Promise.all(
            notifications.map(function (notification) {
              var notificationOptions = {  
                body: notification.body,
                icon: notification.icon,
                tag: notification.id,
                requireInteraction: notification.require_interaction,
                data: { custom: notification.custom_data }
              };
              if (notification.image_url) {
                notificationOptions.image = notification.image_url;
              }
              if (notification.actions && notification.actions.length) {
                notificationOptions.actions = [];
                for (var actionIndex = 0; actionIndex < notification.actions.length; actionIndex++) { 
                  notificationOptions.actions[actionIndex] = {
                    action: notification.actions[actionIndex].action,
                    title: notification.actions[actionIndex].title
                  };
                  if (notification.actions[actionIndex].icon) {
                    notificationOptions.actions[actionIndex].icon = notification.actions[actionIndex].icon;
                  }
                }
              }
              return self.registration.showNotification(notification.title, notificationOptions);
            })
          );
        });  
      }).catch(function(err) {  
        console.error('Unable to retrieve notifications.', err);
      });
    })
  );  
});

self.addEventListener('notificationclick', function(event) {
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  var targetUrl = 'https://pushpad.xyz/notifications/' + event.notification.tag + '/redirect';
  if (event.action) {
    targetUrl += '?notification_action=' + event.action;
  }

  // if custom action
  if (event.action && self.notificationActions && self.notificationActions.hasOwnProperty(event.action)) {
    event.waitUntil(
      Promise.all([
        fetch(targetUrl, { headers: new Headers({'Accept': 'application/json'}) }),
        self.notificationActions[event.action](event.notification.data.custom)
          .catch(function(err) { 
            console.log('A custom action has been invoked but it has raised an exception: ' + err);
          })
      ])
    );
  // else open target url
  } else {
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  }
});