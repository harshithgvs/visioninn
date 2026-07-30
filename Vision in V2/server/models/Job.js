import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String, default: 'Remote' },
  type: { type: String, default: 'Internship' },
  stipend: { type: String },
  tags: [{ type: String }],
  description: { type: String, required: true },
  requirements: [{ type: String }],
  postedBy: { type: String },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
