# Choices theme

Everything the Choices design system contributes to this site lives in this one
folder. Delete `theme/` and the project loses every design token, every
component class and the webfonts in a single step — nothing outside this folder
defines a design-system value.

Imported from the **Choices Design System** project on claude.ai/design
(`5c243588-8c26-487e-b166-d6755cc8b87c`).

## Layout

```
theme/
├── index.css               single CSS entry point
├── fonts.ts                next/font loaders for the two families
├── components.css          base element defaults + .ds-button / .ds-icon
└── tokens/
    ├── fig-tokens.css      raw Figma variables (the literal source values)
    └── theme.css           the @theme block Tailwind reads
```

## How it is wired

Two lines, both outside this folder, connect it to the app:

```css
/* app/globals.css */
@import 'tailwindcss';
@import '../theme/index.css';
```

```tsx
/* app/layout.tsx */
import { fontVariables } from '@/theme/fonts';
<html lang="en" className={fontVariables}>
```

Removing the folder means removing those two lines too. Nothing else references
it.

## Tokens are Tailwind utilities

`tokens/theme.css` is a Tailwind v4 `@theme` block, so every token in it becomes
a utility class — no `tailwind.config.js` involved:

| Token | Utilities it generates |
| --- | --- |
| `--color-brand-purple` | `bg-brand-purple`, `text-brand-purple`, `border-brand-purple` |
| `--color-brand-peach` | `bg-brand-peach`, `text-brand-peach`, and `/60` opacity variants |
| `--color-surface-peach` | `bg-surface-peach` — the alternating section band |
| `--color-ink` | `text-ink`, plus `text-ink/75` for the body copy grey |
| `--radius-xl`, `--radius-pill` | `rounded-xl`, `rounded-pill` |
| `--shadow-card`, `--shadow-step` | `shadow-card`, `shadow-step` |
| `--font-body`, `--font-button` | `font-body`, `font-button` |
| `--ease-reveal` | `ease-reveal` on transitions |

Write new work against those. The `fig-*` variables in `tokens/fig-tokens.css`
stay as the literal Figma source — treat them as the layer the semantic tokens
are built on rather than values to reach for in markup.

## Component classes

A handful of things are worth a class rather than a utility run. Everything else
on the site is plain Tailwind in the JSX.

```tsx
<a className="ds-button" href="#">List your business</a>
<a className="ds-button ds-button-outline ds-button-block" href="#">Talk to us</a>

<div className="ds-icon-well">
  <Icon name="markerPin" size="sm" />
</div>
```

`.ds-button` maps to the Figma Button component and its `property1` variants
(`ds-button-outline`, `ds-button-ghost`), with `ds-button-sm` and
`ds-button-block` for sizing. `.ds-icon` handles icon size, colour and stroke;
the icon shapes themselves are in `components/Icon.tsx`, drawn with
`currentColor` so the surrounding text colour sets them.

## Fonts

The Figma file specifies Grift for display/body and Trueno for buttons. No font
files exist for either — Grift is a paid font, Trueno has no reliable free
source — so the design system permanently substitutes **Plus Jakarta Sans** for
display and body and **Montserrat** for buttons.

`fonts.ts` loads both through `next/font/google`, which self-hosts them at build
time: no render-blocking request to Google, no layout shift. Each exposes a CSS
variable (`--font-jakarta`, `--font-montserrat`) that the font tokens point at.
