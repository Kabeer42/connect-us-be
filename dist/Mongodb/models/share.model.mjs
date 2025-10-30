import mongoose, { Schema } from 'mongoose';
const ShareSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
}, { timestamps: true });
const Share = mongoose.model('Share', ShareSchema);
export { Share };
//# sourceMappingURL=share.model.mjs.map