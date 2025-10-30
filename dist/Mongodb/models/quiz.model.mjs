import mongoose from 'mongoose';
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
}, {
    timestamps: true,
});
const quiz = mongoose.model("quiz", QuizSchema);
export { quiz };
//# sourceMappingURL=quiz.model.mjs.map