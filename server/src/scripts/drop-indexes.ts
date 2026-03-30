import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerforge'

mongoose.connect(uri)
  .then(async () => {
    console.log('📦 Connected to MongoDB:', uri)
    try {
      await mongoose.connection.collection('users').dropIndex('razorpaySubscriptionId_1').catch(() => {})
      await mongoose.connection.collection('users').dropIndexes() // This clears all indexes except _id
      console.log('✅ Successfully dropped old indexes on users collection.')
    } catch (err: any) {
      console.log('⚠️ Note: Could not drop indexes:', err.message)
    }
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message)
    process.exit(1)
  })
