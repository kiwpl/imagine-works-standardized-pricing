import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  onRemoveBefore: () => void;
  onRemoveAfter: () => void;
  onLightboxOpen: (src: string) => void;
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: "white",
  background: "rgba(0,0,0,0.45)",
  padding: "4px 8px",
  borderRadius: "4px",
  pointerEvents: "none",
  userSelect: "none",
};

const REMOVE_BTN_STYLE: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "0.05em",
  color: "#9ca3af",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  onRemoveBefore,
  onRemoveAfter,
  onLightboxOpen,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // 0–100, % from left
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Calculate a 0–100 position from a clientX value */
  const calcPos = useCallback((clientX: number): number => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  // Global mouse/touch listeners — only active while dragging
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => setPosition(calcPos(e.clientX));
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setPosition(calcPos(e.touches[0].clientX));
    };
    const onEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, calcPos]);

  /** Clicking anywhere on the container snaps the divider to that x position */
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      setPosition(calcPos(e.clientX));
    },
    [calcPos],
  );

  /**
   * Double-click opens the lightbox, showing whichever side is more visible.
   * position > 50  → BEFORE occupies more than half → show BEFORE
   * position <= 50 → AFTER occupies more than half  → show AFTER
   */
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onLightboxOpen(position > 50 ? beforeSrc : afterSrc);
    },
    [position, beforeSrc, afterSrc, onLightboxOpen],
  );

  const handleHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* ── Slider container ── */}
      <div
        ref={containerRef}
        className="relative w-full rounded-lg overflow-hidden select-none"
        style={{ height: "320px", cursor: "crosshair" }}
        onClick={handleContainerClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* BEFORE — fills the full background */}
        <img
          src={beforeSrc}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* AFTER — on top, clipped so only the RIGHT portion (past the divider) is visible.
            clip-path: inset(top right bottom left)
            inset(0 0 0 position%) clips the left `position%` away, revealing the right portion */}
        <img
          src={afterSrc}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          draggable={false}
        />

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: `${position}%`,
            width: "2px",
            background: "white",
            transform: "translateX(-50%)",
          }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 flex items-center justify-center rounded-full bg-white shadow-lg z-10"
          style={{
            left: `${position}%`,
            width: "36px",
            height: "36px",
            transform: "translate(-50%, -50%)",
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
          onMouseDown={handleHandleMouseDown}
          onTouchStart={handleHandleTouchStart}
        >
          {/* ← → arrows */}
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 1.5L1 5L4.5 8.5"
              stroke="#333"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 1.5L15 5L11.5 8.5"
              stroke="#333"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* BEFORE label — top-left */}
        <div className="absolute top-2 left-2" style={LABEL_STYLE}>
          BEFORE
        </div>

        {/* AFTER label — top-right */}
        <div className="absolute top-2 right-2" style={LABEL_STYLE}>
          AFTER
        </div>
      </div>

      {/* Remove buttons */}
      <div className="flex gap-4">
        <button style={REMOVE_BTN_STYLE} onClick={onRemoveBefore}>
          × Before
        </button>
        <button style={REMOVE_BTN_STYLE} onClick={onRemoveAfter}>
          × After
        </button>
      </div>
    </div>
  );
}
