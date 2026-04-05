






Happy path (user pays successfully)
User → FE Subscribe → BE CreateSub → RZP API (creates sub)
→ User sees Razorpay Modal → pays
→ Two things happen in parallel:
    1. RZP Modal → FE Verify → BE Verify → DB (fallback, fast)
    2. RZP API → EV Activated → BE Webhook → DB (source of truth)


User closes modal without paying
User closes modal → FE Verify never fires
→ RZP API fires nothing (no payment happened)
→ DB Sub stays status: 'created'
→ Next time user clicks upgrade:
    BE CreateSub sees existing 'created' sub with same plan → reuses it
    (no new Razorpay sub created, no duplicate charge)

Payment fails (charge.failed)
RZP API fires EV ChargeFailed → BE Webhook
→ First failure: do nothing, Razorpay retries automatically
→ After all retries exhausted: Razorpay fires EV Completed
    → BE Webhook → DB User.plan: 'seeker'
You don't need to handle charge.failed aggressively — Razorpay manages retries. Just log it.



DB out of sync with Razorpay (auto-heal)
Scenario: webhook was missed, user paid but DB still shows 'created'
→ User hits any protected route → BE QuotaGuard runs
→ QuotaGuard calls BE Sync → RZP API (fetch subscription)
→ RZP says 'active' → BE Sync updates DB Sub + DB User.plan
→ User gets access without needing to log out/in

Tab switch / stale UI after payment
Payment completes → BE Webhook fires → DB updated
→ But Frontend Zustand store still has old plan
→ Fix: after FE Verify success, call:
    queryClient.invalidateQueries(['user'])
    queryClient.invalidateQueries(['subscription'])
→ React refetches → UI shows correct plan

New month, usage resets
User hits any usage endpoint → BE GetUsage runs
→ Checks DB User.usage.month vs current month
→ If different month: return zeroed usage (don't write yet)
→ Actual write happens inside quotaGuard when next action is taken
→ This prevents premature reset if user never uses the app



Case 1 — User cancels on Day 5 of a 30-day cycle
Day 1:  User pays ₹79 for Hustler
Day 5:  User clicks "Cancel plan" on CareerForge

        → Your site calls BE Cancel
        → BE Cancel calls RZP API: subscriptions.cancel(atEnd: true)
        → BE Cancel sets DB Sub: { cancelAtPeriodEnd: true }
        → Razorpay fires EV Cancelled
        → BE Webhook sees cancelAtPeriodEnd = true
        → DB Sub.status = 'cancelled_pending'
        → DB User.plan = 'hustler'  ← UNCHANGED, still has access

Day 30: Razorpay billing period ends
        → Razorpay fires EV Completed (or subscription.expired)
        → BE Webhook catches it
        → DB Sub.status = 'cancelled'
        → DB User.plan = 'seeker'  ← NOW downgrade

Day 31: User tries to use premium feature → blocked → sees upgrade prompt
No refund. User used Days 1–30. Fair deal.

Case 2 — User cancels on Day 29 (used almost everything)
Exact same flow as Case 1.
User gets access till Day 30.
No refund.
This is fine — industry standard.

Case 3 — User pauses autopay from Razorpay (UPI mandate pause)
This is not a cancel. This is a Razorpay-level feature where the user pauses their UPI autopay mandate directly from their bank app or Razorpay's interface — not from your site.
User pauses UPI mandate from their bank app
→ Razorpay fires EV Paused → BE Webhook
→ DB Sub.status = 'paused'
→ DB User.plan = 'hustler'  ← UNCHANGED

What happens next month?
→ Razorpay tries to charge → mandate is paused → charge fails
→ Razorpay fires EV ChargeFailed → BE Webhook
→ After all retries fail → Razorpay fires EV Completed
→ DB Sub.status = 'cancelled'
→ DB User.plan = 'seeker'  ← downgrade

If user resumes before period ends:
→ User resumes mandate → Razorpay fires EV Resumed
→ DB Sub.status = 'active'
→ DB User.plan = 'hustler'  ← confirmed
So pause is just a "maybe cancel" — you treat it like a warning, not a cutoff.

Case 4 — Should you offer "Cancel from site" at all?
Yes, absolutely. This is what the user expects. Your cancel button on the dashboard should:
User clicks "Cancel plan"
→ Show confirmation modal:
   "You'll keep Hustler access until April 30.
    After that you'll move to Seeker (free).
    No refund. Are you sure?"
→ User confirms
→ Call BE Cancel
→ Show: "Cancelled. You have access until April 30."
→ In UI: show a banner "Plan cancels on Apr 30"
         and hide the "Cancel" button, show "Reactivate" instead
This is exactly what Notion, GitHub, Vercel all do.

Case 6 — What if user reactivates after cancelling?
User cancelled on Day 5, has access till Day 30
Day 15: User changes mind, clicks "Reactivate"

→ Call BE CreateSub again (fresh subscription)
→ Razorpay creates new subscription
→ User pays again immediately for next 30 days
→ DB Sub: new record, status 'active'
→ DB User.plan = 'hustler'
Previous cancelled sub becomes irrelevant. New sub takes over.


autopay canceling should also work similarly as canceling at website itself, the subscription should continue till end of the time 