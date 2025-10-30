import express from 'express';
import { Like } from '../models/like.model.mjs';
import { post } from '../models/post.model.mjs';
const likesRouter = express.Router();
likesRouter.post('/:postId/likes', async (req, res) => {
    try {
        const users = req.body.user;
        const postId = req.params.postId;
        // Check if the like already exists for the user and post
        const existingLike = await Like.findOne({ user: users, post: postId });
        if (existingLike) {
            // Remove the like from the Like model
            await Like.deleteOne({ user: users, post: postId });
            // Remove the like ID from the post
            const Post = await post.findByIdAndUpdate(postId, { $pull: { likes: existingLike._id } }, { new: true });
            if (!Post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            return res.status(200).json({ message: 'Like removed' });
        }
        else {
            // Create a new like
            const like = new Like({
                user: users,
                post: postId,
            });
            const Liked = await like.save();
            if (Liked._id) {
                const Post = await post.findByIdAndUpdate(postId, { $addToSet: { likes: Liked._id } }, { new: true });
                if (!Post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
            }
            res.status(201).json(Liked);
        }
    }
    catch (e) {
        res.status(400).send(e);
    }
});
likesRouter.get('/:postId/:userId/likes/check', async (req, res) => {
    try {
        const users = req.params.userId;
        const postId = req.params.postId;
        // Check if the user has liked the post
        const existingLike = await Like.findOne({ user: users, post: postId });
        if (existingLike) {
            return res.status(200).json({ liked: true });
        }
        res.status(200).send({ liked: false });
    }
    catch (e) {
        res.status(400).send(e);
    }
});
export default likesRouter;
//# sourceMappingURL=like.route.mjs.map