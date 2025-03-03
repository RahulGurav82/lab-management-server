const express = require("express");
const router = express.Router();
const Lab = require("../models/Lab");
const ConnectedPC = require("../models/ConnectedPC"); // New model for PCs
const Requirement = require("../models/Requirement"); // New model for PCs

// Generate a unique Lab ID
const generateLabId = () => `LAB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// Get all labs
router.get("/", async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all PCs along with their corresponding labId
router.get("/pcs", async (req, res) => {
  try {
    const labs = await Lab.find({}, "name labId connectedPCs");

    // Flatten the result to get all PCs with their respective labId and name
    const allPCs = labs.flatMap(lab => 
      lab.connectedPCs.map(pc => ({
        labName: lab.name,
        labId: lab.labId,
        pcNumber: pc.pcNumber,
        joinedAt: pc.joinedAt
      }))
    );

    res.json(allPCs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching PCs", error: error.message });
  }
});

// Create a new lab
router.post("/create", async (req, res) => {
  try {
    console.log(req.body)
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
      return     res.status(200).json({ message: "PC joined the lab successfully", labName: lab.name });
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

// API to fetch connected PCs for a specific lab
router.get("/:labId/connected-pcs", async (req, res) => {
  try {
    const { labId } = req.params;
    
    // Find the lab by labId
    const lab = await Lab.findOne({ labId });
    
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    
    res.json({ labName: lab.name, connectedPCs: lab.connectedPCs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API to send a requirement
router.post("/send-requirement", async (req, res) => {
  try {
    console.log(req.body);
    const { labId, labName, pcNumber, requirementType, description } = req.body;

    // Check if all fields are present
    if (!labId || !labName || !pcNumber || !requirementType || !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Save the requirement to the database
    const requirement = new Requirement({ labId, labName, pcNumber, requirementType, description });
    await requirement.save();

    res.status(201).json({ message: "Requirement submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// API to get all requirements
router.get("/all-requirements", async (req, res) => {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 }); // Sort by latest
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// API for Admin to update requirement status
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure status is valid
    if (!["Pending", "Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value!" });
    }

    const updatedRequirement = await Requirement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequirement) {
      return res.status(404).json({ message: "Requirement not found!" });
    }

    res.status(200).json({ message: "Status updated successfully!", updatedRequirement });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// API to get requirements based on labId or pcNumber
router.get("/requirements-by-lab-or-pc", async (req, res) => {
  try {
    console.log(req.query);
    const { labId, pcNumber } = req.query;

    if (!labId && !pcNumber) {
      return res.status(400).json({ message: "labId or pcNumber is required" });
    }

    const filter = {};
    if (labId) filter.labId = labId;
    if (pcNumber) filter.pcNumber = pcNumber;

    const requirements = await Requirement.find(filter).sort({ createdAt: -1 });

    if (requirements.length === 0) {
      return res.status(404).json({ message: "No requirements found for the given labId or pcNumber" });
    }

    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get statistics
router.get("/stats", async (req, res) => {
  try {
    // Get count of labs
    const totalLabs = await Lab.countDocuments();

    // Get count of connected PCs
    const labs = await Lab.find({}, "connectedPCs");
    const totalConnectedPCs = labs.reduce((acc, lab) => acc + lab.connectedPCs.length, 0);

    // Get count of requirements based on status
    const pendingRequirements = await Requirement.countDocuments({ status: "Pending" });
    const resolvedRequirements = await Requirement.countDocuments({ status: "Resolved" });
    const rejectedRequirements = await Requirement.countDocuments({ status: "Rejected" });

    // Send response
    res.json({
      totalLabs,
      totalConnectedPCs,
      pendingRequirements,
      resolvedRequirements,
      rejectedRequirements,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error: error.message });
  }
});

module.exports = router;