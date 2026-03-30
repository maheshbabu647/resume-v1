import { Schema, model, Document, Types } from 'mongoose'

// ─── Sub-document types ───────────────────────────────────────────────────────

export interface IPersonalInfo {
  fullName: string
  email: string
  phone?: string
  location?: string
  linkedIn?: string
  github?: string
  website?: string
  summary?: string
  summaryLabel?: string
}

/** Generic entry — each section type (experience, projects, etc.) stores its
 *  own fields here as a plain object.  Using Mixed keeps the schema flexible
 *  without needing a separate schema per section type. */
export interface ISectionEntry {
  [key: string]: unknown
}

export interface ISection {
  key: string            // e.g. 'experience' | 'education' | 'projects' | 'skills'
  name?: string
  visible: boolean
  order: number
  entries: ISectionEntry[]
}

export interface ICustomization {
  stylePackKey: string           // e.g. 'monochrome' | 'ocean' | 'forest'
  spacingPresetKey: string       // e.g. 'compact' | 'normal' | 'relaxed'
  sizingPresetKey: string        // e.g. 'small' | 'normal' | 'large'
  sectionOrderPresetKey: string  // e.g. 'tech-fresher' | 'experienced' | 'custom'
}

export type ResumeStatus = 'draft' | 'complete'
export type TemplateId = 'modern-centered' | 'minimal-left' | 'compact-tech'

// ─── Main document interface ──────────────────────────────────────────────────

export interface IResume extends Document {
  userId: Types.ObjectId
  title: string
  templateId: TemplateId
  status: ResumeStatus
  personalInfo: IPersonalInfo
  sections: ISection[]
  customization: ICustomization
  currentJdText?: string         // last JD pasted — used as context for AI tailor
  createdAt: Date
  updatedAt: Date
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const PersonalInfoSchema = new Schema<IPersonalInfo>(
  {
    fullName:  { type: String, default: '' },
    email:     { type: String, default: '' },
    phone:     { type: String },
    location:  { type: String },
    linkedIn:  { type: String },
    github:    { type: String },
    website:   { type: String },
    summary:   { type: String },
    summaryLabel: { type: String },
  },
  { _id: false }
)

const SectionSchema = new Schema(
  {
    key:     { type: String, required: true },
    name:    { type: String },
    visible: { type: Boolean, default: true },
    order:   { type: Number, required: true },
    entries: { type: Schema.Types.Mixed, default: [] },
  },
  { _id: false }
)

const CustomizationSchema = new Schema(
  {
    stylePack:    { type: Schema.Types.Mixed },
    spacing:      { type: Schema.Types.Mixed },
    sizing:       { type: Schema.Types.Mixed },
    sectionOrder: [{ type: String }],
  },
  { _id: false }
)

// ─── Main schema ──────────────────────────────────────────────────────────────

const ResumeSchema = new Schema<IResume>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    templateId:  {
      type: String,
      enum: ['modern-centered', 'classic-sidebar', 'executive-minimal', 'minimal-left', 'compact-tech'],
      required: true,
    },
    status:      { type: String, enum: ['draft', 'complete'], default: 'draft' },
    personalInfo:  { type: PersonalInfoSchema, default: () => ({}) },
    sections:      { type: [SectionSchema], default: [] },
    customization: { type: CustomizationSchema, default: () => ({}) },
    currentJdText: { type: String },
  },
  {
    timestamps: true,
  }
)

// Fast lookup: all resumes for a user (dashboard list)
ResumeSchema.index({ userId: 1, updatedAt: -1 })

export const Resume = model<IResume>('Resume', ResumeSchema)
