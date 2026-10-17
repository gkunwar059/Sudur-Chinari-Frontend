# Mobile-First Responsive Tailwind CSS Architecture & Guidelines

> **Project:** Sudur Chinari (सुदूर चिनारी)  
> **Framework:** Next.js (App Router) + Tailwind CSS + Vanilla CSS Tokens  
> **Core Principle:** Every component must be built from the smallest viewport (360px) upward.

---

## 1. Core Philosophy: True Mobile-First

Tailwind CSS uses **min-width** media queries. This means:
1. **Unprefixed utilities** (e.g., `text-sm`, `p-4`, `grid-cols-1`) apply to **all viewports** starting from `0px`.
2. **Breakpoint prefixes** (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) **only** layer on styles when the screen is *at least* that wide.
3. **Never design desktop-first.** Do not write desktop styles and attempt to override them downward. Always declare mobile styles first, then enhance for larger viewports.

```tsx
// ❌ WRONG (Desktop-first mindset, fighting overrides):
<div className="flex-row md:flex-col text-lg md:text-sm p-8 md:p-3">

// ✅ CORRECT (Mobile-first, progressive enhancement):
<div className="flex flex-col md:flex-row text-sm md:text-lg p-3 sm:p-5 lg:p-8">
```

---

## 2. Breakpoint System & Device Matrix

| Prefix | Min Width | Target Devices | Typical Usage |
| :--- | :--- | :--- | :--- |
| *(default)* | `0px` | Phones portrait (360px – 430px) | Single column, stacked cards, full-width elements, tap-friendly controls |
| `sm:` | `640px` | Large phones landscape, small tablets | 2-column compact grids, horizontal search bars, secondary meta visible |
| `md:` | `768px` | Tablets portrait (iPad), foldables unfolded | Multi-column layouts, sidebars visible, expanded filters, desktop sub-headers |
| `lg:` | `1024px` | Laptops, tablets landscape | 3–4 column grids, sticky sidebars, complex atlas/maps, split hero |
| `xl:` | `1280px` | Standard desktop monitors | Full broadsheet layout, multi-tier editorial columns, expansive leaderboards |
| `2xl:` | `1536px` | Large monitors & ultrawide displays | Max container boundaries (`max-w-[1360px]`), ample gutters |

---

## 3. Essential Editorial Patterns

### A. Responsive Grid Progression

For news feeds, opinion pieces, district cards, and photo stories:

```tsx
// 1 col (mobile) -> 2 cols (tablet) -> 3 or 4 cols (desktop)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
  {items.map((item) => (
    <article key={item.id} className="w-full">
      {/* Card Content */}
    </article>
  ))}
</div>
```

### B. Responsive Flex Alignment & Stacking

Header rows, section titles, filters, and action links:

```tsx
// Stacks vertically on mobile, horizontal with space-between on tablet/desktop
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
  <div className="flex items-center gap-2">
    <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
  </div>
  <div className="flex items-center gap-2 self-start sm:self-auto">
    <Link href="/all" className="text-xs sm:text-sm font-semibold text-[#990F3D]">
      सबै हेर्नुहोस् &rarr;
    </Link>
  </div>
</div>
```

### C. Typography Scaling (English & Nepali Devanagari)

Devanagari glyphs have distinct vertical metrics and ascenders/descenders. Ensure line-heights prevent clipping on narrow screens:

```tsx
// Major Page Title (H1)
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight sm:leading-tight tracking-tight">

// Section Title (H2)
<h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 leading-snug">

// Article Card Headline (H3/H4)
<h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-snug line-clamp-2 hover:text-[#990F3D] transition-colors">

// Metadata, Dates, Authors
<div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 font-medium">

// Section Kicker / Badge (No uppercase as per project standard)
<span className="text-[11px] sm:text-xs font-bold text-[#990F3D] tracking-normal">
```

### D. Padding & Margin Containment

```tsx
// Page Root Container
<main className="min-h-screen px-3.5 sm:px-6 lg:px-8 max-w-[1360px] mx-auto">

// Section Vertical Rhythm
<section className="my-6 sm:my-8 lg:my-12">

// Card Inner Padding
<div className="p-3.5 sm:p-5 lg:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100">
```

### E. Responsive Next.js Images

Prevent layout shifts and high mobile bandwidth usage:

