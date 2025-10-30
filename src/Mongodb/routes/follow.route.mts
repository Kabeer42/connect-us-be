import express from 'express';
import Follow from '../models/following.model.mjs';

const followRouter = express.Router();

// Count followers of a user
followRouter.get('/followers/count/:userId', async (req, res) => {
    const followerCount = await Follow.countDocuments({ following: req.params.userId });
    res.status(200).json({ count: followerCount });
});

// Count following of a user
followRouter.get('/following/count/:userId', async (req, res) => {
    const followingCount = await Follow.countDocuments({ follower: req.params.userId });
    res.status(200).json({ count: followingCount });
});



// Check if a user is following another user
followRouter.get('/is-following/:followerId/:followingId', async (req, res) => {
    const isFollowing = await Follow.findOne({ 
        follower: req.params.followerId, 
        following: req.params.followingId 
    });
    res.status(200).json({ isFollowing: !!isFollowing });
});

// Follow a user
followRouter.post('/follow', async (req, res) => {
    const { followerId, followingId } = req.body;
    const newFollow = new Follow({ follower: followerId, following: followingId });
    await newFollow.save();
    res.status(200).json(newFollow);
});

// Unfollow a user
followRouter.post('/unfollow', async (req, res) => {
    const { followerId, followingId } = req.body;
    await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    res.status(200).json({ message: 'Unfollowed successfully' });
});
export default followRouter;
