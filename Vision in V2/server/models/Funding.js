import mongoose from 'mongoose';

const fundingSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  organization: { type: String, required: true },
  logo: { type: String },
  type: { type: String, default: 'Grant' },
  equity: { type: String },
  fundingAmount: { type: String },
  deadline: { type: String },
  description: { type: String },
  eligibility: { type: String }
}, { timestamps: true });

export default mongoose.models.Funding || mongoose.model('Funding', fundingSchema);
