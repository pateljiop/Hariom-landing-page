# Hariom Patel — Personal Developer Portfolio

A personal website for Hariom Patel: BCA student, developer, and independent builder. This is **not an agency website**. It focuses on real projects, experiments, the learning process, and direct links to inspect the work.

## Sections

- Personal introduction and illustrated developer workspace
- About / working principles
- Project showcase: Haryomix, Hariom AI, and the developer portfolio
- Interactive Build Atlas connecting projects to the questions and principles behind them
- Small interactive Build Lab with Focus, Explore, and Debug modes
- A transparent build/verify/improve workflow
- Notes connected to actual projects and repositories
- Direct contact and GitHub links

## Run locally

Open `index.html` in a browser or start a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customize

- Update personal copy, project descriptions, contact details and URLs in `index.html`
- Update design tokens, responsive layouts and visual treatments in `styles.css`
- Update mobile navigation, reading progress and Build Lab state transitions in `script.js`
- Keep project status honest. The project-card artwork is illustrative, not a screenshot or proof of a feature.
- The Build Lab is a local interaction. It does not call an AI API.

## Research and design principles

This pass was informed by a curated look at personal developer portfolio references and open-source examples, including:
- [emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios) — a large collection of real developer portfolios to study
- [yashovardhan/developer-portfolio](https://github.com/yashovardhan/developer-portfolio) — a lightweight interactive personal-site starter
- [Evavic44/portfolio-ideas](https://github.com/Evavic44/portfolio-ideas) — a curated directory of portfolio examples
- [GitHub developer portfolio topic](https://github.com/topics/developer-portfolio-website)
- [vaibhavmahindru/portfolio-v2.0](https://github.com/vaibhavmahindru/portfolio-v2.0) — interactive system graph, terminal and GitHub activity patterns (reference only)
- [hyeonsangjeon/Repolis](https://github.com/hyeonsangjeon/Repolis) — an unusual way to turn repository metadata into an explorable world (reference only)
- [utkarsh5026/me](https://github.com/utkarsh5026/me) — code-editor-style portfolio with Git history and project navigation (reference only)

The Build Atlas is an original, lightweight project map inspired by the broader idea of interactive project graphs: visitors select nodes to explore project intent, shared principles, and real links. The design emphasizes inspectable work, a clear personal point of view, honest project status, original CSS-built illustrations, responsive behavior, keyboard access, and reduced-motion support. It does not copy a complete site or proprietary visual assets.

## Validation status

Static source checks were performed after implementation for required sections, duplicate IDs, in-page anchors, asset links, and key interaction code. No live deployment, real-device browser session, automated accessibility audit, or Lighthouse/PageSpeed run has been completed. This is a working branch, not a claim of verified production readiness.
