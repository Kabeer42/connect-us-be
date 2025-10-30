import mongoose, { Schema } from 'mongoose';
const CommentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    content: { type: String, required: true },
}, { timestamps: true });
const Comment = mongoose.model('Comment', CommentSchema);
export { Comment };
//# sourceMappingURL=comments.model.mjs.map