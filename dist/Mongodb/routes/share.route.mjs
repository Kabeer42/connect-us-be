import express from 'express';
import { post } from '../models/post.model.mjs';
import { Share } from '../models/share.model.mjs';
const shareRouter = express.Router();
shareRouter.post('/:postId/share', async (req, res) => {
    try {
        const postId = req.params.postId;
        //    Through Body
        const userId = req.body.user;
        const share = new Share({
            user: userId,
            post: postId,
        });
        const newShare = await share.save();
        if (newShare._id) {
            const Post = await post.findByIdAndUpdate(postId, { $addToSet: { shares: newShare._id } }, { new: true });
            if (!Post) {
                return res.status(404).send({ error: 'Post not found' });
            }
        }
        res.status(201).send(share);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
export default shareRouter;
//# sourceMappingURL=share.route.mjs.map