```tsx
// Responsive Aspect Ratio + Optimized Sizes
<div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
  <Image
    src={story.featuredImage}
    alt={story.title.ne}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover group-hover:scale-105 transition-transform duration-500"
    priority={isAboveTheFold}
  />
</div>
```

---

## 4. Key Mobile-First Components in this Codebase

### 1. Section Dividers (`FTSectionDivider.tsx`)
Must remain on a single horizontal row on modern viewports, but gracefully flex on narrow viewports:
- Left title group (`shrink-0` to prevent awkward font squishing).
- Middle stippled rule (`flex-1 ft-dotted-rule min-w-[16px]`).
- Right action link (`shrink-0 whitespace-nowrap`).
- Secondary English subtitle hides on small screens (`hidden md:inline`).

### 2. District Atlas & Directory (`DistrictMapCards.tsx`)
- **Mobile (< 768px):** Shows quick tab selector, compact district cards, or interactive district pills with swipeable badges.
- **Tablet / Desktop (≥ 768px):** Expands into side-by-side interactive SVG map with geographic profile inspector.

### 3. Lead Hero & Top Stories (`FTLeadHero.tsx`, `FTTopStories.tsx`)
- **Mobile:** 1 primary lead story card, followed by a clean vertical list of top stories.
- **Desktop:** Multi-tier broadsheet grid (Lead center, opinion left column, quick updates right column).

### 4. Data & Admin Tables (`src/app/admin/articles/page.tsx`)
- Container uses `overflow-x-auto` to allow horizontal scrolling on phones.
- Non-critical columns hidden on small devices:
  ```tsx
  <th className="hidden md:table-cell">लेखक</th>
  <th className="hidden lg:table-cell">श्रेणी</th>
  <th className="hidden sm:table-cell">मिति</th>
  ```

---

## 5. Critical Mobile Pitfalls & Anti-Patterns

### ❌ 1. Fixed Pixel Widths
- **Bad:** `className="w-[450px]"` (blows out iPhone 390px viewport, causing horizontal scrollbar).
- **Good:** `className="w-full max-w-[450px]"`.

### ❌ 2. Forgetting `min-w-0` on Flex Children
- By default, flex items have `min-width: auto`. If a title inside a flex child is long, it will overflow the screen.
- **Fix:** Add `min-w-0` to the flex container or child with truncated text:
  ```tsx
  <div className="flex items-center gap-3">
    <div className="flex-1 min-w-0">
      <h4 className="truncate">{longTitle}</h4>
    </div>
  </div>
  ```

### ❌ 3. Tiny Touch Targets (< 44px)
- Interactive buttons, filter pills, pagination, and dropdowns on mobile must have at least 44×44px tap targets or ample padding:
  ```tsx
  // Bad:
  <button className="p-0.5 text-[10px]">Close</button>
  // Good:
  <button className="p-2 sm:p-2.5 text-xs min-h-[44px] min-w-[44px] flex items-center justify-center">
  ```

### ❌ 4. Hardcoded Heights on Text Containers
- Never use `h-24` or `h-32` on containers holding Devanagari text. If the font size scales or wraps to 3 lines, text will overflow or get cut off.
- **Good:** Use `min-h-[...]` or natural flex/padding boundaries with `line-clamp-2` or `line-clamp-3`.

### ❌ 5. Forced Uppercase
- **Strict Project Rule:** Do NOT use `uppercase` or `text-transform: uppercase`. All text must use natural Title Case, Sentence Case, or native Devanagari script.

---

## 6. Mobile-First QA Checklist

Before committing any component or page change, test against this checklist:

- [ ] **360px Test:** Emulate 360×740 (Samsung Galaxy S8+) in Chrome DevTools. Does the page scroll horizontally? (Zero horizontal scroll allowed).
- [ ] **390px Test:** Emulate 390×844 (iPhone 12/13/14). Are buttons, inputs, and tabs easily tappable with one thumb?
- [ ] **768px Test:** Emulate iPad Mini portrait. Does layout gracefully shift from 1 column to 2 columns?
- [ ] **1024px+ Test:** Desktop view check. Are container max-widths respected (`max-w-[1360px]`)?
- [ ] **Nepali Font Rendering:** Are Matras (्, ो, ै, ौ, ृ, ्र) intact without clipping at tops or bottoms?
- [ ] **No All-Caps:** Ensure no `uppercase` Tailwind utility exists.
- [ ] **Build Check:** Run `npx tsc --noEmit` to confirm no TypeScript compile errors.
