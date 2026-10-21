# Hariom Patel — Personal Developer Portfolio

A personal website for Hariom Patel: BCA student, developer, and independent builder. This is **not an agency website**. It focuses on real projects, experiments, the learning process, and direct links to inspect the work.

## Sections

- Personal introduction and illustrated developer workspace
- About / working principles
- Project showcase: Haryomix, Hariom AI, and the developer portfolio
- Interactive Build Atlas connecting projects to the questions and principles behind them
- Shareable Builder DNA mini-quiz with three archetypes, reproducible result links, and no backend
- Build Quest: a three-decision product-reliability scenario with trade-off explanations and a copyable local decision trail
- Visitor-specific three-stop portfolio routes for recruiters, developers and curious explorers, inspired by the reference portfolio profile selector
- Landing Studio with 16 selectable art directions, a live interactive preview and links back to real project content
- Quick Jump command palette with searchable section navigation using Ctrl/⌘ + K
- Project Autopsy case studies: problem, design choice, evidence, and limitations
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
- Builder DNA is a playful self-reflection quiz, not a validated personality assessment; result links use the `?dna=` query parameter
- Build Quest is a fictional decision simulator, not a scored engineering assessment; choices stay in the browser
- Keep Project Autopsy evidence current; do not publish unverified results, fabricated metrics, or claims about unfinished features
- Update design tokens, responsive layouts and visual treatments in `styles.css`
- Update mobile navigation, reading progress, Build Lab, Builder DNA, Build Quest, Quick Jump, visitor routes and Landing Studio template selection in `script.js`
- Keep project status honest. The project-card artwork is illustrative, not a screenshot or proof of a feature.
- The Build Lab is a local interaction. It does not call an AI API.

## Research and design principles

This pass was informed by a curated look at personal developer portfolio references and open-source examples, including:
- [emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios) — a large collection of real developer portfolios to study
- [yashovardhan/developer-portfolio](https://github.com/yashovardhan/developer-portfolio) — a lightweight interactive personal-site starter
- [Evavic44/portfolio-ideas](https://github.com/Evavic44/portfolio-ideas) — a curated directory of portfolio examples
- [GitHub developer portfolio topic](https://github.com/topics/developer-portfolio-website)
- [JasonStys/portfolio-case-study-site](https://github.com/JasonStys/portfolio-case-study-site) — evidence-first case studies, verification, and explicit limitations
- [zkblk/case-study-forge](https://github.com/zkblk/case-study-forge) — case-study structure that discourages invented metrics
- [vaibhavmahindru/portfolio-v2.0](https://github.com/vaibhavmahindru/portfolio-v2.0) — interactive system graph, terminal and GitHub activity patterns (reference only)
- [hyeonsangjeon/Repolis](https://github.com/hyeonsangjeon/Repolis) — an unusual way to turn repository metadata into an explorable world (reference only)
- [utkarsh5026/me](https://github.com/utkarsh5026/me) — code-editor-style portfolio with Git history and project navigation (reference only)

The Build Atlas is an original, lightweight project map inspired by the broader idea of interactive project graphs: visitors select nodes to explore project intent, shared principles, and real links. Project Autopsy follows evidence-first case-study patterns found in engineering portfolios: problem, decision, verification, and limitations. Both features are lightweight and use native HTML/CSS/JavaScript; neither fabricates live data. Builder DNA adds a three-question quiz and a reproducible share URL, without collecting answers or sending them to a server. The design emphasizes inspectable work, a clear personal point of view, honest project status, original CSS-built illustrations, responsive behavior, keyboard access, and reduced-motion support. It does not copy a complete site or proprietary visual assets.

## Validation status

Static source checks were performed after implementation for required sections, duplicate IDs, in-page anchors, asset links, and key interaction code. No live deployment, real-device browser session, automated accessibility audit, or Lighthouse/PageSpeed run has been completed. This is a working branch, not a claim of verified production readiness.
