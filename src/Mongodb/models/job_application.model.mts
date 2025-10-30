import mongoose from 'mongoose'

interface jobs_application_model extends Document {
    applicant_id: mongoose.Schema.Types.ObjectId,
    job_id: mongoose.Schema.Types.ObjectId,
    applicant_education:{
        degree:string,
        semester:string
    },
    applicant_email:string,
    country_code:string,
    applicant_contact:string,
    requiredSkills:[
        {
            skill:string
            level:string
        }
    ],
    custom_question:{
        question:string,
        ans:string
    },
    applicant_LanguageSkill:[
      {
        language:string,
        proficiency:string
      }
    ],
    application_status:string,
    hybrid_work:string,
    applicant_resume:string,
    applicant_cover_letter:string,
    comfort_location:string,


}
  // Define a simple mongoose schema and model
  const JobApplicationSchema = new mongoose.Schema({
    applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    applicant_education:{
      degree:{type:String},
      semester:{type:String}
    },
    applicant_email:{type:String},
    country_code:{type:String},
    applicant_contact:{type:String},
    requiredSkills:[
      {
        skill:{type:String},
        level:{type:Number}
      }
    ],
    custom_question:{
      question:{type:String},
      ans:{type:String}
    },
    applicant_LanguageSkill:[
      {
        language:{type:String},
        proficiency:{type:String}
      }
    ],
    application_status:{type:String},
    hybrid_work:{type:String},
    applicant_resume:{type:String},
    applicant_cover_letter:{type:String},
    comfort_location:{type:String},
    
  }, { timestamps: true });

  const Jobs_application = mongoose.model<jobs_application_model>("Jobs_application", JobApplicationSchema);

export {Jobs_application};