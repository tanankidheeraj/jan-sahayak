# Jan Sahayak (जन सहायक) - Design System Specification
**Project:** Jan Sahayak Citizen Assistant  
**Stitch Project ID:** `3919860643683353059` (`projects/3919860643683353059`)  
**Design Theme:** Civic Horizon  
**Target Device:** Mobile (390px baseline viewport, responsive across tablet & desktop)  

---

## 1. Design Philosophy
The **Civic Horizon** design system is engineered for inclusive citizen interaction across India:
- **High Visual Contrast & Clarity:** Clear hierarchy designed for varying digital literacy and visual acuity.
- **Voice-First Affordances:** Empathetic, prominent audio and mic interaction surfaces with generous touch targets (minimum 48–64px).
- **Institutional Civic Authority Balanced with Warmth:** Grounded in India's tri-color symbolism (Ashoka Navy, Solar Saffron, Growth Green) without sacrificing contemporary usability.

---

## 2. Colour Palette

### Primary (Deep Ashoka Navy)
Used for institutional branding, primary navigation headers, primary buttons, and key authority badges.
- **Primary Base:** `#1A237E` (RGB: 26, 35, 126)
- **Deep Base:** `#000666`
- **Primary Container:** `#1A237E`
- **On-Primary:** `#FFFFFF`
- **Inverse Primary:** `#BDC2FF`

### Secondary (Solar Saffron)
Used for voice assistant triggers, floating action buttons (FABs), speech waveform accents, and notification badges.
- **Secondary Base:** `#FF9933` (RGB: 255, 153, 51)
- **Deep Saffron:** `#8F4E00`
- **Secondary Container:** `#FE9832`
- **Secondary Fixed:** `#FFDCC2`
- **Secondary Fixed-Dim:** `#FFB77A`
- **On-Secondary:** `#FFFFFF`

### Tertiary (Growth Green)
Used for success milestones, approved applications, verified citizen entitlements, and green governance indicators.
- **Tertiary Base:** `#138808` (RGB: 19, 136, 8)
- **Deep Green:** `#012100`
- **Tertiary Container:** `#023900`
- **Tertiary Fixed:** `#8DFC75`
- **On-Tertiary-Container:** `#41AD31`

### Neutral & Surface Canvas
- **Background:** `#F8F9FF`
- **Surface:** `#F8F9FF`
- **Surface Container Lowest:** `#FFFFFF` (Card backgrounds)
- **Surface Container Low:** `#EFF4FF`
- **Surface Container:** `#E6EEFF`
- **Surface Container High:** `#DEE9FC`
- **Surface Container Highest:** `#D9E3F6`
- **On-Background / Text Primary:** `#121C2A` / `#1F2937`
- **Text Secondary / Muted:** `#454652` / `#64748B`
- **Borders & Dividers:** `#E2E8F0` / `#CBD5E1`
- **Outline Variant:** `#C6C5D4`

### Status & Feedback
- **Error / Critical Alert:** `#BA1A1A`
- **Error Container:** `#FFDAD6`
- **On-Error:** `#FFFFFF`
- **Warning / Medium Priority:** `#D97706` (Amber 600)
- **Warning Container:** `#FEF3C7` (Amber 100)
- **Info:** `#0284C7` (Sky 600)

---

## 3. Typography Scale

### Font Families
- **Headline Font Family:** `Plus Jakarta Sans`, system-ui, sans-serif
- **Body & Label Font Family:** `Inter`, system-ui, sans-serif

### Type Tokens
| Token | Font Size | Line Height | Weight | Letter Spacing | Target |
|---|---|---|---|---|---|
| `headline-xl` | 36px (2.25rem) | 44px (2.75rem) | 700 (Bold) | -0.02em | Hero headers (Desktop) |
| `headline-xl-mobile` | 28px (1.75rem) | 36px (2.25rem) | 700 (Bold) | -0.01em | Hero headers (Mobile) |
| `headline-lg` | 30px (1.875rem) | 38px (2.375rem) | 700 (Bold) | -0.01em | Page titles |
| `headline-lg-mobile` | 24px (1.5rem) | 32px (2.0rem) | 600 (SemiBold) | -0.01em | Section headers |
| `headline-md` | 22px (1.375rem) | 28px (1.75rem) | 600 (SemiBold) | 0.00em | Modal titles, Card heads |
| `headline-sm` | 18px (1.125rem) | 24px (1.5rem) | 600 (SemiBold) | 0.00em | Feature subheaders |
| `body-lg` | 18px (1.125rem) | 28px (1.75rem) | 400 (Regular) | 0.00em | Lead intro text |
| `body-md` | 16px (1.0rem) | 24px (1.5rem) | 400 (Regular) | 0.00em | Standard reading body |
| `body-sm` | 14px (0.875rem) | 20px (1.25rem) | 400 (Regular) | +0.01em | Secondary descriptions |
| `label-lg` | 16px (1.0rem) | 24px (1.5rem) | 600 (SemiBold) | +0.01em | Button labels, CTAs |
| `label-md` | 14px (0.875rem) | 20px (1.25rem) | 500 (Medium) | +0.02em | Input labels, tabs |
| `label-sm` | 12px (0.75rem) | 16px (1.0rem) | 600 (SemiBold) | +0.03em | Badges, metadata pills |

---

## 4. Spacing Scale

