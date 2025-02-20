const mongoose = require("mongoose");
// Model for connected PCs
const ConnectedPCSchema = new mongoose.Schema({
    labId: { type: String, required: true },
    pcNumber: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
  });
  
const ConnectedPC = mongoose.model("ConnectedPC", ConnectedPCSchema);