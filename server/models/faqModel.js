import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  title: { type: String, required: true }, // File name or FAQ title
  content: { type: String, required: true }, // Extracted plain text from uploaded files
  uploadedBy: { type: String, default: 'user' },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('faqData', faqSchema);

