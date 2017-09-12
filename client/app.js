var pushpad = require('pushpad');

var authToken = '3990a91ee909734c5d40b016114a9c7e';
var urlTarget = 'http://smartportfolioapp.azurewebsites.net';
var projectId = 4378;
var user1 = '123456';
var project = new pushpad.Pushpad({
  authToken: authToken,
  projectId: projectId
});

var notification = new pushpad.Notification({
    project: project,
    body: 'Tienes un nuevo mensaje!', // max 120 characters
    title: 'DeAutos', // optional, defaults to your project name, max 30 characters
    targetUrl: urlTarget, // optional, defaults to your project website
    iconUrl: 'http://static.deautos.com/client/shared/assets/images/deautos-logo.svg', // optional, defaults to the project icon
    imageUrl: 'http://static.deautos.com/client/shared/assets/images/deautos-logo.svg', // optional, an image to display in the notification content
    ttl: 604800, // optional, drop the notification after this number of seconds if a device is offline
    requireInteraction: true, // optional, prevent Chrome on desktop from automatically closing the notification after a few seconds
    customData: '123', // optional, a string that is passed as an argument to action button callbacks
    // optional, add some action buttons to the notification
    // see https://pushpad.xyz/docs/action_buttons
    actions: [
      {
        title: 'Publica Gratis', // max length is 20 characters
        targetUrl: 'https://publish.deautos.com/#/publish', // optional
        // icon: 'http://example.com/assets/button-icon.png', // optional
        action: 'myActionName' // optional
      }
    ],
    starred: true // optional, bookmark the notification in the Pushpad dashboard (e.g. to highlight manual notifications)
  });


  notification.deliverTo(user1, function(err, result) { 
      console.log(err);
      console.log(result);
   });
//   notification.broadcast(function (err, result) {
//        console.log(err);
//        console.log(result); 
//     });
  