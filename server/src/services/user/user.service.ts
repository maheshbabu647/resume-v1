import { User }          from '../../models/User.model'
import { Resume }        from '../../models/Resume.model'
import { Subscription }  from '../../models/Subscription.model'
import { JDHistory }     from '../../models/JDHistory.model'
import { AppError }      from '../../lib/AppError'
import type { UpdateUserBody } from '../../schemas/user.schema'

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash -googleId').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)
  return user
}

export const updateMe = async (userId: string, body: UpdateUserBody) => {
  const user = await User.findByIdAndUpdate(userId, { $set: body }, { new: true, runValidators: true })
    .select('-passwordHash -googleId').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)
  return user
}

export const deleteMe = async (userId: string): Promise<void> => {
  const resumes    = await Resume.find({ userId }).select('_id').lean()
  const resumeIds  = resumes.map((r) => r._id)
  if (resumeIds.length > 0) await JDHistory.deleteMany({ resumeId: { $in: resumeIds } })
  await Resume.deleteMany({ userId })
  await Subscription.deleteOne({ userId })
  await User.findByIdAndDelete(userId)
}
