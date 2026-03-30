import { Types }     from 'mongoose'
import { Resume }    from '../../models/Resume.model'
import { User }      from '../../models/User.model'
import { JDHistory } from '../../models/JDHistory.model'
import { AppError }  from '../../lib/AppError'
import type { CreateResumeBody, UpdateResumeBody, ResumeListQuery } from '../../schemas/resume.schema'
import type { PaginatedResumes, ResumeListItem } from '../../types/resume.types'

export const listResumes = async (userId: string, query: ResumeListQuery): Promise<PaginatedResumes> => {
  const { page, limit } = query
  const [rawResumes, total] = await Promise.all([
    Resume.find({ userId }).select('title templateId status updatedAt personalInfo sections').sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Resume.countDocuments({ userId }),
  ])
  const resumes: ResumeListItem[] = rawResumes.map((r) => ({ 
    _id: r._id.toString(), 
    title: r.title, 
    templateId: r.templateId, 
    status: r.status, 
    updatedAt: r.updatedAt,
    personalInfo: r.personalInfo,
    sections: r.sections,
  }))
  return { resumes, total, page, limit }
}

export const createResume = async (userId: string, body: CreateResumeBody) => {
  const user = await User.findById(userId).select('plan resumeCount referredBy').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)

  // Trigger referral bonus on first resume creation
  if (user.resumeCount === 0 && user.referredBy) {
    // 1. Grant bonus to new user
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'usage.bonusTailoring': 2, 
        'usage.bonusPdfDownloads': 2 
      }
    })

    // 2. Grant bonus to referrer (up to 10 referrals)
    const referrer = await User.findById(user.referredBy).select('totalReferrals').lean()
    if (referrer && (referrer.totalReferrals ?? 0) < 10) {
      await User.findByIdAndUpdate(user.referredBy, {
        $inc: { 
          'usage.bonusTailoring': 2, 
          'usage.bonusPdfDownloads': 2,
          'totalReferrals': 1  
        }
      })
    }
  }

  const resume = await Resume.create({ userId, ...body })
  await User.findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } })
  return resume
}

export const getResume = async (userId: string, resumeId: string) => {
  const resume = await Resume.findOne({ _id: resumeId, userId }).lean()
  if (!resume) throw new AppError('RESUME_NOT_FOUND', 404)
  return resume
}

export const updateResume = async (userId: string, resumeId: string, body: UpdateResumeBody) => {
  const updated = await Resume.findOneAndUpdate({ _id: resumeId, userId }, { $set: body }, { new: true, runValidators: false }).select('updatedAt').lean()
  if (!updated) throw new AppError('RESUME_NOT_FOUND', 404)
  return updated
}

export const deleteResume = async (userId: string, resumeId: string): Promise<void> => {
  const resume = await Resume.findOne({ _id: resumeId, userId }).lean()
  if (!resume) throw new AppError('RESUME_NOT_FOUND', 404)
  await JDHistory.deleteMany({ resumeId })
  await Resume.findByIdAndDelete(resumeId)
  await User.findByIdAndUpdate(userId, { $inc: { resumeCount: -1 } })
}

export const duplicateResume = async (userId: string, resumeId: string) => {
  const user = await User.findById(userId).select('plan resumeCount').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)
  // All plans support unlimited resumes
  const original = await Resume.findOne({ _id: resumeId, userId }).lean()
  if (!original) throw new AppError('RESUME_NOT_FOUND', 404)
  const { _id, createdAt: _c, updatedAt: _u, currentJdText: _j, ...rest } = original as any
  const copy = await Resume.create({ ...rest, _id: new Types.ObjectId(), title: `Copy of ${original.title}`, status: 'draft', currentJdText: undefined })
  await User.findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } })
  return copy
}
