import mongoose from 'mongoose'


interface quiz extends Document {
    Question:string,
    option1:string,
    option2:string,
    option3:string,
    option4:string,
    answer:string,
    program:string,

  }
  // Define a simple mongoose schema and model
  const QuizSchema = new mongoose.Schema({
    name: { type: String, require: true },
    Question: { type: String, require: true },
    option1: { type: String, require: true },
    option2: { type: String, require: true },
    option3: { type: String, require: true },
    option4: { type: String, require: true },
    answer: { type: String, require: true },
    program: { type: String, require: true },
  },{
    timestamps: true,
  });

  const quiz = mongoose.model<quiz>("quiz", QuizSchema);

export {quiz};