# Scroll-Driven Hero Animation

A scroll-driven hero section inspired by the given reference, built with Next.js, Tailwind CSS and GSAP ScrollTrigger.

**Live demo:** https://kanishka-trivedi.github.io/scroll-hero/

## Features
- Pinned full-screen hero; the car, green trail, headline and stat cards are driven by a single scroll value, so they always stay in sync
- Headline letters reveal as the car passes; stat cards appear with count-up numbers
- Extras: cinematic intro, lane-dash parallax, headlights, speed streaks, drifting background text, floating dots, cursor spotlight, 3D card tilt, finish-line confetti
- Transform and opacity only, with no layout reads while scrolling
- Responsive, with a reduced-motion fallback

## Tech stack
Next.js (static export), React, Tailwind CSS, GSAP + ScrollTrigger, deployed with GitHub Actions to GitHub Pages.

## Run locally
```bash
npm install
npm run dev
```

## Credits
Car image (McLaren 720S top view) is taken from the reference project.
