	

import express from "express";
import { SavePost } from "../models/savePost.model.mjs";
const savedPostRouter = express.Router();

// Get Post By UserId
savedPostRouter.post('/savedPost', async (req, res) => {
    try {
      const { user_id, post_id } = req.body;

      const exist = await SavePost.findOne({ user: user_id, post: post_id });

      if (exist) {
        const result = await SavePost.deleteOne({ user: user_id, post: post_id });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Item deleted successfully' });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } else {
        const postData = new SavePost({ user: user_id, post: post_id });
        await postData.save();
        res.status(200).json({ message: 'Post Saved successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  savedPostRouter.get('/savedPost/:userId',async (req, res) => {
  try {
    const userId  = req.params.userId;
    // Fetch user details from the database
    const savedPost = await SavePost.find({user:userId}).populate('post');
    if (!savedPost) {
      return res.status(404).json({ message: 'Post Not Found' });
    }
    res.json(savedPost);
  } catch (error) {
    console.error('Fetch profile failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


// Delete Saved Post
savedPostRouter.delete('/deleteSavedPost/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SavePost.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
});


savedPostRouter.get('/savedPost/check/:postId/:userId',async (req, res) => {
  try {
    const userId  = req.params.userId;
    const postId  = req.params.postId;
    // Fetch user details from the database
    const savedPost = await SavePost.findOne({user:userId, post:postId});
    if (!savedPost) {
      return res.status(200).json({ save: false });
    }
   return res.status(200).json({save:true});
  } catch (error) {
    console.error('Fetch profile failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})




export { savedPostRouter };
