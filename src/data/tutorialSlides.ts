/** 教程轮播数据，视频为本地路径（放在 public/tutorialVideos/） */

export const TUTORIAL_SLIDES = [
  { video: '/tutorialVideos/swipe and  learn form wrong case.mov', title: 'Swipe & Learn', desc: 'Swipe to answer — wrong answers show real crash videos' },
  { video: '/tutorialVideos/review wrong question anytime.mov', title: 'Review Anytime', desc: 'Go back and review any question you got wrong' },
  { video: '/tutorialVideos/go. to profile to check progress.mov', title: 'Track Progress', desc: "Check your profile to see how you're doing" },
] as const;

/** 本地路径转成完整 URL（同源） */
export function getTutorialVideoUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${window.location.origin}${p}`;
}
