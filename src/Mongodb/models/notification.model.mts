import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for the Notification document
export interface INotification extends Document {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId:  mongoose.Schema.Types.ObjectId;
    type:string;
    message: string;
    read: boolean;
    
}

// Define the Mongoose schema for the Notification
const NotificationSchema: Schema = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId,ref: 'users', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    message: { type: String, required: true },
    type:{type:String,required:true},
    read: { type: Boolean, default: false },
},{timestamps:true});

export const Notifications = mongoose.model<INotification>('Notification', NotificationSchema);
