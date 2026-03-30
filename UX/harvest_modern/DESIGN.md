# Design System Document

## 1. Overview & Creative North Star
**Creative North Star: The Organic Curator**

This design system moves away from the rigid, clinical "supermarket grid" and toward an editorial, high-end marketplace experience. The goal is to make grocery shopping feel less like a chore and more like a curated culinary exploration. 

We achieve this through **Soft Minimalism**: a philosophy that prioritizes breathing room, sophisticated tonal layering, and high-contrast typography. By breaking traditional layouts with intentional asymmetry—such as overlapping product cards or floating sidebars—the interface feels bespoke and premium. This system is designed to be "Tailwind-friendly," leveraging a utility-first approach to create complex, layered compositions.

---

## 2. Colors
Our palette is rooted in the "Grocery Green," but it is applied with clinical precision to ensure it feels vibrant rather than overwhelming.

*   **Primary (`#006a3b`):** Reserved strictly for primary actions and brand milestones.
*   **Surface Hierarchy:** We utilize a tiered surface system to create depth without relying on archaic borders.
    *   `surface`: The base canvas (`#f4f7f9`).
    *   `surface-container-lowest`: Pure white (`#ffffff`), used for high-priority floating cards.
    *   `surface-container-high`: A subtle depth layer (`#dee3e6`) for recessed areas like search bars.

**The "No-Line" Rule**
Traditional 1px solid borders are prohibited for sectioning. To separate the category sidebar from the product grid, use a background shift from `surface` to `surface-container-low`. Boundaries must be felt, not seen.

**Signature Textures**
To add "soul" to the UI, main CTAs should utilize a subtle linear gradient from `primary` to `primary_dim`. This prevents the "flat" look of generic templates and adds a tactile, premium finish.

---

## 3. Typography
We use a dual-font strategy to balance editorial character with functional legibility.

*   **Display & Headline (Manrope):** A modern, geometric sans-serif with a high x-height. Use `display-lg` for hero marketing and `headline-md` for category titles. Its wide apertures convey openness and freshness.
*   **Body & Label (Inter):** The industry standard for utility. Used for product weights, nutrition facts, and tabular data. 
*   **Hierarchy as Identity:** By pairing a large `display-sm` headline with a much smaller `label-md` uppercase subtitle, we create an authoritative, magazine-like structure that guides the user’s eye effortlessly.

---

## 4. Elevation & Depth
Depth in this system is a result of **Tonal Layering**, not structural scaffolding.

*   **The Layering Principle:** Place a `surface-container-lowest` card (White) on top of a `surface-container-low` section. The delta in luminance creates a natural "lift."
*   **Ambient Shadows:** When a card must float (e.g., a product hover state), use an extra-diffused shadow: `shadow-[0_20px_50px_rgba(43,47,49,0.05)]`. The shadow is tinted with the `on-surface` color at a very low opacity (4-6%) to mimic natural light.
*   **Glassmorphism:** For floating navigation or top bars, use `bg-surface/80` with a `backdrop-blur-md`. This allows the vibrant colors of fresh produce to bleed through the UI, making the app feel integrated with the content.
*   **The Ghost Border Fallback:** For input fields, use `outline-variant` at 20% opacity. This provides just enough affordance for accessibility without creating a "boxed-in" feeling.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` background with `on-primary` text. Use `rounded-md` (8px-12px) to maintain a friendly but professional tone.
*   **Secondary:** `secondary_container` background. Provides a softer alternative for "Add to List" actions.
*   **Tertiary:** No background, `primary` text. Used for low-priority navigation like "View All."

### Product Cards
*   **Styling:** Forbid dividers. Use `p-4` (Spacing 4) to let the product photography breathe.
*   **Depth:** Use `surface-container-lowest` as the card base on a `surface` background.
*   **Interaction:** On hover, apply a subtle `primary` "Ghost Border" (10% opacity) and a slight upward translate (`-translate-y-1`).

### Input Fields
*   **Visuals:** Use `surface-container-highest` for the background to create a "inset" look. 
*   **States:** On focus, transition the background to `surface-container-lowest` and add a 2px `primary` outer glow.

### Category Chips
*   **Selection:** Active chips use `primary_container` with `on_primary_container` text. Unselected chips use `surface-container-high`. Avoid high-contrast outlines.

### Grocery-Specific Components
*   **Freshness Indicator:** A small, pill-shaped badge using `tertiary_container` to highlight "Organic" or "Local" items.
*   **Quantity Stepper:** A compact horizontal component. Use `surface-container-low` for the base and `primary` for the +/- icons to ensure they are the focal point of the interaction.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. A slightly wider left margin for the category list creates a more high-end, editorial feel.
*   **Do** prioritize high-quality, isolated product photography on neutral backgrounds.
*   **Do** use `8px` (`DEFAULT`) to `12px` (`md`) corner radii to maintain a "modern-soft" aesthetic.

### Don't
*   **Don't** use pure black (`#000000`) for text. Always use `on_surface` (`#2b2f31`) to keep the interface feeling soft.
*   **Don't** use lines to separate list items. Use vertical white space (`py-4` or `py-6`) to define boundaries.
*   **Don't** use heavy drop shadows. If you can clearly see where the shadow ends, it is too heavy. It should be an ambient "glow" of depth.