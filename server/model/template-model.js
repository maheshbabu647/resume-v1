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
  
  // ++ NEW FIELD: For identifying ATS-friendly templates ++
  isAtsRecommended: {
    type: Boolean,
    default: false,
  },

  // ++ NEW FIELD: Defines the curated preset combinations for the UI ++
  presets: [{
      _id: false,
      key: { type: String, required: true }, // e.g., 'tech-graduate-onyx'
      name: { type: String, required: true }, // e.g., 'For recent IT Graduate'
      industry: { type: String, required: true }, // e.g., 'Technology'
      sectionPresetKey: { type: String, required: true }, // Pointer to a key in templateComponents.sectionPresets
      stylePackKey: { type: String, required: true }, // Pointer to a key in templateComponents.stylePacks
      isPrimary: { type: Boolean, default: false } // For the progressive disclosure feature
  }],

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
      _id: false, 
      key: { type: String, required: true },
      name: { type: String, required: true },
      html: { type: String, required: true },
    }],
    stylePacks: [{
      _id: false,
      key: { type: String, required: true },
      name: { type: String, required: true },
      css: { type: String, required: true },
    }],
    sectionPresets: [{ // Note: This defines the SECTION ORDER options that presets can use
      _id: false,
      key: { type: String, required: true },
      name: { type: String, required: true },
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