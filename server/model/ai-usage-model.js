import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for unauthenticated users
      index: true
    },
    userEmail: {
      type: String,
      default: null // Store email for reference even if user is deleted
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    sessionId: {
      type: String,
      default: null // Track anonymous users by session if needed
    },
    service: {
      type: String,
      required: true,
      enum: [
        'resume_summary',
        'cover_letter',
        'field_content',
        'resume_enhancement',
        'ats_analysis',
        'ats_optimization',
        'resume_parser',
        'chat'
      ],
      index: true
    },
    model: {
      type: String,
      required: true,
      enum: ['gemini-2.5-flash', 'gemini-2.0-flash-exp'],
      index: true
    },
    inputTokens: {
      type: Number,
      required: true,
      default: 0
    },
    outputTokens: {
      type: Number,
      required: true,
      default: 0
    },
    // Costs in USD
    inputCost: {
      type: Number,
      required: true,
      default: 0
    },
    outputCost: {
      type: Number,
      required: true,
      default: 0
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0
    },
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    requestStatus: {
      type: String,
      enum: ['success', 'failed'],
      required: true
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Indexes for efficient querying
aiUsageSchema.index({ createdAt: -1 });
aiUsageSchema.index({ userId: 1, createdAt: -1 });
aiUsageSchema.index({ service: 1, createdAt: -1 });
aiUsageSchema.index({ isAuthenticated: 1, createdAt: -1 });

// Static method to calculate cost
aiUsageSchema.statics.calculateCost = function(model, inputTokens, outputTokens) {
  const pricing = {
    'gemini-2.5-flash': {
      input: 0.30 / 1_000_000,  // $0.30 per 1M tokens
      output: 2.50 / 1_000_000   // $2.50 per 1M tokens
    },
    'gemini-2.0-flash-exp': {
      input: 0.05 / 1_000_000,   // $0.05 per 1M tokens
      output: 0.20 / 1_000_000   // $0.20 per 1M tokens
    }
  };

  const modelPricing = pricing[model] || pricing['gemini-2.5-flash'];
  const inputCost = inputTokens * modelPricing.input;
  const outputCost = outputTokens * modelPricing.output;
  const totalCost = inputCost + outputCost;

  return {
    inputCost: parseFloat(inputCost.toFixed(8)),
    outputCost: parseFloat(outputCost.toFixed(8)),
    totalCost: parseFloat(totalCost.toFixed(8))
  };
};

// Instance method to calculate and set costs
aiUsageSchema.methods.setCosts = function() {
  const costs = this.constructor.calculateCost(
    this.model,
    this.inputTokens,
    this.outputTokens
  );
  
  this.inputCost = costs.inputCost;
  this.outputCost = costs.outputCost;
  this.totalCost = costs.totalCost;
};

// Pre-save hook to automatically calculate costs
aiUsageSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('inputTokens') || this.isModified('outputTokens')) {
    this.setCosts();
  }
  next();
});

const AIUsage = mongoose.model('AIUsage', aiUsageSchema);

export default AIUsage;

