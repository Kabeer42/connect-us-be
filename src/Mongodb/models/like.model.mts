import mongoose, { Schema, Document } from 'mongoose';

interface ILike extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
}, { timestamps: true });

const Like =  mongoose.model<ILike>('Like', LikeSchema);
export  {Like}