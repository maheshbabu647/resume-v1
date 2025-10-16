import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required to associate the resume with a user.'],
    index: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: [true, 'Template Id is required to associate the resume with a template.'],
    index: true
  },
  resumeName: {
    type: String,
    trim: true,
    maxlength: [100, 'Resume name cannot exceed 100 characters.']
  },
  resumeData: {
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Content data is required"],
      default: {}
    },
    sectionsConfig: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Sections configuration is required"],
      default: {}
    }
  },
  spacingMultiplier: {
    type: Number,
    default: 1,
    min: 0.8,
    max: 1.5,
  },
  fontSizeMultiplier: {
    type: Number,
    default: 1,
    min: 0.8,
    max: 1.5,
  },
  stylePackKey: {
    type: String,
    trim: true,
  },
  sectionOrder: {
    type: mongoose.Schema.Types.Mixed,
  },
  selectedIndustry: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true,
});

const resumeModel = mongoose.model('Resume', resumeSchema);

export default resumeModel;