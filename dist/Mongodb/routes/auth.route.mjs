// backend/src/routes/authRoutes.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { user } from '../models/user.model.mjs';
const authRouter = express.Router();
authRouter.post('/signup', async (req, res) => {
    const { name, email, password, roleAs } = req.body;
    try {
        const exist = await user.findOne({ email });
        const nameExist = await user.findOne({ name });
        if (exist) {
            res.json({ message: 'Email Already Exist!' });
            console.log('User Already Exist');
        }
        else if (nameExist) {
            res.json({ message: 'User Name Must be Unique!' });
            console.log('User Name Must be Unique!');
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const users = new user({ name: name, email: email, password: hashedPassword, roleAs: roleAs, skills: [], isVerified: false });
            console.log(users);
            await users.save();
            // Generate JWT token
            if (!process.env.SECRET) {
                process.env.SECRET = 'dskfjslkdjfm2';
                // throw new Error("SECRET not found in environment variables");
            }
            const token = jwt.sign({ userId: users._id, roleAs: users.roleAs }, process.env.SECRET, {
                expiresIn: '1h',
            });
            res.json({ message: 'Registration successful', userId: users._id, roleAs: users.roleAs });
            console.log('Registration successful');
        }
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' });
        console.log('Registration failed');
    }
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await user.findOne({ email });
        if (!users) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, users.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Wrong Password' });
            return;
        }
        const token = jwt.sign({ userId: users._id, roleAs: users.roleAs }, 'dskfjslkdjfm2', {
            expiresIn: '1h',
        });
        res.json({ message: "login successful", userId: users._id, roleAs: users.roleAs, token: token, });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});
export default authRouter;
//# sourceMappingURL=auth.route.mjs.map