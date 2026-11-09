import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

/**
 * CinematicCurvedGallery
 *
 * A high-performance, mathematically consistent curved-screen gallery.
 * Features:
 * - Position-driven cinematic curve with continuous Gaussian scaling
 * - Perfectly equidistant card spacing that eliminates collisions and uneven gaps
 * - Constant, smooth animation speed that NEVER slows down or resets on hover
 * - Zero React re-renders during animation (direct DOM transform updates)
 * - Seamless infinite wrapping with zero boundary pops or jumps
 * - Touch & mouse drag support and smooth click-to-center navigation
 */

const DEFAULT_CARDS = [
  {
    id: 'fintech-cashapp',
    title: 'Next-Gen Financial Architecture',
    category: 'Fintech & Payments',
    image: '/showcase/phone-fintech-cashapp.webp',
    fallback: '/showcase/phone-fintech-cashapp.png'
  },
  {
    id: 'fashion-kith',
    title: 'Haute Couture Editorial Lookbook',
    category: 'Luxury E-Commerce',
    image: '/showcase/phone-fashion-kith.webp',
    fallback: '/showcase/phone-fashion-kith.png'
  },
  {
    id: 'ai-linear',
    title: 'AI Product Planning & Systems',
    category: 'AI Software & SaaS',
    image: '/showcase/phone-ai-linear.webp',
    fallback: '/showcase/phone-ai-linear.png'
  },
  {
    id: 'health-whoop',
    title: 'Human Performance Telemetry',
    category: 'Biometrics & Healthtech',
    image: '/showcase/phone-health-whoop.webp',
    fallback: '/showcase/phone-health-whoop.png'
  },
  {
    id: 'mobility-polestar',
    title: 'Scandinavian Electric Mobility',
    category: 'Clean Automotive',
    image: '/showcase/phone-mobility-polestar.webp',
    fallback: '/showcase/phone-mobility-polestar.png'
  },
  {
    id: 'creative-pitch',
    title: 'Generative AI Presentation Suite',
    category: 'Creative Intelligence',
    image: '/showcase/phone-presentation-pitch.webp',
    fallback: '/showcase/phone-presentation-pitch.png'
  },
  {
    id: 'cloud-supabase',
    title: 'Sovereign Cloud & Realtime Data',
    category: 'Enterprise Infrastructure',
    image: '/showcase/card-5-supabase.webp',
    fallback: '/showcase/card-5-supabase.png'
  },
  {
    id: 'audio-teenage',
    title: 'Precision Synthesizer Engineering',
    category: 'Industrial Tech & Hardware',
    image: '/showcase/phone-audio-teenage.webp',
    fallback: '/showcase/phone-audio-teenage.png'
  }
];

const REPEAT_COUNT = 3; // 24 cards total for seamless infinite wrapping

