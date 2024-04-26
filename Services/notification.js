const NotificationModel =require('../Models/notification')

class notificationService {
   
    static async addNotification(message,receiverIds,type)
    {
      const Notification = new NotificationModel({
        users:receiverIds,
        message:message,
        type:type
      });
      return await Notification.save();;
    }
    
    
}
  
  module.exports = notificationService;