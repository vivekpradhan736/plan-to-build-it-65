import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Menu } from "lucide-react";
import { z } from "zod";
import { BookReader } from "@/components/reader/BookReader";
import { ContentsDrawer } from "@/components/reader/ContentsDrawer";
import { getNextPart, getPart } from "@/data/mahabharat";
import { saveProgress } from "@/lib/reading-progress";
import { useIsMobile } from "@/hooks/use-mobile";

const searchSchema = z.object({ page: z.coerce.number().int().min(1).catch(1) });

export const Route = createFileRoute("/read/$partId")({
  validateSearch: searchSchema,
  loader: ({ params }) => {
    const part = getPart(params.partId);
    if (!part) throw notFound();
    return { part };
  },
  head: ({ params }) => {
    const part = getPart(params.partId);
    const title = part
      ? `Part ${part.number}: ${part.title} — Mahabharat`
      : "Reader — Mahabharat";
    const description =
      part?.description ?? "Read the illustrated Mahabharat storybook page by page.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Reader,
});

function Reader() {
  const { part } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const step = isMobile ? 1 : 2;
  const rawIndex = Math.min(Math.max(page - 1, 0), part.pages.length - 1);
  const index = isMobile ? rawIndex : rawIndex - (rawIndex % 2);

  const setIndex = useCallback(
    (next: number) => {
      navigate({
        to: "/read/$partId",
        params: { partId: part.id },
        search: { page: next + 1 },
        replace: true,
      });
    },
    [navigate, part.id],
  );

  useEffect(() => {
    saveProgress(part.id, index + 1);
  }, [part.id, index]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  const lastVisible = Math.min(index + step, part.pages.length);
  const atEnd = index + step >= part.pages.length;
  const nextPart = getNextPart(part.id);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-4 border-b border-gold/20 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-1 font-display text-[11px] tracking-[0.25em] text-parchment/60 transition-colors hover:text-gold"
        >
          <ChevronLeft className="size-4" /> BACK
        </Link>
        <div className="text-center">
          <p className="font-display text-xs tracking-[0.35em] text-parchment sm:text-sm">
            MAHABHARAT
          </p>
          <p className="font-display text-[10px] tracking-[0.3em] text-gold/70">
            PART {part.number}
          </p>
        </div>
        <div className="flex items-center gap-3 text-parchment/60">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="hidden cursor-pointer transition-colors hover:text-gold sm:block"
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open contents"
            className="cursor-pointer transition-colors hover:text-gold"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <BookReader part={part} index={index} onIndexChange={setIndex} />

      <footer className="px-4 pb-4 pt-2">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6">
          <button
            type="button"
            disabled={index - step < 0}
            onClick={() => setIndex(Math.max(index - step, 0))}
            className="flex cursor-pointer items-center gap-1 font-display text-[11px] tracking-[0.25em] text-parchment/60 transition-colors hover:text-gold disabled:opacity-25"
          >
            <ChevronLeft className="size-4" /> PREV
          </button>

          <div className="flex-1">
            <div className="h-px w-full bg-parchment/10">
              <div
                className="h-px bg-gold/70 transition-all duration-500"
                style={{ width: `${(lastVisible / part.pages.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center font-display text-[10px] tracking-[0.3em] text-parchment/50">
              {lastVisible} / {part.pages.length}
            </p>
          </div>

          <button
            type="button"
            disabled={atEnd}
            onClick={() => setIndex(Math.min(index + step, part.pages.length - 1))}
            className="flex cursor-pointer items-center gap-1 font-display text-[11px] tracking-[0.25em] text-parchment/60 transition-colors hover:text-gold disabled:opacity-25"
          >
            NEXT <ChevronRight className="size-4" />
          </button>
        </div>

        {atEnd && (
          <div className="mt-3 text-center font-display text-[10px] tracking-[0.3em] text-gold/80">
            END OF PART {part.number}
            {nextPart && (
              <Link
                to="/read/$partId"
                params={{ partId: nextPart.id }}
                search={{ page: 1 }}
                className="ml-3 underline underline-offset-4 hover:text-parchment"
              >
                NEXT PART →
              </Link>
            )}
          </div>
        )}
      </footer>

      <ContentsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentPartId={part.id}
      />
    </div>
  );
}
