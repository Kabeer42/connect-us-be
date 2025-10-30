import mongoose from 'mongoose'

interface jobs_model extends Document {
    user_id:  mongoose.Schema.Types.ObjectId,
    Job_title:String,
    Company:String,
    Workplace_type:String,
    Job_location:String,
    Job_type:String, 
    description: String,
    Skills:[],
    email_website :String,
    education: {
      degree: string,
      semester: number,
      required: boolean
  },
  skills_level: [{
    skill: string,
    level: string,
    required:boolean;
  }],
  hybrid_work : boolean,
    languages: [{
      language:string,
      proficiency: string,
      required:boolean
    }],
    comfort_location:boolean;
    custom_question: {
      question:string,
      response_type: string,
      ideal_ans: string,
    };
}
  // Define a simple mongoose schema and model
  const JobSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    Job_title:{type:String, require: true },
    Company:{type:String, require: true },
    Workplace_type:{type:String, require: true },
    Job_location:{type:String, require: true },
    Job_type:{type:String, require: true },
    description: {type:String, require: true },
    Skills:{type:[]},
    Receive_applicants :{type:String, require: true },
    email_website:{type:String, require: true },
    education:{type:{}},
    skills_level:{type:[]},
    hybrid_work:{type:Boolean},
    languages:{type:[]},
    comfort_location:{type:Boolean},
    custom_question:{},
    keywords:{type:String}
  }, { timestamps: true });

  const job = mongoose.model<jobs_model>("Jobs", JobSchema);

export {job};