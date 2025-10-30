import express from 'express';
import { quiz } from '../models/quiz.model.mjs';
import { user } from '../models/user.model.mjs';
import { error, time } from 'console';
const QuizRouter = express.Router();

QuizRouter.get("/getQuiz/:userId/:program/:level", async (req, res) => {
    const program = req.params.program;
    const userId = req.params.userId;
    const level = parseInt(req.params.level, 10);
    const users = await user.findById(userId);
 try{   if (!users) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      const skill = users.skills.find((skill: { skillName: string; skillLevel: any }) => skill.skillName === program);
      if (skill) {
       const quizz = await quiz.aggregate([{$match: {program:program, Level:level}}, {$sample: {size: 20}}]);
       res.json( quizz);
} 
else{
    return res.status(404).send(error);
}}catch(e){
  res.status(500).json({ message: 'Internal server error' });
}
   
  });

  QuizRouter.put("/updateResult/:userId", async (req, res) => {
    const id = req.params.userId;
    const  skillName  = req.body.skillName;
    const marksUpdate = parseInt(req.body.marksUpdate, 10);
    const newSkillLevel = parseInt(req.body.newSkillLevel, 10);
    try {
       const User = await user.findById(id);
  
    if (!User) {
      return res.status(404).json({ message: 'User not found' });
  }
     // Find the skill to update
     const skill = User.skills.find(skill => skill.skillName === skillName);
     if (!skill) {
       throw new Error('Skill not found');
     }
  
     // Update the skillLevel
     skill.skillLevel = newSkillLevel+1;
    
    
      skill.lastView.attempts = 0;
        skill.lastView.nextAttempt = undefined ;
        skill.lastView.lastAttempt = undefined;
     // Update the marks based on the new skill level
     switch (newSkillLevel) {
       case 1:
         skill.marks.level1 = marksUpdate ?? skill.marks.level1;
         break;
       case 2:
         skill.marks.level2 = marksUpdate ?? skill.marks.level2;
         break;
       case 3:
         skill.marks.level3 = marksUpdate ?? skill.marks.level3;
         break;
       case 4:
         skill.marks.level4 = marksUpdate ?? skill.marks.level4;
         break;
       case 5:
         skill.marks.level5 = marksUpdate ?? skill.marks.level5;
         break;
       default:
         throw new Error('Invalid skill level');
     }
  
     // Update the marksObtained if provided
     if (marksUpdate >= 0) {
      if(!skill.marks.marksObtained ){
        skill.marks.marksObtained = marksUpdate;
      }else{
        skill.marks.marksObtained = (skill.marks.marksObtained + marksUpdate) / (newSkillLevel);
      }
       }
       
     // Save the user document
     await User.save();
     res.json(User);
    
  
  }catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  })


  QuizRouter.get('/checkLastUpdate/:userId/:skillName', async (req, res) => {
    const userId = req.params.userId;
    const skillName = req.params.skillName;
    const now = new Date();
    try {
      const User = await user.findById(userId);
      if (!User) {
        return res.status(404).json({ message: 'User not found' });
      }

      const skill = User.skills.find(skill => skill.skillName === skillName);
      if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
      }
      if(!skill.lastView){
        return res.status(200).json({ message: 'Skill last viewed', result: false });
      }
      res.status(200).json({ message: 'Skill last viewed', time: User, result: true});
    }catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  QuizRouter.get('/updateLateView/:userId/:skillName', async (req, res) => {
    const {userId, skillName} = req.params;
    const now = new Date();
    try {
      const User = await user.findById(userId);
      if (!User) {
        return res.status(404).json({ message: 'User not found' });
      }
      const skill = User.skills.find(skill => skill.skillName === skillName);
      if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
      }
      if(skill.lastView?.attempts===0){
        skill.lastView = {lastAttempt: now, attempts: 1, nextAttempt: calculateNextAttemptTime(1)};
        await User.save();
        return res.status(200).json({message: 'Skill View has been Update recently',time:User})
        
      }else{
        if(skill.lastView.nextAttempt!.getTime() - now.getTime() <=0){
          skill.lastView = {lastAttempt: now, attempts: skill.lastView.attempts+1, nextAttempt: calculateNextAttemptTime(skill.lastView.attempts+1)};
          await User.save();
        
          return res.status(200).json({message: 'Skill View has been Update recently',time:User})
        }
      }
    
    
     
        return res.status(200).json({message: 'Skill has been viewed recently',time:User})
  }catch{
    res.status(500).json({ message: 'Internal server error' })
  }}
)


function calculateNextAttemptTime(attemptCount: number): Date {
  let nextAttemptTime;
  switch (attemptCount) {
    case 1:
      nextAttemptTime = new Date();
      nextAttemptTime.setHours(nextAttemptTime.getHours() + 1); // 1 hour
      break;
    case 2:
      nextAttemptTime = new Date();
      nextAttemptTime.setHours(nextAttemptTime.getHours() + 5); // 5 hours
      break;
    default:
      nextAttemptTime = new Date();
      nextAttemptTime.setDate(nextAttemptTime.getDate() + 7); // 1 week
      break;
  }
  return nextAttemptTime;
}

  export {QuizRouter}