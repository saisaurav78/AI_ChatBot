import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  title: { type: String, required: true }, // The file name or FAQ title
  content: { type: String, required: true }, // Extracted plain text content from the uploaded file
  uploadedBy: { type: String, default: 'user' }, // Username or identifier of uploader
  uploadedAt: { type: Date, default: Date.now }, // Timestamp when the FAQ was uploaded
});

export default mongoose.model('faqData', faqSchema);
