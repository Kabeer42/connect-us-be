import { Server, Socket } from 'socket.io';
import Message from './models/message.model.mjs';
import Follow from './models/following.model.mjs';
import { Comment } from './models/comments.model.mjs';
import { post } from './models/post.model.mjs';
import { user } from './models/user.model.mjs';
import { sendNotification } from './routes/user.route.mjs';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const socketService = (io: Server) => {
    let activeUsers: any[] = [];

    io.on("connection", (socket) => {
      // add new User
      socket.on("new-user-add", (newUserId) => {
        // if user is not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
          activeUsers.push({ userId: newUserId, socketId: socket.id });
          console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
      });
    
      socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
      });
      // Load previous messages
    Message.find().then((messages) => {
      socket.emit('loadMessages', messages);
    });
        
    socket.on('sendMessage', async (messageData) => {
      const {sender, content, chatId, type} = messageData
      let savedContent = content;
      if (type === 'image' || type === 'doc') {
        const filePath = path.join(__dirname, '../../uploads/message/', content);
  
        try {
          const fileData = await fs.promises.readFile(filePath);
          savedContent = content; // Assuming `content` is the filename
        } catch (error) {
          console.error('Error reading file:', error);
          return;
        }
      }
      const newMessage = new Message({sender,content, chatId, type});
      await newMessage.save();

      io.emit('receiveMessage', newMessage);
    });



      // Follow User
      socket.on("follow-user", async ({ followerId, followingId }) => {
        const newFollow = new Follow({ follower: followerId, following: followingId });
        await newFollow.save();

        const followingUser = activeUsers.find((user) => user.userId === followingId);
        if (followingUser) {
            io.to(followingUser.socketId).emit("new-follower", { followerId });
        }

        const followerUser = activeUsers.find((user) => user.userId === followerId);
        if (followerUser) {
            io.to(followerUser.socketId).emit("follow-success", { followingId });
        }
    });

    // Unfollow User
    socket.on("unfollow-user", async ({ followerId, followingId }) => {
        await Follow.findOneAndDelete({ follower: followerId, following: followingId });

        const unfollowedUser = activeUsers.find((user) => user.userId === followingId);
        if (unfollowedUser) {
            io.to(unfollowedUser.socketId).emit("unfollowed", { followerId });
        }

        const followerUser = activeUsers.find((user) => user.userId === followerId);
        if (followerUser) {
            io.to(followerUser.socketId).emit("unfollow-success", { followingId });
        }
    }); 

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    
  socket.on('verifyUser', async ({ userId }) => {
    try {
      // Update the user's verification status in the database
      const updatedUser = await user.findByIdAndUpdate(userId, { isVerified: true });

      // Broadcast the update to all connected clients
      io.emit('userVerified', { userId, isVerified: true });
      if(updatedUser){
        sendNotification('66be5802a0733b88942cd09f', userId, `Hi ${updatedUser?.firstName}, Welcome to become a family of ConnectUs. Your profile has been verified.`,'notify-user');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  });
    socket.on('newComment', async (commentData) => {
      const {postId, user, content} = commentData
      const newComment = new Comment({post:postId,user, content});
      await newComment.save();
      if(newComment._id){
        const Post = await post.findByIdAndUpdate(postId,{$addToSet:{comments:newComment._id}},{new:true});
          // Emit the comment event to all connected clients
          if(Post){
             // Populate the user data in the new comment before emitting it
             const populatedComment = await newComment.populate({path:'user', select:'name profile'});

       io.emit('receiveComment', populatedComment);
          }
         }
      
    });




    socket.on('offer', (data) => {
      socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
      socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
      socket.broadcast.emit('candidate', data);
  });

    });
};