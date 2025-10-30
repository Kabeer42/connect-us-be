// backend/src/routes/authRoutes.ts
import express from 'express';
import { user } from '../models/user.model.mjs';
import {companyDocumentUpload, uploadCover, uploadProfile } from '../maltermiddleware.mjs';
import fs from 'fs';
import path from 'path';
import { getIoInstance } from '../../index.mjs';
import { Notifications } from '../models/notification.model.mjs';
const userRouter = express.Router();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const users = await user.findById(id).populate('university');
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const sendNotification = async (senderId:string,userId: string, message: string, type :string) => {
  const io = getIoInstance();
  const notification = new Notifications({
    senderId: senderId,
    receiverId: userId,
    message: message,
    read: false,
    type:type
  });
  await notification.save();
  io.to(userId).emit('receiveNotification', notification);
}
  userRouter.put('/:id', companyDocumentUpload.single('legal_document'), async (req, res) => {
    const { id } = req.params;
   

    try {
      const userToUpdate = await user.findById(id);
      if (!userToUpdate) {
        if (req.file) {
          // Delete the uploaded file if user not found
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: 'User not found' });
      }

      if (userToUpdate.legal_document) {
        const previousFilePath = path.join(__dirname, './uploads/companyDocument/', userToUpdate.legal_document);
        if (fs.existsSync(previousFilePath)) {
          fs.unlinkSync(previousFilePath);
        }
      }


      const { firstName, lastName, contact, address, bio, registrationNo, userLocation, skills } = req.body;

      // Common fields update
      userToUpdate.firstName = firstName;
      userToUpdate.lastName = lastName;
      userToUpdate.contact = contact;
      userToUpdate.address = address;
      userToUpdate.bio = bio;
      userToUpdate.registrationNo = registrationNo;
      userToUpdate.userLocation = userLocation;

      if (userToUpdate.roleAs === "Student") {
        const { cgpa, university, semester, program } = req.body;

        // Update specific fields for Student
        userToUpdate.cgpa = cgpa;
        userToUpdate.university = university;
        userToUpdate.semester = semester;
        userToUpdate.program = program;

        if (skills) {
          const existingSkills = userToUpdate.skills || [];
          const updatedSkills = skills.map((skill: { skillName: string, skillLevel: number }) => {
            const existingSkill = existingSkills.find((s: any) => s.skillName === skill.skillName);
            return existingSkill || skill;
          });
          userToUpdate.skills = updatedSkills;
        }

      } else if (userToUpdate.roleAs === "Company") {
        const { companyType, Website_URL } = req.body;
        console.log('Company');
        // Update specific fields for Company
        userToUpdate.companyType = companyType;
        userToUpdate.Website_URL = Website_URL;
        userToUpdate.skills = skills;

  const legal_document=  req.file ? req.file.filename : '';
        if (!legal_document) {
          return res.status(400).json({ message: 'Legal document not found' });
        }
        userToUpdate.legal_document = legal_document;
      }
      else if(userToUpdate.roleAs === "University"){
        const { Website_URL } = req.body;
        userToUpdate.Website_URL = Website_URL;
        
  const legal_document=  req.file ? req.file.filename : '';
  if (!legal_document) {
    return res.status(400).json({ message: 'Legal document not found' });
  }
  userToUpdate.legal_document = legal_document;
      }

      const updatedUser = await userToUpdate.save();
      if(userToUpdate.isVerified === false) {
      sendNotification('66be5802a0733b88942cd09f', userToUpdate._id.toString(), `Hi ${updatedUser.firstName}, your profile has been updated. Please wait for verification!`,'notify-user');
      
      if(updatedUser.roleAs === "Student"){
        sendNotification( updatedUser._id.toString(), updatedUser.university,  `Please verify this Account, ${updatedUser.firstName} ${updatedUser.lastName} Joined as your Student`, 'verify-user');
      }else{
        sendNotification( updatedUser._id.toString(), '66be5802a0733b88942cd09f',  `Please verify this Account, ${updatedUser.firstName} ${updatedUser.lastName} Joined as ${updatedUser.roleAs}`, 'verify-user');
      }
     }else{
      sendNotification('66be5802a0733b88942cd09f', userToUpdate._id.toString(), `Hi ${updatedUser.firstName}, your profile has been updated.`,'notify-user');
      
     }
      res.json(updatedUser)  
    
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


userRouter.get('/roleAs/:roleAs', async (req, res) => {
  const { roleAs } = req.params;
  try {
    const users = await user.find({roleAs});
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.get('/roleAs/:roleAs/:id', async (req, res) => {
  const { roleAs, id } = req.params;
  try {
    const users = await user.find({roleAs, _id: { $ne: id } });
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.get('/students/:uni_Id', async (req, res) => {
  const { uni_Id } = req.params;
  try {
    const users = await user.find({university: uni_Id, roleAs: 'Student' });
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



userRouter.put('/update/:id', uploadProfile.single('profile'), async (req, res) => {
  const User = await user.findById(req.params.id);
  if (User) {
    if (User.profile) {
      fs.unlinkSync(`./uploads/profile/${User.profile}`); // Delete the old image
    }
    if(req.file){
        User.profile = req.file?.filename; 
        await User.save();
    }
  
   
    res.status(200).json(User);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


userRouter.put('/update-coverImage/:id', uploadCover.single('coverImage'), async (req, res) => {
  const User = await user.findById(req.params.id);
  if (User) {
    if (User.coverPhoto) {
      fs.unlinkSync(`./uploads/coverPhoto/${User.coverPhoto}`); // Delete the old image
    }
    if(req.file){
        User.coverPhoto = req.file?.filename; 
        await User.save();
    }
  
   
    res.status(200).json(User);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});



userRouter.get('/search/:keyword', async (req, res) => {
  const {keyword } = req.params;

  if (!keyword) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // First, search by name
    const nameSearch = await user.find({
      name: new RegExp(keyword, 'i') // Case-insensitive search for name
    });

    if (nameSearch.length > 0) {
      return res.json(nameSearch);
    }

    // If no results in name, search by skills
    const skillsSearch = await user.find({
      skills: new RegExp(keyword, 'i') // Case-insensitive search for skills
    });

    res.json(skillsSearch);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default userRouter;