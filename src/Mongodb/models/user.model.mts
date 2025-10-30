import mongoose from 'mongoose'


interface users extends Document {
    name: string,
    email: string,
    password: string,
    address:string,
    roleAs: string,
    firstName: string,
    lastName: string,
    contact: string,
    userLocation:string,
    profile: string,
    bio:string,
  registrationNo:string,
  cgpa: string,
  university: string,
  semester: string,
  skills: [{
    skillName:string,
    skillLevel: number,
    marks:{
      level1:number,
      level2:number,
      level3:number,
      level4:number,
      level5:number,
      marksObtained: number,
    },
    lastView:{
      lastAttempt?:Date,
      nextAttempt?:Date,
      attempts: number,
    },
  }],
  program:string,
  coverPhoto:string,
   isVerified:boolean,
   legal_document:string,
   companyType:string,
   Website_URL:string


 

  }
  // Define a simple mongoose schema and model
  const UsersSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    roleAs:{type: String, require: true },
    firstName: { type: String, require: false },
    lastName: { type: String, require: false},
    contact: { type: String, require:false},
    userLocation:{type: String, require:false},
    address:{type: String, require:false},
    profile: { type: String, require:false },
    bio: { type: String, require:false },
    registrationNo:{ type:String, required:false},
    cgpa: { type:String, required:false},
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:false},
    semester: { type:String, required:false},
    skills: { type:[{
      skillName:String,
      skillLevel: Number,
      marks:{
        level1:Number,
        level2:Number,
        level3:Number,
        level4:Number,
        level5:Number,
        marksObtained: {type: Number, required:false},
      },
      lastView:{ lastAttempt: {  type:Date, required:false},
      nextAttempt:{type:Date, required:false},
      attempts: {type: Number, required:false, default:0},
    },
    }], required:false},
    program:{ type:String, required:false},
    coverPhoto: {type:String, required:false},
   isVerified:{type:Boolean, required:false},
   companyType:{type:String, required:false},
   Website_URL:{type:String, required:false},
   legal_document:{type:String, required:false}
  },{
    timestamps: true,
  });

  const user = mongoose.model<users>("users", UsersSchema);

export {user};