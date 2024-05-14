const NotificationModel =require('../Models/notification')
const io =require('../socket').gitIO;


class notificationService {
   
    static async addNotification(message,receiverIds,type)
    {
      //add notification to database
      const Notification = new NotificationModel({
        users:receiverIds,
        message:message,
        type:type
      });
      await Notification.save();

      //send notification to all users with socket io
    //   receiverIds.forEach(userId => {
    //     io.to(userId).emit('notification', Notification);
    // });
      return;
    }
    
}

  module.exports = notificationService;