# Design rules

How to build a page that looks like the rest of CROUStillant. Read this before adding a page or a new section. If something you need isn't covered here, copy it from an existing page and keep it consistent with the rules below.

---

## 1. Page skeleton

Every standard page uses `PageContainer` and `PageHeader` from [`src/components/page-layout.tsx`](src/components/page-layout.tsx). Don't rebuild the header by hand.

```tsx
import { PageContainer, PageHeader } from "@/components/page-layout";

export default async function MyPage() {
  const t = await getTranslations("MyPage");

  return (
    <PageContainer>
      <PageHeader
        title={t("title")}            // the page's only <h1>
        badge={t("subtitle")}         // optional: short tagline in a pill
        description={t("intro")}      // optional: a sentence or two
        actions={<>…buttons…</>}      // optional
        aside={<>…map, image…</>}     // optional: right column on large screens
      />

      <div className="space-y-12">
        {/* sections */}
      </div>
    </PageContainer>
  );
}
```

- `PageContainer` sets the gutters (`px-4`), the top/bottom spacing and an 8-unit gap between the header and the content. Don't add your own `mt-4 px-4 pb-20` wrapper.
- The header goes first and is rendered on the server. **Never** fade in the page or its header from `opacity: 0`, because the title would stay hidden until hydration (see the comment in `home-hero.tsx`).
- Every route also needs `generateMetadata` built with `buildPageMetadata()` and a `loading.tsx` that re-exports `@/components/page-loading`. The exception is a segment that calls `notFound()` or `redirect()`, which must not have a `loading.tsx` (see the comment in `about/loading.tsx`).

### Pages that are allowed to differ

| Page | Why |
|---|---|
| Home (`/`) | It's the landing page, so it gets the larger hero and `rounded-[3rem]` blocks. Don't copy them elsewhere. |
| Restaurant (`/restaurants/[slug]`) | The header is the restaurant photo. |
| Screen mode (`…/screen`) | Kiosk display with no site chrome. |
| `too-many-requests`, root `not-found` | They render outside the normal layout and must stay self-contained. |

Everything else follows this document.

---

## 2. Colour

**Use theme tokens only:** `background`, `foreground`, `card`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `border`, `destructive`, plus opacity steps (`primary/5`, `/10`, `/20`).

The seasonal themes (Christmas, Halloween…) and the high-contrast mode work by swapping these tokens. A hard-coded colour doesn't follow them, so it will look wrong part of the year or be unreadable for someone.

- ❌ `text-gray-500`, `bg-white`, `#d946ef`, `bg-blue-500/10` on a header or card.
- ✅ `text-muted-foreground`, `bg-card/50`, `hsl(var(--primary))`.
- In charts, use `hsl(var(--primary))` and `hsl(var(--chart-1…5))`.

Allowed exceptions, kept **small** (an icon, a badge, never a card, header or page background):
- **Status:** green for success/"open", amber for warning/beta, `destructive` for errors.
- **Third-party brands:** the Android green or the Apple blue on the platform icon itself.

---

## 3. Building blocks

Copy these class strings exactly. When the same block appears three times or more, extract a component.

### Surface card (the default container for content)

```
rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs
```
Padding: `p-4 sm:p-8` for content sections, `p-6` for compact cards in a grid. With shadcn's `<Card>`, pass the same classes.

### Data card (tables, charts, long text)

A surface card with a header:

```tsx
<Card className="…surface card…">
  <CardHeader className="border-b border-primary/5 pb-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0"><Icon className="w-6 h-6" /></div>
      <div className="min-w-0">
        <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary wrap-break-word">…</CardTitle>
        <CardDescription className="text-sm sm:text-base font-medium">…</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-6">…</CardContent>
</Card>
```

### Inner item (a row or tile inside a surface card)

```
p-4 rounded-2xl bg-background/50 border border-border/20 hover:bg-background transition-all
```

### Icon tile

```
p-3 rounded-2xl bg-primary/10 text-primary shrink-0      → icon h-6 w-6 (or h-5 w-5 in compact cards)
```
One style only: no neutral `bg-background border` tiles.

### Pill

Use `<Pill>` from `page-layout.tsx` for short labels and taglines. For a clickable chip (e.g. section links), use `rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/10 hover:bg-primary/10`.

### Buttons

Always use `<Button>`. For a link, use `<Button asChild><Link …/></Button>`. **Never** put `<Link>` around `<Button>`: that renders a `<button>` inside an `<a>`, which is invalid and gets focused twice.

| Role | Classes |
|---|---|
| Primary call to action | `<Button size="lg" className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20">` |
| Secondary | `<Button size="lg" variant="outline" className="rounded-2xl px-8 font-bold">` |
| Tertiary / back | `<Button size="lg" variant="ghost" className="rounded-2xl font-bold text-muted-foreground hover:text-foreground">` |
| Inline text link | `font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary` + `ArrowRight` that moves `translate-x-1` on hover |

At most one primary button per block.

### Inputs

Search fields: `h-12 rounded-2xl bg-muted/30 border-primary/5 pl-11` with a `Search` icon at `left-4`. Select triggers: `h-12 rounded-2xl`.

---

## 4. Typography

| Element | Classes |
|---|---|
| `h1` | Only in `PageHeader`. Never write one yourself. |
| `h2`: section title | `text-2xl sm:text-3xl font-bold tracking-tight text-foreground` |
| `h2`: label above a grid of small cards | `text-xl font-bold tracking-tight` |
| Data card title | see *Data card* above (`font-black uppercase text-primary`) |
| `h3` inside a card | `text-xl font-bold text-foreground` |
| Intro paragraph in a card | `text-lg text-muted-foreground leading-relaxed` |
| Secondary text | `text-sm text-muted-foreground` |

- Don't skip heading levels (no `h3` directly under the `h1`).
- Add `wrap-break-word` on titles: French words get long on a 360 px screen.
- All text comes from `messages/fr.json` **and** `messages/en.json`. Never hard-code strings.

---

## 5. Spacing and shape

- Between major sections: `space-y-12`. Inside a grid of cards: `gap-6` (`gap-4` for small tiles).
- Grids collapse to one column on mobile: `grid-cols-1 md:grid-cols-2` (or `sm:` / `xl:` steps).
- Radius: `rounded-2xl` for cards, buttons and inputs, `rounded-xl` for small elements inside them, `rounded-full` for pills and avatars.
- Decoration (blurred blobs, large faint icons) lives only in `PageHeader` and in the home page.

---

## 6. Motion

- Content below the fold may animate in with `whileInView` (`opacity 0 → 1`, `y 20–32 → 0`, ~0.5 s, `once: true`). Import from `@/lib/motion`.
- Content above the fold (the header, the first cards) is not animated in.
- Hover effects stay subtle: colour or border change, `translate-x-1` on arrows, `scale-110` on icon tiles at most.
- Reduced-motion users are handled globally in `globals.css`. Don't add animations outside CSS/motion that would bypass it.

---

## 7. Checklist before opening a PR

- [ ] `PageContainer` + `PageHeader`, one `<h1>`.
- [ ] No hard-coded colours (grep your diff for `gray-`, `white`, `black`, `#`).
- [ ] No `<Link>` wrapping a `<Button>`.
- [ ] Checked in **light, dark and high-contrast** (Settings → Accessibility), at **360 px** and on desktop.
- [ ] Strings in both `fr.json` and `en.json`.
- [ ] `generateMetadata` via `buildPageMetadata`, `loading.tsx` if the segment never calls `notFound()`/`redirect()`.
- [ ] `npm run lint` and `npm test` pass.
