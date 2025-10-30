import mongoose, { Schema } from 'mongoose';
// Define the Mongoose schema for the Notification
const NotificationSchema = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
export const Notifications = mongoose.model('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.mjs.map