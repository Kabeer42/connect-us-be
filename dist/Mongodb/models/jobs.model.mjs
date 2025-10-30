import mongoose from 'mongoose';
// Define a simple mongoose schema and model
const JobSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    Job_title: { type: String, require: true },
    Company: { type: String, require: true },
    Workplace_type: { type: String, require: true },
    Job_location: { type: String, require: true },
    Job_type: { type: String, require: true },
    description: { type: String, require: true },
    Skills: { type: [] },
    Receive_applicants: { type: String, require: true },
    email_website: { type: String, require: true },
    education: { type: {} },
    skills_level: { type: [] },
    hybrid_work: { type: Boolean },
    languages: { type: [] },
    comfort_location: { type: Boolean },
    custom_question: {},
    keywords: { type: String }
}, { timestamps: true });
const job = mongoose.model("Jobs", JobSchema);
export { job };
//# sourceMappingURL=jobs.model.mjs.map