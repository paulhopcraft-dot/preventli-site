// The onboarding tour is split into 5 short chapter videos. Workflow map
// nodes each point at one chapter (and optionally a start-time hint inside
// it) so several nodes can share a single video.
//
// TODO(video): every entry below is a placeholder. Real chapter videos are
// being produced in parallel — once a file lands, set its `src` (and swap
// `poster` for a real frame grab if desired) and this page picks it up with
// no other changes.

export type Chapter = {
  id: string;
  index: number;
  title: string;
  description: string;
  /** Real hosted video URL. Left undefined until the file is produced. */
  src?: string;
  poster: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "getting-started",
    index: 1,
    title: "Getting started",
    description: "Sign up, verify your email, and find your way around the partner workspace.",
    src: "/welcome/getting-started.mp4",
    poster: "/welcome/getting-started-poster.jpg",
  },
  {
    id: "setting-up-a-client",
    index: 2,
    title: "Setting up a client",
    description: "Add a client company and upload the job descriptions you'll be checking against.",
    poster: "/welcome/video-placeholder.svg",
  },
  {
    id: "creating-and-sending-checks",
    index: 3,
    title: "Creating and sending checks",
    description: "Create a check and send the secure link to your candidate.",
    poster: "/welcome/video-placeholder.svg",
  },
  {
    id: "the-candidate-experience",
    index: 4,
    title: "The candidate experience",
    description: "What the candidate sees, and how automatic reminders keep things moving.",
    poster: "/welcome/video-placeholder.svg",
  },
  {
    id: "clinical-review",
    index: 5,
    title: "Clinical review & client notification",
    description: "How the report is drafted, reviewed by GPNet clinicians, approved, and sent to your client.",
    poster: "/welcome/video-placeholder.svg",
  },
];

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
