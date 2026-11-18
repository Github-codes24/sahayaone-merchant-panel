let notifications = [
  { id: 1, title: "New Telecaller Registered", message: "Jordan Blake just registered as a new telecaller.", time: "10 minutes ago", unread: true },
  { id: 2, title: "Subscription Renewed", message: "Acme Corp successfully renewed their Enterprise plan.", time: "2 hours ago", unread: true },
  { id: 3, title: "System Maintenance", message: "Scheduled maintenance will occur tonight at 2:00 AM.", time: "Yesterday", unread: false },
  { id: 4, title: "New Client Added", message: "Globex has been added to your client roster.", time: "2 days ago", unread: false },
];

let listeners = [];

export const getNotifications = () => {
  return notifications;
};

export const markAllNotificationsAsRead = () => {
  notifications = notifications.map((n) => ({ ...n, unread: false }));
  listeners.forEach((listener) => listener(notifications));
};

export const subscribeNotifications = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
