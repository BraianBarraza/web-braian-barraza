# Project Documentation

Technical documentation for the Braian Barraza Web Portfolio.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Tree](#component-tree)
- [State Management](#state-management)
- [Styling & Theming](#styling--theming)
- [Data Layer](#data-layer)
- [Adding Content](#adding-content)
- [Task Kanban Board](#task-kanban-board)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

---

## Architecture Overview

The project follows a single-page application (SPA) pattern with React. All configuration lives in CSS (Tailwind v4 native) rather than JavaScript config files.

```
index.html
  └── src/main.jsx          (React root)
        └── App.jsx          (state & layout)
              ├── Header     (navigation)
              ├── Hero       (landing)
              ├── About      (skills)
              ├── Projects   (portfolio)
              ├── Contact    (form)
              └── Footer     (info & CV)
```

### Key Files

| File | Responsibility |
|------|---------------|
| `index.html` | HTML shell, meta tags, CDN imports (Boxicons) |
| `src/main.jsx` | React 19 root render with StrictMode |
| `src/App.jsx` | Global state, IntersectionObserver, layout |
| `src/input.css` | Tailwind v4 theme, dark mode variant, global styles |

---

## Component Tree

### `App.jsx` — Root Component

Manages all application-level state and passes it down via props.

**State:**

| State | Type | Purpose |
|-------|------|---------|
| `isMenuOpen` | `boolean` | Mobile menu visibility |
| `isScrolled` | `boolean` | Header background on scroll (>100px) |
| `isLight` | `boolean` | Theme mode (light/dark) |
| `activeSection` | `string` | Currently visible section ID |

**Effects:**

1. **Scroll listener** — toggles `isScrolled` based on `window.scrollY`
2. **Dark mode** — toggles `.dark` class on `<html>` element
3. **IntersectionObserver** — watches sections `home`, `about`, `projects`, `contact` and updates `activeSection`

### `Header.jsx` — Navigation

- Desktop: horizontal nav with animated underline indicator
- Mobile: hamburger menu with dropdown
- Theme toggle switch (light/dark)
- Closes on outside click (`mousedown`) and `Escape` key

**Nav Links:** Home (`#home`) · About (`#about`) · Projects (`#projects`) · Contact (`#contact`)

### `Hero.jsx` — Landing Section

- Introduction text and profile image
- Social media links (rendered from `src/data/socialLinks.js`)
- CTA button linking to `#contact`

### `About.jsx` — Skills Section

- Renders skill cards from `src/data/skills.js`
- Uses the reusable `Card` component
- Supports both list items (`items[]`) and paragraph text (`description`)

### `Projects.jsx` — Portfolio Section

- Renders project cards from Firestore
- Uses the reusable `Card` component
- Opens a full-screen project detail view when a project card is selected
- Demo/GitHub links render conditionally (only if URLs are provided)

### `Contact.jsx` — Contact Form

- Controlled form with `useState`
- On submit, opens `mailto:` with form data (name, email, message)
- Shows confirmation message after submission

### `Card.jsx` — Reusable Card

Shared visual wrapper for About and Projects cards.

```jsx
<Card className="custom-classes-here">
  {children}
</Card>
```

Base styles: `border border-primary shadow-xl shadow-[#5dadec3b] bg-white/70 dark:bg-transparent`

### `Footer.jsx` — Footer

- Logo and branding
- Contact info (email, phone)
- CV download link (URL-encoded path)
- Dynamic copyright year

---

## State Management

All state lives in `App.jsx` and flows down as props. There is no external state library — this is intentional given the project's scope.

```
App (state owner)
 ├─ Header  ← isMenuOpen, isScrolled, isLight, activeSection
 ├─ Hero    ← assetsBase
 ├─ About   ← assetsBase
 ├─ Projects← assetsBase
 ├─ Contact ← (no props, self-contained form state)
 └─ Footer  ← assetsBase
```

**`assetsBase`** is derived from `import.meta.env.BASE_URL` with trailing slash stripped. It prefixes all asset paths to support sub-directory deployments.

---

## Styling & Theming

### Tailwind CSS v4 Configuration

All theme configuration is in `src/input.css` using native v4 directives:

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #0872BF;
  --color-background: #141A1A;
  --font-sans: "Open Sans", sans-serif;
  --font-inter: "Inter", sans-serif;
  --font-montserrat: "Montserrat", sans-serif;
  --drop-shadow-3xl: 0 4px 20px rgba(93, 173, 236, 0.23);
}
```

### Dark Mode

- **Method:** class-based (`.dark` on `<html>`)
- **Default:** dark mode enabled on load
- **Toggle:** checkbox in Header that sets `isLight` state
- `App.jsx` syncs state to `document.documentElement.classList`

### Fonts

Loaded via Google Fonts CDN in `input.css`:
- **Open Sans** — default body font (`font-sans`)
- **Inter** — available via `font-inter`
- **Montserrat** — used for subtitles via `font-montserrat`

---

## Data Layer

Project content is managed from the admin panel and stored in Firestore.
Project images are uploaded to Firebase Storage.

### `skills.js`

```js
export const skills = [
  {
    title: "Category Name",
    image: "/img/icon.png",
    alt: "Alt text",
    items: ["Skill 1", "Skill 2"],     // renders as <ul>
    // OR
    description: "Paragraph text.",     // renders as <p>
  },
];
```

### `socialLinks.js`

```js
export const socialLinks = [
  {
    name: "Platform Name",
    url: "https://...",
    icon: "/icons/platform.svg",
  },
];
```

---

## Adding Content

### Add a New Project

1. Open the admin panel.
2. Create a project with this data shape:

```js
{
  title: "My New Project",
  imageUrl: "https://...", // generated after upload
  imagePath: "projects/my-project.png",
  description: "What this project does.",
  technologies: "React, Node.js",
  features: ["Responsive", "Dark mode"],
  demoUrl: "https://my-project.com",
  githubUrl: "https://github.com/user/repo",
}
```

### Add a New Skill Card

Add an entry to `src/data/skills.js` with either `items` (list) or `description` (paragraph).

### Add a Social Link

1. Place the SVG icon in `public/icons/`
2. Add an entry to `src/data/socialLinks.js`

---

## Task Kanban Board

The admin panel has a **Tareas** tab (next to **Proyectos**) with a per-client Kanban board for tracking bugs, features, chores, and organizational tasks across freelance projects, including a time log and a resolved-tasks history view.

### Where the code lives

| File | Responsibility |
|------|-----------------|
| `src/components/tasks/taskConstants.js` | The `status` and `type` enums, with labels/colors/icons |
| `src/components/tasks/taskUtils.js` | Pure logic: grouping, filtering, duration formatting, status-transition side effects. Unit tested. |
| `src/lib/tasks.js` | Firestore CRUD + realtime subscription for the `tasks` collection |
| `src/hooks/useTasks.js` | React hook wrapping the subscription |
| `src/components/tasks/TaskBoard.jsx` | Presentational board (columns, filters, history view, drag & drop) |
| `src/components/tasks/TaskCard.jsx` | Individual task card (badges, dates, timer, quick status move) |
| `src/components/tasks/TaskFormModal.jsx` | Create/edit form |
| `src/components/tasks/TasksPanel.jsx` | Wires `useTasks` + `src/lib/tasks.js` into `TaskBoard` |

`TaskBoard` never talks to Firestore directly — it receives `tasks` and callback props. That keeps it testable with plain mock data and reusable outside the admin panel if needed.

### Firestore schema — `tasks` collection

This is the schema an AI agent (or any script) should follow when creating or updating tickets directly in Firestore, so it stays consistent with what the UI reads and writes.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Short task title |
| `description` | string | no | Free text, defaults to `""` |
| `client` | string | yes | Client name. The UI derives its client filter/autocomplete from the distinct values already in use — reuse an existing client name exactly (case-sensitive) instead of inventing a new spelling |
| `projectId` | string \| null | no | Optional link to a document in the `projects` collection |
| `type` | `"bug"` \| `"feature"` \| `"chore"` \| `"organizational"` | yes | Exactly one of these four string values |
| `status` | `"pending"` \| `"in_progress"` \| `"resolved"` | yes | Kanban column |
| `receivedAt` | Timestamp | yes | When the ticket was received/logged |
| `startedAt` | Timestamp \| null | no | When work started |
| `completedAt` | Timestamp \| null | no | When work finished |
| `timeSpentMinutes` | number | yes | Total time logged, in minutes (e.g. `90` = 1h 30m) |
| `timerStartedAt` | Timestamp \| null | no | Set while a live stopwatch is running on the card; `null` otherwise |
| `createdAt` / `updatedAt` | Timestamp | yes | Bookkeeping, set by `src/lib/tasks.js` |

### Status-transition side effects

When a task's `status` changes, `src/components/tasks/taskUtils.js#applyStatusTransition` (used by `moveTaskStatus` in `src/lib/tasks.js`) applies these rules. An agent writing to Firestore directly should replicate them so the board stays coherent:

1. Moving into `in_progress` for the first time sets `startedAt` to now, **only if `startedAt` is still `null`**.
2. Moving into `resolved` sets `completedAt` to now (if not already set) and, if a timer is running (`timerStartedAt` is set), stops it — adding the elapsed time to `timeSpentMinutes` and clearing `timerStartedAt`.
3. Moving a task **away** from `resolved` clears `completedAt` back to `null`.

### Time tracking

Two ways to log time, both writing to the same `timeSpentMinutes` field:

- **Manual**: set `timeSpentMinutes` directly (e.g. when an AI agent already knows how long a task took).
- **Stopwatch**: the card's play/pause button sets `timerStartedAt` on start, and on stop computes the elapsed minutes and adds them to `timeSpentMinutes`, clearing `timerStartedAt`.

### Firestore security rules

Rules aren't checked into this repo (they're managed in the Firebase console), but the `tasks` collection should follow the same access pattern already used for `projects`: public read (the admin panel is the only consumer today, but keep it simple) and writes restricted to authenticated users, e.g.:

```
match /tasks/{taskId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

Apply this via the Firebase console → Firestore Database → Rules.

---

## Testing

The project uses [Vitest](https://vitest.dev) with [Testing Library](https://testing-library.com) for React components.

```bash
npm test         # run the suite once
npm run test:watch   # watch mode
```

Tests live next to the code they cover (`*.test.js` / `*.test.jsx`). `src/components/tasks/taskUtils.test.js` covers the pure Kanban logic (status transitions, filtering, duration formatting) and `src/components/tasks/TaskBoard.test.jsx` is a component smoke test using mock tasks — neither touches Firestore, since `TaskBoard` receives data via props instead of fetching it itself.

### Visual preview without Firebase credentials

`preview-kanban.html` + `src/dev-preview-kanban.jsx` are a second, standalone Vite entry point that mounts the Kanban board with in-memory mock data instead of Firestore, bypassing the login flow entirely. `vite build` never picks it up (only `index.html` is a build entry), so it's only reachable through the dev server. Use it to eyeball layout or interaction changes when you don't have (or don't want to use) real Firebase credentials:

```bash
npm run dev
# open http://localhost:5173/preview-kanban.html
```

---

## Build & Deployment

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

### Deployment

The `dist/` folder is a static site that can be deployed to any hosting provider:

- **GitHub Pages** — push `dist/` to `gh-pages` branch
- **Netlify / Vercel** — connect repo, set build command to `npm run build` and output to `dist`

### Environment

If deploying to a subdirectory (e.g., `https://user.github.io/repo/`), set the `base` option in `vite.config.js`:

```js
export default defineConfig({
  base: "/repo/",
  plugins: [react()],
});
```

All asset paths will automatically adjust via `assetsBase`.
