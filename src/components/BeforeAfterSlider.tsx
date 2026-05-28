import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: "white",
  background: "rgba(0,0,0,0.5)",
  padding: "4px 8px",
  borderRadius: "4px",
  pointerEvents: "none",
  userSelect: "none",
};

/**
 * Pure before/after drag-divider slider.
 *
 * The outer wrapper fills its parent. The inner "image box" is sized to the
 * before image's natural aspect ratio (capped by the wrapper) so that the
 * <img> elements (object-contain) exactly fill it — meaning the divider,
 * handle, and labels are strictly contained within the image bounds.
 */
export function BeforeAfterSlider({ beforeSrc, afterSrc }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // 0–100 % from left
  const [isDragging, setIsDragging] = useState(false);
  const [aspect, setAspect] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Load natural aspect ratio of the BEFORE image so the image box matches it
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = beforeSrc;
  }, [beforeSrc]);

  /** Map a clientX value to a 0–100 position within the image box (clamped) */
  const calcPos = useCallback((clientX: number): number => {
    if (!boxRef.current) return 50;
    const rect = boxRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  // Global mouse/touch listeners — only while handle is being dragged
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

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      setPosition(calcPos(e.clientX));
    },
    [calcPos],
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
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{ overflow: "hidden" }}
    >
      <div
        ref={boxRef}
        className="relative select-none"
        style={{
          // Fit the image box inside the parent while preserving aspect ratio.
          // maxWidth/maxHeight ensure it never exceeds the parent bounds.
          aspectRatio: aspect ? String(aspect) : "16 / 9",
          maxWidth: "100%",
          maxHeight: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
        onClick={handleContainerClick}
      >
        {/* BEFORE — fills the image box */}
        <img
          src={beforeSrc}
          alt="Before"
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* AFTER — on top, clipped to the right of the divider */}
        <img
          src={afterSrc}
          alt="After"
          className="absolute inset-0 w-full h-full object-contain"
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
            width: "40px",
            height: "40px",
            transform: "translate(-50%, -50%)",
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
          onMouseDown={handleHandleMouseDown}
          onTouchStart={handleHandleTouchStart}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path d="M4.5 1.5L1 5L4.5 8.5" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.5 1.5L15 5L11.5 8.5" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* BEFORE label — top-left, inside image */}
        <div className="absolute top-2 left-2" style={LABEL_STYLE}>
          BEFORE
        </div>

        {/* AFTER label — top-right, inside image */}
        <div className="absolute top-2 right-2" style={LABEL_STYLE}>
          AFTER
        </div>
      </div>
    </div>
  );
}
