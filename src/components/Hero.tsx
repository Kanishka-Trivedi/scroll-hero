// 'use client';

// import React, { useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';
// import { StatCard } from './StatCard';

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger);
// }

// const statsList = [
//   {
//     percentage: 58,
//     label: 'Increase in pick up point use',
//     bgColor: '#dff64d',
//     textColor: '#111111',
//     cardClass: 'stat-card-a',
//   },
//   {
//     percentage: 27,
//     label: 'Increase in pick up point use',
//     bgColor: '#333333',
//     textColor: '#ffffff',
//     cardClass: 'stat-card-b',
//   },
//   {
//     percentage: 23,
//     label: 'Decreased in customer phone calls',
//     bgColor: '#6cc9ff',
//     textColor: '#111111',
//     cardClass: 'stat-card-c',
//   },
//   {
//     percentage: 40,
//     label: 'Decreased in customer phone calls',
//     bgColor: '#f97324',
//     textColor: '#111111',
//     cardClass: 'stat-card-d',
//   },
// ];

// const welcomeText = 'WELCOME ITZFIZZ';

// const getAssetUrl = (path: string) => {
//   const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
//   const cleanPath = path.startsWith('/') ? path : `/${path}`;
//   return `${basePath}${cleanPath}`;
// };

// export const Hero: React.FC = () => {
//   const heroRef = useRef<HTMLDivElement>(null);
//   const roadRef = useRef<HTMLDivElement>(null);
//   const carRef = useRef<HTMLDivElement>(null);
//   const trailRef = useRef<HTMLDivElement>(null);
//   const lettersRowRef = useRef<HTMLHeadingElement>(null);
//   const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

//   useGSAP(
//     () => {
//       const hero = heroRef.current;
//       const road = roadRef.current;
//       const car = carRef.current;
//       const trail = trailRef.current;
//       const lettersRow = lettersRowRef.current;

//       if (!hero || !car || !trail || !road || !lettersRow) return;

//       const mm = gsap.matchMedia();

//       mm.add(
//         {
//           isDesktop: '(min-width: 769px)',
//           isMobile: '(max-width: 768px)',
//           reduceMotion: '(prefers-reduced-motion: reduce)',
//         },
//         (context) => {
//           const { reduceMotion } = context.conditions as {
//             isDesktop: boolean;
//             isMobile: boolean;
//             reduceMotion: boolean;
//           };

//           const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

//           if (reduceMotion) {
//             gsap.set(trail, { scaleX: 1 });
//             gsap.set(car, { x: window.innerWidth * 0.8 });
//             letters.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
//             gsap.set('.stat', { opacity: 1, y: 0 });
//             return;
//           }

//           // 1. Initial Load Animation for Stats
//           const loadTl = gsap.timeline({ ease: 'power3.out' });
//           loadTl.fromTo(hero, { opacity: 0 }, { opacity: 1, duration: 0.6 });

//           const statElements = gsap.utils.toArray<HTMLElement>('.stat');
//           loadTl.fromTo(
//             statElements,
//             { opacity: 0, y: 40 },
//             {
//               opacity: 1,
//               y: 0,
//               duration: 0.9,
//               stagger: 0.18,
//               delay: 0.2,
//               onStart: () => {
//                 statElements.forEach((card) => {
//                   const numEl = card.querySelector('.stat-number');
//                   if (numEl) {
//                     const targetVal = parseInt(numEl.getAttribute('data-value') || '0', 10);
//                     const obj = { val: 0 };
//                     gsap.to(obj, {
//                       val: targetVal,
//                       duration: 1.2,
//                       ease: 'power2.out',
//                       onUpdate: () => {
//                         numEl.textContent = Math.round(obj.val).toString();
//                       },
//                     });
//                   }
//                 });
//               },
//             },
//             '-=0.4'
//           );

//           // 2. Section A: Single Source of Truth Animation Logic
//           const state = { p: 0 };
//           const m: {
//             vw: number;
//             carW: number;
//             startCenter: number;
//             endCenter: number;
//             travel: number;
//             letters: { left: number; width: number }[];
//           } = {
//             vw: 0,
//             carW: 0,
//             startCenter: 0,
//             endCenter: 0,
//             travel: 0,
//             letters: [],
//           };

