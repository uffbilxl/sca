# BCUSCA Design System

**Theme:** Dark Precision — surgical whitespace, cinematic typography, intentional micro-interactions.

---

## Colour Tokens

All colours live in `:root` inside `globals.css`. Never hardcode hex values outside this block.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#08090a` | Page background |
| `--color-surface` | `#111214` | Cards, panels, surfaces |
| `--color-border` | `#1e2024` | All borders |
| `--color-accent` | `#6366f1` | Primary CTA, links, active states |
| `--color-accent-glow` | `rgba(99,102,241,0.2)` | Shadow glows |
| `--color-text` | `#f1f2f4` | Primary text |
| `--color-muted` | `#6b7280` | Secondary / helper text |
| `--color-tag` | `#1a1d23` | Pill / tag backgrounds |

Legacy aliases (`--bg`, `--t1`, etc.) are preserved for admin pages and should not be used in new components.

---

## Typography

### Fonts
- **Display / UI:** `var(--font-geist-sans)` — bold headlines, nav, card titles
- **Body:** system fallback via Geist Sans variable (`Inter` as fallback)
- **Mono:** `var(--font-geist-mono)` — eyebrow labels, counters, code-style tags

Both fonts are loaded in `layout.tsx` via the `geist` npm package.

### Scale

| Token | Size | Use |
|-------|------|-----|
| `--text-xs` | `0.75rem` | Eyebrow labels, badges |
| `--text-sm` | `0.875rem` | Body small, footer |
| `--text-base` | `1rem` | Default body |
| `--text-lg` | `1.125rem` | Subtitles, hero sub |
| `--text-2xl` | `1.5rem` | Section headings (small) |
| `--text-3xl` | `2rem` | Section headings |
| `--text-4xl` | `2.75rem` | Page headings |
| `--text-5xl` | `3.75rem` | Hero |
| `--text-6xl` | `5rem` | Hero (max) |

For responsive headlines, use `clamp()`: `font-size: clamp(1.75rem, 4vw, 2.75rem)`.

---

## The Signature Gradient

Used on the hero and the CTA "You belong here." headline only. Apply sparingly — one bold visual moment per page.

```css
background: linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Tailwind shorthand: `.gradient-text` utility class.

---

## Component Patterns

### Eyebrow labels
```html
<span class="eyebrow">// section name</span>
```
Mono font, `xs`, indigo, `tracking-widest`, uppercase. Precedes every section h2.

### Cards
Surface bg + 1px border + `rounded-xl`:
```html
<div class="card">...</div>
```
Hover state: `translateY(-4px)` + accent border tint + `shadow-[0_20px_40px_rgba(0,0,0,0.4)]`.

### Buttons
```html
<!-- Primary -->
<button class="btn-primary">Label</button>

<!-- Ghost -->
<button class="btn-ghost">Label</button>
```
Both use `rounded-full` pill shape.

### Badges
```html
<span class="badge-blue">Internship</span>
<span class="badge-green">Open</span>
<span class="badge-amber">Closing soon</span>
<span class="badge-red">Closed</span>
<span class="badge-gray">Tag</span>
```

### Focus rings (accessibility)
Every interactive element uses `.focus-ring`:
```html
<button class="focus-ring">...</button>
```
This applies `outline: none` on focus and `ring-2 ring-[--color-accent]` on `:focus-visible`.

---

## Animation Guidelines

```
Hover transitions:  200–300ms, cubic-bezier(0.4, 0, 0.2, 1)
Page entrance:      opacity 0→1 + translateY(24px→0), via <FadeIn> component
Scroll reveals:     framer-motion whileInView, viewport.once = true
Reduced motion:     @media (prefers-reduced-motion) disables all in globals.css
```

Use `<FadeIn delay={i * 0.06}>` for staggered grid items.

**Do not** add animation just to fill space. Every motion must serve the content.

---

## Layout

- Max content width: `max-w-[1280px] mx-auto`
- Horizontal padding: `px-6 sm:px-10`
- Section vertical rhythm: `py-20 sm:py-28`
- Breakpoints: `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px`

---

## What NOT to do

- No light mode — this site is dark-only.
- No hardcoded hex values outside `:root`.
- No glassmorphism cards everywhere — frosted glass is reserved for the Navbar only.
- No gradient backgrounds on entire sections — only the hero radial glow and the headline gradient text.
- No drop shadows on resting card states — shadow only on hover/elevated states.
- No carousel/slider components — use grids.
