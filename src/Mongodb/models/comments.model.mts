import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export  {Comment}