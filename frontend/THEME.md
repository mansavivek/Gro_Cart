# Gro-Cart Frontend Theme Guide

## Overview
Gro-Cart uses a cohesive design system based on fresh, natural colors that promote trust and efficiency in grocery shopping. The theme combines the warm, organic feel of groceries with modern, clean UI principles.

---

## Color Palette

### Primary Brand Colors
- **Gro Green** (`#2e8b57`): Primary brand color, used for CTAs, focus states, and key UI elements
  - Represents growth, freshness, and organic produce
  - Used for buttons, links, active states
- **Gro Orange** (`#f37021`): Accent color for secondary actions and highlights
  - Represents warmth and urgency
  - Used for links, hover states, and decorative elements

### Semantic Colors
- **Primary Green Scale**:
  - 50: `#f0fdf4` - Lightest background
  - 100: `#dcfce7` - Light backgrounds
  - 500: `#22c55e` - Current primary (green-600)
  - 600: `#16a34a` - Hover state
  - 700: `#15803d` - Active state

- **Neutral Colors**:
  - Gray-50: `#f9fafb` - Lightest backgrounds
  - Gray-100: `#f3f4f6` - Light backgrounds
  - Gray-500: `#6b7280` - Secondary text
  - Gray-700: `#374151` - Primary text
  - Gray-800: `#1f2937` - Dark text

- **Alert Colors**:
  - Red: `#ef4444` - Error states
  - Red-50: `#fef2f2` - Error backgrounds

### Background Colors
- **Light Theme**: `#f9fafb` (Gray-50)
- **Card Background**: `#ffffff` (White) with subtle shadows
- **Accent Background**: `#f0fdf4` (Green-50)

---

## Typography

### Font Families
- **Primary Font**: System default (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **Display Font**: Uses bold weights for headings

### Font Sizes & Weights
- **Headings (h1, h2, h3)**
  - h1: `1.875rem` (30px), Bold/Black (700-900 weight)
  - h2: `1.5rem` (24px), Bold (700 weight)
  - h3: `1.25rem` (20px), Semibold (600 weight)

- **Body Text**
  - Large: `1rem` (16px), Regular (400 weight)
  - Base: `0.875rem` (14px), Regular (400 weight)
  - Small: `0.875rem` (14px), Regular (400 weight)

- **Labels & Captions**
  - Label: `0.75rem` (12px), Semibold (600 weight)
  - Caption: `0.75rem` (12px), Regular (400 weight)

---

## Components

### Buttons
- **Primary Button**:
  - Background: `gro-green` (`#2e8b57`)
  - Text: White
  - Hover: `green-700` (`#15803d`)
  - Padding: `py-3 px-4` (large), `py-2 px-4` (medium)
  - Border Radius: `rounded-lg` or `rounded-xl`
  - Shadow: `shadow-sm` or `shadow-lg`
  - Active State: `scale-95` transform

- **Secondary Button**:
  - Background: `gray-100`
  - Text: `gray-700`
  - Hover: `gray-200`
  - Border: 1px solid

### Input Fields
- **Base Styling**:
  - Border: `border-gray-300` or `border-slate-200`
  - Padding: `px-4 py-3` (large), `px-3 py-2` (small)
  - Border Radius: `rounded-lg` or `rounded-xl`
  - Font Size: `text-sm` or `text-base`
  - Shadow: `shadow-sm`

- **Focus State**:
  - Ring: `ring-2`, color `gro-green`
  - Border: `border-gro-green`

- **Error State**:
  - Border: `border-red-400`
  - Background: `bg-red-50`
  - Text: `text-red-600`

- **With Icons**:
  - Left padding increased for icon space (`pl-12`)
  - Emoji or symbol icons (person 👤, mail ✉️, lock 🔒, etc.)

### Cards
- **Container**:
  - Background: `white`
  - Border: `1px solid border-gray-100`
  - Border Radius: `rounded-2xl` or `rounded-xl`
  - Shadow: `shadow-xl` or `shadow-md`
  - Padding: `p-8` (large), `p-6` (medium)

### Forms
- **Form Groups**:
  - Vertical spacing: `gap-5` or `space-y-6`
  - Label above input
  - Error message below input

- **Checkboxes**:
  - Size: `h-4 w-4`
  - Color: `text-gro-green`
  - Focus Ring: `ring-gro-green`
  - Rounded corners: `rounded`

### Navigation Links
- **Default**: `text-gro-green` with `font-medium`
- **Hover**: `text-orange-600` or underline
- **Active**: Bold text

---

## Layout Patterns

### Full-Screen Forms (Login/Register)
```
┌─────────────────────────────────┐
│          Logo/Header            │
├─────────────────────────────────┤
│                                 │
│    Form Container               │
│    - Title                      │
│    - Description                │
│    - Input Fields               │
│    - Submit Button              │
│    - Footer Link                │
│                                 │
└─────────────────────────────────┘
    Decorative Footer Bar
```

### Login Page Specifics
- **Container Max Width**: `max-w-md` (448px)
- **Header**: Centered logo, title, subtitle
- **Form Spacing**: 
  - Between fields: `space-y-4` or `space-y-6`
  - Field to button: `gap-6` or `space-y-6`
- **Special Elements**:
  - Remember me checkbox
  - Forgot password link (positioned top-right of password field)
  - Full-width sign-in button
  - Footer text with register link

### Register Page Specifics
- **Container Max Width**: `max-w-lg` (512px)
- **Layout**: Full page with header, main content, footer
- **Background**: Light cyan/blue `bg-cyan-50`
- **Form Grid**: Single column, full-width inputs
- **Special Elements**:
  - Eye icon for password visibility toggle
  - Confirm password field
  - Optional fields (phone, address, DOB)
  - Emoji icons for each input
  - Terms & conditions checkbox
  - Footer with copyright

---

## Spacing System

### Padding Scale
- `p-1` = 0.25rem (4px)
- `p-2` = 0.5rem (8px)
- `p-3` = 0.75rem (12px)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)

