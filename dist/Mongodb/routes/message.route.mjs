import express from 'express';
import Message from '../models/message.model.mjs';
import { uploadMessage, uploadVoice } from '../maltermiddleware.mjs';
import { getIoInstance } from '../../index.mjs';
// import { Server } from 'socket.io';
// Inject the socket.io server instance into the controller (this is a new change)
// let io: Server;
const messageRouter = express.Router();
messageRouter.post('/', uploadMessage.single('file'), async (req, res) => {
    const io = getIoInstance();
    const file = req.file;
    const { sender, chatId, type } = req.body;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const savedContent = file.filename;
    const newMessage = new Message({
        sender,
        content: savedContent,
        chatId,
        type,
    });
    try {
        await newMessage.save();
        io.emit('receiveMessage', newMessage);
        res.status(200).json({ message: 'File uploaded and message saved.' });
        // res.status(200).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: "Error saving message: " + error.message });
    }
});
messageRouter.get('/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await Message.find({ chatId }).sort({ timestamp: 1 });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
messageRouter.post('/uploadAudio', uploadVoice.single('audio'), async (req, res) => {
    const io = getIoInstance();
    const audio = req.file;
    if (!audio) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const { sender, chatId, type } = req.body;
    const newMessage = new Message({
        sender,
        content: audio.filename,
        chatId,
        type,
    });
    try {
        await newMessage.save();
        io.emit('receiveMessage', newMessage);
        res.status(200).json({ message: 'File uploaded and message saved.' });
        // res.status(200).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: "Error saving message: " + error.message });
    }
});
export default messageRouter;
//# sourceMappingURL=message.route.mjs.map