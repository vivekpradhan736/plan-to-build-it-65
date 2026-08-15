import { createFileRoute, Link } from "@tanstack/react-router";
import { parts } from "@/data/mahabharat";

export const Route = createFileRoute("/contents")({
  head: () => ({
    meta: [
      { title: "Contents — Mahabharat Storybook" },
      {
        name: "description",
        content:
          "Browse every part of the Mahabharat storybook: chapter titles, short summaries and page counts.",
      },
      { property: "og:title", content: "Contents — Mahabharat Storybook" },
      {
        property: "og:description",
        content: "The complete table of contents of the illustrated Mahabharat storybook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contents,
});

function Contents() {
  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="font-display text-[11px] tracking-[0.3em] text-parchment/50 transition-colors hover:text-gold"
        >
          ← HOME
        </Link>
        <h1 className="mt-8 text-center font-display text-2xl tracking-[0.3em] text-parchment sm:text-4xl">
          MAHABHARAT
        </h1>
        <p className="mt-2 text-center font-serif-body text-lg text-parchment/60">
          The Complete Journey
        </p>
        <div className="gold-rule mx-auto mt-6 h-px w-40" />

        <ul className="mt-10 space-y-4">
          {parts.map((part) => (
            <li key={part.id}>
              <Link
                to="/read/$partId"
                params={{ partId: part.id }}
                search={{ page: 1 }}
                className="parchment-surface page-shadow flex items-start gap-5 rounded-sm border border-gold/40 p-5 transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={part.coverImage}
                  alt={`Part ${part.number} thumbnail`}
                  loading="lazy"
                  width={90}
                  height={120}
                  className="hidden h-24 w-18 rounded-[2px] object-cover sm:block"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-lg text-traditional-red">
                      {String(part.number).padStart(2, "0")}
                    </span>
                    <h2 className="font-serif-body text-xl leading-snug text-ink">
                      {part.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-ink/65">{part.description}</p>
                  <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-ink/50">
                    {part.pageCount} PAGES →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
