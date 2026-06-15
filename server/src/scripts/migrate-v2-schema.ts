/**
 * One-time migration: CareerForge v2 schema updates
 *
 * - Normalises all users to plan: 'free'
 * - Adds role: 'user' where missing
 * - Initialises onboarding state for existing users
 * - Ensures usage.coverLetter exists on users/guests
 *
 * Run: npx ts-node src/scripts/migrate-v2-schema.ts
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { User } from '../models/User.model'
import { Guest } from '../models/Guest.model'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerforge'

async function migrateUsers() {
  const users = await User.find({}).select('_id plan role resumeCount onboarding usage').lean()
  let updated = 0

  for (const user of users) {
    const patch: Record<string, unknown> = {}

    if (user.plan !== 'free') {
      patch.plan = 'free'
    }

    if (!user.role) {
      patch.role = 'user'
    }

    if (!user.onboarding) {
      patch.onboarding = user.resumeCount > 0
        ? { status: 'completed', completedAt: new Date() }
        : { status: 'pending' }
    } else if (user.resumeCount > 0 && user.onboarding.status === 'pending') {
      patch.onboarding = {
        ...user.onboarding,
        status: 'completed',
        completedAt: user.onboarding.completedAt ?? new Date(),
      }
    }

    if (user.usage && user.usage.coverLetter === undefined) {
      patch['usage.coverLetter'] = 0
    }

    if (Object.keys(patch).length > 0) {
      await User.updateOne({ _id: user._id }, { $set: patch })
      updated++
    }
  }

  console.log(`✅ Users: ${updated}/${users.length} updated`)
}

async function migrateGuests() {
  const result = await Guest.updateMany(
    { 'usage.coverLetter': { $exists: false } },
    { $set: { 'usage.coverLetter': 0 } }
  )
  console.log(`✅ Guests: ${result.modifiedCount} usage records patched`)
}

async function ensureIndexes() {
  await User.syncIndexes()
  await Guest.syncIndexes()
  console.log('✅ Indexes synced for User and Guest')
}

mongoose.connect(uri)
  .then(async () => {
    console.log('📦 Connected to MongoDB:', uri)
    await migrateUsers()
    await migrateGuests()
    await ensureIndexes()
    console.log('🎉 Migration complete')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  })