//           const measure = () => {
//             const vw = hero.clientWidth;
//             const carW = car.offsetWidth || 220;
//             m.vw = vw;
//             m.carW = carW;
//             m.startCenter = vw * 0.06 + carW / 2; // car fully visible at scroll 0
//             m.endCenter = vw + carW / 2; // car fully off right edge at scroll 100%
//             m.travel = m.endCenter - m.startCenter;
//             const base = lettersRow.offsetLeft;
//             m.letters = letters.map((el) => ({
//               left: base + el.offsetLeft,
//               width: el.offsetWidth,
//             }));
//           };

//           const setCarX = gsap.quickSetter(car, 'x', 'px');
//           const setTrail = gsap.quickSetter(trail, 'scaleX');
//           const setters = letters.map((el) => ({
//             o: gsap.quickSetter(el, 'opacity'),
//             y: gsap.quickSetter(el, 'y', 'px'),
//           }));

//           const render = () => {
//             const center = m.startCenter + state.p * m.travel;
//             setCarX(center - m.carW / 2);
//             setTrail(Math.min(1, Math.max(0, center / m.vw)));
//             m.letters.forEach((l, i) => {
//               const t = Math.min(1, Math.max(0, (center - l.left) / l.width));
//               const e = 1 - (1 - t) * (1 - t);
//               setters[i].o(e);
//               setters[i].y((1 - e) * 18);
//             });
//           };

//           measure();
//           render();

//           gsap.to(state, {
//             p: 1,
//             ease: 'none',
//             onUpdate: render,
//             scrollTrigger: {
//               trigger: hero,
//               start: 'top top',
//               end: '+=150%',
//               pin: true,
//               scrub: 1,
//               anticipatePin: 1,
//               invalidateOnRefresh: true,
//               onRefresh: () => {
//                 measure();
//                 render();
//               },
//             },
//           });

//           if (document.fonts) {
//             document.fonts.ready.then(() => {
//               ScrollTrigger.refresh();
//             });
//           }
//         }
//       );

//       return () => mm.revert();
//     },
//     { scope: heroRef }
//   );

//   return (
//     <section ref={heroRef} className="hero">
//       {/* 4 Colored Stat Cards placed dynamically */}
//       {statsList.map((stat, idx) => (
//         <StatCard
//           key={idx}
//           percentage={stat.percentage}
//           label={stat.label}
//           bgColor={stat.bgColor}
//           textColor={stat.textColor}
//           className={stat.cardClass}
//         />
//       ))}

//       {/* Main Road Track & Trail */}
//       <div className="track-container">
//         <div ref={roadRef} className="road-band">
//           {/* Green trail behind letters */}
//           <div ref={trailRef} className="green-trail" />

//           {/* Headline text with accessible ARIA label */}
//           <h1
//             ref={lettersRowRef}
//             className="letters-container"
//             aria-label={welcomeText}
//           >
//             {welcomeText.split('').map((char, index) => (
//               <span
//                 key={index}
//                 ref={(el) => {
//                   lettersRef.current[index] = el;
//                 }}
//                 className={`letter ${char === ' ' ? 'letter-space' : ''}`}
//                 aria-hidden="true"
//               >
//                 {char === ' ' ? '\u00A0' : char}
//               </span>
//             ))}
//           </h1>

//           {/* Top-view transparent car facing right */}
//           <div ref={carRef} className="car-container">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={getAssetUrl('/car.png')}
//               alt="McLaren 720S Top View"
//               className="car-img"
//               onLoad={() => ScrollTrigger.refresh()}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };








'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { StatCard } from './StatCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const statsList = [
  { percentage: 58, label: 'Increase in pick up point use', bgColor: '#dff64d', textColor: '#111111', cardClass: 'stat-card-a' },
  { percentage: 27, label: 'Increase in pick up point use', bgColor: '#333333', textColor: '#ffffff', cardClass: 'stat-card-b' },
  { percentage: 23, label: 'Decreased in customer phone calls', bgColor: '#6cc9ff', textColor: '#111111', cardClass: 'stat-card-c' },
  { percentage: 40, label: 'Decreased in customer phone calls', bgColor: '#f97324', textColor: '#111111', cardClass: 'stat-card-d' },
];

