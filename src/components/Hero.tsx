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
  {
    percentage: 58,
    label: 'Increase in pick up point use',
    bgColor: '#dff64d', // Lime yellow
    textColor: '#111111',
    cardClass: 'stat-card-a',
  },
  {
    percentage: 27,
    label: 'Increase in pick up point use',
    bgColor: '#333333', // Dark slate/black
    textColor: '#ffffff',
    cardClass: 'stat-card-b',
  },
  {
    percentage: 23,
    label: 'Decreased in customer phone calls',
    bgColor: '#6cc9ff', // Sky blue
    textColor: '#111111',
    cardClass: 'stat-card-c',
  },
  {
    percentage: 40,
    label: 'Decreased in customer phone calls',
    bgColor: '#f97324', // Orange
    textColor: '#111111',
    cardClass: 'stat-card-d',
  },
];

const welcomeText = 'WELCOME ITZFIZZ';

const getAssetUrl = (path: string) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const road = roadRef.current;
      const car = carRef.current;
      const trail = trailRef.current;

      if (!hero || !car || !trail || !road) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 769px)',
          isMobile: '(max-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            // Accessible fallback state
            gsap.set(trail, { scaleX: 1 });
            gsap.set(car, { x: window.innerWidth * 0.8 });
            lettersRef.current.forEach((el) => {
              if (el) gsap.set(el, { opacity: 1 });
            });
            gsap.set('.stat', { opacity: 1, y: 0 });
            return;
          }

          // 1. Initial Load Timeline for Stats and Hero
          const loadTl = gsap.timeline({ ease: 'power3.out' });

          loadTl.fromTo(hero, { opacity: 0 }, { opacity: 1, duration: 0.6 });

          const statElements = gsap.utils.toArray<HTMLElement>('.stat');
          loadTl.fromTo(
            statElements,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.18,
              delay: 0.2,
              onStart: () => {
                statElements.forEach((card) => {
                  const numEl = card.querySelector('.stat-number');
                  if (numEl) {
                    const targetVal = parseInt(numEl.getAttribute('data-value') || '0', 10);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                      val: targetVal,
                      duration: 1.2,
                      ease: 'power2.out',
                      onUpdate: () => {
                        numEl.textContent = Math.round(obj.val).toString();
                      },
                    });
                  }
                });
              },
            },
            '-=0.4'
          );

          // 2. Core Scroll Animation
          const endScroll = isMobile ? '+=120%' : '+=150%';

          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: endScroll,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
            defaults: { ease: 'none' },
          });

          const getCarWidth = () => (car ? car.offsetWidth || 220 : 220);
          const getViewportWidth = () => window.innerWidth;

          // Car driving strictly straight left to right
          scrollTl.fromTo(
            car,
            { x: () => -getCarWidth() },
            { x: () => getViewportWidth() + getCarWidth() * 0.1 },
            0
          );

          // Trail growth tracking car center
          scrollTl.fromTo(
            trail,
            { scaleX: 0 },
            {
              scaleX: 1,
              onUpdate: function () {
                const progress = this.progress();
                const currentCarX = -getCarWidth() + progress * (getViewportWidth() + getCarWidth() * 1.1);
                const carCenter = currentCarX + getCarWidth() / 2;
                const trailRatio = Math.max(0, Math.min(1, carCenter / getViewportWidth()));
                gsap.set(trail, { scaleX: trailRatio });
              },
            },
            0
          );

          // 3. Headline Letters Reveal (0 at scroll 0, reveals on car pass)
          const letterElements = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

          const updateLetterPositions = () => {
            if (!road || letterElements.length === 0) return;

            const carWidth = getCarWidth();
            const vpWidth = getViewportWidth();
            const startCarCenter = -carWidth + carWidth / 2;
            const endCarCenter = vpWidth + carWidth * 0.1 + carWidth / 2;
            const totalTravelDistance = endCarCenter - startCarCenter;

            letterElements.forEach((letter) => {
              const rect = letter.getBoundingClientRect();
              const letterCenterX = rect.left + rect.width / 2;

              const targetPosition = Math.max(
                0.01,
                Math.min(0.99, (letterCenterX - startCarCenter) / totalTravelDistance)
              );

              scrollTl.fromTo(
                letter,
                { opacity: 0 },
                { opacity: 1, duration: 0.04, ease: 'power2.out' },
                targetPosition
              );
            });
          };

          if (document.fonts) {
            document.fonts.ready.then(() => {
              updateLetterPositions();
              ScrollTrigger.refresh();
            });
          } else {
            updateLetterPositions();
            ScrollTrigger.refresh();
          }
        }
      );

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="hero">
      {/* 4 Colored Stat Cards placed dynamically */}
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

      {/* Main Road Track & Trail */}
      <div className="track-container">
        <div ref={roadRef} className="road-band">
          {/* Green trail behind letters */}
          <div ref={trailRef} className="green-trail" />

          {/* Headline text with accessible ARIA label */}
          <h1 className="letters-container" aria-label={welcomeText}>
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

          {/* Top-view transparent car facing right */}
          <div ref={carRef} className="car-container">
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
    </section>
  );
};
