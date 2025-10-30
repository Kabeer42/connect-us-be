import mongoose, { Schema, Document } from 'mongoose';

interface IChat extends Document {
  members: Array<mongoose.Schema.Types.ObjectId>;
}

const ChatSchema: Schema = new Schema({
    members: { type: Array<mongoose.Schema.Types.ObjectId>, ref: 'users'},
}, { timestamps: true });

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export  {Chat}