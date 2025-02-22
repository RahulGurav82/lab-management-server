const mongoose = require("mongoose");

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  labId: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  connectedPCs: [
    {
      pcNumber: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lab", LabSchema);