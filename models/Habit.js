import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // store user ID
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
