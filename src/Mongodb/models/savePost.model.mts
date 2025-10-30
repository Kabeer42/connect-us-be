import mongoose, { Schema, Document } from 'mongoose';

interface ISavePost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const SavePostSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
}, { timestamps: true });

const SavePost =  mongoose.model<ISavePost>('SavePost', SavePostSchema);
export  {SavePost}
