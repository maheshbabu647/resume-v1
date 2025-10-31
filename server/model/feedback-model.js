import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, enum: ['save_resume', 'download_resume', 'enhance_resume', 'ats_check'], required: true },
  rating: { type: Number, min: 1, max: 5, required: false },
  comments: { type: String, maxlength: 2000, required: false },
  pageUrl: { type: String, required: false },
  meta: { type: Object, required: false },
}, { timestamps: true })

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema)
export default FeedbackModel


