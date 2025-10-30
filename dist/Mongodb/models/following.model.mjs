import { Schema, model } from 'mongoose';
const followSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
const Follow = model('Follow', followSchema);
export default Follow;
//# sourceMappingURL=following.model.mjs.map