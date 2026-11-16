# Hanish Pagadala engineering portfolio

React + TypeScript + Vite + Tailwind CSS. Includes 13 projects organized into four disciplines, ongoing-work filtering, expandable contributions, an interactive wing concept, persisted light/dark themes, mobile navigation, email copying, and a Visualize navigation link opening a full-page animated mind map at #visualize. Hanish is at the center of six branches: four project disciplines, experience and growth, and hobbies/passions. Hover or keyboard-focus a bubble for a short summary; select it to expand its satellites, then choose a project or interest for details. The center and breadcrumb return to the full map. Motion can be paused and respects reduced-motion preferences. The page works with browser Back/Forward and direct hash links without requiring server routes.

## Run locally

Use Node.js 22.12+ and npm:

```powershell
npm ci
npm run dev
```

If another Vite project is already running, use the URL printed for this project. This completed version was previewed at port 5174, independently of the original project at port 5173.

```powershell
npm run build
npm run lint
npm run preview
```

## Content

- `src/projects.ts`: project descriptions, categories, technologies, contributions, and ongoing status.
- `src/App.tsx`: biography, experience, social links, and email.
- `src/Drawing.tsx`: original conceptual SVG illustrations, not photographs or engineering simulations.
- `public/resume.html`: printable résumé containing only the approved contact email and public social profiles. Use browser Print / Save as PDF; original résumé PDFs are deliberately excluded because they contain other contact details.
- `build-resume.cjs`: regenerate the printable résumé after changing project content by running `node build-resume.cjs` from this directory. Experience and biography in the generator should be kept synchronized with the main page.

The three user-confirmed ongoing projects are labeled Work in progress. Academic work, competition builds, hackathon prototypes, and personal demonstrations have distinct context labels; dates alone are not used as evidence of completion.

CMHC is described as an analyst internship in Fall 2026 because supplied résumés differ on exact title and start month. No disputed month, future completed placement, GPA, unsupported performance metric, phone number, or street address is published. The chess robot and hand-tracking project are excluded. The interactive wing sweep ranges from 0 to 45 degrees.

## Move into the original project

The supplied `portfolio-update.zip` contains only the changed source, résumé page, and documentation. Extract it into `C:\Personal\Projects\hanishPagadala.github.io`, allowing replacement of matching files. This preserves the existing Git history, package configuration, and other files. Refresh the original Vite server after extraction.

The separate `portfolio-source.zip` includes a full clean source project, excluding dependencies, Git history, source résumés, and build output. Extract to a directory, run `npm ci`, then `npm run dev`.

## GitHub Pages

The repository `hanishPagadala.github.io` uses Vite's default `/` base. The included `.github/workflows/deploy.yml` is manual only. Nothing has been pushed or published.

When ready, push reviewed changes, set repository Settings → Pages → Source to GitHub Actions, and manually run Deploy portfolio to GitHub Pages. The workflow installs dependencies, builds, and deploys `dist/`.

Project cards use a consistent illustration-free layout with discipline accents, readable typography, subtle hover treatment, and expandable contributions. The interactive wing remains in the hero; project illustrations are omitted.


Color and motion: Polish.css provides shared indigo/teal neutral-surface tokens for both themes, restrained warm accents, reduced-motion-aware scroll entrances and detail transitions. Run node check-colors.cjs for the text/surface palette contrast check (not a full accessibility audit).


Project details expand inline with smooth height transitions. Cards align independently at the top of each row, so opening one does not stretch its neighbor. There are no project overlays or focus changes.


Design references reviewed: https://brittanychiang.com/ (content hierarchy), https://rauno.me/ (interaction craft and restraint), and https://bruno-simon.com/ (personal exploration). Adaptations include active section navigation, reading progress, suggested project entry points with inline detail navigation, sticky category labels, editorial type hierarchy, and an invitation into the existing mind map. No reference-site assets or code were copied.


Control visibility: Controls.css gives the résumé a prominent secondary action, makes suggested projects clearly clickable, strengthens filter borders and selected states, increases touch targets, and applies consistent focus/hover cues in both themes.


Resume presentation now follows the supplied ARA Robotics reference: centered name/contact line, uppercase section headings with thin blue rules, right-aligned dates, and concise bullets. It uses selected projects plus a WIP summary; the complete collection remains on the portfolio. Only the approved email and public social links appear. Visible controls use reduced padding while retaining clear borders and touch target sizing.


Content focus: three featured engineering stories (Robowars, hovercraft, News Sharing Protocol), three WIP projects in a compact workbench, and seven additional projects in an optional filtered archive. Removed project counters, side navigation, repeated starting-point links, and automatic scroll entrances. Continuous mind-map motion now defaults off but remains available. Supporting links are taken from supplied resume annotations; current external availability was not verified. CMHC remains broadly described because supplied titles/start dates differ. No project outcomes or media were invented.


Additional projects are permanently visible, with discipline filters. Only individual project contribution details collapse. Filter changes use a brief staggered entrance, with subtle hover and inline-detail transitions; reduced-motion disables these effects.


Mind-map refinement: instructions and the back-to-branches control now occupy a separate footer below the canvas, so nodes cannot cover them. The center is smaller, satellite labels are clearer, connections use balanced curves, the fifth satellite has more clearance, and node/detail styling is quieter and more consistent.


Mind-map ambient background: low-opacity indigo/teal radial fields drift over 32–38 seconds. Pause motion freezes the flow; reduced-motion preferences keep it static. The hub and wire paths remain steady so continuous movement stays in the background.


The hero now uses the supplied portrait (public/hanish-portrait.jpeg) in a responsive frame. The original photo is unchanged; CSS handles composition and a gentle hover zoom. The aircraft illustration and sweep control have been removed from the introduction. The standalone preview embeds the portrait so it opens without a separate image file.

