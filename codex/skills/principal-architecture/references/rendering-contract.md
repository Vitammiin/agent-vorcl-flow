# Rendering contract

- `ARCHITECTURE.md` is generated first and is the primary narrative.
- `architecture.html` is self-contained, contains no remote assets, embeds the exact JSON model, includes an accessible inline SVG overview (`title`, `desc`, `aria-labelledby`), supports search/filter/evidence inspection, and has print CSS.
- `architecture.drawio` is native multi-page `mxfile` XML with deterministic page-scoped IDs, valid source/target edges, 10px grid, non-overlapping nodes, zones, orthogonal routing, jump arcs, fanned ports, semantic colors, and `file:line` labels.
- `mermaid/*.mmd` are copyable source files. Render them with pinned/self-hosted `mmdc`; never upload private diagrams to public render services.
- `architecture.pdf` is printed from HTML with Chrome/Chromium/Edge when available. Otherwise the zero-dependency built-in renderer creates a readable text-first PDF; reopen/render it for visual QA when Poppler exists.

Adaptive levels and visual budgets:

- up to 40 nodes: L0 context and one detailed L1;
- 41-150: L0/L1, L2 by detected domain/layer, L4 when deployment exists;
- over 150: aggregated L1, separate L2 pages, proven critical-flow L3, deployment L4;
- cap each detailed draw.io page at 24 nodes by default and split a layer into numbered pages above the ceiling;
- keep L0 aggregated; do not shrink typography to force a large system onto one page;
- use `architecture.config.json > diagram.maxNodesPerPage` to tune the ceiling from 8 through 40;
- route edges before rendering nodes, keep labels on opaque backgrounds, and use dashed connectors only for proven async/optional flows.

Default visual language is restrained editorial dark: clean graphite background, semantic layer accents, square-to-small-radius cards, no glow and no shadows. Green clients, blue application/API, orange data/events, purple AI/MCP, red security/critical infra, gray external systems. Label important protocols/interactions. Use solid sync and dashed async edges where the model proves the distinction.
