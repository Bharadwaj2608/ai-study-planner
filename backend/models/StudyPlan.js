import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: String },
    topic: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 },
    resources: [{ type: String }],
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    goal: { type: String, required: true },
    examDate: { type: Date },
    hoursPerDay: { type: Number, default: 2 },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
