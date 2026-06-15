# CareerForgePro — Design Document

> A resume‑building product for Indian job‑seekers that combines AI tailoring, ATS scoring, and a hands‑on editor — packaged in a calm, modern SaaS aesthetic that feels closer to Linear / Notion / Framer than to the LinkedIn / Indeed crowd.

---

## 1. Product positioning

**One‑liner**
> Build an ATS‑ready resume in 3 minutes, tailor it to any JD in another 30 seconds, and know exactly why it scored what it scored.

**Who it's for**
- Indian early‑to‑mid career professionals (SDE, PM, design, data, marketing).
- People who apply to many roles per week and rewrite their resume each time.
- Users who don't trust pure AI output — they want to see the diff, accept/reject, and stay in control.

**Why design matters here**
Resume tools are a crowded, generic category. Most look like "form on the left, paper on the right" — clinical, dated, low trust. Our north star is to make the product feel as **credible as a hiring manager's tool** and as **delightful as a modern creative app**.

---

## 2. Inspirations & why we took them

Each inspiration is a deliberate steal of *one thing*, not a wholesale aesthetic clone.

| Inspiration | What we took | Why |
|---|---|---|
| **Linear** | Restraint with color, dense info, crisp keyboard‑first feel of the editor shell | A power‑user tool needs to *look* like a power‑user tool. Linear's sidebar + content + right‑panel layout is the canonical structure for tools where users live for 30+ min sessions. |
| **Notion** | Three‑column workspace (nav · canvas · contextual inspector) in the Editor | The right panel switches between **Edit / Style / Score** — Notion taught us users don't want modals for inspector‑style edits. |
| **Framer / Vercel** | The bold display type (Bricolage Grotesque), oversized headlines, animated decorative orbs on the auth page | Marketing pages get *one* moment to convince. Big confident type + restrained motion does the work of three paragraphs of copy. |
| **Stripe** | Color discipline (one indigo, one coral accent, neutrals do the rest), the "trust strip" pattern in the auth panel | Stripe sells money — we sell trust. Their layout for proof (logos, stats, testimonials stacked vertically) is the most efficient density of credibility on the web. |
| **Raycast** | The AI Assist popup pattern, the keyboard‑friendly command surface, calm gradients | The AI panel should feel like *a helper that appeared*, not a chatbot pinned to the side. |
| **Arc Browser** | The playful coral accent on a serious indigo base | One warm accent against a cool base is how you get "premium but friendly" instead of "enterprise but boring." |
| **Figma** | The Style panel's typography/spacing controls; the diff‑review UX for AI suggestions | Designers expect granular type/color/spacing controls. We mimicked Figma's right‑panel grouping (Type → Color → Spacing → Layout). |
| **Linear / GitHub diff views** | The accept/reject UI on AI edits | Trust requires transparency. Users see a red strike‑through of what was, a green addition of what AI proposes, and explicit accept/reject. |
| **Y Combinator company logos page** | The "Our members landed roles at" 4×2 grid on auth | A logo wall is the most compressed form of social proof. We built ours with Indian brands users actually recognize (Razorpay, Swiggy, CRED, PhonePe, Meesho, Zerodha, Flipkart, Zomato). |

What we **deliberately rejected**:
- ❌ **Glassmorphism / heavy blur** — feels dated, hurts text legibility.
- ❌ **Gradient buttons** — overused 2021 trend; we use solid coral on solid indigo.
- ❌ **Stock photos of "happy professionals"** — instant credibility killer.
- ❌ **Emoji in product chrome** — fine in copy, never in UI.
- ❌ **Inter / Roboto** — every SaaS uses them; Plus Jakarta Sans is warmer with similar legibility.

---

## 3. Visual system

### 3.1 Color tokens

```js
const A = {
  // Brand
  brand:      '#5046E4',  // Indigo — primary CTAs are NOT this; we save it for brand chrome
  brandDark:  '#3730D0',  // Pressed states, deep gradients
  brandLight: '#EEEDFF',  // Tinted icon backgrounds, soft fills
  brandSoft:  '#F4F2FF',  // Page section backgrounds

  // Accent
  coral:      '#FF5C35',  // PRIMARY CTA color — every "go" button is coral
  coralLight: '#FFF1ED',  // Coral tints for badges, highlights

  // Neutrals
  dark:       '#0F0E2A',  // Display headings, dense body
  body:       '#44445A',  // Paragraph text
  muted:      '#8888A5',  // Captions, helper text
  muted2:     '#B5B5C8',  // Disabled, dividers with weight

  border:     '#E8E6F4',  // Default 1px borders
  borderSoft: '#F0EEF9',  // Inside cards, subtle separators

  bg:         '#FFFFFF',  // Surface
  bgSoft:     '#F7F6FF',  // App canvas, secondary surface

  // Feedback
  green:      '#16A34A',
  greenLight: '#F0FDF4',
};
```

