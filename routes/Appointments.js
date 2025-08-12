import express from "express";
import Appointment from "../models/Appointment.js";
import auth from "../middleware/auth.js";
import { generateSlots } from "../utils/slots.js";

const router = express.Router();

// GET /api/appointments/slots?provider=Dr.%20Sharma&date=2025-08-10
router.get("/slots", async (req, res) => {
  try {
    const { provider, date } = req.query;
    if (!provider || !date) return res.status(400).json({ message: "provider and date required" });
    const booked = await Appointment.find({ provider, date }).select("time");
    const bookedTimes = new Set(booked.map(b => b.time));
    const all = generateSlots();
    const available = all.filter(t => !bookedTimes.has(t));
    res.json({ provider, date, available });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/appointments
// body: { provider, date: "YYYY-MM-DD", time: "HH:mm" }
router.post("/", auth, async (req, res) => {
  try {
    const { provider, date, time } = req.body || {};
    if (!provider || !date || !time) return res.status(400).json({ message: "All fields required" });
    // ensure slot format exists in generated set
    if (!generateSlots().includes(time)) return res.status(400).json({ message: "Invalid time slot" });
    const appt = await Appointment.create({ user: req.userId, provider, date, time });
    res.status(201).json(appt);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Slot already booked" });
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/appointments/my
router.get("/my", auth, async (req, res) => {
  try {
    const list = await Appointment.find({ user: req.userId }).sort({ date: 1, time: 1 });
    res.json(list);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, user: req.userId });
    if (!appt) return res.status(404).json({ message: "Not found" });
    await appt.deleteOne();
    res.json({ message: "Cancelled" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
