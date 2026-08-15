import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BookPage } from "@/data/mahabharat";

export function PageImage({
  page,
  priority = false,
  className,
}: {
  page: BookPage;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "parchment-surface flex h-full w-full flex-col items-center justify-center gap-2 rounded-sm px-6 text-center",
          className,
        )}
      >
        <p className="font-display text-sm tracking-widest text-traditional-red">
          PAGE UNAVAILABLE
        </p>
        <p className="font-serif-body text-base text-ink/70">
          Yeh page abhi load nahi ho paaya. Kripya dobara koshish karein.
        </p>
      </div>
    );
  }

  return (
    <img
      src={page.imageUrl}
      alt={page.altText}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn("h-full w-full select-none object-contain", className)}
    />
  );
}
