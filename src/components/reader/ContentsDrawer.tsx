import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { parts } from "@/data/mahabharat";
import { cn } from "@/lib/utils";

export function ContentsDrawer({
  open,
  onOpenChange,
  currentPartId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPartId?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="parchment-surface w-full border-l border-gold/40 sm:max-w-md"
      >
        <SheetHeader className="border-b border-ink/10 pb-4">
          <SheetTitle className="font-display text-xl tracking-[0.25em] text-ink">
            CONTENTS
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 space-y-2 overflow-y-auto px-4 pb-8">
          {parts.map((part) => (
            <Link
              key={part.id}
              to="/read/$partId"
              params={{ partId: part.id }}
              search={{ page: 1 }}
              onClick={() => onOpenChange(false)}
              className={cn(
                "block rounded-sm border border-ink/15 px-4 py-3 transition-colors hover:border-gold",
                part.id === currentPartId && "border-gold bg-ink/5",
              )}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm text-traditional-red">
                  {String(part.number).padStart(2, "0")}
                </span>
                <span className="font-serif-body text-lg leading-snug text-ink">
                  {part.title}
                </span>
              </div>
              <p className="mt-1 pl-8 text-sm text-ink/60">{part.description}</p>
              <p className="mt-1 pl-8 text-xs tracking-widest text-ink/45">
                {part.pageCount} PAGES
              </p>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
