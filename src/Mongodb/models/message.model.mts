import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
    sender: string;
    content: string;
    chatId: Schema.Types.ObjectId;
    type: 'text' | 'image' |  'document' | 'emoji' | 'audio';
    timestamp: Date;
    postReference: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    postReference: { type: Schema.Types.ObjectId, ref: 'Post', required: false }, // Optional reference to a post

    type: { type: String, enum: ['text', 'image', 'document', 'emoji', 'audio'], required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;