// Fixed values (no Math.random) so server and client render identically
const dots = [
  { l: 6, t: 8, s: 10, c: '#dff64d' }, { l: 14, t: 24, s: 7, c: '#6cc9ff' },
  { l: 27, t: 12, s: 12, c: '#f97324' }, { l: 36, t: 27, s: 8, c: '#45db7d' },
  { l: 44, t: 6, s: 9, c: '#6cc9ff' }, { l: 92, t: 30, s: 11, c: '#dff64d' },
  { l: 60, t: 31, s: 7, c: '#f97324' }, { l: 95, t: 9, s: 9, c: '#45db7d' },
  { l: 8, t: 68, s: 11, c: '#6cc9ff' }, { l: 20, t: 82, s: 8, c: '#f97324' },
  { l: 31, t: 70, s: 10, c: '#dff64d' }, { l: 40, t: 90, s: 7, c: '#45db7d' },
  { l: 91, t: 76, s: 9, c: '#6cc9ff' }, { l: 96, t: 91, s: 12, c: '#f97324' },
  { l: 12, t: 92, s: 8, c: '#dff64d' }, { l: 53, t: 88, s: 9, c: '#45db7d' },
];
const burstColors = ['#dff64d', '#6cc9ff', '#f97324', '#45db7d', '#ffffff'];
const burst = Array.from({ length: 28 }, (_, i) => burstColors[i % burstColors.length]);

const welcomeText = 'WELCOME ITZFIZZ';

// Fine-tuning
const TRAIL_START = 0.3; // 0 = trail starts at the car's rear edge, 0.5 = at its center
const CAR_START_OFFSET = 0; // car's left edge at scroll 0, in % of viewport width

