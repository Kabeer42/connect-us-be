import mongoose, { Schema, Document } from 'mongoose';

interface IShare extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const ShareSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
}, { timestamps: true });

const Share =  mongoose.model<IShare>('Share', ShareSchema);
export  {Share}