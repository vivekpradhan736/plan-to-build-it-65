export type ReadingProgress = {
  partId: string;
  page: number;
  updatedAt: number;
};

const STORAGE_KEY = "mahabharat:progress";

export function loadProgress(): ReadingProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReadingProgress;
    if (!parsed?.partId || typeof parsed.page !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress(partId: string, page: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ partId, page, updatedAt: Date.now() } satisfies ReadingProgress),
    );
  } catch {
    /* storage unavailable — reading still works */
  }
}
