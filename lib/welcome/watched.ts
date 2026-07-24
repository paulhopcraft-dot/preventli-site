// Tracks which chapter videos a user has already watched (closed the
// lightbox on). Keyed by chapter id, so it persists across visits with no
// backend — just localStorage. A workflow node shows its checkmark whenever
// its chapter is in this set.

const STORAGE_KEY = "preventli:welcome:watched-chapters";

export function getWatchedChapters(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function markChapterWatched(chapterId: string): Set<string> {
  const current = getWatchedChapters();
  current.add(chapterId);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    } catch {
      // localStorage unavailable (private mode, etc.) — watched state just
      // won't persist across visits. Not worth surfacing to the user.
    }
  }
  return current;
}
