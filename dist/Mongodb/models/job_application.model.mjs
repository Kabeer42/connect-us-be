import mongoose from 'mongoose';
// Define a simple mongoose schema and model
const JobApplicationSchema = new mongoose.Schema({
    applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    applicant_education: {
        degree: { type: String },
        semester: { type: String }
    },
    applicant_email: { type: String },
    country_code: { type: String },
    applicant_contact: { type: String },
    requiredSkills: [
        {
            skill: { type: String },
            level: { type: Number }
        }
    ],
    custom_question: {
        question: { type: String },
        ans: { type: String }
    },
    applicant_LanguageSkill: [
        {
            language: { type: String },
            proficiency: { type: String }
        }
    ],
    application_status: { type: String },
    hybrid_work: { type: String },
    applicant_resume: { type: String },
    applicant_cover_letter: { type: String },
    comfort_location: { type: String },
}, { timestamps: true });
const Jobs_application = mongoose.model("Jobs_application", JobApplicationSchema);
export { Jobs_application };
//# sourceMappingURL=job_application.model.mjs.map