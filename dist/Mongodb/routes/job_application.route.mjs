import express from 'express';
import { Jobs_application } from '../models/job_application.model.mjs';
import { resumeUpload } from '../maltermiddleware.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { user } from '../models/user.model.mjs';
const jobApplicationRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFileExtension = (filePath) => {
    const ext = path.extname(filePath); // e.g., ".pdf"
    return ext ? ext.slice(1) : ''; // Remove the dot (e.g., "pdf")
};
jobApplicationRouter.get("/JobApplication/:jobId", async (req, res) => {
    try {
        const { jobId } = req.params;
        const applicant = await Jobs_application.find({ job_id: jobId }).populate('applicant_id');
        res.status(200).json({ applicant });
    }
    catch (error) {
        console.error('Error fetching Job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
jobApplicationRouter.post("/jobs-apply", resumeUpload.single('applicant_resume'), async (req, res) => {
    try {
        const { applicant_id, job_id, applicant_education, applicant_email, country_code, applicant_contact, requiredSkills, custom_question, applicant_LanguageSkill, application_status, hybrid_work, applicant_cover_letter, comfort_location, } = req.body;
        // Multer adds file info to req.file
        const applicant_resume = req.file ? req.file.filename : null;
        const exiest = await Jobs_application.findOne({ applicant_id, job_id });
        if (exiest) {
            return res.status(400).json({ message: "Already Applied" });
        }
        // Perform basic validation
        if (!applicant_id || !job_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Create a new job application instance
        const newJobApplication = new Jobs_application({
            applicant_id,
            job_id,
            applicant_education,
            applicant_email,
            country_code,
            applicant_contact,
            requiredSkills,
            custom_question,
            applicant_LanguageSkill,
            application_status,
            hybrid_work,
            applicant_resume: applicant_resume,
            applicant_cover_letter,
            comfort_location,
        });
        // Save the job application to the database
        const savedJobApplication = await newJobApplication.save();
        // Respond with a success message and the saved job application data
        res.status(201).json({ message: 'Applied Successfully', data: savedJobApplication });
    }
    catch (error) {
        console.error('Error applying for job:', error);
        // If an error occurs after file upload, delete the uploaded file
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads/resume', req.file.filename));
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
jobApplicationRouter.get('/JobsApplicationById/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const applications = await Jobs_application.findById(id).populate('job_id');
        if (!applications) {
            return res.status(404).json({ message: 'Application not found' });
        }
        const users = await user.findById(applications.applicant_id).populate('university');
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!applications.applicant_resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        const resumePath = path.join(__dirname, '..', '../../uploads/resume', applications.applicant_resume);
        // console.log(resumePath);
        // Check if resume file exists
        fs.stat(resumePath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).json({ message: 'Resume file does not exist' });
                }
                return res.status(500).json({ message: 'Error accessing file' });
            }
            const fileSize = stats.size; // Get file size in bytes
            const fileSizeInKB = fileSize / 1024; // Convert bytes to kilobytes
            const fileSizeInMB = fileSizeInKB / 1024; // Convert kilobytes to megabytes
            const fileType = getFileExtension(resumePath); // File extension without the dot
            return res.status(200).json({ applications, users, fileSizeInMB, fileType });
        });
    }
    catch (e) {
        console.error('Error fetching Job:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default jobApplicationRouter;
//# sourceMappingURL=job_application.route.mjs.map