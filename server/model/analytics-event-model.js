import mongoose from 'mongoose'

const analyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true, index: true }, // e.g. 'user_signup', 'resume_download'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible: holds any extra info
  timestamp: { type: Date, default: Date.now, index: true }
})

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema)
export default AnalyticsEvent
