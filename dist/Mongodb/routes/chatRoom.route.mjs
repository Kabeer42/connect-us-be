import express from 'express';
import { Chat } from '../models/chat.model.mjs';
const chatRoomRouter = express.Router();
chatRoomRouter.post('/', async (req, res) => {
    try {
        const firstId = req.body.senderId;
        const secondId = req.body.receiverId;
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });
        if (chat) {
            return res.status(200).json({ message: 'Chat already exiest!', chat });
        }
        if (firstId === null || secondId === null) {
            return res.status(400).json({ message: 'Please provide both senderId and receiverId' });
        }
        if (req.body.senderId === req.body.receiverId) {
            return res.status(400).json({ message: `You cannot chat with yourself!${req.body.senderId} - ${req.body.receiverId}` });
        }
        const newChat = new Chat({
            members: [req.body.senderId, req.body.receiverId]
        });
        const result = await newChat.save();
        res.status(200).json({ message: 'Chat created successfully!', result });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
chatRoomRouter.get('/:userId', async (req, res) => {
    try {
        const chat = await Chat.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
chatRoomRouter.get('/find/:firstId/:secondId', async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
export default chatRoomRouter;
//# sourceMappingURL=chatRoom.route.mjs.map