const getAssetUrl = (path: string) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRowRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const road = roadRef.current;
      const car = carRef.current;
      const trail = trailRef.current;
      const lettersRow = lettersRowRef.current;

      if (!hero || !car || !trail || !road || !lettersRow) return;

      const speed = car.querySelector<HTMLElement>('.speed-lines');
      const beam = car.querySelector<HTMLElement>('.headlights');
      const dashes = road.querySelector<HTMLElement>('.road-dashes');
      const ghostTop = hero.querySelector<HTMLElement>('.ghost-top');
      const ghostBottom = hero.querySelector<HTMLElement>('.ghost-bottom');
      const spot = hero.querySelector<HTMLElement>('.spotlight');
      const fill = hero.querySelector<HTMLElement>('.progress-fill');
      const hint = hero.querySelector<HTMLElement>('.scroll-hint');
      const dotEls = gsap.utils.toArray<HTMLElement>('.dot', hero);
      const particles = gsap.utils.toArray<HTMLElement>('.particle', hero);

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 769px)',
          isMobile: '(max-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduceMotion, isDesktop } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
          const statEls = gsap.utils.toArray<HTMLElement>('.stat', hero);

          // Reduced motion: show the final state, no pin, no scrub, no extras
          if (reduceMotion) {
            gsap.set(trail, { scaleX: 1 });
            gsap.set(car, { x: hero.clientWidth - car.offsetWidth });
            gsap.set(letters, { opacity: 1, y: 0 });
            gsap.set(statEls, { opacity: 1, y: 0 });
            return;
          }

          const cleanups: (() => void)[] = [];
          const clamp01 = gsap.utils.clamp(0, 1);

          // ---------- Cinematic intro (load) ----------
          gsap.from(road, { opacity: 0, scaleY: 0.3, transformOrigin: 'center', duration: 0.9, ease: 'power3.out' });
          gsap.from(car, { opacity: 0, scale: 0.85, duration: 1, delay: 0.35, ease: 'power3.out' });
          if (hint) gsap.from(hint, { opacity: 0, y: 10, duration: 0.6, delay: 1.1, ease: 'power2.out' });

          // ---------- Ambient floating dots ----------
          gsap.fromTo(dotEls, { opacity: 0 }, { opacity: 0.55, duration: 1.2, delay: 0.6, stagger: 0.05 });
          gsap.to(dotEls, {
            x: () => gsap.utils.random(-26, 26),
            y: () => gsap.utils.random(-34, 34),
            duration: () => gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: { each: 0.15, from: 'random' },
          });

          // ---------- Cursor spotlight (desktop only) ----------
          if (isDesktop && spot) {
            gsap.set(spot, { xPercent: -50, yPercent: -50, x: hero.clientWidth * 0.7, y: hero.clientHeight * 0.3 });
            const spotX = gsap.quickTo(spot, 'x', { duration: 0.7, ease: 'power3' });
            const spotY = gsap.quickTo(spot, 'y', { duration: 0.7, ease: 'power3' });
            const onMove = (e: PointerEvent) => {
              spotX(e.clientX);
              spotY(e.clientY);
              gsap.to(spot, { opacity: 1, duration: 0.6, overwrite: 'auto' });
            };
            window.addEventListener('pointermove', onMove, { passive: true });
            cleanups.push(() => window.removeEventListener('pointermove', onMove));
          }

          // ---------- 3D tilt on the stat cards (desktop only) ----------
          if (isDesktop) {
            statEls.forEach((el) => {
              gsap.set(el, { transformPerspective: 800 });
              const rx = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3' });
              const ry = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3' });
              const onMove = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                ry(px * 16);
                rx(-py * 16);
              };
              const onLeave = () => {
                rx(0);
                ry(0);
              };
              el.addEventListener('pointermove', onMove);
              el.addEventListener('pointerleave', onLeave);
              cleanups.push(() => {
                el.removeEventListener('pointermove', onMove);
                el.removeEventListener('pointerleave', onLeave);
              });
            });
          }

          // Stats start hidden with the number at 0 (revealed by scroll)
          const numEls = statEls.map((card) => card.querySelector<HTMLElement>('.stat-number'));
          const targets = numEls.map((el) => parseInt(el?.getAttribute('data-value') || '0', 10));
          numEls.forEach((el) => {
            if (el) el.textContent = '0';
          });
          const counted = statEls.map(() => false);

          // ---------- Finish moment: confetti burst + letter wave ----------
          let finished = false;
          const celebrate = () => {
            gsap.fromTo(
              particles,
              { x: 0, y: 0, opacity: 1, scale: 1 },
              {
                x: () => gsap.utils.random(-220, 60),
                y: () => gsap.utils.random(-130, 130),
                opacity: 0,
                scale: 0,
                duration: () => gsap.utils.random(0.8, 1.4),
                ease: 'power3.out',
                stagger: 0.008,
              }
            );
            gsap.fromTo(
              letters,
              { scale: 1 },
              { scale: 1.12, duration: 0.22, yoyo: true, repeat: 1, stagger: 0.045, ease: 'power2.inOut' }
            );
          };

          // One source of truth: everything derives from state.p
          const state = { p: 0 };
          const m: {
            vw: number;
            carW: number;
            startX: number;
            endX: number;
            letters: { left: number; width: number }[];
            stats: { left: number }[];
          } = { vw: 0, carW: 0, startX: 0, endX: 0, letters: [], stats: [] };

          // Measured once (and on refresh). No DOM reads while scrolling.
          const measure = () => {
            const vw = hero.clientWidth;
            const carW = car.offsetWidth || 220;
            m.vw = vw;
            m.carW = carW;
            m.startX = (vw * CAR_START_OFFSET) / 100;
            m.endX = vw - carW; // car parks fully visible at the right edge
            const base = lettersRow.offsetLeft;
            m.letters = letters.map((el) => ({ left: base + el.offsetLeft, width: el.offsetWidth }));
            m.stats = statEls.map((el) => ({ left: el.offsetLeft }));
          };

          const setCarX = gsap.quickSetter(car, 'x', 'px');
          const setTrail = gsap.quickSetter(trail, 'scaleX');
          const setBar = fill ? gsap.quickSetter(fill, 'scaleX') : null;
          const setDash = dashes ? gsap.quickSetter(dashes, 'x', 'px') : null;
          const setGhostTop = ghostTop ? gsap.quickSetter(ghostTop, 'x', 'px') : null;
          const setGhostBottom = ghostBottom ? gsap.quickSetter(ghostBottom, 'x', 'px') : null;
          const setBeam = beam ? gsap.quickSetter(beam, 'opacity') : null;
          const setSpeedO = speed ? gsap.quickSetter(speed, 'opacity') : null;
          const setSpeedS = speed ? gsap.quickSetter(speed, 'scaleX') : null;
          const setLetters = letters.map((el) => ({
            o: gsap.quickSetter(el, 'opacity'),
            y: gsap.quickSetter(el, 'y', 'px'),
          }));
          const setStats = statEls.map((el) => ({
            o: gsap.quickSetter(el, 'opacity'),
            y: gsap.quickSetter(el, 'y', 'px'),
            s: gsap.quickSetter(el, 'scale'),
          }));

          const render = () => {
            const p = state.p;
            const carX = m.startX + p * (m.endX - m.startX);
            const center = carX + m.carW / 2;
            setCarX(carX);

            // Trail: short at the start, full width exactly at the end
            const trailEdge = carX + m.carW * (TRAIL_START + (1 - TRAIL_START) * p);
            setTrail(clamp01(trailEdge / m.vw));

            if (setBar) setBar(p);
            if (setBeam) setBeam(1 - p * 0.9);

            // Parallax layers: lane dashes loop seamlessly, ghost text drifts in opposite directions
            if (setDash) setDash(-((p * m.vw * 1.2) % 90));
            if (setGhostTop) setGhostTop(-p * m.vw * 0.14);
            if (setGhostBottom) setGhostBottom(p * m.vw * 0.14);

            // Letters reveal as the car passes, all visible at 100%
            const revealX = carX + p * m.carW;
            m.letters.forEach((l, i) => {
              const t = clamp01((revealX - l.left) / l.width);
              const e = 1 - (1 - t) * (1 - t);
              setLetters[i].o(e);
              setLetters[i].y((1 - e) * 18);
            });

            // Cards appear as the car reaches them, then drift slightly for depth
            const win = m.vw * 0.08;
            m.stats.forEach((s, i) => {
              const t = clamp01((center - s.left) / win);
              const e = 1 - Math.pow(1 - t, 3);
              const drift = (p - 0.5) * (i % 2 ? -16 : 16) * e;
              setStats[i].o(e);
              setStats[i].y((1 - e) * 40 + drift);
              setStats[i].s(0.92 + 0.08 * e);

              if (t > 0 && !counted[i]) {
                counted[i] = true;
                const el = numEls[i];
                if (el) {
                  const obj = { val: 0 };
                  gsap.to(obj, {
                    val: targets[i],
                    duration: 1.2,
                    ease: 'power2.out',
                    onUpdate: () => {
                      el.textContent = Math.round(obj.val).toString();
                    },
                  });
                }
              }
            });

            // Finish moment fires when the car arrives, re-arms when scrolling back
            if (p > 0.995 && !finished) {
              finished = true;
              celebrate();
            } else if (p < 0.9) {
              finished = false;
            }
          };

          measure();
          render();

          gsap.to(state, {
            p: 1,
            ease: 'none',
            onUpdate: render,
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=150%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                measure();
                render();
              },
            },
          });

          // ---------- Speed streaks: strength follows scroll speed, fades when idle ----------
          let lastP = 0;
          const fx = { v: 0 };
          const tick = () => {
            const target = clamp01(Math.abs(state.p - lastP) / 0.02);
            lastP = state.p;
            fx.v += (target - fx.v) * 0.12;
            if (setSpeedO && setSpeedS) {
              setSpeedO(fx.v);
              setSpeedS(0.3 + 0.7 * fx.v);
            }
          };
          gsap.ticker.add(tick);
          cleanups.push(() => gsap.ticker.remove(tick));

          if (document.fonts) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="hero">
      {/* Background layers */}
      <div className="ghost ghost-top" aria-hidden="true">ITZFIZZ</div>
      <div className="ghost ghost-bottom" aria-hidden="true">ITZFIZZ</div>
      <div className="spotlight" aria-hidden="true" />
      {dots.map((d, i) => (
        <span
          key={i}
          className="dot"
          aria-hidden="true"
          style={{ left: `${d.l}vw`, top: `${d.t}vh`, width: d.s, height: d.s, background: d.c }}
        />
      ))}

      {statsList.map((stat, idx) => (
        <StatCard
          key={idx}
          percentage={stat.percentage}
          label={stat.label}
          bgColor={stat.bgColor}
          textColor={stat.textColor}
          className={stat.cardClass}
        />
      ))}

      <div className="track-container">
        <div ref={roadRef} className="road-band">
          <div className="road-dashes" aria-hidden="true" />
          <div ref={trailRef} className="green-trail" />

          <h1 ref={lettersRowRef} className="letters-container" aria-label={welcomeText}>
            {welcomeText.split('').map((char, index) => (
              <span
                key={index}
                ref={(el) => {
                  lettersRef.current[index] = el;
                }}
                className={`letter ${char === ' ' ? 'letter-space' : ''}`}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <div className="burst" aria-hidden="true">
            {burst.map((c, i) => (
              <span key={i} className="particle" style={{ background: c }} />
            ))}
          </div>

          <div ref={carRef} className="car-container">
            <div className="speed-lines" aria-hidden="true" />
            <div className="headlights" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAssetUrl('/car.png')}
              alt="McLaren 720S Top View"
              className="car-img"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="bar">
          <span className="progress-fill" />
        </span>
      </div>
    </section>
  );
};