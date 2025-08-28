import express from "express";
import Habit from "../models/habit.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all habits for logged-in user
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new habit
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Habit name required" });

  try {
    const newHabit = await Habit.create({
      user: req.user._id,
      name,
      completed: false,
    });
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle habit completed
router.put("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    habit.completed = !habit.completed;
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete a habit
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // Ensure the logged-in user owns this habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Habit.findByIdAndDelete(req.params.id); // delete by ID

    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
