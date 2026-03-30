import { Schema, model, Document, Types } from 'mongoose'
import type { ISection } from './Resume.model'

export interface IJDHistory extends Document {
  resumeId: Types.ObjectId          // ref: Resume
  userId: Types.ObjectId            // ref: User — denormalised for fast user-scoped queries
  jdText: string                    // full job description that was used
  jdCompanyName: string             // extracted by LLM
  jdRoleName: string                // extracted by LLM
  beforeSnapshot: ISection[]        // sections state BEFORE tailoring — used for revert
  afterSnapshot: ISection[]         // sections state AFTER tailoring
  createdAt: Date
}

const JDHistorySchema = new Schema<IJDHistory>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    userId:   { type: Schema.Types.ObjectId, ref: 'User',   required: true },
    jdText:         { type: String, required: true },
    jdCompanyName:  { type: String, default: '' },
    jdRoleName:     { type: String, default: '' },
    beforeSnapshot: { type: Schema.Types.Mixed, required: true }, // ISection[] stored as plain objects
    afterSnapshot:  { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // history is immutable — no updatedAt
  }
)

// List all history for a resume — used in GET /ai/jd-history/:resumeId
JDHistorySchema.index({ resumeId: 1, createdAt: -1 })

// Cascade delete check — when resume is deleted, also delete its history
// (handled in resume.service.ts, not here — keeping model clean)

export const JDHistory = model<IJDHistory>('JDHistory', JDHistorySchema)
