import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Mahabharat Storybook" },
      {
        name: "description",
        content:
          "What this handwritten digital Mahabharat storybook is, how it is divided into parts, and how to use the interactive reader.",
      },
      { property: "og:title", content: "About — The Mahabharat Storybook" },
      {
        property: "og:description",
        content: "About the handwritten, illustrated Mahabharat storybook and its reader.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="font-display text-[11px] tracking-[0.3em] text-parchment/50 transition-colors hover:text-gold"
        >
          ← HOME
        </Link>
        <h1 className="mt-8 font-display text-2xl tracking-[0.2em] text-parchment sm:text-3xl">
          THE MAHABHARAT STORYBOOK
        </h1>
        <div className="gold-rule mt-5 h-px w-40" />

        <div className="mt-8 space-y-4 font-serif-body text-lg leading-relaxed text-parchment/75">
          <p>
            Yeh ek digital handwritten storybook hai — har page haath se likha aur chitrit
            kiya gaya hai, aur yahan usi original roop mein dikhaya jaata hai.
          </p>
          <p>
            Poori kahani parts mein baanti gayi hai, taaki aap thoda-thoda karke aaram se
            padh sakein. Aapki reading position aapke apne browser mein save hoti hai.
          </p>
        </div>

        <div className="parchment-surface mt-10 rounded-sm border border-gold/40 p-6">
          <p className="font-display text-[11px] tracking-[0.3em] text-ink/60">HOW TO READ</p>
          <ul className="mt-4 space-y-2 font-serif-body text-lg text-ink/85">
            <li>Swipe → Turn page</li>
            <li>← → Navigate pages</li>
            <li>☰ → Contents</li>
            <li>⛶ → Fullscreen</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
