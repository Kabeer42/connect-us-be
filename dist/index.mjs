import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from 'http';
import { Server } from "socket.io";
import authRouter from "./Mongodb/routes/auth.route.mjs";
import postRoute from "./Mongodb/routes/post.route.mjs";
import userRouter from "./Mongodb/routes/user.route.mjs";
import likesRouter from "./Mongodb/routes/like.route.mjs";
import commentRouter from "./Mongodb/routes/comment.route.mjs";
import { savedPostRouter } from "./Mongodb/routes/savePost.route.mjs";
import shareRouter from "./Mongodb/routes/share.route.mjs";
import { QuizRouter } from "./Mongodb/routes/quiz.route.mjs";
import { jobRouter } from "./Mongodb/routes/job.route.mjs";
import chatRoomRouter from "./Mongodb/routes/chatRoom.route.mjs";
import messageRouter from "./Mongodb/routes/message.route.mjs";
import { socketService } from "./Mongodb/socketServer.mjs";
import jobApplicationRouter from "./Mongodb/routes/job_application.route.mjs";
import followRouter from "./Mongodb/routes/follow.route.mjs";
import notificationRouter from "./Mongodb/routes/notification.route.mjs";
const PORT = 3000;
const app = express();
const server = createServer(app);
const allowedOrigins = ['http://localhost:5173', 'http://192.168.100.12:5173', 'http://0.0.0.0:5173', 'http://192.168.100.12:3000'];
// const io = new Server(server, {
//   cors:{ 
//     origin:  function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods:['GET', 'POST'],
//     credentials: true,
//   }
// });
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        credentials: true, // you can keep this true if needed
    },
});
export const getIoInstance = () => io;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//     cors({
//       origin: function (origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//     })
//   );
app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// connecting to MongoDB
const username = encodeURIComponent("mkabeer9242");
const password = encodeURIComponent("!qa@ws#ed$rf");
//const MongoDB_Connection_String = "mongodb://127.0.0.1:27017/jobs-provider";
const MongoDB_Connection_String = `mongodb+srv://${username}:${password}@connectus.lsydzcu.mongodb.net/?appName=ConnectUS&retryWrites=true&w=majority`;
async function connectToMongoDB(connectionString) {
    await mongoose.connect(connectionString);
    const db = mongoose.connection;
    // Handle MongoDB connection events
    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}
try {
    await connectToMongoDB(MongoDB_Connection_String);
    // Connection events
}
catch (e) {
    console.log("Something Went wrong!!!", e);
}
app.get("/", (req, res) => {
    res.status(200).send("The server is Running !!!!");
});
app.use('/api/auth', authRouter);
app.use('/api/post', postRoute);
app.use('/api/user', userRouter);
app.use('/api/user', followRouter);
app.use('/api/posts', likesRouter);
app.use('/api/posts', commentRouter);
app.use('/api/posts', shareRouter);
app.use('/api/posts', savedPostRouter);
app.use('/api/quiz', QuizRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/chat', chatRoomRouter);
app.use('/api/message', messageRouter);
app.use('/api/apply', jobApplicationRouter);
app.use('/api/notification', notificationRouter);
socketService(io);
// Allow Client To access File
app.use('/uploads/user-post/', express.static('uploads/user-post/'));
app.use('/uploads/profile/', express.static('uploads/profile/'));
app.use('/uploads/coverPhoto/', express.static('uploads/coverPhoto/'));
app.use('/uploads/chats/', express.static('uploads/chats/'));
app.use('/uploads/message/', express.static('uploads/message/'));
app.use('/uploads/resume/', express.static('uploads/resume/'));
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.mjs.map