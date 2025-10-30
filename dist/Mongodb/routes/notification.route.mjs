import express from 'express';
import { Notifications } from '../models/notification.model.mjs';
const notificationRouter = express.Router();
notificationRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notifications.find({ receiverId: userId }).populate('senderId').sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
notificationRouter.post('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedNotification = await Notifications.findByIdAndDelete(id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted successfully', deletedNotification });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default notificationRouter;
//# sourceMappingURL=notification.route.mjs.map