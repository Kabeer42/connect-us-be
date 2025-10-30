import mongoose, { Schema } from 'mongoose';
const ChatSchema = new Schema({
    members: { type: (Array), ref: 'users' },
}, { timestamps: true });
const Chat = mongoose.model('Chat', ChatSchema);
export { Chat };
//# sourceMappingURL=chat.model.mjs.map