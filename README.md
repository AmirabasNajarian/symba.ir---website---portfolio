# SYMBA Corporate Website — Frontend Portfolio

A public-facing frontend snapshot of the bilingual SYMBA corporate website, prepared as an IT and web development portfolio project.

**Production website:** [symba.ir](https://symba.ir)

## Overview

The website presents engineering services, oilfield projects, company information, human capital and categorized media in English and Persian. This repository demonstrates the public interface and its client-side interactions.

## Features

- English and Persian layouts with right-to-left support.
- Responsive navigation with dropdown menus.
- Project tabs with direct links to individual categories.
- Categorized gallery and image lightbox.
- News photo carousel with playback and manual controls.
- Site-wide, section-based search with Persian text normalization.
- Interactive geographic presence map.
- Organizational chart viewer with zoom and drag controls.
- Branded company, human capital and contact sections.

## Technology

HTML, CSS and vanilla JavaScript. Public JSON data supports search and the map. No package installation, framework or database is needed to preview this snapshot.

## Run locally

Extract or clone the repository, open a terminal in its root directory and run:

```bash
python -m http.server 8000
```

On Windows, `py -m http.server 8000` is an alternative. Open **http://localhost:8000** for English or **http://localhost:8000/fa/** for Persian.

Use a local HTTP server instead of double-clicking HTML files: search and map data use `fetch`, and some navigation paths start at the website root.

## Repository structure

```text
index.html          English homepage
about.html          Company and human capital
contact.html        Contact interface (display-only)
gallery.html        Media gallery
fa/                 Persian pages and compatibility URLs
css/                Public stylesheets
js/                 Client-side interactions
data/               Public search index and geographic boundaries
tools/              Optional GitHub Pages export helper
```

## Public portfolio scope

This is a **frontend showcase**, not a production deployment backup. Contact and application inputs are disabled, and submissions do not reach a server. Search remains functional.

Server-side processing, administration, authentication, configuration, database access, uploaded resumes, personal documents and deployment instructions are excluded. Company images, fonts, videos and catalogs are referenced from their public production URLs rather than copied into this repository. An internet connection and availability of those public URLs are required for media.

The demo must not be uploaded over the production website. Future source imports should receive the same review; `.gitignore` is a convenience, not a guarantee against disclosure.

## Optional GitHub Pages preview

The original interface uses root-relative paths. To export a version for a project repository named `symba-website-portfolio`, run:

```bash
python tools/build_pages.py --base-path /symba-website-portfolio/ --output docs
```

Commit the generated `docs` folder, then select **Settings → Pages → Deploy from a branch → main → /docs**. Use your actual repository name in the command. This step is optional; the repository and production link are already usable as portfolio references.

## Ownership

SYMBA names, branding and media belong to their respective owners. No open-source reuse license is granted by this portfolio snapshot.
