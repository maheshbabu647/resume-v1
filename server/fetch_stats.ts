import mongoose from 'mongoose';
import { User } from './src/models/User.model';
import { Resume } from './src/models/Resume.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);

    const newUsers = await User.find({
      createdAt: { $gte: fiveDaysAgo }
    }).select('name email createdAt').sort({ createdAt: -1 });

    console.log(`\nFound ${newUsers.length} new signups in the past 5 days.\n`);

    for (const user of newUsers) {
      const resumes = await Resume.find({ userId: user._id }).select('title status updatedAt');
      console.log(`User: ${user.name} (${user.email})`);
      console.log(`Joined: ${user.createdAt.toISOString()}`);
      if (resumes.length > 0) {
        console.log(`Resumes (${resumes.length}):`);
        resumes.forEach(r => {
          console.log(`  - ${r.title} [${r.status}] (Last updated: ${r.updatedAt.toISOString()})`);
        });
      } else {
        console.log(`No resumes created yet.`);
      }
      console.log('-----------------------------------');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
