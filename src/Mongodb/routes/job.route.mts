import express from 'express';
import { job } from '../models/jobs.model.mjs';

const jobRouter = express.Router();

jobRouter.get("/allJobs", async (req, res) => {
   try{
 const jobs = await job.find().populate('user_id').sort({ createdAt: -1 });
    res.status(200).json(jobs);

   }catch(e){
    console.error('Error fetching Job:', e);
    res.status(500).json({ message: 'Internal server error' });
 
   }
   
  });

  jobRouter.post("/create-jobs", async (req, res) => {
    try {
        const {  
            user_id,
            Job_title,
            Company,
            Workplace_type,
            Job_location,
            Job_type, 
            description,
            Skills,
            languages,
            email_website,
            education,
            custom_question,
            comfort_location,
            hybrid_work,
            skills_level
        } = req.body;

        const keywords = Job_title+' '+Company+' '+Workplace_type+' '+Job_location+' '+Job_type+' '+description+' '+Skills+' '+languages+' '+email_website+' '+education+' '+custom_question+' '+comfort_location+' '+hybrid_work+' '+skills_level;
        const newJob = new job({
            user_id,
            Job_title,
            Company,
            Workplace_type,
            Job_location,
            Job_type, 
            description,
            Skills,
            languages,
            email_website,
            education,
            custom_question,
            comfort_location,
            hybrid_work,
            skills_level,
            keywords
          });
            const check = await job.findOne({Job_title:Job_title,user_id:user_id, description:description})
            if(check){
                return res.status(400).json({ message: 'Already Exist this Job' });
            }
        
            const savedJob = await newJob.save();
        res.status(200).json({message: 'Upload Successfully', data: savedJob});
    } catch (error) {
        res.status(400).json({ message: "Error" });
    }
}); 
  export {jobRouter}


  
jobRouter.get("/JobsById/:id", async (req, res) => {
   const {id} = req.params
   try{

      const jobs = await job.findById(id).populate('user_id');
    res.status(200).json(jobs);
   }catch(e){
    console.error('Error fetching Job:', e);
    res.status(500).json({ message: 'Internal server error' });
 
   }
  
  });

    
jobRouter.get("/JobsByUserId/:id", async (req, res) => {
    const {id} = req.params
    try{
 
       const jobs = await job.find({user_id:id}).populate('user_id');
     res.status(200).json(jobs);
    }catch(e){
     console.error('Error fetching Job:', e);
     res.status(500).json({ message: 'Internal server error' });
  
    }
   
   });


jobRouter.get("/searchByKeyword-Location/:keyword/:location", async (req, res) => {
  const {keyword, location } = req.params;
if (!keyword || !location) {  
      return res.status(400).json({ message: 'Query parameter is required' });
    }
  
  try{
    const jobSearch = await job.find({
      keywords: new RegExp(keyword, 'i'), // Case-insensitive search for skills
      Job_location: new RegExp(location, 'i') // Case-insensitive search for job location
    });

    res.status(200).json(jobSearch);
    }catch(e){
     console.error('Error fetching Job:', e);
     res.status(500).json({ message: 'Internal server error' });
    }
})