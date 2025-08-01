const mongoose = require("mongoose");

const CaseTimelineSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
  type: {
    type: String,
    enum: ["note", "update", "deadline"],
    required: true,
  },
  description: { type: String, required: true },
  dueDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CaseTimeline", CaseTimelineSchema);
