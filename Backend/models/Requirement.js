const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema({
  labId: { type: String, required: true },
  labName: { type: String, required: true }, // Added labName
  pcNumber: { type: String, required: true },
  requirementType: { type: String, enum: ["Hardware", "Software"], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" }, // Added status field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Requirement", RequirementSchema);