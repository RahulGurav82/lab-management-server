const express = require("express");
const router = express.Router();
const Lab = require("../models/Lab");
const ConnectedPC = require("../models/ConnectedPC"); // New model for PCs
const Requirement = require("../models/Requirement"); // New model for PCs

// Generate a unique Lab ID
const generateLabId = () => `LAB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// Create a new lab
router.post("/create", async (req, res) => {
  try {
    const { name, capacity } = req.body;
    if (!name || !capacity) {
      return res.status(400).json({ message: "Lab name and capacity are required" });
    }

    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ message: "Capacity must be a valid number greater than 0" });
    }

    const newLab = new Lab({ name, labId: generateLabId(), capacity });
    await newLab.save();

    res.status(201).json(newLab);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Join Lab (PC connects to Lab)
router.post("/join-lab", async (req, res) => {
  try {
    const { labId, pcNumber } = req.body;

    if (!labId || !pcNumber) {
      return res.status(400).json({ message: "Lab ID and PC Number are required" });
    }

    const lab = await Lab.findOne({ labId });
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    // Check if PC already joined
    if (lab.connectedPCs.some(pc => pc.pcNumber === pcNumber)) {
      return res.status(400).json({ message: "PC is already connected to this lab" });
    }

    // Check if Lab is full
    if (lab.connectedPCs.length >= lab.capacity) {
      return res.status(400).json({ message: "Lab is full" });
    }

    // Add PC to the lab
    lab.connectedPCs.push({ pcNumber });
    await lab.save();

    res.status(200).json({ message: "PC joined the lab successfully", labName: lab.name });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all labs
router.get("/", async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// API to send a requirement
router.post("/send-requirement", async (req, res) => {
  try {
    console.log(req.body)
    const { labId, pcNumber, requirementType, description } = req.body;

    if (!labId || !pcNumber || !requirementType || !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const requirement = new Requirement({ labId, pcNumber, requirementType, description });
    await requirement.save();

    res.status(201).json({ message: "Requirement submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;