Built on a flexible 4px/8px modular grid:
- **`space-xs` (4px / 0.25rem):** Micro gaps between icons and labels, pill paddings.
- **`space-sm` (8px / 0.5rem):** Standard inter-element spacing within components.
- **`space-md` (16px / 1.0rem):** Card internal padding, form input spacing, standard gutters.
- **`space-lg` (24px / 1.5rem):** Spacing between content sections, card margins.
- **`space-xl` (40px / 2.5rem):** Major section separators and hero offsets.

### Viewport Layout Margins & Gutters
- **Mobile (<640px):** 16px (1.0rem) horizontal margin, 16px column gutter.
- **Tablet (640px - 1024px):** 24px - 32px horizontal margin, 24px column gutter.
- **Desktop (>1024px):** 48px - 64px horizontal margin, 32px column gutter, max-width `1280px` (`max-w-7xl`).

---

## 5. Border Radius & Shapes
- **`rounded-sm` (4px / 0.25rem):** Code tags, small tooltips.
- **`rounded-DEFAULT` (8px / 0.5rem):** Checkboxes, form helper badges.
- **`rounded-md` (12px / 0.75rem):** Standard buttons, text inputs, dropdown selects.
- **`rounded-lg` (16px / 1.0rem):** Service cards, scheme result cards, popup cards.
- **`rounded-xl` (24px / 1.5rem):** Section containers, bottom sheets, modal dialogs.
- **`rounded-full` (9999px):** Filter pills, status badges, Voice Assistant Floating Action Button (64px FAB).

---

## 6. Elevation & Depth
- **Level 0 (Flat):** `none` (Canvas baseline).
- **Level 1 (Card Baseline):** `0px 2px 6px -1px rgba(26, 35, 126, 0.04)` with `1px solid #E2E8F0`.
- **Level 2 (Interactive Floating / Hover):** `0px 8px 16px -2px rgba(26, 35, 126, 0.08)` with `1px solid #CBD5E1`.
- **Level 3 (Voice FAB / Active Speech):** `0px 12px 28px -4px rgba(255, 153, 51, 0.35)` with concentric pulsing ring.

---

## 7. Screens Catalog (Stitch Project Screens)

| # | Screen Name | Screen ID | Dimensions | Key Purpose / Workflow |
|---|---|---|---|---|
| 1 | **Jan Sahayak - Home (Primary)** | `c476b5599520489aa8ae7522980f3255` | 780 × 3588 | Citizen portal welcome, instant voice trigger, trending schemes, and quick actions. |
| 2 | **Jan Sahayak - Home (Alternate Variant)** | `86aadac883644ea3b82a1004870ea6c6` | 780 × 2614 | Minimalist alternate card layout for lower resolution displays. |
| 3 | **Jan Sahayak - Speak AI** | `30c9cdd54b6047bdba437094f5e95898` | 780 × 3528 | Voice-first overlay, audio waveform visualizer, Indic dialect picker. |
| 4 | **Jan Sahayak - AI Chat** | `f5730caf3039412d964a215fe4d86d1c` | 780 × 3000 | Conversational Q&A thread, suggestion chips, text-to-speech speaker output. |
| 5 | **Jan Sahayak - Services Directory** | `55df46706ed84c1a83532dc5816aefc0` | 780 × 4748 | Complete catalog across Agriculture, Health, Pensions, Housing with filters. |
| 6 | **Jan Sahayak - Eligibility Form** | `7322979e425c4974a1afdedbbb66677f` | 780 × 2714 | Multi-step eligibility questionnaire (Step 2 of 5: Demographics & Occupation). |
| 7 | **Jan Sahayak - Matched Schemes** | `34b322f4e3a9455bbb053e06a816868f` | 780 × 4400 | Matching results sorted by percentage match score with benefit estimates. |
| 8 | **Jan Sahayak - Scheme Detail** | `2ca5cfa7b3864eef979e439ac143f7fc` | 780 × 4496 | In-depth scheme dossiers: qualifications, required documents, step-by-step guide. |
| 9 | **Jan Sahayak - Application Tracking** | `53ada5204da7462aaf97cf212c163ad0` | 780 × 3336 | Live milestone tracker for citizen benefit applications. |
| 10 | **Jan Sahayak - Report Civic Issue** | `37bb2be104094f22953cf4f9ee63e9d7` | 780 × 3148 | Vision AI reporting tool for potholes, garbage, water leaks with GPS map pin. |
| 11 | **Jan Sahayak - File Complaint** | `be34d82c88b446d8800c6df9edef9f54` | 780 × 4840 | Formal administrative grievance lodging with departmental routing. |
| 12 | **Jan Sahayak - Track Complaint** | `eef05562db1e436682d4493891195774` | 780 × 3688 | Grievance timeline tracker with SLA countdown and officer details. |
| 13 | **Jan Sahayak - Complaint Success** | `21fe2360ad8e4d4bae230e1ca3bb3d5e` | 780 × 3536 | Acknowledgment receipt with unique Tracking ID and SMS tracking link. |
| 14 | **Jan Sahayak - Accessibility Settings**| `6ea3a928bce8415ab03c3789ccea45cd` | 780 × 4400 | High contrast mode, text scaling up to 150%, Indic language selector. |
| 15 | **Jan Sahayak - Admin Dashboard** | `560d5d57e6ee405eb8cd588b9607fe91` | 3680 × 1982 | Official command center: grievance heatmap, SLA compliance, resolution desk. |
