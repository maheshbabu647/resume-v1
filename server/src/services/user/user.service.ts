import { User }          from '../../models/User.model'
import { Resume }        from '../../models/Resume.model'
import { Subscription }  from '../../models/Subscription.model'
import { JDHistory }     from '../../models/JDHistory.model'
import { AppError }      from '../../lib/AppError'
import type { UpdateUserBody } from '../../schemas/user.schema'
import type { IOnboardingState } from '../../models/User.model'

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash -googleId').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)
  return user
}

const buildOnboardingPatch = (
  current: IOnboardingState | undefined,
  incoming: NonNullable<UpdateUserBody['onboarding']>
): IOnboardingState => {
  const next: IOnboardingState = {
    status: incoming.status ?? current?.status ?? 'pending',
    lastStepId: incoming.lastStepId ?? current?.lastStepId,
    entryMethod: incoming.entryMethod ?? current?.entryMethod,
    completedAt: current?.completedAt,
    skippedAt: current?.skippedAt,
  }

  if (incoming.status === 'completed') {
    next.completedAt = current?.completedAt ?? new Date()
    next.skippedAt = undefined
  }

  if (incoming.status === 'skipped') {
    next.skippedAt = current?.skippedAt ?? new Date()
    next.completedAt = undefined
  }

  if (incoming.status === 'pending') {
    next.completedAt = undefined
    next.skippedAt = undefined
  }

  return next
}

export const updateMe = async (userId: string, body: UpdateUserBody) => {
  const patch: Record<string, unknown> = {}

  if (body.name !== undefined) patch.name = body.name
  if (body.avatarUrl !== undefined) patch.avatarUrl = body.avatarUrl
  if (body.lastActiveResumeId !== undefined) patch.lastActiveResumeId = body.lastActiveResumeId

  if (body.onboarding) {
    const current = await User.findById(userId).select('onboarding').lean()
    patch.onboarding = buildOnboardingPatch(current?.onboarding, body.onboarding)
  }

  const user = await User.findByIdAndUpdate(userId, { $set: patch }, { new: true, runValidators: true })
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