export const CinematicCurvedGallery = forwardRef(function CinematicCurvedGallery(
  { cards = DEFAULT_CARDS, onPhaseChange },
  ref
) {
  const containerRef = useRef(null);
  const cardElementsRef = useRef([]);

  // Animation & Position Refs (Progress in continuous card units)
  const progressRef = useRef(0);
  const targetProgressRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafIdRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const activePhaseRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);
  const isIntersectingRef = useRef(true);

  // Layout parameters ref (updated on container resize)
  const layoutRef = useRef({
    cardWidth: 270,
    cardHeight: 440,
    minScale: 0.55,
    maxScale: 1.00,
    targetGap: 20,
    beta: 0.40,
    sigma0: 168.5,
    sigmaInf: 290,
    viewHalfWidth: 760,
    curveZDepth: 180,
    maxRotateY: 16,
    perspective: 1350,
    totalCards: cards.length * REPEAT_COUNT
  });

  // Triplicate cards for infinite continuous wrapping
  const denseCards = React.useMemo(() => {
    const list = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      cards.forEach((card, idx) => {
        list.push({
          ...card,
          instanceKey: `${card.id}-rep${r}-${idx}`
        });
      });
    }
    return list;
  }, [cards]);

  // Update layout parameters based on stage container width
  const updateLayoutMeasurements = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;

    let cardWidth = 270;
    let cardHeight = 440;
    let minScale = 0.55;
    let maxScale = 1.00;
    let targetGap = 20;
    let beta = 0.40;
    let viewHalfWidth = Math.max(340, width * 0.48);
    let curveZDepth = 200;
    let maxRotateY = 16;
    let perspective = 1400;

    if (width < 640) {
      // Mobile
      cardWidth = 165;
      cardHeight = 270;
      minScale = 0.58;
      maxScale = 1.00;
      targetGap = 12;
      beta = 0.40;
      viewHalfWidth = Math.max(170, width * 0.45);
      curveZDepth = 90;
      maxRotateY = 10;
      perspective = 850;
    } else if (width < 1024) {
      // Tablet
      cardWidth = 215;
      cardHeight = 350;
      minScale = 0.56;
      maxScale = 1.00;
      targetGap = 16;
      beta = 0.40;
      viewHalfWidth = Math.max(260, width * 0.46);
      curveZDepth = 140;
      maxRotateY = 14;
      perspective = 1100;
    }

    const sigma0 = cardWidth * minScale + targetGap;
    const sigmaInf = cardWidth * maxScale + targetGap;
    const totalCards = denseCards.length;

    layoutRef.current = {
      cardWidth,
      cardHeight,
      minScale,
      maxScale,
      targetGap,
      beta,
      sigma0,
      sigmaInf,
      totalCards,
      viewHalfWidth,
      curveZDepth,
      maxRotateY,
      perspective
    };

    if (containerRef.current) {
      containerRef.current.style.perspective = `${perspective}px`;
    }
  }, [denseCards.length]);

  // Mathematical Direct DOM transform updates for each card
  const updateCardStyles = useCallback((currentProgress) => {
    const {
      cardWidth,
      minScale,
      maxScale,
      beta,
      sigma0,
      sigmaInf,
      totalCards,
      viewHalfWidth,
      curveZDepth,
      maxRotateY
    } = layoutRef.current;

    const N = totalCards;
    const halfN = N / 2;
    let closestIndex = 0;
    let minU = Infinity;

    // Viewport edge visibility cutoff
    const maxVisibleX = viewHalfWidth + cardWidth * 1.35;
    const fadeStartX = viewHalfWidth * 1.12;

    for (let i = 0; i < N; i++) {
      const el = cardElementsRef.current[i];
      if (!el) continue;

      // ─── Mathematical Continuous Card Coordinate ───────────────────────
      // u: continuous distance in card units from center waist (u = 0 at center)
      let u = i - currentProgress;
      // Symmetrical wrapping into [-halfN, +halfN]
      u = ((((u + halfN) % N) + N) % N) - halfN;

      const absU = Math.abs(u);
      if (absU < minU) {
        minU = absU;
        closestIndex = i;
      }

      // ─── Scale-Aware Spacing Closed-Form Spatial Map ───────────────────
      // dX/du transitions smoothly from sigma0 (at center) to sigmaInf (at edges)
      // guaranteeing consistent, balanced gaps between every pair of adjacent cards
      const X = sigmaInf * u - ((sigmaInf - sigma0) / beta) * Math.tanh(beta * u);
      const absX = Math.abs(X);

      // Hide cards well outside visible viewport bounds
      if (absX > maxVisibleX) {
        if (el.style.visibility !== 'hidden') {
          el.style.visibility = 'hidden';
        }
        continue;
      }

      // ─── Normalized Position for Trajectory Geometry ──────────────────
      const p = X / viewHalfWidth;
      const absP = Math.abs(p);

      // Continuous Hourglass Scale: center is smallest (~0.55), expanding to ends (~1.00)
      const scaleFactor = 1.0 - Math.exp(-2.2 * p * p);
      const scale = minScale + (maxScale - minScale) * Math.min(1.0, scaleFactor);

      // Vertical Trajectory: Symmetrical horizontal centerline through waist (y = 0)
      // Symmetrical scaling naturally creates the opposing upper & lower hourglass curves
      const y = 0;

      // Curved Screen Depth: Center cards recede into corridor, outer cards sit forward
      const z = -(1.0 - Math.min(1.0, scaleFactor)) * curveZDepth;

      // Perspective Rotation: Subtle inward angle toward the central corridor
      const rotProgress = Math.min(1.0, Math.pow(absP, 0.85));
      const rotY = -Math.sign(p) * rotProgress * maxRotateY;

      // Layering / Stacking: Predictable depth stacking, outer cards sit slightly in front
      const zIndex = Math.max(1, Math.round(scaleFactor * 30) + 1);

      // Smooth Edge Entry/Exit Fade: Prevents abrupt clipping at viewport edges
      let opacity = 1.0;
      if (absX > fadeStartX) {
        opacity = Math.max(0, Math.min(1, (maxVisibleX - absX) / (maxVisibleX - fadeStartX)));
      }

      if (el.style.visibility !== 'visible') {
        el.style.visibility = 'visible';
      }

      el.style.transform = `translate3d(calc(-50% + ${X.toFixed(1)}px), calc(-50% + ${y}px), ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.zIndex = zIndex;
      el.style.opacity = opacity.toFixed(3);
    }

    // Active Phase Detection (8 cards map to 4 phases: 2 cards per phase)
    const baseIdx = closestIndex % cards.length;
    const computedPhase = Math.floor(baseIdx / 2) % 4;
    if (computedPhase !== activePhaseRef.current) {
      activePhaseRef.current = computedPhase;
      if (onPhaseChange) {
        onPhaseChange(computedPhase);
      }
    }
  }, [cards.length]);

  // Main high-performance Animation Loop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    lastTimeRef.current = performance.now();

    const loop = (now) => {
      // Offscreen Battery & GPU Optimization: Truly stop transforms when gallery is scrolled out of view
      if (!isIntersectingRef.current) {
        rafIdRef.current = null;
        return;
      }

      const rawDt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const dt = Math.min(50, Math.max(1, rawDt));

      const { totalCards } = layoutRef.current;
      const isReduced = prefersReducedMotionRef.current;

      if (targetProgressRef.current !== null) {
        // Smoothly glide towards target card or phase
        const diff = targetProgressRef.current - progressRef.current;
        if (Math.abs(diff) < 0.002) {
          progressRef.current = targetProgressRef.current;
          targetProgressRef.current = null;
        } else {
          progressRef.current += diff * 0.085;
        }
      } else if (!isDraggingRef.current && !isReduced) {
        // Continuous smooth auto-advance speed: ~0.20 cards per second (constant and never pauses on hover)
        const speed = 0.20;
        progressRef.current += speed * (dt / 1000);
      }

      // Keep progress in positive range [0, totalCards)
      if (totalCards > 0) {
        progressRef.current = ((progressRef.current % totalCards) + totalCards) % totalCards;
      }

      updateCardStyles(progressRef.current);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = loop;
    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [updateCardStyles]);

  const loopRef = useRef(null);

  // IntersectionObserver to pause animation work when offscreen (saving mobile battery & GPU)
  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !rafIdRef.current && loopRef.current) {
            lastTimeRef.current = performance.now();
            rafIdRef.current = requestAnimationFrame(loopRef.current);
          }
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // ResizeObserver for responsive layout updates
  useEffect(() => {
    updateLayoutMeasurements();
    const ro = new ResizeObserver(() => {
      updateLayoutMeasurements();
      updateCardStyles(progressRef.current);
    });
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    return () => ro.disconnect();
  }, [updateLayoutMeasurements, updateCardStyles]);

  // Expose imperatively to parent (for phase buttons)
  useImperativeHandle(ref, () => ({
    scrollToPhase: (phaseIdx) => {
      const { totalCards } = layoutRef.current;
      const targetBaseIdx = (phaseIdx * 2) % cards.length;
      const N = totalCards;
      const halfN = N / 2;

      // Find the closest instance of this phase card to the current progress
      let bestDiff = Infinity;
      let bestTarget = progressRef.current;

      for (let r = 0; r < REPEAT_COUNT; r++) {
        const cardIdx = r * cards.length + targetBaseIdx;
        let du = cardIdx - progressRef.current;
        du = ((((du + halfN) % N) + N) % N) - halfN;
        if (Math.abs(du) < Math.abs(bestDiff)) {
          bestDiff = du;
          bestTarget = progressRef.current + du;
        }
      }

      targetProgressRef.current = bestTarget;
    }
  }), [cards.length]);

  // Click on a card to glide it to the center waist
  const handleCardClick = (i) => {
    if (hasDraggedRef.current) return;
    const { totalCards } = layoutRef.current;
    const N = totalCards;
    const halfN = N / 2;
    let du = i - progressRef.current;
    du = ((((du + halfN) % N) + N) % N) - halfN;
    targetProgressRef.current = progressRef.current + du;
  };

  // Pointer drag handling (mouse & touch)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartProgressRef.current = progressRef.current;
    targetProgressRef.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    // Detect predominantly vertical drag on mobile and yield immediately to native page scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      return;
    }

    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    const { sigma0 } = layoutRef.current;
    const deltaU = deltaX / (sigma0 || 168);
    progressRef.current = dragStartProgressRef.current - deltaU;
    updateCardStyles(progressRef.current);
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      id="process-ribbon-stage"
      className="relative w-full h-[270px] sm:h-[350px] lg:h-[430px] xl:h-[440px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: '1400px', touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Left/Right Edge Soft Gradient Masks (Narrow and subtle to prevent premature clipping) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-20 bg-gradient-to-r from-[#FAFAF7] via-[#FAFAF7]/50 to-transparent pointer-events-none z-30" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-20 bg-gradient-to-l from-[#FAFAF7] via-[#FAFAF7]/50 to-transparent pointer-events-none z-30" />

      {/* 3D Preserved Curved Stage Container */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {denseCards.map((card, i) => (
          <div
            key={card.instanceKey}
            ref={(el) => {
              cardElementsRef.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[165px] sm:w-[215px] lg:w-[270px] h-[270px] sm:h-[350px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-[0_16px_40px_rgba(0,0,0,0.14)] bg-[#101412] pointer-events-auto cursor-pointer transition-shadow duration-300 hover:shadow-[0_24px_55px_rgba(0,0,0,0.24)] flex-shrink-0 border border-black/8 ring-1 ring-black/5"
            style={{
              transformOrigin: '50% 50%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            onClick={() => handleCardClick(i)}
          >
            <picture className="w-full h-full block">
              <source srcSet={card.image} type="image/webp" />
              <img
                src={card.fallback || card.image.replace('.webp', '.png')}
                alt={card.title}
                width="270"
                height="440"
                className="w-full h-full object-cover object-top select-none pointer-events-none block"
                loading={i < 8 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  );
});