**The 60/30/10 rule we follow**
- 60% — white / `bgSoft` surfaces
- 30% — `dark` / `body` text and structural elements
- 10% — `brand` indigo for chrome (logo, links, focus rings) **plus** `coral` for the one action we want clicked

The two‑accent choice (indigo + coral) is the single most important decision in this system. It's why screens feel branded without ever needing a gradient.

### 3.2 Typography

| Role | Family | Use |
|---|---|---|
| Display | **Bricolage Grotesque** (700/800) | Hero headlines, section titles, large numbers (stats, ATS scores) |
| UI / Body | **Plus Jakarta Sans** (400/500/600/700) | Everything functional — buttons, labels, paragraphs |
| Resume body (editor preview) | **Source Serif 4** / **Inter** depending on template | User‑facing resume templates |
| Code / data | **JetBrains Mono** | The few places we show technical data |

**Type scale (display)**
- Hero: `clamp(40px, 5vw, 64px)`, -1.5px tracking, line‑height 1.05
- Page title: `clamp(28px, 3vw, 34px)`, -1px tracking, line‑height 1.15
- Section title: 22–26px, -0.5px tracking
- Body: 14–15px, line‑height 1.55
- Caption: 11.5–12.5px, slight uppercase + letter‑spacing for labels

### 3.3 Spacing & radius
- Base unit: **4px**. Common steps: 4 / 8 / 12 / 16 / 22 / 28 / 40 / 56.
- Radius scale: `8` (controls), `10` (inputs, buttons), `12–14` (cards), `999` (pills).
- Border weight: **1.5px** on focusable controls, **1px** on dividers. The extra .5px on inputs is what makes focus states feel deliberate.

### 3.4 Elevation
We use shadow sparingly — only on **floating** things (toasts, popovers, the floating resume preview, the primary CTA on hover).
- Resting card: no shadow, 1px border.
- Hover lift: `transform: translateY(-1px)` + soft brand‑tinted shadow.
- Floating: layered shadow `0 32px 80px rgba(0,0,0,.30), 0 12px 32px rgba(0,0,0,.15)`.

---

## 4. Page‑by‑page intent

### 4.1 `CareerForgePro Homepage.html`
**Goal:** Convert a cold visitor in <8 seconds.
- Bold display headline, one coral CTA, one ghost CTA.
- "Trusted by 12,400+" pill above the fold for instant social proof.
- Real product screenshots (not abstract illustrations).
- Sections sequenced as **problem → product → proof → pricing** — the canonical SaaS funnel because it works.

### 4.2 `CareerForgePro Auth.html`
**Goal:** Make signing up feel like joining something credible, not filling a form.
- **Left 50%**: clean form, OAuth (Google + LinkedIn), email + password, password strength.
- **Right 50%**: trust stack — live activity pill, 12,400+ headline, 3‑stat strip (3.4× more interviews · 89 avg ATS · 2:47 to first resume), rotating testimonial card with verified‑hire badge, 4×2 hired‑at company grid, live latest‑hire ticker, SOC 2 / GDPR footer.
- **Why the redesign of the right panel:** the original was "floating resume + one quote." It looked decorative but did no persuasion work. The new version is **proof‑dense by design** — every block does a different job (urgency, scale, credibility, specificity, security).

### 4.3 `CareerForgePro Editor.html`
**Goal:** Power‑user resume editing without feeling like Word.
- 3‑pane layout: section nav (left) · live resume preview (center) · contextual inspector (right).
- Inspector tabs: **Edit** (text/dates/links), **Style** (typography, color, spacing), **Score** (ATS breakdown).
- AI Assist appears as a Raycast‑style floating popover, not a docked panel.
- JD Tailor is a modal dialog with **diff review** — the trust mechanic.

### 4.4 `CareerForgePro App.html`
**Goal:** The home screen after login — resume library + quick actions.
- Card grid of saved resumes, each with template thumbnail + ATS score + last‑edited time.
- Empty state guides toward "Create from JD" rather than "Start blank."

### 4.5 `CareerForgePro Insights.html`
**Goal:** Make the user feel data‑backed.
- ATS score breakdown, keyword match heatmap, comparison vs. similar applicants.
- Borrows the chart/card density from Linear's Cycles view.

---

## 5. Components & primitives

