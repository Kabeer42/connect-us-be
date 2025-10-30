import mongoose, { Schema } from 'mongoose';
const LikeSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
}, { timestamps: true });
const Like = mongoose.model('Like', LikeSchema);
export { Like };
//# sourceMappingURL=like.model.mjs.map