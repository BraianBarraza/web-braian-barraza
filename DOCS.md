# Project Documentation

Technical documentation for the Braian Barraza Web Portfolio.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Tree](#component-tree)
- [State Management](#state-management)
- [Styling & Theming](#styling--theming)
- [Data Layer](#data-layer)
- [Adding Content](#adding-content)
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

- Renders project cards from `src/data/projects.js`
- Uses the reusable `Card` component
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

Content is separated from components in `src/data/`:

### `projects.js`

```js
export const projects = [
  {
    title: "Project Name",
    image: "/img/screenshot.png",   // path relative to public/
    alt: "Alt text for image",
    description: "Project description.",
    technologies: "HTML, CSS, React",
    features: ["Feature 1", "Feature 2"],
    demoUrl: "https://..." | null,   // null = link hidden
    githubUrl: "https://..." | null,
  },
];
```

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

1. Place the screenshot in `public/img/`
2. Add an entry to `src/data/projects.js`:

```js
{
  title: "My New Project",
  image: "/img/my-project.png",
  alt: "My New Project screenshot",
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