All shared in `cfp-v3-components.jsx` and `cfp-shell.jsx`:

- **`AIcon`** — single inline SVG component, line‑weight 1.7, lucide‑style geometry. Why hand‑rolled: no external icon library bloat, full control over weight and color.
- **`Logo`** — 30px indigo rounded square with a small chart‑line glyph. Reads as both "career growth" and "a checkmark."
- **`PrimaryButton`** — solid coral, 13px vertical padding, 700 weight, lifts on hover with a tinted shadow.
- **`TextInput` / `PasswordInput`** — 1.5px border, focus state adds `box-shadow: 0 0 0 4px brand15%`. The 4px ring is the signature focus treatment across the system.
- **`Field`** — label + hint + child + error. Forces consistent vertical rhythm in forms.
- **`OAuthButtons`** — Google + LinkedIn only. We rejected Apple/GitHub/Twitter because our audience signs up with Google or LinkedIn ~95% of the time.
- **`Heading`** — pretitle (uppercase tracking) + title (Bricolage 800) + sub (body 14.5px). One component, all hero/page/modal titles.
- **`PasswordStrength`** — 4‑bar meter + check list. Live, no submit needed.

---

## 6. Motion principles

Motion is **functional, not decorative**.

1. **Confirmations are fast (150ms), reveals are gentle (250ms), ambient is slow (5–9s).** Hover lifts in 150ms; modal entrances in 250ms; the background orb pulses on a 7‑second loop.
2. **No bouncy easing.** Resume tools should not feel like games. We use `ease-out` and `ease-in-out` exclusively.
3. **One ambient loop max per screen.** The auth panel has the orb pulse and the green status dot — that's the cap.
4. **Page changes do NOT animate.** Route transitions are instant. Trust > delight when the user is mid‑task.

---

## 7. Copy voice

- **Direct, concrete, never aspirational.** "Got 3 interview calls in the first week" beats "Land your dream job."
- **Numbers over adjectives.** "89 avg ATS score" not "great ATS performance."
- **Indian context where natural.** Company names in testimonials (Razorpay, Swiggy) ground the product. We avoid forced cultural references.
- **Microcopy admits the work.** "Build your first ATS‑ready resume in 3 minutes" — 3 minutes is honest, not "instantly."
- **No exclamation marks in UI chrome.** They're allowed in success toasts and nowhere else.

---

## 8. Accessibility & responsiveness

- All text targets WCAG AA against its background (verified on body / muted / coral‑on‑white).
- Focus rings are visible on every interactive element (the 4px brand‑tinted ring).
- Form inputs have associated labels, never placeholder‑only.
- The auth grid collapses to single‑column under 880px; brand panel becomes a top banner.
- Editor degrades to single‑pane with tab switcher on tablets; not supported on phones (by design — resume editing is a desktop task).

---

## 9. File map

```
CareerForgePro Homepage.html      ← Marketing landing
CareerForgePro Auth.html          ← Sign up / log in / verify / forgot / reset
CareerForgePro App.html           ← Resume library (logged‑in home)
CareerForgePro Editor.html        ← Three‑pane editor
CareerForgePro Insights.html      ← ATS score deep‑dive

cfp-hero-v3.jsx                   ← Homepage hero section
homepage-components.jsx           ← Homepage sections (features, pricing, footer)
cfp-auth.jsx                      ← All auth views + brand panel
cfp-shell.jsx                     ← App chrome (sidebar, topbar)
cfp-editor.jsx                    ← Editor + inspector + dialogs
cfp-insights.jsx                  ← Insights views
cfp-v2-components.jsx             ← Legacy shared primitives
cfp-v3-components.jsx             ← Current shared primitives (icons, buttons, inputs)
tweaks-panel.jsx                  ← In‑page tweaks UI (dev/preview only)
```

Each HTML page is a thin shell that imports React + Babel + the relevant JSX modules. Components are attached to `window` at the bottom of each JSX file so they're available across `<script type="text/babel">` boundaries.

---

## 10. Open design questions

Things we deferred and should revisit:

1. **Dark mode** — not built. The indigo/coral palette translates well; needs a pass.
2. **Mobile editor** — currently unsupported. Could be a read‑only "preview & share" mode on phones.
3. **Template marketplace** — only 3 templates today (Modern / Classic / Minimal). Should explore an inspector‑driven custom template builder.
4. **Internationalization** — copy is English only; we should plan token‑izing strings before adding Hindi/regional support.
5. **The "Score" inspector tab** — currently a static breakdown. Should become interactive (click a missing keyword → AI inserts it in context).

---

*Last updated: May 2026*
