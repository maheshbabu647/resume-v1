# Design System Document: The Precision Architect

## 1. Overview & Creative North Star
**Creative North Star: The Digital Executive Ledger**
For the ambitious Asian/Indian fresh graduate, a resume isn't just a document; it’s a career launchpad. This design system moves away from the "template generator" aesthetic and toward a high-end editorial experience. We aim for a "Digital Executive Ledger" feel: an interface that feels as authoritative as a physical portfolio but as fluid as a modern IDE.

We break the "standard UI" mold by embracing **intentional asymmetry**. The editing workspace (the "Engine") uses deep, technical tones to focus the mind, while the resume preview (the "Output") sits on a bright, elevated surface. By overlapping elements and using high-contrast typography scales, we create a sense of depth and prestige that signals professionalism to recruiters.

## 2. Colors
Our palette balances the "Midnight" authority of global tech with the "Emerald" vibrancy of growth.

*   **Primary (`#000000` / `primary-container: #131b2e`):** Used sparingly for high-impact branding and structural anchors.
*   **Secondary (`#006c49` / `secondary-container: #6cf8bb`):** Represents progress and "ATS-Passed" status. It is our "Growth" signal.
*   **Surface Tiers:** Use `surface-container-low` (`#f2f4f6`) for the main workspace background and `surface-container-lowest` (`#ffffff`) for the actual resume paper to create natural separation.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Traditional boxes feel rigid and "template-like." Boundaries must be defined solely through background color shifts. To separate the "Personal Info" section from "Experience," transition from `surface-container-lowest` to `surface-container-low`.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (`#f7f9fb`)
*   **Workspace Panes:** `surface-container-low`
*   **Active Input Cards:** `surface-container-lowest` (this creates a soft "lift" effect).
*   **AI Utility Panels:** Use `primary-container` (`#131b2e`) to create a dark, "Command Center" feel for the AI Assistant, contrasting against the lighter editing tools.

### The "Glass & Gradient" Rule
Main Action Buttons and Progress Indicators should utilize a subtle linear gradient: `primary` to `primary-container`. For the AI Assistant panel, apply a backdrop-blur of 12px with a semi-transparent `primary-container` (80% opacity) to achieve a sophisticated "frosted glass" tech aesthetic.

## 3. Typography
We utilize **Inter** to bridge the gap between technical precision and readability.

*   **Display (Display-LG to SM):** Used for "Resume Score" or "Success" states. Large, bold, and commanding.
*   **Headlines (Headline-LG to SM):** Reserved for section headers (e.g., "Work Experience"). We use a tighter letter-spacing (-0.02em) to give it a premium, editorial look.
*   **Body (Body-LG to SM):** The workhorse. `body-md` is the default for input labels and descriptions.
*   **Labels (Label-MD to SM):** Used for ATS metadata and status tags (e.g., "ATS-Friendly").

**Tonal Hierarchy:** Headers should use `on-surface` (`#191c1e`), while helper text and secondary labels must use `on-surface-variant` (`#45464d`) to reduce visual noise.

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "Paper-on-Desk" effect that feels tactile and high-end without the clutter of drop shadows.
*   **Ambient Shadows:** For floating elements like the AI Suggestion pop-over, use an extra-diffused shadow: `offset-y: 8px`, `blur: 24px`, color: `rgba(15, 23, 42, 0.08)`. This mimics soft, natural studio lighting.
*   **The "Ghost Border" Fallback:** If a container needs an edge (e.g., an image upload zone), use a "Ghost Border": `outline-variant` at 20% opacity. 100% opaque borders are strictly forbidden.
*   **Glassmorphism:** Use for the "Live Preview" sticky header. A `surface-container-lowest` with 70% opacity and 10px backdrop-blur ensures the content below "bleeds through," making the UI feel integrated.

## 5. Components

### Buttons
*   **Primary:** Midnight Navy (`primary-container`) with white text. Apply `roundness-md` (0.375rem). Use a subtle inner-glow (top-down) for a 3D "milled" feel.
*   **Secondary (Progress):** Emerald Green (`secondary-container`) with `on-secondary-container` text. This is used exclusively for "Finalize" or "Download" actions.

### AI Assistant Utility Panel
*   **Styling:** A dark-mode oasis within the light UI. Use `primary-container` background with `on-primary-fixed` text.
*   **Glass Effect:** Apply `backdrop-blur` to the panel to separate the "Assistant" logic from the "Editor" data.

### Input Fields
*   **Default State:** No border. A `surface-container-high` background with `roundness-sm`.
*   **Focus State:** A 2px "Ghost Border" using `secondary` (Emerald) at 40% opacity.
*   **Error State:** Background shifts to `error-container` with text in `on-error-container`.

### Progress & Status Chips
*   **Status Indicators:** Use `secondary-container` for "Done" and `primary-fixed` for "In Progress."
*   **ATS Indicator:** A high-contrast chip using `secondary-fixed` with a small "Checkmark" icon.

### Cards & Lists
*   **No Dividers:** Never use a line to separate "Education" from "Skills." Instead, use `spacing-8` (2rem) of vertical white space or a subtle shift in surface color.

## 6. Do's and Don'ts

### Do:
*   **Use White Space as a Tool:** Give the resume preview significant breathing room (`spacing-12` margins) to emphasize its premium nature.
*   **Align to the Grid, then Break it:** Keep inputs aligned, but allow the "AI Assistant" to overlap the main container slightly to create visual "soul."
*   **Use Emerald for Confidence:** Only use the Emerald Green when a user has successfully completed a section or passed an ATS check.

### Don'ts:
*   **No "Box-in-a-Box":** Avoid nesting borders. Use the Surface Tiers (`low` to `highest`) to define depth.
*   **No Harsh Shadows:** If a shadow looks like a shadow, it’s too dark. It should look like a soft glow.
*   **No Pure Black:** Use `primary-container` (`#131b2e`) for dark areas; pure black is too aggressive for a professional career tool.