### Margin Scale
- `gap-1` = 0.25rem (4px)
- `gap-2` = 0.5rem (8px)
- `gap-3` = 0.75rem (12px)
- `gap-5` = 1.25rem (20px)
- `gap-6` = 1.5rem (24px)
- `gap-8` = 2rem (32px)

---

## Border Radius

- `rounded` = `0.25rem` (standard)
- `rounded-lg` = `0.5rem`
- `rounded-xl` = `0.75rem`
- `rounded-2xl` = `1rem`
- `rounded-full` = `9999px`

---

## Shadow System

- `shadow-sm`: Light shadow for subtle depth
- `shadow-md`: Medium shadow for cards
- `shadow-lg`: Large shadow for prominent cards
- `shadow-xl`: Extra large shadow for focus elements
- `shadow-gro-green/20`: Green-tinted shadow for brand emphasis

---

## Responsive Design

### Breakpoints
- **Mobile**: Default styles (< 640px)
- **Tablet**: `sm:` prefix (640px+)
- **Desktop**: `lg:` prefix (1024px+)

### Mobile-First Approach
- All base styles target mobile
- Use `sm:` and `lg:` prefixes to enhance for larger screens
- Forms remain centered and full-width on mobile
- Padding increases on desktop: `p-4` → `p-8`

---

## Dark Mode (Future)

**Reserved color tokens** for dark mode extension:
- `dark:bg-background-dark`: `#221610`
- `dark:text-white`: `#ffffff`
- `dark:border-slate-800`: For dark borders
- `dark:bg-slate-800/50`: For dark card backgrounds

---

## Accessibility

### Color Contrast
- Primary text on white: WCAG AA compliant
- Gro-green on white: WCAG AAA compliant
- All focus states have visible indicators

### Interactive Elements
- Buttons have `:focus-visible` states
- Links are underlined on hover
- Form inputs have clear labels
- Error messages are color-coded AND use descriptive text

### Icons & Imagery
- Emoji icons are semantic but not primary content
- Logo images have alt text
- Focus rings are visible on all interactive elements

---

## Button States

### Primary (Gro-Green)
| State | Background | Text | Additional |
|-------|-----------|------|-----------|
| Default | `#2e8b57` | White | Shadow |
| Hover | `#15803d` | White | Darker shade |
| Active | `#15803d` | White | Scale 95% |
| Disabled | Previous | White | Opacity 50% |
| Focus | `#2e8b57` | White | Ring offset |

---

## Input States

### Default
- Border: `#d1d5db` (Gray-300)
- Background: `white`
- Text: `#1f2937` (Gray-800)

### Focus
- Border: `#2e8b57` (Gro-green)
- Ring: 2px ring in `#2e8b57`
- Shadow: `shadow-sm`

### Error
- Border: `#f87171` (Red-400)
- Background: `#fef2f2` (Red-50)
- Text: `#dc2626` (Red-600)

### Disabled
- Border: `#e5e7eb` (Gray-200)
- Background: `#f9fafb` (Gray-50)
- Text: `#9ca3af` (Gray-400)
- Cursor: `not-allowed`

---

## Implementation Notes

### Tailwind Configuration
All custom colors are extended in `tailwind.config.js`:
```javascript
colors: {
  'gro-green': '#2e8b57',
  'gro-orange': '#f37021',
}
```

### CSS Classes
- Utility-first approach using Tailwind CSS
- Custom classes are minimized
- Component libraries (Card, Button, Input) handle consistent styling
- Consistent use of focus rings and transitions

### Decorative Elements
- **Login Page**: Gradient bar at bottom (gro-green → gro-orange → gro-green)
- **Register Page**: Light cyan background for visual interest
- **Icons**: Emoji used for visual cues and semantic meaning

---

## Usage Guidelines

1. **Always use brand colors** for primary actions
2. **Maintain consistent spacing** using the defined scale
3. **Include hover states** for all interactive elements
4. **Use semantic colors** for status indicators (red for error, etc.)
5. **Test color contrast** for accessibility compliance
6. **Keep form layouts simple** with clear visual hierarchy
7. **Use emoji icons** sparingly for decorative purposes only
8. **Include focus states** on all keyboard-interactive elements

---

## Design Assets

### Required Assets
- Gro-Cart Logo (SVG preferred, 128px+ for login/register pages)
- Favicon for browser tab

### Image Optimization
- Use WebP format when possible
- Optimize for mobile (reduce download size)
- Serve responsive images with srcset

---

*Last Updated: March 17, 2026*
*Theme Version: 1.0*
