import express from 'express';
import { Comment } from '../models/comments.model.mjs';
import { post } from '../models/post.model.mjs';
const commentRouter = express.Router();
commentRouter.post('/:postId/comments', async (req, res) => {
    try {
        const postId = req.params.postId;
        //    Through Body
        const userId = req.body.user;
        const contentData = req.body.content;
        const comment = new Comment({
            user: userId,
            post: postId,
            content: contentData,
        });
        const newContent = await comment.save();
        if (newContent._id) {
            const Post = await post.findByIdAndUpdate(postId, { $addToSet: { comments: newContent._id } }, { new: true });
            // Emit the comment event to all connected clients
            req.app.get('io').emit('newComment', comment);
            if (!Post) {
                return res.status(404).send({ error: 'Post not found' });
            }
        }
        // if (!Post.comments) {
        //   Post.comments = [];
        // }
        res.status(201).send(comment);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
commentRouter.get('/:postId/comments', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('user');
        res.status(200).send(comments);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
export default commentRouter;
//# sourceMappingURL=comment.route.mjs.map