const UserModel = require('../Models/user');
const NotificationModel = require('../Models/notification')

const gitAllNotification = async (req, res, next) => {
    try {
        const userId = req.userId;
        const notification = await NotificationModel.find({ users: { $in: [userId] } });

        return res.status(200).json({ success: true, data: notification });

    } catch (err) {
        console.log("get all notification");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const notificationIsReaded = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;
        await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        return res.status(200).json({ success: true, message: 'this notification mark as readed' });

    } catch (err) {
        console.log("error in mark notification as readed");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
const deleteNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;
        await NotificationModel.findByIdAndDelete(notificationId);

        return res.status(200).json({ success: true, message: 'this notification was deleted' });

    } catch (err) {
        console.log("error in delete notification");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


module.exports = {
    gitAllNotification,
    notificationIsReaded,
    deleteNotification
}