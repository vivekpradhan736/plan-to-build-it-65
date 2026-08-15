import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import coverImage from "@/assets/book-cover.jpg";
import { Embers } from "@/components/home/Embers";
import { firstPartId, getPart } from "@/data/mahabharat";
import { loadProgress, type ReadingProgress } from "@/lib/reading-progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mahabharat — The Interactive Storybook" },
      {
        name: "description",
        content:
          "Explore the timeless story of Mahabharat through beautifully illustrated handwritten pages in an immersive digital book experience.",
      },
      { property: "og:title", content: "Mahabharat — The Interactive Storybook" },
      {
        property: "og:description",
        content:
          "A handwritten, illustrated Mahabharat storybook you can open, turn and read page by page.",
      },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const open = (partId: string, page: number) => {
    setOpening(true);
    window.setTimeout(() => {
      navigate({ to: "/read/$partId", params: { partId }, search: { page } });
    }, 850);
  };

  const savedPart = progress ? getPart(progress.partId) : undefined;

  return (
    <main className="vignette relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <Embers />

      <p className="font-display text-xs tracking-[0.6em] text-gold/80">✦</p>
      <h1 className="mt-4 text-center font-display text-3xl tracking-[0.35em] text-parchment sm:text-5xl">
        MAHABHARAT
      </h1>
      <div className="gold-rule mt-5 h-px w-40" />
      <p className="mt-4 max-w-md text-center font-serif-body text-lg text-parchment/60">
        Ek haath se likhi gayi, chitron se saji kahani — page dar page.
      </p>

      <div className="mt-10" style={{ perspective: "1800px" }}>
        <button
          type="button"
          onClick={() => open(firstPartId, 1)}
          aria-label="Open the Mahabharat book"
          className="group block cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <img
            src={coverImage}
            alt="Mahabharat book cover with gold chariot motif on aged leather"
            width={912}
            height={1200}
            className={`book-shadow h-[52vh] max-h-[560px] w-auto rounded-sm transition-transform duration-500 group-hover:scale-[1.02] ${
              opening ? "animate-cover-open" : ""
            }`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => open(firstPartId, 1)}
        className="mt-8 cursor-pointer font-display text-xs tracking-[0.35em] text-gold transition-colors hover:text-parchment"
      >
        BEGIN READING
      </button>

      {savedPart && progress && (
        <div className="mt-8 rounded-sm border border-gold/30 px-5 py-4 text-center">
          <p className="font-display text-[10px] tracking-[0.35em] text-gold/80">
            CONTINUE READING
          </p>
          <p className="mt-2 font-serif-body text-lg text-parchment">{savedPart.title}</p>
          <p className="text-sm text-parchment/50">
            Page {progress.page} / {savedPart.pageCount}
          </p>
          <button
            type="button"
            onClick={() => open(savedPart.id, progress.page)}
            className="mt-3 cursor-pointer font-display text-xs tracking-[0.3em] text-parchment underline decoration-gold/60 underline-offset-4"
          >
            CONTINUE
          </button>
        </div>
      )}

      <nav className="mt-10 flex gap-8 font-display text-[11px] tracking-[0.3em] text-parchment/50">
        <Link to="/contents" className="transition-colors hover:text-gold">
          CONTENTS
        </Link>
        <Link to="/about" className="transition-colors hover:text-gold">
          ABOUT
        </Link>
      </nav>
    </main>
  );
}
