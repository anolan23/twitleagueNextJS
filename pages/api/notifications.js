import Notifications from "../../db/repos/Notifications";

export default async (req, res) => {
  const method = req.method;
  const { userId, notificationId } = req.query;

  if (method === "GET") {
    const notifications = await Notifications.findByUserId(userId);
    res.send(notifications);
  } else if (method === "POST") {
    const { notification } = req.body;
    const sentNotification = await Notifications.send(notification);
    res.send(sentNotification);
  } else if (method === "DELETE") {
    const notification = await Notifications.delete(notificationId);
    res.send(notification);
  } else {
    res
      .status(405)
      .json({ message: "api/notifications only supports GET/DELETE method" });
  }
};
