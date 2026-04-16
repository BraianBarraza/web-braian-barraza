# Braian Barraza - Web Portfolio

A modern, responsive portfolio website built with **React 19**, **Vite 7**, and **Tailwind CSS 4**. Features dark/light theme switching, smooth scroll navigation, and a component-based architecture.

**[Live Page](https://braianbarraza.com)** · **[Report Bug](https://github.com/BraianBarraza/web-braian-barraza/issues)**

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI library |
| Vite | 7.1.4 | Build tool & dev server |
| Tailwind CSS | 4.1.12 | Utility-first styling |
| PostCSS | 8.5.6 | CSS processing |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
git clone https://github.com/BraianBarraza/web-braian-barraza.git
cd web-braian-barraza
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Production Build

```bash
npm run build
npm run preview
```

Output is generated in the `dist/` directory.

## Project Structure

```
src/
├── main.jsx               # App entry point
├── App.jsx                # Root component & state management
├── input.css              # Tailwind v4 config & global styles
├── data/
│   ├── projects.js        # Portfolio projects
│   ├── skills.js          # Skills & expertise
│   └── socialLinks.js     # Social media links
└── components/
    ├── Header.jsx         # Navigation & theme toggle
    ├── Hero.jsx           # Landing section
    ├── About.jsx          # Skills showcase
    ├── Projects.jsx       # Project cards
    ├── Contact.jsx        # Contact form
    ├── Card.jsx           # Reusable card component
    └── Footer.jsx         # Footer with contact info
```

> For detailed architecture documentation, see [DOCS.md](./DOCS.md).

## Features

- **Dark / Light Theme** — class-based toggle with persistent UI state
- **Responsive Design** — mobile-first layout with hamburger menu
- **Smooth Scroll Navigation** — animated section indicator in header
- **Intersection Observer** — auto-highlights active nav section on scroll
- **Data-Driven Content** — projects, skills, and links managed from `src/data/`
- **Lazy Loading** — deferred image loading for better performance
- **SEO Ready** — Open Graph meta tags included

## Contact

**Braian Barraza** — Web Developer

- Email: Braian_019@hotmail.com
- LinkedIn: [braian-barraza-bengal](https://www.linkedin.com/in/braian-barraza-bengal-8071a322b/)
- GitHub: [BraianBarraza](https://github.com/BraianBarraza)

## License

This project is for personal/portfolio use. All rights reserved.
