import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  appliance: {
    type: String,
    required: true,
    enum: ["washer", "dryer"],
  },
  applianceNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  residenceHall: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

ReportSchema.index({ appliance: 1, residenceHall: 1 });
ReportSchema.index({ residenceHall: 1, timestamp: -1 });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);