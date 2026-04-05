# CareerForge GA4 — Complete Analytics Setup Guide

> You're currently using GA4 like a view counter. This guide will turn it into a full product intelligence system — tracking signups, paid conversions, user behavior, drop-off points, and more.

---

## Table of Contents

1. [Understanding the Basics — What These Words Mean](#1-understanding-the-basics)
2. [What to Track on CareerForge](#2-what-to-track-on-careerforge)
3. [Step 1 — Custom Events Setup (Code)](#3-step-1--custom-events-setup)
4. [Step 2 — Mark Conversions in GA4 Dashboard](#4-step-2--mark-conversions-in-ga4-dashboard)
5. [Step 3 — User-ID Setup (Track Logged-In Users)](#5-step-3--user-id-setup)
6. [Step 4 — Funnel Exploration Setup](#6-step-4--funnel-exploration-setup)
7. [Step 5 — Path Exploration (User Movement)](#7-step-5--path-exploration)
8. [Step 6 — Understanding Search Console in GA4](#8-step-6--search-console-in-ga4)
9. [Step 7 — Audience Segments](#9-step-7--audience-segments)
10. [What to Check Every Week](#10-what-to-check-every-week)
11. [Quick Reference — All Events](#11-quick-reference--all-events)

---

## 1. Understanding the Basics

Before touching any code, understand what these terms actually mean.

### Conversion
A conversion is any action you care about. It's not just a purchase. For CareerForge:
- A user **signing up** = conversion
- A user **upgrading to Hustler/Closer** = conversion
- A user **downloading a resume** = conversion

GA4 lets you mark any event as a "conversion" so it gets highlighted separately in reports.

### Event
Everything in GA4 is an event. A pageview is an event. A button click is an event. You define your own events for things that matter to you — like `user_signed_up` or `payment_completed`.

### Funnel
A funnel is a sequence of steps you expect users to take. Example:
```
Lands on Pricing Page → Clicks Upgrade → Enters Payment → Payment Succeeds
```
GA4 shows you how many users dropped off at each step. If 100 people click Upgrade but only 20 complete payment — that's a 80% drop-off at payment. That's a problem you need to fix.

### Path Exploration
This shows you where users actually go — not where you think they go. You can ask: "After a user visits the Resume Editor, what do they do next?" GA4 draws a visual map of the answer.

### User-ID
By default, GA4 tracks anonymous sessions. If someone opens your site on mobile and desktop, GA4 thinks they're 2 different users. User-ID lets you say "this anonymous session = this logged-in user from your database." It makes all tracking accurate for logged-in products like CareerForge.

### Cohort
A group of users who did something in the same time period. Example: "Users who signed up in March 2025 — are they still using the site in April?" This tells you about retention.

---

## 2. What to Track on CareerForge

Here is your full event plan. These are the things that actually matter for your product.

### Signup & Auth Events
| Event Name | When to Fire | Why |
|---|---|---|
| `user_signed_up` | When registration is complete | Core conversion #1 |
| `user_logged_in` | On successful login | Know how often users return |
| `user_login_failed` | On login error | Debug UX problems |

### Resume Builder Events
| Event Name | When to Fire | Why |
|---|---|---|
| `resume_created` | When user creates a new resume | Activation signal |
| `resume_edited` | When user saves changes | Engagement signal |
| `resume_downloaded` | When user downloads PDF | Core value delivery moment |
| `template_changed` | When user switches template | Feature usage |
| `ai_suggestion_accepted` | When user accepts AI content | AI feature engagement |
| `ai_suggestion_rejected` | When user rejects AI content | Quality signal |

### Payment & Upgrade Events
| Event Name | When to Fire | Why |
|---|---|---|
| `pricing_page_viewed` | When user lands on /pricing | Top of payment funnel |
| `upgrade_clicked` | When user clicks an upgrade button | Intent signal |
| `payment_initiated` | When Razorpay modal opens | Funnel step |
| `payment_completed` | On successful payment webhook | Core conversion #2 |
| `payment_failed` | On payment failure | Revenue loss tracking |
| `subscription_cancelled` | On cancellation | Churn tracking |

### Engagement Events
| Event Name | When to Fire | Why |
|---|---|---|
| `job_suggestions_viewed` | When user opens job feed | Feature adoption |
| `job_clicked` | When user clicks a job listing | Intent signal |
| `interview_prep_started` | When user starts mock interview | Feature adoption |
| `feature_locked_seen` | When user hits a gated feature | Upgrade trigger moments |

---

## 3. Step 1 — Custom Events Setup

### Install the analytics utility file

Create this file in your project. This is the single source of truth for all GA4 events.

**File: `src/utils/analytics.ts`**

```typescript
// CareerForge Analytics Utility
// All GA4 events go through this file

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// ─── Core helper ───────────────────────────────────────────────────────────

const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
};

// ─── Auth Events ────────────────────────────────────────────────────────────

export const trackSignUp = (method: string = "email") => {
  trackEvent("user_signed_up", { method });
  // GA4's built-in signup event — also fires the standard one
  trackEvent("sign_up", { method });
};

export const trackLogin = (method: string = "email") => {
  trackEvent("user_logged_in", { method });
  trackEvent("login", { method });
};

// ─── Resume Events ──────────────────────────────────────────────────────────

export const trackResumeCreated = (templateId: string) => {
  trackEvent("resume_created", { template_id: templateId });
};

export const trackResumeDownloaded = (resumeId: string, format: string = "pdf") => {
  trackEvent("resume_downloaded", { resume_id: resumeId, format });
};

export const trackTemplateChanged = (fromTemplate: string, toTemplate: string) => {
  trackEvent("template_changed", { from_template: fromTemplate, to_template: toTemplate });
};

export const trackAISuggestion = (accepted: boolean, section: string) => {
  const eventName = accepted ? "ai_suggestion_accepted" : "ai_suggestion_rejected";
  trackEvent(eventName, { section });
};

// ─── Payment Events ─────────────────────────────────────────────────────────

export const trackPricingPageViewed = () => {
  trackEvent("pricing_page_viewed");
};

export const trackUpgradeClicked = (plan: "hustler" | "closer", location: string) => {
  trackEvent("upgrade_clicked", {
    plan_name: plan,
    click_location: location, // e.g. "pricing_page", "feature_gate_modal", "navbar"
  });
};

export const trackPaymentInitiated = (plan: string, amount: number) => {
  trackEvent("payment_initiated", {
    plan_name: plan,
    value: amount,
    currency: "INR",
  });
};

export const trackPaymentCompleted = (plan: string, amount: number, orderId: string) => {
  // This is your most important event. Also fires GA4's standard purchase event.
  trackEvent("payment_completed", {
    plan_name: plan,
    value: amount,
    currency: "INR",
    order_id: orderId,
  });
  trackEvent("purchase", {
    transaction_id: orderId,
    value: amount,
    currency: "INR",
    items: [{ item_name: `CareerForge ${plan}`, price: amount }],
  });
};

export const trackPaymentFailed = (plan: string, reason: string) => {
  trackEvent("payment_failed", { plan_name: plan, failure_reason: reason });
};

export const trackSubscriptionCancelled = (plan: string) => {
  trackEvent("subscription_cancelled", { plan_name: plan });
};

// ─── Feature Events ─────────────────────────────────────────────────────────

export const trackFeatureLocked = (featureName: string) => {
  trackEvent("feature_locked_seen", { feature_name: featureName });
  // This tells you WHICH locked features users hit most → what drives upgrades
};

export const trackJobSuggestionsViewed = () => {
  trackEvent("job_suggestions_viewed");
};

export const trackJobClicked = (jobId: string, jobTitle: string) => {
  trackEvent("job_clicked", { job_id: jobId, job_title: jobTitle });
};

// ─── User Properties (called once after login) ──────────────────────────────

export const setUserProperties = (userId: string, plan: "seeker" | "hustler" | "closer") => {
  if (!window.gtag) return;
  // Set User-ID so GA4 links sessions to your DB user
  window.gtag("config", import.meta.env.VITE_GA_MEASUREMENT_ID, {
    user_id: userId,
  });
  // Set custom dimensions
  window.gtag("set", "user_properties", {
    subscription_plan: plan,
    user_id: userId,
  });
};
```

---

### Where to call these functions

**On Signup success:**
```typescript
// In your signup handler / auth callback
import { trackSignUp, setUserProperties } from "@/utils/analytics";

// After successful registration:
trackSignUp("email");
setUserProperties(user._id, "seeker");
```

**On Login:**
```typescript
import { trackLogin, setUserProperties } from "@/utils/analytics";

// After successful login:
trackLogin("email");
setUserProperties(user._id, user.subscriptionPlan);
```

**On Resume Download:**
```typescript
import { trackResumeDownloaded } from "@/utils/analytics";

// In your download button handler:
const handleDownload = async () => {
  await generatePDF();
  trackResumeDownloaded(resume._id);
};
```

**On Pricing Page (component mount):**
```typescript
import { trackPricingPageViewed } from "@/utils/analytics";
import { useEffect } from "react";

// In your Pricing component:
useEffect(() => {
  trackPricingPageViewed();
}, []);
```

**On Upgrade Button Click:**
```typescript
import { trackUpgradeClicked } from "@/utils/analytics";

<button onClick={() => {
  trackUpgradeClicked("hustler", "pricing_page");
  openRazorpay();
}}>
  Upgrade to Hustler
</button>
```

**On Razorpay Modal Open:**
```typescript
import { trackPaymentInitiated } from "@/utils/analytics";

const openRazorpay = (plan: string, amount: number) => {
  trackPaymentInitiated(plan, amount);
  // ... your existing Razorpay code
};
```

**On Payment Success (Razorpay handler):**
```typescript
import { trackPaymentCompleted } from "@/utils/analytics";

handler: function (response: any) {
  trackPaymentCompleted(plan, amount, response.razorpay_order_id);
  // ... rest of your handler
}
```

**On Payment Failure:**
```typescript
import { trackPaymentFailed } from "@/utils/analytics";

modal: {
  ondismiss: function () {
    trackPaymentFailed(plan, "user_dismissed");
  }
}
```

**On Feature Gate Hit:**
```typescript
import { trackFeatureLocked } from "@/utils/analytics";

// When you show your "upgrade to unlock" modal:
const showUpgradePrompt = (feature: string) => {
  trackFeatureLocked(feature);
  setUpgradeModalOpen(true);
};
```

---

## 4. Step 2 — Mark Conversions in GA4 Dashboard

After you've pushed the events above to production and they're showing up in GA4, do this:

1. Go to **GA4 → Admin (gear icon, bottom left)**
2. Under "Data display" → click **Events**
3. Find these events and toggle the "Mark as conversion" switch:
   - `user_signed_up`
   - `payment_completed`
   - `resume_downloaded`

Now these appear separately in your **Conversions** report and GA4 will track them with a special star in the UI.

**How to verify events are firing:**
1. In GA4 → go to **Configure → DebugView**
2. Open your site in another tab
3. Do an action (click upgrade, download resume, etc.)
4. Watch it appear in DebugView in real time

---

## 5. Step 3 — User-ID Setup

This is already partially handled in the `setUserProperties` function above. But you need one more thing.

### In your GA4 script tag (index.html):

Make sure your gtag config has `send_page_view: true`:

```html
<!-- In public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    send_page_view: true
  });
</script>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from GA4.

### In GA4 Dashboard — Enable User-ID reporting:

1. **Admin → Reporting Identity**
2. Select **"Blended"** (uses User-ID when available, device ID when not)
3. Save

Now in your reports, you'll see metrics like "Users" that correctly count logged-in people across devices — not sessions.

---

## 6. Step 4 — Funnel Exploration Setup

This is where you see WHERE users drop off in your payment and signup flows.

### How to create a Funnel:

1. Go to **GA4 → Explore** (the compass icon in the left sidebar)
2. Click **"Blank"** → then switch the technique to **"Funnel exploration"**
3. Name it: `Payment Conversion Funnel`

### Add these steps:

**Step 1:** Name = `Pricing Page` → Event = `pricing_page_viewed`

**Step 2:** Name = `Clicked Upgrade` → Event = `upgrade_clicked`

**Step 3:** Name = `Payment Started` → Event = `payment_initiated`

**Step 4:** Name = `Payment Done` → Event = `payment_completed`

Click each step → "Add new condition" → "Event name" → type the event name.

### What to read:

GA4 will show a bar chart like:
```
Pricing Page:      1000 users  (100%)
Clicked Upgrade:    300 users  (30%)
Payment Started:    150 users  (15%)
Payment Done:        80 users  (8%)
```

This means 70% of people who saw the pricing page didn't click upgrade. And 47% of people who started payment didn't finish. These are the problems to fix.

### Also create a Signup Funnel:

**Step 1:** `page_view` where `page_location` contains `/` (homepage)

**Step 2:** `page_view` where `page_location` contains `/register`

**Step 3:** `user_signed_up`

---

## 7. Step 5 — Path Exploration

This shows you what users actually do on your site — their movement.

### How to create a Path Exploration:

1. **GA4 → Explore → Blank → Switch technique to "Path exploration"**
2. Name it: `User Journey After Login`

### Configuration:

- **Starting point:** Event = `user_logged_in`
- Leave everything else default
- Click **"Start over"** to apply

### What to read:

GA4 draws a tree. The starting node is "user_logged_in" and branches show what pages/events users go to next — and what percentage goes each direction.

Example reading:
```
user_logged_in
├── 60% → Resume Editor
│         ├── 40% → Download Resume
│         └── 60% → Exit (session ends)
└── 40% → Pricing Page
          ├── 30% → upgrade_clicked
          └── 70% → Exit
```

This tells you the exact user flow without guessing.

### Also useful: Reverse path

Set the ENDING point instead: End with `payment_completed` — then see what path users took BEFORE they paid. This shows you what converts.

---

## 8. Step 6 — Search Console in GA4

You connected Search Console already. Here's what it actually shows you.

### Where to find it:

**GA4 → Reports → Acquisition → Search Console**

You'll see two reports:
- **Google organic search queries** — what people searched on Google to find your site
- **Landing pages** — which pages users land on from Google

### What to look at:

| Column | What it means |
|---|---|
| Query | The exact search term someone typed in Google |
| Clicks | How many people clicked your site from that search |
| Impressions | How many times your site appeared in search results |
| CTR (Click-Through Rate) | Clicks ÷ Impressions. Low CTR = your title/description is weak |
| Position | Average ranking in Google results. Position 1 = top result |

### What to do with this data:

**If you see queries like "free resume builder India" and your CTR is low:**
→ Your title tag or meta description for that page needs to better match what users expect.

**If you're at Position 8-15 for relevant queries:**
→ You're close to page 1. Write better content on those pages — GA4 + Search Console will show improvement within weeks.

**If you see zero queries:**
→ Google hasn't indexed enough of your site yet. Submit your sitemap: GA4 Admin → Data Streams → your stream → Measurement Protocol / then go to Google Search Console directly and submit sitemap.

---

## 9. Step 7 — Audience Segments

Audiences let you group your users into buckets and study each group separately.

### How to create an Audience:

1. **GA4 → Admin → Audiences → New Audience**

### Useful audiences for CareerForge:

**"Active Free Users" (upgrade targets)**
- Condition: Has event `resume_downloaded` in last 14 days
- AND has NOT event `payment_completed` ever

**"Feature Gate Hit" (high intent)**
- Condition: Has event `feature_locked_seen` in last 7 days
- AND has NOT event `payment_completed`

**"Churned Paid Users"**
- Condition: Has event `subscription_cancelled` in last 30 days

**"Power Users"**
- Condition: Has event `resume_downloaded` more than 3 times

### How to use these:

Once audiences exist, in any Exploration or Report you can drag them in as a **Comparison** dimension. Example: compare "Power Users" vs "Casual Users" — see if their conversion rate differs. It will.

---

## 10. What to Check Every Week

Make this your weekly routine (takes 10 minutes):

### Monday — Check conversions

**GA4 → Reports → Conversions**

Questions to answer:
- How many signups this week vs last week?
- How many paid conversions?
- Which day had the most conversions?

### Wednesday — Check funnels

Open your Payment Funnel exploration.

Questions to answer:
- Where is the biggest drop-off right now?
- Did drop-off increase or decrease from last week?

### Friday — Check user paths

Open your User Journey Path exploration.

Questions to answer:
- Are users reaching the Resume Editor?
- Are users hitting feature gates? (means they want to upgrade)
- Are users leaving from a specific page repeatedly?

### Anytime — Search Console

Check once a week which queries are bringing people in.
- Are new queries appearing? (new content is being found)
- Is CTR going up? (your titles/descriptions are getting better)

---

## 11. Quick Reference — All Events

```
FIRE THIS                    WHEN THIS HAPPENS
─────────────────────────────────────────────────────────────
trackSignUp()                User completes registration
trackLogin()                 User logs in successfully
setUserProperties()          User logs in (sets User-ID + plan)
trackResumeCreated()         User creates new resume
trackResumeDownloaded()      User downloads resume PDF
trackTemplateChanged()       User switches resume template
trackAISuggestion()          User accepts or rejects AI content
trackPricingPageViewed()     Pricing page mounts
trackUpgradeClicked()        User clicks any upgrade button
trackPaymentInitiated()      Razorpay modal opens
trackPaymentCompleted()      Payment succeeds
trackPaymentFailed()         Payment fails or user dismisses
trackSubscriptionCancelled() User cancels subscription
trackFeatureLocked()         User hits a gated feature
trackJobSuggestionsViewed()  User opens job feed
trackJobClicked()            User clicks a job listing
```

---

## Checklist — Do These In Order

- [ ] Add `src/utils/analytics.ts` to your project
- [ ] Call `trackSignUp` + `setUserProperties` in your auth handler
- [ ] Call `trackPaymentInitiated`, `trackPaymentCompleted`, `trackPaymentFailed` in Razorpay handler
- [ ] Call `trackPricingPageViewed` on Pricing page mount
- [ ] Call `trackUpgradeClicked` on every upgrade button
- [ ] Call `trackResumeDownloaded` on download
- [ ] Call `trackFeatureLocked` on every gated feature modal
- [ ] Deploy to production
- [ ] Verify events in GA4 → DebugView (takes ~1 minute to appear)
- [ ] Mark `user_signed_up`, `payment_completed`, `resume_downloaded` as Conversions in GA4
- [ ] Enable Reporting Identity = Blended in GA4 Admin
- [ ] Create Payment Funnel exploration
- [ ] Create User Journey Path exploration
- [ ] Create 2-3 Audience segments
- [ ] Bookmark Search Console report in GA4

---

*Built for CareerForge.pro — Mahesh's GA4 setup guide*
*Last updated: April 2026*
