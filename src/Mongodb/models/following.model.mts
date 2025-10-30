import { Schema, model, Document } from 'mongoose';

interface IFollow extends Document {
    follower: Schema.Types.ObjectId;
    following: Schema.Types.ObjectId;
}

const followSchema = new Schema<IFollow>({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Follow = model<IFollow>('Follow', followSchema);

export default Follow;
