# Peply — UX/UI Framework

**Role:** Design specification for the implementation agent.  
**Scope:** MVP mobile-first lifestyle motivation app.  
**Emotional promise:** "Effort leads to meaningful rewards, and progress is worth celebrating."

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Visual Direction](#2-visual-direction)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Motion Design](#6-motion-design)
7. [Core Screen Specifications](#7-core-screen-specifications)
8. [Component Inventory](#8-component-inventory)
9. [State Definitions](#9-state-definitions)
10. [Copywriting Guidance](#10-copywriting-guidance)
11. [Accessibility Guidance](#11-accessibility-guidance)
12. [Implementation Notes](#12-implementation-notes)

---

## 1. Design Principles

These five principles govern every decision. When two options conflict, return here.

### 1.1 Effort Before Outcome
Celebrate the act of showing up, not just completion. A logged attempt is a win. Interface language and visual feedback must acknowledge effort at the moment it happens, before results are known.

### 1.2 Progress Feels Alive
Static dashboards are dead. Every metric — progress rings, momentum bars, streaks — must visibly react to input. The UI should breathe, pulse, and respond. Numbers animate on change. Rings fill with physics. The user should feel the app is paying attention.

### 1.3 Rewards Are Desired, Not Withheld
Locked rewards look aspirational — glowing, blurred, with tantalizing copy — not grayed-out or punishing. The locked state should increase desire, not signal failure. Proximity to unlock is a cause for excitement, not frustration.

### 1.4 Recovery Is Designed In
There are no "streak broken" screens, no guilt, no red failure states. When a user returns after missing days, the first message they see is welcoming. The system holds their goal state without judgment and offers a clean on-ramp forward.

### 1.5 Joy Is the Interface
Delight is not decorative — it is functional. Micro-animations, satisfying tap feedback, smooth transitions, and celebration moments are core features. A joyless interaction is an incomplete one. Every primary action should produce a small, satisfying response.

---

## 2. Visual Direction

### 2.1 Aesthetic Reference
The visual language sits at the intersection of:
- **Duolingo** — playful, gamified, confident color
- **BeReal / Gen-Z social apps** — energetic, unpolished warmth
- **Modern fintech (Revolut, Cash App)** — bold hierarchy, premium feel
- **Notion Calendar** — clean information density without sterility

### 2.2 Art Direction Keywords
Warm. Vibrant. Rounded. Tactile. Joyful. Aspirational. Bold without aggression. Clean without coldness.

### 2.3 Shape Language
- Corner radius: heavy. 16px minimum for cards, 24px for modals, 999px for pills and buttons.
- No sharp angles in the primary UI. Hard edges signal severity; this app should never feel severe.
- Cards have visible depth through layered shadow, not borders.
- Use blob/organic shapes as decorative background elements sparingly.

### 2.4 Iconography
- Style: Filled, rounded, slightly chunky. Think Phosphor Icons (fill variant) or Heroicons Solid.
- Size: 24px standard, 20px in dense contexts, 32px for feature icons, 48px+ for reward icons.
- Emoji: Use liberally for goals and rewards — they communicate personality instantly. Emoji should feel like a first-class UI element, not an afterthought.
- Custom illustrations: Reserve for empty states and the reward unlock moment. Clean, flat vector style with the brand palette.

### 2.5 Photography / Media
Out of MVP scope except user-defined reward images. If a user uploads a reward image, display it with a radial gradient overlay at the bottom to maintain text legibility.

---

## 3. Color System

### 3.1 Palette

#### Brand Gradients
These are the primary brand expressions. Use for CTAs, headers, and celebratory moments.

| Name | Value | Use |
|------|-------|-----|
| `gradient-primary` | `135deg, #FF6B6B → #845EC2` | Primary CTAs, home header, reward glow |
| `gradient-warm` | `135deg, #FFB347 → #FF6B6B` | Secondary actions, progress rings |
| `gradient-celebration` | `135deg, #F9F871 → #FFB347 → #FF6B6B` | Unlock moments, confetti |
| `gradient-cool` | `135deg, #00C9A7 → #3FC1C9` | Completed states, success moments |
| `gradient-momentum` | `135deg, #845EC2 → #D65DB1` | Momentum meter fill |

#### Semantic Colors

| Token | Light mode | Dark mode | Use |
|-------|-----------|----------|-----|
| `color-bg` | `#FDFCFB` | `#1A1625` | App background |
| `color-surface` | `#FFFFFF` | `#241E35` | Cards, modals |
| `color-surface-raised` | `#F5F3F0` | `#2E2744` | Nested surfaces, input backgrounds |
| `color-primary` | `#FF6B6B` | `#FF8585` | Primary accent, icons, links |
| `color-secondary` | `#845EC2` | `#A07FD4` | Secondary accent |
| `color-success` | `#00C9A7` | `#1DDBB9` | Completion, positive states |
| `color-warning` | `#FFB347` | `#FFC068` | Gentle nudges, not errors |
| `color-text-primary` | `#1A1625` | `#F5F3F0` | Body text |
| `color-text-secondary` | `#6B6580` | `#9D96B4` | Secondary labels, timestamps |
| `color-text-inverse` | `#FFFFFF` | `#1A1625` | Text on colored backgrounds |
| `color-border` | `#ECEAF2` | `#3A3355` | Subtle separators |
| `color-shadow` | `rgba(26,22,37,0.08)` | `rgba(0,0,0,0.3)` | Card shadows |

#### Goal Type Colors
Each goal type has a dedicated color identity to aid quick recognition.

| Goal type | Color | Gradient |
|-----------|-------|---------|
| Count-based | `#FF6B6B` (coral) | `#FF6B6B → #FF8E53` |
| Recurring habit | `#845EC2` (purple) | `#845EC2 → #D65DB1` |
| Avoidance | `#00C9A7` (teal) | `#00C9A7 → #3FC1C9` |
| One-time milestone | `#FFB347` (amber) | `#FFB347 → #F9F871` |

### 3.2 Usage Rules
- Never use raw hex values in components — always use design tokens.
- Gradients are reserved for high-energy moments. Flat colors are for information.
- Use `color-warning` not `color-primary` for missed-day states. Never use red/danger for missing a goal.
- Ensure 4.5:1 contrast ratio for all text. Enforce AA as minimum; AAA where possible.
- Background gradients behind text must use `color-text-inverse` with a semi-transparent scrim if needed.

---

## 4. Typography

### 4.1 Font Stack

**Primary:** `'Plus Jakarta Sans', system-ui, sans-serif`  
Load via Google Fonts. Weights needed: 400, 500, 600, 700, 800.

**Monospace (for numbers, stats, timers):** `'Syne Mono', monospace`  
Use sparingly — only for large numeric displays like progress counts, streak numbers, and countdowns.

**Emoji:** System emoji stack (no override needed).

### 4.2 Type Scale

| Token | Size | Weight | Line height | Use |
|-------|------|--------|------------|-----|
| `text-display` | 32px | 800 | 1.1 | Hero moments, reward unlock |
| `text-headline` | 24px | 700 | 1.2 | Screen titles, card headers |
| `text-title` | 20px | 700 | 1.3 | Section headers, goal names |
| `text-body-lg` | 17px | 500 | 1.5 | Primary body, card content |
| `text-body` | 15px | 400 | 1.5 | Standard body, descriptions |
| `text-body-sm` | 13px | 400 | 1.5 | Secondary info, meta |
| `text-label` | 12px | 600 | 1.3 | Caps labels, tags, badges (use `letter-spacing: 0.06em`) |
| `text-caption` | 11px | 400 | 1.4 | Timestamps, footnotes |
| `text-mono-lg` | 28px | 400 | 1.0 | Large stat numbers |
| `text-mono` | 20px | 400 | 1.0 | Progress counts |

### 4.3 Typography Rules
- Headlines and display text: sentence case (not ALL CAPS, which reads as pressure).
- Labels and tags: ALL CAPS with letter-spacing.
- Numeric progress values use `text-mono-*` for a data-display feel.
- Maximum line length: 65 characters for body, 45 for headings.
- On gradient backgrounds, always use `color-text-inverse` (white).
- Avoid `font-weight: 400` for interactive elements — minimum 500 for anything clickable.

---

## 5. Spacing & Layout

### 5.1 Base Grid
4px base unit. All spacing is a multiple of 4.

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Micro gaps, icon padding |
| `space-2` | 8px | Tight element spacing |
| `space-3` | 12px | Compact inner padding |
| `space-4` | 16px | Standard element gap |
| `space-5` | 20px | Medium padding |
| `space-6` | 24px | Card padding, section gap |
| `space-8` | 32px | Large section gap |
| `space-10` | 40px | Screen-level padding top/bottom |
| `space-12` | 48px | Hero section spacing |
| `space-16` | 64px | Major section breaks |

### 5.2 Layout System
- **Mobile-first column layout:** Single column, 16–20px horizontal margin.
- **Horizontal padding standard:** 20px from screen edge.
- **Safe area:** Respect device safe areas (notch top, home indicator bottom). Add `env(safe-area-inset-*)`.
- **Max content width:** 430px centered (iPhone Pro Max width). On desktop, center the mobile layout with gentle side gradient or blurred background.
- **Card spacing:** 12px gap between stacked cards.
- **Section spacing:** 32px between major sections.

### 5.3 Touch Targets
- **Minimum:** 44×44px (iOS HIG / WCAG 2.5.5).
- **Preferred for primary actions:** 52px height minimum.
- **Full-width CTAs:** 100% width, 56px height, 28px border-radius.
- **FAB (Floating Action Button):** 64×64px, centered bottom, 24px from bottom safe area.
- **Card tap area:** Full card is tappable — never rely on a small text link inside a card.

### 5.4 Z-Index Stack
| Layer | Value | Contents |
|-------|-------|---------|
| base | 0 | Static content |
| raised | 10 | Cards, elevated elements |
| sticky | 100 | Sticky headers, nav |
| overlay | 200 | Drawers, bottom sheets |
| modal | 300 | Full-screen overlays |
| toast | 400 | Toast notifications |
| celebration | 500 | Confetti, unlock particles |

---

## 6. Motion Design

### 6.1 Core Motion Principles
1. **Purposeful:** Every animation communicates meaning. Progress filling = moving forward. Card scaling up = inviting interaction. Nothing animates purely decoratively.
2. **Physical:** Animations respect physics. Things don't teleport. Entrances decelerate. Exits accelerate. Springs overshoot slightly.
3. **Proportional:** Small UI changes → subtle animation. Major moments (goal complete, reward unlock) → full celebration.
4. **Instant feedback:** User input is acknowledged within 100ms. The visual response to a tap must begin before the interaction resolves.
5. **Reduced-motion fallback:** Every animation must have a non-animated equivalent. Use `prefers-reduced-motion: reduce`.

### 6.2 Duration Tokens

| Token | Duration | Use |
|-------|----------|-----|
| `duration-instant` | 80ms | Tap feedback, checkbox toggle |
| `duration-fast` | 150ms | Button state, hover |
| `duration-normal` | 250ms | Card transitions, slide-in |
| `duration-slow` | 400ms | Screen transitions, modal open |
| `duration-deliberate` | 600ms | Progress ring fill on load |
| `duration-celebration` | 800ms–1400ms | Reward unlock, completion burst |

### 6.3 Easing Tokens

| Token | CSS value | Use |
|-------|-----------|-----|
| `ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Entrances — things arriving |
| `ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Exits — things leaving |
| `ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | State transitions |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1.0)` | Celebrations, completions, bouncy pop |
| `ease-smooth` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Cards, nav transitions |

### 6.4 Interaction Animation Specs

#### Button Press
- Scale down to `0.96` on `touchstart` / mousedown. Duration: `80ms ease-in`.
- Scale back to `1.0` on release. Duration: `150ms ease-spring`.
- For primary gradient buttons: add a brief brightness pulse (`filter: brightness(1.1)`) on release.

#### Card Tap
- Scale to `0.98` on press. Duration: `80ms ease-in`.
- Return to `1.0` on release. Duration: `200ms ease-spring`.
- Add a soft ripple from tap origin (use CSS clip-path or radial gradient overlay).

#### Progress Ring Fill
- On first render: ring fills from 0 to current value over `600ms ease-out`.
- On value update: ring continues filling from current position over `400ms ease-out`.
- When ring reaches 100%: brief pulse scale (`1.0 → 1.08 → 1.0`) over `300ms ease-spring`, then glow appears.

#### Log Tap (primary action)
1. Button scale-down: `80ms`
2. Scale-up spring: `150ms ease-spring` (slight overshoot to `1.05`)
3. Return to rest: `100ms ease-out`
4. Emit floating "+1" or checkmark particle from tap point, rising and fading out over `500ms`
5. Progress ring increments with fill animation
6. Momentum bar briefly pulses

#### Goal Completion
1. All content fades slightly (dim to 80% opacity): `200ms`
2. Completion graphic scales in from center: `400ms ease-spring`
3. Burst of small particles radiating from center: `600ms`
4. Success copy fades in: `200ms delay 300ms`
5. "Claim reward" CTA slides up: `300ms ease-out delay 600ms`

#### Reward Unlock Celebration (see Section 7.5 for full spec)
Full-screen takeover. The most elaborate animation in the app.

#### Screen Transitions
- **Push (navigating forward):** New screen slides in from right (`translateX(100% → 0)`) while old screen slides out left (`translateX(0 → -30%)`). Duration: `300ms ease-smooth`.
- **Pop (back navigation):** Reverse — new slides in from left, old slides right. Duration: `250ms ease-smooth`.
- **Modal/Sheet open:** Sheet slides up from bottom (`translateY(100% → 0)`). Background dims to `rgba(0,0,0,0.5)`. Duration: `350ms ease-out`.
- **Modal/Sheet close:** Sheet slides down. Duration: `250ms ease-in`.
- **Tab switch:** Crossfade (`opacity 0 → 1`). Duration: `150ms ease-in-out`. No slide.

#### Loading States
- Skeleton screens shimmer with a traveling highlight gradient (`#F5F3F0 → #ECEAF2 → #F5F3F0`). Duration: `1200ms` looping.
- No spinners for skeleton-able content. Use skeleton only.
- For actions (button loading): pulse opacity on button label `(1.0 → 0.4 → 1.0)` looping at `800ms` while disabled.

#### Empty States
- Illustration scales in with a subtle bounce: `scale(0.8) → scale(1.0)` over `400ms ease-spring` on first render.
- Copy fades in after illustration: `200ms ease-out delay 200ms`.
- CTA button slides up: `200ms ease-out delay 400ms`.

### 6.5 Reduced Motion
When `prefers-reduced-motion: reduce` is active:
- Remove all transforms and scale animations.
- Replace sliding transitions with instant opacity crossfades (`150ms ease-in-out`).
- Celebration particles are replaced with a static full-screen color flash (single frame at 100% opacity → fade to 0 over `300ms`).
- Progress rings fill instantly on render without animation.
- Momentum bar updates instantly without transition.
- All hover/active state changes are instant.
- Toast and modal transitions use opacity only, no movement.

---

## 7. Core Screen Specifications

### 7.1 Home Screen

#### Purpose
The home is the emotional center of the app. It should feel alive, personalized, and immediately actionable. It is not a task list — it is a motivation dashboard.

#### Layout Structure (top to bottom)

**1. Header Zone (full-bleed gradient)**
- Height: ~180px
- Background: `gradient-primary` with soft noise texture overlay (subtle SVG filter)
- Content:
  - Top-left: App logo mark (small, white) + time-of-day greeting ("Good morning", "Keep going", "Evening wind-down")
  - Center: User's first name in `text-headline` white
  - Motivational tagline: `text-body` white 80% opacity, rotating from copy pool (see Section 10)
  - Bottom-right: Avatar circle (initials or photo) — 40×40px, white border 2px
- The header bleeds under the status bar using `padding-top: env(safe-area-inset-top)`.

**2. Active Reward Teaser**
- A horizontal scrollable strip (or single prominent card if only one active reward) immediately below the header.
- **Reward Progress Card:**
  - Frosted glass effect (`backdrop-filter: blur(20px)` on a semi-transparent surface) OR solid `color-surface` with shadow.
  - Shows: reward emoji/icon, reward name, progress percentage, animated progress bar.
  - Copy: "You're [X]% of the way to [Reward Name]."
  - Tappable — navigates to reward vault.
  - Width: ~280px for horizontal scroll, or full-width if single.
  - Height: 88px.

**3. Today's Goals Section**
- Section header: "Today" in `text-title`, + goal count badge (pill chip).
- Goal cards — stacked vertically with `12px` gap.
- Each card (see Component: GoalCard — Quick Log in Section 8).
- Maximum 5 goals shown before "Show more" expansion.

**4. Momentum Snapshot**
- A single horizontal widget below goals.
- Shows weekly rhythm: 7 circles (Mon–Sun), each filled/empty/partial based on activity.
- Filled = active day (gradient fill), empty = hollow, today = pulsing ring.
- Label: "Your momentum this week" in `text-label`.
- No streak number. No "X days" language. Just the visual pattern.
- Tapping navigates to no screen — it expands inline to show recent log history.

**5. Recent Wins Strip**
- Label: "Recent wins" in `text-label`.
- Horizontally scrollable chips: each chip shows goal emoji + "Goal name ✓" with a completion timestamp.
- Chip style: `color-surface-raised` background, `color-success` emoji/icon, `text-body-sm`.
- If no wins yet: this section is hidden entirely (don't show empty wins).

**6. FAB (Floating Action Button)**
- Position: Fixed, bottom-center, `24px` above bottom safe area.
- Size: `64×64px`, `32px` border-radius (circle).
- Background: `gradient-primary`.
- Icon: `+` in white, `28px`.
- Shadow: `0 8px 24px rgba(255,107,107,0.4)` (colored shadow matching gradient start).
- Press: scale to `0.90 → 1.05 → 1.0`. Opens bottom sheet: "Quick Add" (new goal or quick log).
- Label: none visible; tooltip on long press: "Add goal".

**7. Bottom Navigation**
- 4 tabs: Home, Goals, Rewards, Profile.
- Height: `64px` + bottom safe area.
- Background: `color-surface` with `border-top: 1px solid color-border`.
- Active tab: icon + label in `color-primary`. Inactive: `color-text-secondary`.
- Tab icon size: `24px`. Tab label: `text-caption`.
- Active indicator: small gradient dot below icon (`8px` circle, `gradient-primary`).
- No badge counts in MVP.

#### Home Screen States
- **Empty (new user):** Replace goal cards section with a large, illustrated empty state (see State Definitions). Gentle encouraging copy + "Create your first goal" CTA.
- **All goals logged today:** Header changes to celebration variant ("You showed up today. 🎉") with confetti background in the header gradient area.
- **Returning after absence:** Header shows recovery message ("Welcome back. Pick up where you left off.") with no guilt context.

---

### 7.2 Goal Builder

#### Purpose
A guided, step-by-step flow that feels like a conversation, not a form. Completion should feel like you've made a commitment to yourself.

#### Flow Structure
Use a step-based layout with:
- Progress indicator: small dots at the top (filled = complete, current = large, upcoming = hollow). NOT a progress bar.
- "Back" button: top-left, ghost style, only shown after step 1.
- Animated step transitions: horizontal slide (forward = right-to-left content slide, backward = left-to-right).
- Each step occupies the full screen below the dots and above the CTA.

#### Steps

**Step 1 — Name It**
- Large single-line or two-line text input, auto-focused on load.
- Placeholder: "Run 3x a week", "Save $500", "No doom scrolling"
- Input style: borderless, `text-headline` size, centered, with an animated underline (gradient color).
- Below input: emoji picker row (horizontal scroll, 12px each, tap to set goal emoji). Pre-selected random emoji shown.
- Copy: "What are you working on?"
- CTA: "Looks good →" (disabled until text entered, minimum 3 characters).

**Step 2 — What kind of goal?**
- Grid of 4 large selection cards (2×2).
- Each card: goal type icon (64px), type name (`text-title`), one-line description (`text-body-sm color-text-secondary`).
- Selected card: gains a `gradient-primary` border (3px), scale `1.03`, shadow increase.
- Card colors per goal type (see Section 3.1).
- No CTA button — selecting auto-advances to Step 3 after `200ms` pause (feels intentional, not instant).

**Step 3 — Set Your Target**
Varies by goal type:

*Count-based:*
- Number stepper (large, centered) — "–" and "+" buttons flanking a large number.
- Unit input below (text field, small): "times", "km", "pages", "glasses of water"
- Copy: "How much do you want to do?"

*Recurring habit:*
- Days-of-week selector: horizontal row of pill buttons (S M T W T F S).
- Multiple selection. Selected = `gradient-primary` fill.
- Frequency label auto-generates below: "3 times a week" etc.
- Copy: "When do you want to do this?"

*Avoidance:*
- Toggle group: "Every day" | "Per week" | "Custom period"
- "I want to avoid this for [duration]."
- Duration selector with stepper.

*One-time milestone:*
- Date picker, minimal style — horizontal scroll month/day/year columns.
- Or: "No deadline" toggle.

**Step 4 — Link a Reward**
- Header: "What will you earn?" with a gift box emoji.
- Two options shown as large cards:
  - **"Choose an existing reward"** — shows vault preview (up to 3 reward thumbnails in a row, + count if more).
  - **"Create a new reward"** — navigates into reward creation, returns to this step after saving.
- Option to skip: small ghost link below, "I'll add a reward later."
- Selected reward shows its card with a checkmark overlay.

**Step 5 — Your Why (Optional)**
- Branded as optional with a clear label: "Optional — but powerful."
- Single multiline text input: "In one sentence, why does this matter to you?"
- Character limit: 140. Shown as countdown from 140.
- Skip affordance: CTA says "Skip for now →" if empty, "Add this →" if text entered.

**Step 6 — Confirm**
- Summary card showing the created goal (emoji, name, type, target, reward linkage).
- Large CTA: "Start this goal ✓" with `gradient-primary` background.
- Below CTA: small copy — "You can always edit this later."
- On tap: CTA scales into a success checkmark animation, then navigates to home with the goal added (smooth insert animation on the home list).

#### Goal Builder Principles
- No asterisks, no "required" labels — required steps are just the active step.
- Never show a wall of fields simultaneously.
- Each step should be completable in under 5 seconds.
- The builder should work on a small screen with the keyboard visible.

---

### 7.3 Reward Vault & Reward Creation

#### Reward Vault Screen

**Layout:**
- Screen title: "Rewards" with `text-headline`.
- Subtitle: "Things you're working toward." in `text-body color-text-secondary`.
- Two sections:

**Section 1 — Active Rewards (linked to in-progress goals)**
- Horizontal scroll row of Reward Cards (280px wide, see Component: RewardCard).
- Each card shows: image/emoji, name, linked goal progress ring, unlock percentage.
- Card glow effect for rewards > 70% progress.

**Section 2 — Reward Vault (all rewards)**
- Vertical list (full width) of compact reward rows.
  - Row: emoji (40px circle), name (`text-body-lg`), status chip (Locked / In Progress / Unlocked), cost/tier tag.
  - Tappable row navigates to Reward Detail.
- Floating "Add Reward +" button — full-width or FAB variant — at bottom.

**Empty vault state:**
- Illustrated lock with sparkles emoji.
- Copy: "Your vault is empty. Create rewards to work toward."
- CTA: "Add your first reward" button.

#### Reward Card Component
Full spec in Section 8.

#### Reward Creation Flow
Lighter than goal builder — 2–3 steps:

**Step 1 — Name & Describe**
- Name input (required): `text-headline` sized, centered, same style as goal builder.
- Note/description (optional): secondary textarea, `text-body`.
- Emoji/icon picker: prominent, same as goal builder.

**Step 2 — Details**
- Cost field (optional): currency-formatted number input. Label: "Estimated cost (optional)". Shows currency symbol.
- Tier selector: "Small treat / Medium reward / Big reward / Dream goal" — pill group selector. Visual only (color-coded pills). Controls card visual weight.
- Image upload (optional): full-width upload zone with dashed border. Shows preview on selection.

**Step 3 — Confirm**
- Reward preview card shown full-width.
- CTA: "Save reward ✓"
- Secondary option: "Link to a goal now" → navigates to goal picker.

---

### 7.4 Goal Detail Screen

#### Purpose
Focused view for a single goal. The primary action (log progress) must be immediately reachable without scrolling.

#### Layout (top to bottom)

**1. Hero Area (full-bleed)**
- Background: goal type gradient, full bleed.
- Content: goal emoji (large, 56px), goal name (`text-headline white`), goal type chip (`text-label white 70%`).
- Progress ring overlay in bottom-right of hero — 80px diameter, white, showing progress percentage.
- Back button: top-left, white, arrow icon.

**2. Primary Action Zone**
- Immediately below hero, above the fold.
- Large, prominent log button:
  - Count-based: "Log +1 [unit]" button (full width, `gradient-warm`, `56px` height).
  - Habit: "Mark done today ✓" (full width, `gradient-cool`).
  - Avoidance: "I stayed on track today ✓" (full width, `gradient-cool`).
  - Milestone: "Log progress →" (full width, `gradient-primary`).
- If already logged today: Button changes to a "Done for today ✓" success state (green, non-interactive), with a micro "Undo" ghost button.
- **Sub-action:** small "+ Add note" ghost link below the button.

**3. Progress Summary**
- Large stat display: current progress vs target (e.g., "12 / 30 sessions").
- Stat uses `text-mono-lg` for numbers, `text-body-sm` for labels.
- Animated progress bar (full width, gradient-fill, 8px height, 4px radius).
- Below bar: "Keep going — [X] more to unlock [Reward Name]"
- Reward preview thumbnail (small, 40px, with lock icon overlay if locked).

**4. Reward Connection**
- Card linking to the reward.
- Shows: reward image/emoji, name, glow border if > 70% unlocked.
- Tap: navigates to reward detail.
- If no reward attached: "Add a reward to work toward →" as a soft CTA card.

**5. Recent History**
- Section header: "Recent activity" in `text-label`.
- Vertical list of recent log entries (last 7–10).
- Each entry: date, logged value, optional note. `text-body-sm color-text-secondary`.
- Mood icon if captured (small emoji, 16px).

**6. Motivational Message**
- Single-line copy, dynamically selected (see Section 10.2).
- `text-body color-text-secondary`, centered, italic.
- Rotates on each screen visit.

---

### 7.5 Reward Unlock Celebration

This is the most emotionally important moment in the app. It must feel earned and memorable.

#### Trigger Conditions
- Goal progress reaches 100% AND reward is linked.
- Triggered immediately when the final log tap registers.

#### Sequence

**Beat 1 (0ms–400ms) — World Transforms**
- Current screen content fades to 30% opacity.
- Dark scrim animates in (`rgba(0,0,0,0.7)`): `400ms ease-out`.
- Confetti particles begin emitting from the center of the screen — 60–80 particles, random hues from `gradient-celebration`, varying sizes (6px–16px), random trajectories, gravity applied.

**Beat 2 (300ms–800ms) — Reward Reveal**
- Reward card scales in from `0.3` to `1.1` to `1.0`: `500ms ease-spring`.
- Reward is shown unlocked: full clarity, no blur or lock overlay.
- Glow effect radiates from reward card (radial gradient, reward accent color, `0 0 60px 20px rgba(255,179,71,0.6)`).
- Reward emoji/image pulses: `scale(1.0) → scale(1.15) → scale(1.0)` over `600ms ease-spring`.

**Beat 3 (700ms–1000ms) — Identity Reinforcement**
- Copy animates in (fade + slight upward slide):
  - Large: "You did it. 🎉" — `text-display white`.
  - Secondary: "[Goal Name] complete." — `text-title white 80%`.
  - Tertiary: identity copy from Section 10 — e.g., "You're becoming someone who follows through." — `text-body white 60%`.

**Beat 4 (1100ms) — Actions Appear**
- Two buttons slide up:
  - Primary: "Claim [Reward Name] →" — `gradient-celebration`, full-width.
  - Secondary: "Share moment" (ghost, white text) — optional/low priority.
  - Below: "Keep going — create your next goal →" (small text link).

**Beat 5 — Dismiss**
- User taps "Claim" or taps outside area.
- Confetti fades.
- Celebration overlay slides down.
- App navigates to reward vault, where the reward now shows in an "Unlocked" state with a special glow.

#### Reduced Motion Version
- No confetti particles.
- No scale animations.
- Reward card fades in at full size over `300ms`.
- Copy fades in over `200ms`.
- Overlay is a simple color flash (gradient fill) that fades in over `200ms` then holds.

---

### 7.6 Quick Logging Interaction

#### Principles
- Completion within 2 taps maximum.
- No navigation away from current context required for basic logging.
- Immediate visual reward for the act of logging.

#### Home Screen Log Tap (GoalCard inline)
- Goal card has a prominent log button on the right side (see Component: GoalCard).
- Tap registers immediately (no confirmation required for standard logging).
- Visual feedback sequence: button scale, particle burst, progress ring update, momentum pulse — all within `600ms`.
- Card enters "logged today" state: soft green tint on the card border, checkmark icon replaces log button, progress ring shows updated value.

#### Goal Detail Log Tap
- Same feedback sequence but larger scale (full-width button, larger particles).
- Page scroll position does not change.
- "Done today" success state animated into place.

#### Log with Note (optional)
- After tapping the primary log button, a small floating tooltip appears: "Add a note? (optional)" with a text input and "Done" button.
- Auto-dismisses after `4 seconds` if no interaction.
- Note is attached to the log entry if entered.
- This is not a blocking step — the log is already saved before the tooltip appears.

#### Swipe Actions (on GoalCard in home list)
- Swipe right on a goal card: reveals "Log +1" action with green background — releasing performs the log.
- Swipe left: reveals "Skip today" with amber background — records a skip (not a miss, never "failed").
- Swipe threshold: `60px`. Haptic feedback at threshold (if available via Vibration API).

---

### 7.7 Momentum Visualization

#### Philosophy
Momentum replaces "streaks." It measures effort without demanding perfection. Missing a day reduces momentum but does not reset it. Returning adds momentum back immediately.

#### Home Momentum Widget
- 7-circle weekly rhythm display.
- Each circle: `32px` diameter, `4px` gap.
- **Active day:** Filled with goal-type gradient (if multiple goals, use dominant type). Slightly larger (`36px`).
- **Partial day (some goals logged):** Filled halfway using a gradient clip-path.
- **Today (not yet logged):** Pulsing ring, hollow fill. Pulse: `scale(1.0 → 1.1 → 1.0)` every `2s`.
- **Missed day (not today):** Hollow circle, `color-border` fill, no emphasis.
- **Future days:** Faded hollow, `30% opacity`.

#### Momentum Meter (Goal Detail)
- Horizontal bar below the progress bar on goal detail.
- Width: full container.
- Height: `6px`, `3px` border-radius.
- Fill: `gradient-momentum` (purple-to-pink).
- Fill percentage = momentum score (calculated as: recent 14-day activity ratio, capped at 100%).
- Label above bar: "Momentum" in `text-label`, value shown as descriptor not number: "Building 🔥", "Strong 💪", "Getting started ✨", "Warming up 🌱".
- Avoid numeric momentum scores — qualitative labels feel more human.

#### Momentum Score Logic (for implementation agent)
- 100% = logged ≥ target for last 7 days.
- 75–99% = logged ≥ 4 of last 7 days.
- 40–74% = logged 2–3 of last 7 days.
- 1–39% = logged 1 day in last 7.
- 0% = no logs in 14 days. (Still show "Getting started" — no negative framing.)

---

## 8. Component Inventory

### 8.1 GoalCard (Standard — Home List)

**Purpose:** Primary unit of the home screen. Shows a goal and enables quick logging.

**Dimensions:** Full content width, height: auto (min 80px).

**Anatomy (left to right):**
- Left strip: 4px wide vertical colored bar, goal type color.
- Icon zone: emoji/icon in a 40px soft-gradient circle (goal type gradient, 20% opacity), `12px` left margin.
- Content zone:
  - Row 1: Goal name in `text-body-lg weight-600`.
  - Row 2: Progress text in `text-body-sm color-text-secondary` (e.g., "6 / 10 sessions this week").
  - Row 3 (optional): Small inline progress bar (100% width of content zone, 4px height).
- Right zone: Log button (see below).

**Log Button (right side of card):**
- Size: `44×44px` minimum.
- States:
  - Default: filled circle with `+` or check icon, `gradient-warm` or goal type gradient.
  - Logged today: filled circle with `✓`, `color-success`.
  - Loading: spinner animation inside circle.
- Spacing: `12px` right margin.

**Card States:**
- Default: `color-surface`, shadow `0 2px 8px color-shadow`.
- Logged today: Left strip = `color-success`. Slight green tint on background `rgba(0,201,167,0.05)`.
- Overdue (optional soft state): Left strip = `color-warning`. No red, no "overdue" label — just a gentle warm tint.
- Focused (in swipe): Reveal action area.

**Corner radius:** `16px`.

---

### 8.2 RewardCard (Vault / Active Rewards)

**Purpose:** Visual representation of a reward — aspirational when locked, celebratory when unlocked.

**Dimensions:** 280×180px (horizontal scroll) or full-width (detail).

**Anatomy:**
- Background: reward image if available (cover fill), OR gradient based on tier (small=cool, medium=warm, big=primary, dream=celebration).
- Gradient scrim: bottom 60% of card, darkening overlay for text legibility.
- Top-right: Lock icon (24px white, 70% opacity) when locked. Disappears when unlocked.
- Top-right (unlocked): Sparkle/star icon (24px `color-success`).
- Center/bottom-left content:
  - Reward emoji (36px).
  - Reward name in `text-title text-inverse`.
  - Tier label in `text-label white 60%`.
- Bottom: Progress ring (if active, linked to goal) — 48px diameter, white stroke, gradient fill, percentage label in `text-caption white`.

**Locked State:**
- Background image: `blur(4px)` + brightness reduced to 70%.
- Glow border: `box-shadow: 0 0 0 2px rgba(255,255,255,0.2), 0 8px 32px rgba(132,94,194,0.3)`.
- Lock icon present.

**Unlocked State:**
- Full clarity, no blur.
- Glow border intensified: `box-shadow: 0 0 0 2px rgba(255,255,255,0.6), 0 8px 32px rgba(255,179,71,0.4)`.
- Subtle shimmer animation: traveling highlight over card surface, `2s` loop, `ease-in-out`.

**Corner radius:** `20px`.

---

### 8.3 ProgressRing

**Anatomy:** SVG circle, `stroke-linecap: round`.

**Sizes:**
| Size | Outer diameter | Stroke width |
|------|---------------|-------------|
| `xs` | 32px | 3px |
| `sm` | 48px | 4px |
| `md` | 64px | 5px |
| `lg` | 80px | 6px |
| `xl` | 120px | 8px |

**Track:** `color-border` or `rgba(255,255,255,0.2)` on dark.
**Fill:** Gradient — use `linearGradient` or apply fill color as stroke. Animate `stroke-dashoffset` for fill transitions.
**Center content:** Percentage text in `text-mono` or icon.
**Animation:** `stroke-dashoffset` transition with `duration-deliberate ease-out` on mount; `duration-normal ease-out` on update.

---

### 8.4 MomentumBar

Described in Section 7.7. Reusable component accepting a `score` (0–100) and a `label` override.

---

### 8.5 EmptyState

**Anatomy (centered, vertical stack):**
1. Illustration: 160px tall SVG, enters with scale-bounce animation.
2. Title: `text-title`, centered.
3. Body: `text-body color-text-secondary`, centered, max 2 lines.
4. CTA button: primary or secondary, max width 240px, centered.

**Empty states needed:**
| Context | Illustration theme | Title | Body |
|---------|-------------------|-------|------|
| Home, no goals | Person planting a seed | "Start your first goal" | "Every big change starts with one small decision." |
| No rewards | Gift box with sparkles | "Nothing to work toward yet" | "Create a reward — give your goals a reason." |
| No history | Calendar with dots | "No activity yet" | "Your first log entry will appear here." |
| Search/filter, no results | Magnifying glass, blank | "Nothing here" | "Try a different filter." |

---

### 8.6 Toast Notification

**Use:** Confirm actions, log events, system feedback.

**Anatomy:**
- Pill-shaped card. Width: full minus `32px` margins. Max width: `360px`. Height: `52px`. `26px` border-radius.
- Left icon (24px), message text (`text-body-sm weight-600`), optional right action (ghost text, `text-body-sm color-primary`).
- Background: `color-surface` with strong shadow OR colored variant for success/warning.

**Colored variants:**
- Success: `color-success` gradient background, white text.
- Warning: `color-warning` with dark text.
- Info: `gradient-primary` background, white text.

**Position:** Top of screen (under status bar + 8px) OR bottom (above nav + 8px). Default: top.
**Entry:** Slide down from top (or slide up from bottom), `250ms ease-spring`.
**Exit:** Fade out + slight upward movement after `3000ms` auto-dismiss. `200ms ease-in`.
**Interaction:** Swipe up (or down) to dismiss.

---

### 8.7 Bottom Sheet / Modal

**Structure:**
- Handle bar: `36px × 4px`, `2px` radius, `color-border`, centered, `8px` top margin.
- Title bar (optional): `text-title`, padded `20px` horizontal.
- Content area: `20px` horizontal padding, `16px` top padding.
- Action zone: `20px` horizontal padding, `16px` top padding, `16px + safe-area` bottom padding.
- Backdrop: `rgba(0,0,0,0.5)`, tap to dismiss.

**Corner radius:** Top corners only, `24px`.
**Snap points:** Standard sizes — half-screen, three-quarter, full. Implement with touch drag support.

---

### 8.8 Chip / Tag

**Anatomy:** Pill shape, `999px` border-radius, `8px` horizontal padding, `4px` vertical padding.

**Variants:**
- Goal type chip: background = goal type color at `20% opacity`, text = goal type color, `text-label weight-600`.
- Status chip: "Locked" (gray), "In progress" (primary), "Unlocked" (success).
- Day chip (habit builder): 40px circle, toggle-able.
- Count chip (e.g., "3 goals"): neutral background, `text-label`.

---

### 8.9 Input Fields

**Text input:**
- Height: `52px`, `14px` border-radius.
- Background: `color-surface-raised`.
- Border: `1.5px solid color-border` default, `1.5px solid color-primary` focused.
- `text-body-lg`, `16px` font-size minimum (prevents iOS zoom).
- Placeholder: `color-text-secondary`.
- Focus ring: `0 0 0 3px rgba(255,107,107,0.2)`.

**Hero input (goal/reward name):**
- No border, no background — transparent.
- Large: `text-headline` (24px).
- Animated underline: gradient line, `2px`, enters on focus.
- Auto-sizes height for multi-line.

**Stepper input:**
- "–" button | number display | "+" button.
- Buttons: `44×44px` circle, `color-surface-raised`.
- Number: `text-mono-lg`, centered.

---

## 9. State Definitions

### 9.1 Goal States

| State | Trigger | Visual |
|-------|---------|--------|
| `active` | Default in-progress goal | Standard card, goal type color strip |
| `logged_today` | Progress recorded today | Green strip, checkmark, subtle green tint |
| `completed` | 100% progress reached | Celebration trigger → goal shows complete card |
| `missed_soft` | No log for 1–2 days | Warm amber strip, no label change |
| `paused` | User manually paused | Gray strip, "Paused" chip, reduced opacity 70% |
| `archived` | Goal manually ended | Removed from home list, visible in history |

### 9.2 Reward States

| State | Trigger | Visual |
|-------|---------|--------|
| `draft` | Created but not linked | Standard vault entry, no progress ring |
| `locked_active` | Linked to in-progress goal | Blurred card, lock icon, progress ring showing |
| `unlocking` | Goal just reached 100% | Celebration trigger fires |
| `unlocked` | Post-celebration | Clear card, sparkle icon, shimmer animation |
| `claimed` | User marked as redeemed | Muted state, "Claimed ✓" chip, no glow |

### 9.3 Momentum States

| Label | Score | Icon | Copy |
|-------|-------|------|------|
| Getting started | 0–15 | 🌱 | "Every step counts from here." |
| Warming up | 16–39 | ✨ | "You're finding your rhythm." |
| Building | 40–69 | 🔥 | "You're building consistency." |
| Strong | 70–89 | 💪 | "This is becoming a part of you." |
| In Flow | 90–100 | ⚡ | "You're in the zone." |

### 9.4 App Loading State

- Splash screen: App logo centered on `gradient-primary` background. Logo scale-in: `scale(0.5 → 1.0)`, `400ms ease-spring`. Minimum display: `600ms`.
- Data loading: Skeleton screens for all content areas (no blank white screens).
- Inline action loading: Button enters loading state (opacity pulse) while action processes.

### 9.5 Error States

- **Network error:** Toast notification (warning variant). Copy: "Couldn't connect. Your progress is saved locally." Never say "error" in user-facing copy.
- **Save failure:** Inline warning below the action zone. Copy: "We couldn't save that — tap to retry." Retry button.
- **No recovery state needed for goal data:** App must function offline and sync when online (offline-first).

---

## 10. Copywriting Guidance

### 10.1 Voice & Tone Principles
- **Warm, not saccharine.** Genuine encouragement. Avoid hollow cheerfulness.
- **Identity-based.** Frame progress as "becoming someone who does X", not just "doing X."
- **Process over perfection.** Celebrate the act, not just the outcome.
- **Short.** Most copy is 1–2 sentences. Long motivational paragraphs feel preachy.
- **Specific when possible.** "You're 3 sessions away from [reward]" beats "Keep going."

### 10.2 Rotating Motivational Copy Pool

**Home header (time-of-day variants):**
- Morning: "Good morning — today's a good day to build something."
- Afternoon: "You've got time. One more step."
- Evening: "Even a small win today counts."
- Late night: "Night mode: tomorrow's goals start with tonight's rest."

**After logging:**
- "Nice. That's real progress."
- "One more log in the books."
- "You showed up. That counts."
- "Getting closer to [reward]."
- "Logged. You're building consistency."

**Recovery (returning after missed days):**
- "Welcome back — your goals are still here."
- "One difficult stretch does not erase what you've built."
- "No pressure. Pick up where you left off."
- "Today is a fresh start. Let's go."
- "Missing days is human. Coming back is the skill."

**Near a reward unlock (>80% progress):**
- "You're so close to [reward]. Don't stop now."
- "[Reward] is almost yours."
- "One more push and you're there."

**Goal completion:**
- "You did it. Seriously, you did it."
- "That was [X] sessions of showing up. That's you."
- "Goal complete — you earned this."

**Reward unlock:**
- "You worked for this. It's yours now."
- "You became someone who follows through."
- "Proof that consistency pays off."

### 10.3 Things to Never Write
- "Streak broken!" or any variant.
- "You failed to log today."
- "You're falling behind."
- "Only [X] days left." (deadline urgency)
- "Don't break the chain."
- "You missed [X] days."

### 10.4 Goal Type Default Names
When a user hasn't named a goal yet, suggest auto-names based on type:
- Count-based: "Count it up", "Track the reps"
- Habit: "Build the habit", "Make it daily"
- Avoidance: "Breaking the pattern", "Staying clear"
- Milestone: "Make it happen", "One big win"

---

## 11. Accessibility Guidance

### 11.1 Reduced Motion
- Wrap all animations in `@media (prefers-reduced-motion: reduce)` — disable transforms, remove delays, replace with instant opacity changes.
- Celebration confetti: replaced with a static full-screen color overlay that fades over `300ms`.
- Auto-playing animations (momentum widget pulse, skeleton shimmer): paused entirely.
- In React: detect with `window.matchMedia('(prefers-reduced-motion: reduce)')` and pass as context.

### 11.2 Color & Contrast
- All text meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text).
- Never convey meaning through color alone. Pair color with an icon, label, or pattern.
- Goal type colors are accompanied by type labels.
- State differences (logged / not logged) use icons AND color change, not color alone.
- Goal type color strips are decorative; type name is always shown.

### 11.3 Focus Management
- All interactive elements are keyboard-navigable and have visible focus rings.
- Focus ring: `0 0 0 3px rgba(132,94,194,0.5)` (secondary color, offset from element).
- Bottom sheets and modals trap focus while open and return focus on close.
- Step navigation in goal builder: autofocus first input of each step.
- After logging, focus remains on or near the logging area (not jumping to top of screen).

### 11.4 Touch & Motor
- All tap targets: minimum 44×44px (no exceptions for primary and secondary interactive elements).
- Swipe actions (log, skip) are always duplicated by a tappable button — swipe is an enhancement, never the only path.
- Avoid requiring double-taps or long-presses for primary actions.
- Long-press interactions (FAB label, card preview): always have a visual affordance (press-and-hold indicator).

### 11.5 Text & Reading
- Minimum font size: 13px for all visible text.
- Prefer sentence case over ALL CAPS for body content (all-caps labels limited to `text-label` size contexts).
- Line length: ≤65 characters for body, prevents cognitive overload.
- Avoid justified text — use left-aligned (or centered for short hero copy only).
- Reading level target: accessible to a 12-year-old. Avoid jargon.

### 11.6 Neurodivergent & Executive Function Support
- **Clear, single-focus screens:** Each step of goal builder shows one task only. No scrolling required.
- **No time pressure:** Timers or countdowns are never shown unless explicitly set by the user and never in the primary UI.
- **Undo affordance:** Log actions are undoable within `10 seconds` via toast undo button. This reduces fear of accidental taps.
- **Predictable patterns:** Navigation, CTA position, and card layout are consistent across the app.
- **Low-friction paths:** Reward attachment and "why" in goal builder are both explicitly optional with clear skip affordances.
- **Calm option for celebrations:** A system setting (in Profile) to reduce celebration intensity — replaces confetti with a simple success card. Persists across sessions.

### 11.7 Screen Reader Support
- All interactive elements have `aria-label` values.
- Progress rings include `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.
- Toast notifications announced via `aria-live="polite"` region.
- Celebration screen: announced as "Goal complete. [Reward name] unlocked." — particles are `aria-hidden`.
- Emoji used decoratively are `aria-hidden`. Emoji used as primary meaning have a text alternative.
- Bottom nav uses `role="navigation"` with `aria-label="Main navigation"`.

---

## 12. Implementation Notes

### 12.1 Tech Stack Guidance
- React + Vite (already scaffolded).
- CSS approach: Tailwind CSS strongly recommended — configure theme with design tokens. Alternatively, CSS custom properties + CSS modules.
- Animation: Framer Motion for React — handles `layout` animations, `AnimatePresence`, and spring physics. Use `useReducedMotion()` hook.
- SVG progress rings: Implement as React component with animated `stroke-dashoffset`. Use `useEffect` to trigger animation on mount/update.
- Confetti: Use `canvas-confetti` library for celebration moments.
- Fonts: Load from Google Fonts: `Plus Jakarta Sans` (400,500,600,700,800) + `Syne Mono` (400).
- Icons: Phosphor Icons (`@phosphor-icons/react`).

### 12.2 Design Token Implementation
Implement as CSS custom properties on `:root` and a `.dark` class for dark mode:

```css
:root {
  --color-bg: #FDFCFB;
  --color-surface: #FFFFFF;
  --color-surface-raised: #F5F3F0;
  --color-primary: #FF6B6B;
  --color-secondary: #845EC2;
  --color-success: #00C9A7;
  --color-warning: #FFB347;
  --color-text-primary: #1A1625;
  --color-text-secondary: #6B6580;
  --color-border: #ECEAF2;
  --color-shadow: rgba(26,22,37,0.08);

  --gradient-primary: linear-gradient(135deg, #FF6B6B, #845EC2);
  --gradient-warm: linear-gradient(135deg, #FFB347, #FF6B6B);
  --gradient-celebration: linear-gradient(135deg, #F9F871, #FFB347, #FF6B6B);
  --gradient-cool: linear-gradient(135deg, #00C9A7, #3FC1C9);
  --gradient-momentum: linear-gradient(135deg, #845EC2, #D65DB1);

  --duration-instant: 80ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-deliberate: 600ms;

  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1.0);
  --ease-in: cubic-bezier(0.4, 0.0, 1.0, 1.0);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1.0);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 999px;

  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px;
}

.dark {
  --color-bg: #1A1625;
  --color-surface: #241E35;
  --color-surface-raised: #2E2744;
  --color-primary: #FF8585;
  --color-secondary: #A07FD4;
  --color-success: #1DDBB9;
  --color-warning: #FFC068;
  --color-text-primary: #F5F3F0;
  --color-text-secondary: #9D96B4;
  --color-border: #3A3355;
  --color-shadow: rgba(0,0,0,0.3);
}
```

### 12.3 Mobile Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
Use `env(safe-area-inset-*)` for padding on notched devices.

### 12.4 Component Architecture Priorities
Build components in this order:
1. Design tokens (CSS variables above)
2. Typography components (`Heading`, `Body`, `Label`, `MonoStat`)
3. Button (primary gradient, secondary, ghost, icon-only)
4. ProgressRing
5. GoalCard
6. RewardCard
7. Bottom navigation
8. Toast system
9. EmptyState
10. Bottom sheet

### 12.5 Framer Motion Integration
```jsx
// Wrap routes with AnimatePresence for screen transitions
// Use motion.div with variants for consistent transitions

const screenVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { x: '-30%', opacity: 0, transition: { duration: 0.25, ease: [0.4, 0.0, 1.0, 1.0] } }
};

// Reduced motion: check useReducedMotion() and replace transforms with opacity-only variants
```

### 12.6 Offline Considerations
- Log actions must be committed to local state immediately (optimistic updates).
- Sync to Supabase in background.
- On sync failure: silent retry with exponential backoff.
- Never block the user from logging because of network state.

### 12.7 Performance Budget
- First contentful paint: < 1.5s on 4G mobile.
- Home screen: skeleton shown within 100ms, data hydrated within 500ms on good connection.
- Animation frames: maintain 60fps. Use `will-change: transform` sparingly and only during animations.
- Confetti particles: max 80 particles. Disable on low-power mode (`navigator.hardwareConcurrency < 4` as heuristic).

### 12.8 Dark Mode
- Detect via `prefers-color-scheme: dark`.
- Add `dark` class to `<html>` element.
- Provide a manual toggle in Profile settings.
- Most components work with the token system — no per-component dark mode overrides needed.
- Gradients remain the same in dark mode (they pop more against dark backgrounds).

### 12.9 What This Spec Leaves Open
The implementation agent has latitude on:
- Exact illustration art style within the described aesthetic.
- Specific Supabase schema design.
- Routing library choice (React Router v6 or TanStack Router).
- State management (Zustand or React Context both work for MVP scope).
- Exact confetti behavior (colors, gravity, shapes) — follow the emotional intent.
- Profile screen layout (out of primary MVP scope here).
- Onboarding flow beyond first goal creation.

---

*Document version: 1.0 — MVP design framework for Peply.*  
*Use this as a living reference. Annotate decisions that deviate, so future design iterations are informed.*
