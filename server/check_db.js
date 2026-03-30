const { connect, mongoose } = require('mongoose');
const { User } = require('./src/models/User.model');
require('dotenv').config();

async function check() {
  await connect('mongodb://localhost:27017/careerforge');
  const users = await User.find({}).select('email name referralCode referredBy usage resumeCount totalReferrals plan');
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}
check();
