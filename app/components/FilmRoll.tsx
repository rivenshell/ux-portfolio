"use client";
import React, { useEffect, useRef } from "react";

// Pins its children to the screen and slides them sideways as the user
// scrolls down, like advancing a roll of film.
const FilmRoll = ({ children }: { children: React.ReactNode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const distance = () => track.scrollWidth - window.innerWidth;

    // Vertical scroll room = how far the track has to slide sideways.
    const setHeight = () => {
      section.style.height = `${distance() + window.innerHeight}px`;
    };

    let scrolled = 0;
    // How far the user has pulled past either end: + past the start, - past the end.
    let pull = 0;

    // Resistance that grows the further you pull, like iOS's rubber band.
    // Never stretches more than 12% of the screen width.
    const rubber = (x: number) => {
      const max = window.innerWidth * 0.12;
      return Math.sign(x) * (1 - 1 / ((Math.abs(x) * 0.55) / max + 1)) * max;
    };

    const render = () => {
      track.style.transform = `translate3d(${rubber(pull) - scrolled}px, 0, 0)`;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      scrolled = Math.min(
        Math.max(-section.getBoundingClientRect().top, 0),
        distance(),
      );
      render();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      setHeight();
      update();
    };

    // Sideways bounce at the ends. The browser's own bounce is vertical, so
    // it's turned off in layout.tsx and replaced with this.
    let springFrame = 0;
    let settle = 0; // pending release timer
    let settling = false; // released; ignoring wheel input until it pauses
    let gestureEnd = 0;
    const atStart = () => window.scrollY <= 0;
    const atEnd = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;

    // A quick spring that overshoots the edge a little before settling.
    // Higher stiffness = snappier; lower damping = more wobble.
    const stiffness = 0.4;
    const damping = 0.5;
    const springBack = () => {
      cancelAnimationFrame(springFrame);
      let velocity = 0;
      const step = () => {
        velocity = (velocity - pull * stiffness) * damping;
        pull += velocity;
        if (Math.abs(pull) < 0.5 && Math.abs(velocity) < 0.5) pull = 0;
        render();
        if (pull) springFrame = requestAnimationFrame(step);
      };
      springFrame = requestAnimationFrame(step);
    };

    // deltaY > 0 means the user is moving forward through the roll.
    const overscroll = (deltaY: number, autoSettle: boolean) => {
      if (autoSettle && settling) {
        // Trackpad momentum keeps sending events after the fingers lift; let
        // it run out instead of stretching the roll again.
        clearTimeout(gestureEnd);
        gestureEnd = window.setTimeout(() => (settling = false), 100);
        return;
      }

      const pastStart = deltaY < 0 && atStart();
      const pastEnd = deltaY > 0 && atEnd();
      if (!pastStart && !pastEnd && !pull) return;

      cancelAnimationFrame(springFrame);
      const before = pull;
      pull -= deltaY;
      // Reversing direction eases back to the edge, never past the other way.
      if (before && Math.sign(pull) !== Math.sign(before)) pull = 0;
      render();

      // Wheels and trackpads have no "let go" event, so spring back a fixed
      // time after the pull starts, however long the scrolling keeps going.
      if (autoSettle && !settle) {
        settle = window.setTimeout(() => {
          settle = 0;
          settling = true;
          gestureEnd = window.setTimeout(() => (settling = false), 100);
          springBack();
        }, 100);
      }
    };

    // Sideways swipes move the roll the same as scrolling down: swiping
    // left (deltaX > 0) advances it.
    const onWheel = (e: WheelEvent) => {
      const lines = e.deltaMode === 1 ? 16 : 1; // Firefox can report lines
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = (sideways ? e.deltaX : e.deltaY) * lines;
      if (sideways) {
        e.preventDefault();
        window.scrollBy(0, delta);
      }
      overscroll(delta, true);
    };

    // Touch: every swipe, up/down or sideways, scrolls by hand with a glide
    // after the finger lifts. Native touch scrolling only moves the roll a
    // frame or more late (and iOS resizes the page as its toolbar hides),
    // which made vertical swipes stutter. The section is touch-pinch-zoom so
    // the browser doesn't also pan.
    let touchX = 0;
    let touchY = 0;
    let axis: "x" | "y" | null = null;
    let velocity = 0; // px per ms
    let lastMove = 0;
    let glideFrame = 0;

    // Scroll and move the roll in the same frame, so it never lags behind.
    const scrollRoll = (delta: number) => {
      window.scrollBy(0, delta);
      update();
    };

    const glide = () => {
      velocity *= 0.95;
      scrollRoll(velocity * 16);
      if (Math.abs(velocity) > 0.02 && !atStart() && !atEnd()) {
        glideFrame = requestAnimationFrame(glide);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      cancelAnimationFrame(glideFrame);
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      axis = null;
      velocity = 0;
      lastMove = e.timeStamp;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return; // leave pinch-zoom to the browser
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = touchX - x;
      const dy = touchY - y;
      // Lock to one axis per swipe so a slightly diagonal swipe doesn't wobble.
      if (!axis) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      const delta = axis === "x" ? dx : dy;

      e.preventDefault();
      scrollRoll(delta);
      // Capped so a jittery reading can't fling the whole roll.
      velocity = Math.max(
        -4,
        Math.min(4, delta / Math.max(e.timeStamp - lastMove, 1)),
      );
      lastMove = e.timeStamp;
      overscroll(delta, false);
      touchX = x;
      touchY = y;
    };
    const onTouchEnd = (e: TouchEvent) => {
      springBack();
      // A finger that paused before lifting shouldn't fling.
      if (axis && e.timeStamp - lastMove < 100) {
        glideFrame = requestAnimationFrame(glide);
      }
    };

    onResize();
    // Re-measure when content changes width, e.g. images finish loading.
    const observer = new ResizeObserver(onResize);
    observer.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Not passive: sideways wheel and touch moves call preventDefault.
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(springFrame);
      cancelAnimationFrame(glideFrame);
      clearTimeout(settle);
      clearTimeout(gestureEnd);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative touch-pinch-zoom">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full w-max will-change-transform"
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default FilmRoll;
