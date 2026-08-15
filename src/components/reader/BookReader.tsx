import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageImage } from "./PageImage";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BookPart } from "@/data/mahabharat";
import { cn } from "@/lib/utils";

const FLIP_MS = 700;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Flip = { dir: "next" | "prev" } | null;

export function BookReader({
  part,
  index,
  onIndexChange,
}: {
  part: BookPart;
  /** zero-based index of the leading (left) page */
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const isMobile = useIsMobile();
  const step = isMobile ? 1 : 2;
  const [flip, setFlip] = useState<Flip>(null);
  const dragStart = useRef<number | null>(null);
  const pages = part.pages;

  const canNext = index + step < pages.length;
  const canPrev = index - step >= 0;

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flip) return;
      if (dir === "next" && !canNext) return;
      if (dir === "prev" && !canPrev) return;
      const commit = () => {
        onIndexChange(dir === "next" ? index + step : index - step);
        setFlip(null);
      };
      if (prefersReducedMotion()) {
        commit();
        return;
      }
      setFlip({ dir });
      window.setTimeout(commit, FLIP_MS);
    },
    [flip, canNext, canPrev, index, step, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) < 50) return;
    go(dx < 0 ? "next" : "prev");
  };

  // Preload neighbouring pages only.
  const preload = useMemo(
    () =>
      [pages[index - 1], pages[index + step], pages[index + step + 1]].filter(
        Boolean,
      ) as typeof pages,
    [pages, index, step],
  );

  const left = pages[index];
  const right = !isMobile ? pages[index + 1] : undefined;

  const sheetCommon =
    "absolute inset-y-0 preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.65,0.02,0.35,1)]";

  return (
    <div
      className="relative flex w-full flex-1 touch-pan-y items-center justify-center"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStart.current = null)}
    >
      <div
        className="book-shadow relative w-full max-w-[min(96vw,1100px)] overflow-hidden rounded-sm"
        style={{ perspective: "2000px" }}
      >
        <div
          className={cn(
            "relative grid bg-ink/40",
            isMobile ? "grid-cols-1" : "grid-cols-2",
          )}
          style={{ aspectRatio: isMobile ? "3 / 4" : "3 / 2" }}
        >
          <div className="parchment-surface relative h-full w-full p-1">
            {left ? <PageImage page={left} priority /> : null}
          </div>
          {!isMobile && (
            <div className="parchment-surface relative h-full w-full border-l border-ink/15 p-1">
              {right ? <PageImage page={right} priority /> : null}
            </div>
          )}

          {/* spine shading */}
          {!isMobile && (
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 w-16 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0 0 0 / 28%), transparent)",
              }}
            />
          )}

          {/* turning sheet */}
          {flip && (
            <div
              className={cn(
                sheetCommon,
                isMobile ? "inset-x-0" : flip.dir === "next" ? "right-0 w-1/2" : "left-0 w-1/2",
              )}
              style={{
                transformOrigin: flip.dir === "next" ? "left center" : "right center",
                transform:
                  flip.dir === "next"
                    ? "rotateY(-176deg)"
                    : "rotateY(176deg)",
                boxShadow: "var(--shadow-page)",
              }}
            >
              <div className="parchment-surface backface-hidden absolute inset-0 p-1">
                {(flip.dir === "next" ? (right ?? left) : left) ? (
                  <PageImage page={(flip.dir === "next" ? (right ?? left) : left)!} priority />
                ) : null}
              </div>
              <div
                className="parchment-surface backface-hidden absolute inset-0 p-1"
                style={{ transform: "rotateY(180deg)" }}
              >
                {(flip.dir === "next" ? pages[index + step] : pages[index - 1]) ? (
                  <PageImage
                    page={(flip.dir === "next" ? pages[index + step] : pages[index - 1])!}
                    priority
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* edge tap zones */}
      <button
        type="button"
        aria-label="Previous page"
        disabled={!canPrev}
        onClick={() => go("prev")}
        className="absolute inset-y-0 left-0 w-[12%] cursor-w-resize disabled:cursor-default"
      />
      <button
        type="button"
        aria-label="Next page"
        disabled={!canNext}
        onClick={() => go("next")}
        className="absolute inset-y-0 right-0 w-[12%] cursor-e-resize disabled:cursor-default"
      />

      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        {preload.map((p) => (
          <img key={p.id} src={p.imageUrl} alt="" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
