import { CoverLetter } from '../../models/CoverLetter.model'
import { AppError }    from '../../lib/AppError'
import type { CreateCoverLetterBody, UpdateCoverLetterBody, CoverLetterListQuery } from '../../schemas/coverLetter.schema'

export const listCoverLetters = async (userId: string, query: CoverLetterListQuery) => {
  const { page, limit } = query
  const [letters, total] = await Promise.all([
    CoverLetter.find({ userId })
      .select('title companyName roleName tone wordCount updatedAt')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    CoverLetter.countDocuments({ userId }),
  ])
  return { coverLetters: letters, total, page, limit }
}

export const createCoverLetter = async (userId: string, body: CreateCoverLetterBody) => {
  return CoverLetter.create({ userId, ...body })
}

export const getCoverLetter = async (userId: string, id: string) => {
  const letter = await CoverLetter.findOne({ _id: id, userId }).lean()
  if (!letter) throw new AppError('COVER_LETTER_NOT_FOUND', 404)
  return letter
}

export const updateCoverLetter = async (userId: string, id: string, body: UpdateCoverLetterBody) => {
  const updated = await CoverLetter.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true, runValidators: false }).lean()
  if (!updated) throw new AppError('COVER_LETTER_NOT_FOUND', 404)
  return updated
}

export const deleteCoverLetter = async (userId: string, id: string): Promise<void> => {
  const letter = await CoverLetter.findOne({ _id: id, userId }).lean()
  if (!letter) throw new AppError('COVER_LETTER_NOT_FOUND', 404)
  await CoverLetter.findByIdAndDelete(id)
}
