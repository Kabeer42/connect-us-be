import mongoose from 'mongoose'


interface Posts extends Document {
    user_id:mongoose.Schema.Types.ObjectId;
    description: string;
    photo: string;
    likes: mongoose.Schema.Types.ObjectId[];
    tags: string[];
    locations: string;
    comments: mongoose.Schema.Types.ObjectId[];
    postBy:string;
    share: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }
  // Define a simple mongoose schema and model
  const PostsSchema = new mongoose.Schema({
    user_id: { type:mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    description: { type: String, require: true },
    photo: { type: String, require: true },
    date: { type: String, require: false },
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Like'  }],
    tags: { type: Array, require: false },
    locations: { type: String, require:false},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    postBy: { type: String, require:true },
    shares:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Share' }],
    
  },{
    timestamps: true,
  });

  const post = mongoose.model<Posts>("Posts", PostsSchema);

export {post};