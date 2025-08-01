const CaseTimeline = require("@models/CaseTimeline.model");
const Case = require("@models/case.model");

// 🔹 Create a timeline entry
exports.createTimelineEntry = async (req, res) => {
  try {
    const { case: caseId, type, description, dueDate, createdBy } = req.body;

    // Optional: Check if case exists
    const foundCase = await Case.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const timelineEntry = await CaseTimeline.create({
      case: caseId,
      type,
      description,
      dueDate,
      createdBy,
    });

    res.status(201).json(timelineEntry);
  } catch (error) {
    console.error("Create timeline error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all timeline entries for a case
exports.getTimelinesByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    const timelines = await CaseTimeline.find({ case: caseId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email" , "clien"); // optional: populate creator

    res.json(timelines);
  } catch (error) {
    console.error("Get timelines error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get a single timeline entry
exports.getSingleTimelineEntry = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const timeline = await CaseTimeline.findById(timelineId).populate("createdBy", "name");

    if (!timeline) {
      return res.status(404).json({ message: "Timeline entry not found" });
    }

    res.json(timeline);
  } catch (error) {
    console.error("Get single timeline error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update a timeline entry
exports.updateTimelineEntry = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const updates = req.body;

    const updated = await CaseTimeline.findByIdAndUpdate(timelineId, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Timeline entry not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update timeline error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete a timeline entry
exports.deleteTimelineEntry = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const deleted = await CaseTimeline.findByIdAndDelete(timelineId);

    if (!deleted) {
      return res.status(404).json({ message: "Timeline entry not found" });
    }

    res.json({ message: "Timeline entry deleted successfully" });
  } catch (error) {
    console.error("Delete timeline error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
