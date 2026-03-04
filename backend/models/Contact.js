import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique contact per user
contactSchema.index({ user: 1, contact: 1 }, { unique: true });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
