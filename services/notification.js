const NotificationModel =require('../Models/notification')
// const io =require('../socket').gitIO;


class notificationService {
   
    static async addNotification(message,picture,receiverIds,refId,type)
    {
      //add notification to database
      const Notification = new NotificationModel({
        users:receiverIds,
        message:message,
        picture:picture,
        type:type,
        ref:refId
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