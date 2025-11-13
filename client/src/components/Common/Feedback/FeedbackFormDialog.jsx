import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/api/feedbackServiceApi'

const Star = ({ filled, onClick }) => (
  <button type="button" onClick={onClick} aria-label="rate" className="text-yellow-500 text-3xl transition-transform hover:scale-110">
    {filled ? '★' : '☆'}
  </button>
)

const FeedbackFormDialog = ({ open, onOpenChange, defaultAction = 'save_resume' }) => {
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFeedbackDecision = (decision) => {
    if (decision === 'later') {
      localStorage.setItem('feedback_ask_later', Date.now());
    } else if (decision === 'never') {
      localStorage.setItem('feedback_never_ask', 'true');
    }
    onOpenChange(false);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitFeedback({
        action: defaultAction,
        rating,
        comments: comments?.trim() || undefined,
        pageUrl: window.location.pathname + window.location.search,
      })
      localStorage.setItem('feedback_never_ask', 'true'); // Don't ask again after submitting
      onOpenChange(false)
      setRating(0)
      setComments('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>Your feedback helps us improve.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center gap-2 text-2xl">
            {[1,2,3,4,5].map(n => (
              <Star key={n} filled={n <= rating} onClick={() => setRating(n)} />
            ))}
          </div>
          <Textarea
            placeholder="What worked well? What could be better?"
            value={comments}
            onChange={e => setComments(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2 justify-center sm:justify-start">
            <Button type="button" variant="ghost" size="sm" onClick={() => handleFeedbackDecision('later')}>Ask Me Later</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => handleFeedbackDecision('never')}>Don't Ask Again</Button>
          </div>
          <div className="flex gap-2 justify-center sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">Skip</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackFormDialog


