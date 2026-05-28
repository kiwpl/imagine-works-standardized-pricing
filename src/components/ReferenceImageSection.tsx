import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Upload, X } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferenceImageSectionProps {
  /** Unique slug for this row — used to namespace localStorage keys */
  rowSlug: string;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
};

const ZONE_LABEL_STYLE: React.CSSProperties = {
  ...MONO,
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: "#9ca3af",
  fontWeight: 500,
  marginBottom: "6px",
  textTransform: "uppercase",
};

const REMOVE_BTN_STYLE: React.CSSProperties = {
  ...MONO,
  fontSize: "10px",
  letterSpacing: "0.05em",
  color: "#9ca3af",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  marginTop: "4px",
};

const BADGE_STYLE: React.CSSProperties = {
  ...MONO,
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: "white",
  background: "rgba(0,0,0,0.45)",
  padding: "4px 8px",
  borderRadius: "4px",
  pointerEvents: "none",
  userSelect: "none",
};

// ─── UploadZone sub-component ─────────────────────────────────────────────────

interface UploadZoneProps {
  side: "before" | "after";
  onUpload: (file: File) => void;
}

function UploadZone({ side, onUpload }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    // reset so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex-1 min-w-0">
      <div style={ZONE_LABEL_STYLE}>{side}</div>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${side} image`}
        className="flex flex-col items-center justify-center gap-2 rounded-lg transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{
          border: "1.5px dashed #d1d5db",
          height: "120px",
          padding: "16px",
          cursor: "pointer",
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload size={18} strokeWidth={1.5} color="#9ca3af" />
        <span
          style={{ ...MONO, fontSize: "10px", color: "#9ca3af", textAlign: "center" }}
        >
          Upload {side} image
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ─── Single-image lightbox (zoom + drag-to-pan) ───────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; tx: number; ty: number } | null>(null);
  const hasDraggedRef = useRef(false);

  // Reset pan when zoom returns to 1×
  useEffect(() => {
    if (zoomLevel === 1) { setTranslateX(0); setTranslateY(0); }
  }, [zoomLevel]);

  // Keyboard + scroll-wheel zoom
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "+" || e.key === "=") setZoomLevel((p) => Math.min(5, p + 0.25));
      if (e.key === "-") setZoomLevel((p) => Math.max(0.5, p - 0.25));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomLevel((p) => Math.min(5, Math.max(0.5, p + (e.deltaY < 0 ? 0.25 : -0.25))));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [onClose]);

  const closeIfNotDragged = () => {
    if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
    onClose();
  };

  const startDrag = (mouseX: number, mouseY: number) => {
    if (zoomLevel <= 1) return;
    hasDraggedRef.current = false;
    dragStartRef.current = { mouseX, mouseY, tx: translateX, ty: translateY };
    setIsDragging(true);
  };
  const moveDrag = (mouseX: number, mouseY: number) => {
    if (!dragStartRef.current) return;
    hasDraggedRef.current = true;
    setTranslateX(dragStartRef.current.tx + mouseX - dragStartRef.current.mouseX);
    setTranslateY(dragStartRef.current.ty + mouseY - dragStartRef.current.mouseY);
  };
  const stopDrag = () => { dragStartRef.current = null; setIsDragging(false); };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={closeIfNotDragged}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={(e) => { if (e.touches[0]) moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={stopDrag}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "fixed", top: "1rem", right: "1rem", background: "none",
          border: "none", color: "#fff", fontSize: "2rem", cursor: "pointer",
          width: "32px", height: "32px", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 10001, padding: 0, lineHeight: 1,
        }}
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Zoomed image */}
      <img
        src={src}
        alt="Reference — zoomed"
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); startDrag(e.clientX, e.clientY); }}
        onTouchStart={(e) => { e.stopPropagation(); if (e.touches[0]) startDrag(e.touches[0].clientX, e.touches[0].clientY); }}
        style={{
          maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain", userSelect: "none",
          transform: `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.1s ease",
          cursor: isDragging ? "grabbing" : zoomLevel > 1 ? "grab" : "default",
          display: "block",
        }}
      />

      {/* Zoom controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          background: "rgba(0,0,0,0.6)", borderRadius: "9999px",
          padding: "0.5rem 1.25rem", zIndex: 10001,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setZoomLevel((p) => Math.max(0.5, p - 0.25)); }}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "9999px", width: "32px", height: "32px", cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Zoom out"
        >−</button>
        <span style={{ ...MONO, fontSize: "0.8125rem", color: "#fff", minWidth: "3rem", textAlign: "center" }}>
          {zoomLevel.toFixed(1)}×
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setZoomLevel((p) => Math.min(5, p + 0.25)); }}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "9999px", width: "32px", height: "32px", cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Zoom in"
        >+</button>
      </div>
    </div>,
    document.body,
  );
}

// ─── Single image display (one side uploaded) ─────────────────────────────────

interface SingleImageProps {
  src: string;
  label: "BEFORE" | "AFTER";
  onRemove: () => void;
  onLightboxOpen: (src: string) => void;
}

function SingleImage({ src, label, onRemove, onLightboxOpen }: SingleImageProps) {
  return (
    <div className="flex-1 min-w-0" style={{ maxWidth: "220px" }}>
      <div style={ZONE_LABEL_STYLE}>{label}</div>
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer"
        style={{ height: "120px" }}
        onClick={() => onLightboxOpen(src)}
      >
        <img src={src} alt={label} className="w-full h-full object-cover" />
        {/* Badge */}
        <div
          className="absolute top-2 left-2 pointer-events-none"
          style={BADGE_STYLE}
        >
          {label}
        </div>
        {/* Remove button */}
        <button
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90"
          style={{ background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label} image`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ─── Static thumbnail (both images uploaded — inline view) ────────────────────

interface StaticThumbnailProps {
  src: string;
  label: "BEFORE" | "AFTER";
  onClick: () => void;
}

function StaticThumbnail({ src, label, onClick }: StaticThumbnailProps) {
  return (
    <div
      className="relative flex-1 min-w-0 rounded-lg overflow-hidden cursor-pointer"
      style={{ height: "120px" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${label} image in lightbox`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <img src={src} alt={label} className="w-full h-full object-cover" draggable={false} />
      {/* Badge: BEFORE → top-left, AFTER → top-right */}
      <div
        className={`absolute top-2 ${label === "BEFORE" ? "left-2" : "right-2"} pointer-events-none`}
        style={BADGE_STYLE}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Slider lightbox (both images — full before/after slider with zoom + pan) ─

interface SliderLightboxProps {
  beforeSrc: string;
  afterSrc: string;
  onClose: () => void;
}

/**
 * Fullscreen lightbox that hosts the BeforeAfterSlider.
 *
 * Zoom transforms the entire slider container as a unit.
 * Dragging anywhere OUTSIDE the slider handle pans the zoomed view.
 * Dragging the handle moves the before/after divider — the handle's
 * onMouseDown calls stopPropagation so pan never starts on a handle drag.
 *
 * State (position=50%, zoom=1×, pan=0,0) is fresh on every mount because
 * the component is conditionally rendered and unmounts on close.
 */
function SliderLightbox({ beforeSrc, afterSrc, onClose }: SliderLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const hasDraggedRef = useRef(false);

  // Reset pan when zoom returns to 1×
  useEffect(() => {
    if (zoomLevel === 1) { setPanX(0); setPanY(0); }
  }, [zoomLevel]);

  // Keyboard + scroll-wheel zoom
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "+" || e.key === "=") setZoomLevel((p) => Math.min(5, p + 0.25));
      if (e.key === "-") setZoomLevel((p) => Math.max(0.5, p - 0.25));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomLevel((p) => Math.min(5, Math.max(0.5, p + (e.deltaY < 0 ? 0.25 : -0.25))));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [onClose]);

  // ── Pan drag helpers ──────────────────────────────────────────────────────

  const startPan = (clientX: number, clientY: number) => {
    // Only allow pan when zoomed in
    if (zoomLevel <= 1) return;
    hasDraggedRef.current = false;
    panStartRef.current = { clientX, clientY, panX, panY };
    setIsPanning(true);
  };

  const movePan = (clientX: number, clientY: number) => {
    if (!panStartRef.current) return;
    hasDraggedRef.current = true;
    setPanX(panStartRef.current.panX + clientX - panStartRef.current.clientX);
    setPanY(panStartRef.current.panY + clientY - panStartRef.current.clientY);
  };

  const stopPan = () => {
    panStartRef.current = null;
    setIsPanning(false);
  };

  // Close only if the click was on the bare overlay (not a drag from inside the slider)
  const handleOverlayClick = () => {
    if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      // Mouse events on the overlay handle pan movement and close-on-backdrop-click.
      // Clicks that originate inside the slider container are stopped by that element's
      // onClick={stopPropagation} before they reach here.
      onClick={handleOverlayClick}
      onMouseMove={(e) => movePan(e.clientX, e.clientY)}
      onMouseUp={stopPan}
      onMouseLeave={stopPan}
      onTouchMove={(e) => { if (e.touches[0]) movePan(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={stopPan}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: isPanning ? "grabbing" : "default",
      }}
    >
      {/* × Close button — top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "2rem",
          cursor: "pointer",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001,
          padding: 0,
          lineHeight: 1,
        }}
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/*
       * Slider container — 85vw × 75vh.
       * transform: translate(pan) scale(zoom) applies to this whole block.
       * onMouseDown here starts a pan drag; the BeforeAfterSlider handle's
       * onMouseDown calls stopPropagation, so handle drags never reach this.
       * onClick={stopPropagation} prevents backdrop-close when clicking inside.
       */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          e.stopPropagation();
          startPan(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          if (e.touches[0]) startPan(e.touches[0].clientX, e.touches[0].clientY);
        }}
        style={{
          width: "85vw",
          height: "75vh",
          transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
          transformOrigin: "center center",
          cursor: isPanning ? "grabbing" : zoomLevel > 1 ? "grab" : "default",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} />
      </div>

      {/* Zoom controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "9999px",
          padding: "0.5rem 1.25rem",
          zIndex: 10001,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setZoomLevel((p) => Math.max(0.5, p - 0.25)); }}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            borderRadius: "9999px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Zoom out"
        >
          −
        </button>
        <span
          style={{
            ...MONO,
            fontSize: "0.8125rem",
            color: "#fff",
            minWidth: "3rem",
            textAlign: "center",
          }}
        >
          {zoomLevel.toFixed(1)}×
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setZoomLevel((p) => Math.min(5, p + 0.25)); }}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            borderRadius: "9999px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReferenceImageSection({ rowSlug }: ReferenceImageSectionProps) {
  const [beforeSrc, setBeforeSrc] = useState<string | null>(null);
  const [afterSrc, setAfterSrc] = useState<string | null>(null);
  // Single-image lightbox (one side uploaded)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  // Before/after slider lightbox (both sides uploaded)
  const [sliderLightboxOpen, setSliderLightboxOpen] = useState(false);

  // Load persisted images on mount
  useEffect(() => {
    const storedBefore = localStorage.getItem(`ref-before-${rowSlug}`);
    const storedAfter = localStorage.getItem(`ref-after-${rowSlug}`);
    if (storedBefore) setBeforeSrc(storedBefore);
    if (storedAfter) setAfterSrc(storedAfter);
  }, [rowSlug]);

  const handleUpload = useCallback(
    (side: "before" | "after", file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (side === "before") {
          setBeforeSrc(dataUrl);
          localStorage.setItem(`ref-before-${rowSlug}`, dataUrl);
        } else {
          setAfterSrc(dataUrl);
          localStorage.setItem(`ref-after-${rowSlug}`, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    },
    [rowSlug],
  );

  const handleRemoveBefore = useCallback(() => {
    setBeforeSrc(null);
    setSliderLightboxOpen(false);
    localStorage.removeItem(`ref-before-${rowSlug}`);
  }, [rowSlug]);

  const handleRemoveAfter = useCallback(() => {
    setAfterSrc(null);
    setSliderLightboxOpen(false);
    localStorage.removeItem(`ref-after-${rowSlug}`);
  }, [rowSlug]);

  // ── Both images uploaded → static thumbnails + slider lightbox ─────────────
  if (beforeSrc && afterSrc) {
    return (
      <>
        <div className="flex gap-3">
          {/* BEFORE column */}
          <div className="flex-1 min-w-0 flex flex-col">
            <StaticThumbnail
              src={beforeSrc}
              label="BEFORE"
              onClick={() => setSliderLightboxOpen(true)}
            />
            <button style={REMOVE_BTN_STYLE} onClick={handleRemoveBefore}>
              × Before
            </button>
          </div>
          {/* AFTER column */}
          <div className="flex-1 min-w-0 flex flex-col">
            <StaticThumbnail
              src={afterSrc}
              label="AFTER"
              onClick={() => setSliderLightboxOpen(true)}
            />
            <button style={REMOVE_BTN_STYLE} onClick={handleRemoveAfter}>
              × After
            </button>
          </div>
        </div>

        {/* Slider lightbox — conditionally rendered so state resets on every open */}
        {sliderLightboxOpen && (
          <SliderLightbox
            beforeSrc={beforeSrc}
            afterSrc={afterSrc}
            onClose={() => setSliderLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  // ── One image uploaded → image with badge + upload zone for the other side ──
  if (beforeSrc || afterSrc) {
    const hasBefore = !!beforeSrc;
    return (
      <>
        <div className="flex gap-3">
          {hasBefore ? (
            <>
              <SingleImage
                src={beforeSrc!}
                label="BEFORE"
                onRemove={handleRemoveBefore}
                onLightboxOpen={setLightboxSrc}
              />
              <UploadZone side="after" onUpload={(f) => handleUpload("after", f)} />
            </>
          ) : (
            <>
              <UploadZone side="before" onUpload={(f) => handleUpload("before", f)} />
              <SingleImage
                src={afterSrc!}
                label="AFTER"
                onRemove={handleRemoveAfter}
                onLightboxOpen={setLightboxSrc}
              />
            </>
          )}
        </div>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </>
    );
  }

  // ── No images → two upload zones ────────────────────────────────────────────
  return (
    <div className="flex gap-3">
      <UploadZone side="before" onUpload={(f) => handleUpload("before", f)} />
      <UploadZone side="after" onUpload={(f) => handleUpload("after", f)} />
    </div>
  );
}
