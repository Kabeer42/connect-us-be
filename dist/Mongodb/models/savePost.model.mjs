import mongoose, { Schema } from 'mongoose';
const SavePostSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
}, { timestamps: true });
const SavePost = mongoose.model('SavePost', SavePostSchema);
export { SavePost };
//# sourceMappingURL=savePost.model.mjs.map