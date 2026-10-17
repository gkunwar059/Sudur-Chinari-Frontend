---
description: Enforce mobile-first responsive Tailwind CSS design practices across all components
globs: ["src/**/*.{tsx,jsx,ts,js,css}"]
---

# Mobile-First Tailwind CSS Standards

1. **Mobile-First Mindset**: Always specify base styles for mobile (0px+) without prefixes (`p-4`, `grid-cols-1`, `flex-col`, `text-sm`). Layer breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) only to progressively enhance for larger screens.
2. **No Fixed Pixel Widths**: Never use hardcoded pixel widths (`w-[500px]`) that can exceed mobile screen widths (360px–390px). Always use `w-full max-w-[500px]`.
3. **Flex Shrink & Overflow**: Always apply `min-w-0` to flex child containers wrapping titles or text with `truncate` or `line-clamp` to prevent container blowout on mobile.
4. **Touch Targets**: Buttons, icons, and interactive elements must have minimum 40-44px touch targets or sufficient padding for tap accessibility on touch screens.
5. **No Uppercase**: Do not use `uppercase` or `text-transform: uppercase`. Use natural Title Case or Sentence Case for English and standard Devanagari for Nepali.
6. **Reference**: See [RESPONSIVE_MOBILE_FIRST_TAILWIND.md](file:///home/jeevan/DEV/news/RESPONSIVE_MOBILE_FIRST_TAILWIND.md) for full architecture and component guidelines.
