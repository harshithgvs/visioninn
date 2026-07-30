import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  authorRole: { type: String },
  title: { type: String },
  headline: { type: String },
  body: { type: String, required: true },
  roleTags: [{ type: String }],
  isSecureIdea: { type: Boolean, default: false },
  timestampBadge: { type: String },
  hash: { type: String },
  likes: [{ type: String }],
  likeCount: { type: Number, default: 0 },
  comments: [{
    id: String,
    authorId: String,
    authorName: String,
    authorAvatar: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  savedBy: [{ type: String }],
  category: { type: String, default: 'Ecosystem Feed' }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
