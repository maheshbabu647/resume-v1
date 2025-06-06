import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User ID is required to associate the cover letter with a user.'],
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required.'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters.']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required.'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters.']
  },
  coverLetterContent: {
    type: String,
    required: [true, 'Cover letter content is required.'],
    trim: true
  },
  // We can also store the original inputs for future reference or regeneration
  originalInputs: {
    jobDescription: String,
    userSkills: String
  }
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
});


const coverLetterModel = mongoose.model('CoverLetter', coverLetterSchema);

export default coverLetterModel;
