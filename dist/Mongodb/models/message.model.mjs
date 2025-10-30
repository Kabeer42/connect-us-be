import { Schema, model } from 'mongoose';
const messageSchema = new Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    postReference: { type: Schema.Types.ObjectId, ref: 'Post', required: false }, // Optional reference to a post
    type: { type: String, enum: ['text', 'image', 'document', 'emoji', 'audio'], required: true },
    timestamp: { type: Date, default: Date.now },
});
const Message = model('Message', messageSchema);
export default Message;
//# sourceMappingURL=message.model.mjs.map