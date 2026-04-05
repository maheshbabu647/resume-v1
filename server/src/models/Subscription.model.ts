import { Schema, model, Document, Types } from 'mongoose'

export type SubscriptionStatus = 'created' | 'active' | 'past_due' | 'cancelled' | 'completed'

export interface ISubscriptionBase {
  userId: Types.ObjectId                  // ref: User
  plan: 'hustler' | 'closer'             // which paid plan
  razorpaySubscriptionId: string          // Razorpay's sub_xxx id
  razorpayPlanId: string                  // Razorpay plan id
  status: SubscriptionStatus
  currentPeriodStart?: Date
  currentPeriodEnd?: Date                 // when the current billing period ends
  cancelAtPeriodEnd: boolean              // user cancelled but still active until period end
  createdAt: Date
  updatedAt: Date
}

export interface ISubscription extends ISubscriptionBase, Document {}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,   // one active subscription per user at a time
    },
    plan: {
      type: String,
      enum: ['hustler', 'closer'],
      required: true,
    },
    razorpaySubscriptionId: { type: String, required: true, unique: true },
    razorpayPlanId:         { type: String, required: true },
    status: {
      type: String,
      enum: ['created', 'active', 'past_due', 'cancelled', 'completed'],
      default: 'created',
    },
    currentPeriodStart:  { type: Date },
    currentPeriodEnd:    { type: Date },
    cancelAtPeriodEnd:   { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)


export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema)
