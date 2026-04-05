# CareerForge — Post-Update Setup Guide (GA4 & Search Console)

This guide outlines the manual steps required in your Dashboards to activate the features implemented in the code.

---

## 1. Google Analytics 4 (GA4) Setup

### A. Activate User-ID Tracking (Crucial for cross-device)
Our code now sends the internal Database User ID to GA4. To see this:
1.  Go to **Admin** → **Data Display** → **Reporting Identity**.
2.  Select **Blended** (this uses User-ID, then Google Signals, then Device ID).
3.  Click **Save**.

### B. Register Custom Dimensions
You can now track if a user is a "Seeker", "Hustler", or "Closer". 
1.  Go to **Admin** → **Data Display** → **Custom Definitions**.
2.  Click **Create custom dimension**.
    *   **Dimension name:** `Subscription Plan`
    *   **Scope:** User
    *   **Description:** The current paid plan of the user.
    *   **User property:** `subscription_plan` (Type this exactly).
3.  Click **Save**.

### C. Mark Conversions (Business Goals)
Once you trigger these events once on your site, they will appear in the Events list.
1.  Go to **Admin** → **Data Display** → **Events**.
2.  Toggle **"Mark as conversion"** for:
    *   `user_signed_up` (Growth)
    *   `payment_completed` (Revenue)
    *   `resume_downloaded` (Core Value)

### D. Verification (DebugView)
1.  Open your site in a browser.
2.  Go to **Admin** → **Data Display** → **DebugView**.
3.  Perform actions on your site (login, download). You should see blue icons appearing in real-time.

---

## 2. Google Search Console (GSC) Setup

Since we fixed the **FAQ Schema duplicates** and **Title Tag redundancies**, you should prompt Google to re-crawl your site immediately.

### A. Request Re-indexing
1.  Go to the [Search Console](https://search.google.com/search-console).
2.  Paste your home URL (`https://careerforge.in` or your domain) into the **URL Inspection** bar at the top.
3.  Click **Request Indexing**. 
    *   *Why?* This tells Google your SEO fixes (schema/titles) are ready to be checked.

### B. Monitor Core Web Vitals
Since we optimized the Resume Editor's responsiveness:
1.  Go to **Experience** → **Core Web Vitals** → **Mobile**.
2.  Check for "CLS" (Cumulative Layout Shift) issues. Our recent layout fixes should improve this score.

### C. Rich Results Test
1.  Go to the [Rich Results Test Tool](https://search.google.com/test/rich-results).
2.  Enter your URL.
3.  Ensure only **one** FAQ section and **one** Logo section appear (we removed the duplicates).

---

## 3. Environment Variables (.env)
Ensure your production environment (Docker/Deployment) has these specific keys:

```env
# Client Side (Vite)
VITE_GA_MEASUREMENT_ID=G-VZFRD7VP2C

# Server Side (for payments/SEO)
VITE_API_URL=https://api.careerforge.in  # Update with your actual API URL
```

---

**Implementation Status:** Done ✅
The code is currently firing all 22 custom events, handling User-ID stitching, and has clean SEO metadata. Data should start appearing in your dashboards within 24 hours of user activity.
