self.addEventListener('fetch', () => console.log('fetch'));
self.addEventListener('notificationclick', (e) => {
  self.registration.getNotifications().then(function (notifications) {
    notifications.forEach(function (notification) {
      notification.close();
    });
  });
  e.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        if (e.notification.data.url) {
          let client = null;

          for (let i = 0; i < clientList.length; i++) {
            let item = clientList[i];

            if (item.url) {
              client = item;
              break;
            }
          }
          if (client && 'navigate' in client) {
            client.focus();
            return client.navigate(e.notification.data.url);
          } else {
            // if client doesn't have navigate function, try to open a new browser window
            return clients.openWindow(e.notification.data.url);
          }
        }
      })
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js', { scope: '/' })
    .then(function (reg) {
      reg.pushManager.getSubscription().then(console.log('asd a0'));
    })
    .catch(function (err) {
      console.warn('Error whilst registering service worker', err);
    });
}
