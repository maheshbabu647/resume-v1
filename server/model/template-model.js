import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
  },
  templateImage: {
    type: String, // URL from Cloudinary
    required: [true, 'Template image URL is required'],
  },
  templateImageId: {
    type: String,
    required: [true, 'Template image public id is required'],
  },
  layoutSlots: {
    type: [String],
    required: [true, 'Layout slots must be defined.'],
    default: ['main_column']
  },
  templateComponents: {
    htmlShell: {
      type: String,
      required: [true, 'HTML shell is required'],
    },
    baseCss: {
      type: String,
      required: [true, 'Base CSS is required'],
    },
    sections: [{
      _id: false, // Prevents Mongoose from creating an _id for each section object
      key: { type: String, required: true },  // e.g., 'education', 'experience'
      name: { type: String, required: true }, // e.g., 'Education', 'Work Experience'
      html: { type: String, required: true }, // The HTML for this section, specific to this template's design.
    }],
    stylePacks: [{
      _id: false,
      key: { type: String, required: true },  // e.g., 'classic-blue', 'modern-dark'
      name: { type: String, required: true }, // e.g., 'Classic Blue', 'Modern Dark'
      css: { type: String, required: true },  // The specific CSS for this style pack
    }],
    sectionPresets: [{
      _id: false,
      key: { type: String, required: true },  // e.g., 'entry-level', 'senior-professional'
      name: { type: String, required: true }, // e.g., 'Entry-Level Focus', 'Experience First'
      order: { type: mongoose.Schema.Types.Mixed, required: true } 
    }]
  },
  templateFieldDefinition: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Field definitions are required.'],
    default: []
  },
  tags: {
    style: {
      type: String,
      trim: true
    },
    level: {
      type: [String]
    },
    industry: {
      type: [String]
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const templateModel = mongoose.model('Template', templateSchema);

export default templateModel;