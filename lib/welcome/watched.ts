// Tracks which chapter videos a partner user has already watched (closed the
// lightbox on). Keyed by partner slug + chapter id, so it persists across
// visits with no backend — just localStorage. A workflow node shows its
// checkmark whenever its chapter is in this set.

function storageKey(partnerSlug: string): string {
  return `preventli:welcome:${partnerSlug}:watched-chapters`;
}

export function getWatchedChapters(partnerSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(partnerSlug));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function markChapterWatched(partnerSlug: string, chapterId: string): Set<string> {
  const current = getWatchedChapters(partnerSlug);
  current.add(chapterId);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(storageKey(partnerSlug), JSON.stringify([...current]));
    } catch {
      // localStorage unavailable (private mode, etc.) — watched state just
      // won't persist across visits. Not worth surfacing to the user.
    }
  }
  return current;
}
