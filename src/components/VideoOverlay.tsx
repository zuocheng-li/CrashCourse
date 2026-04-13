import { useRef, useEffect, useState } from 'react';

/** 正确/错误反馈统一时长（ms）：Correct 停留、overlay 淡入淡出、抖动到打开视频的延迟 */
export const FEEDBACK_DURATION_MS = 320;

const fadeTransition = `opacity ${FEEDBACK_DURATION_MS}ms ease-out`;

interface Props {
  videoSrc: string;
  label: string;
  onContinue: () => void;
}

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

/** 错误反馈全屏：单 video 预加载，就绪后淡入并播放；点击 Continue 淡出后回调。iOS 用 loadedmetadata（loadeddata 常不触发），其它用 loadeddata。 */
export default function VideoOverlay({ videoSrc, label, onContinue }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setClosing(false);
  }, [videoSrc]);

  useEffect(() => {
    if (!isReady) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => {
      v.muted = false;
    }).catch(() => {});
  }, [isReady]);

  const handleContinue = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => onContinue(), FEEDBACK_DURATION_MS);
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-[#1a1a2e] flex flex-col"
      style={{ opacity: closing ? 0 : 1, transition: fadeTransition }}
    >
      {/* 预加载后淡入：同一元素先 load，loadeddata 后再显示并 play */}
      <div
        className="absolute inset-0"
        style={{ opacity: isReady ? 1 : 0, transition: fadeTransition }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          loop
          preload="auto"
          src={videoSrc}
          onLoadedMetadata={isIOS ? () => setIsReady(true) : undefined}
          onLoadedData={!isIOS ? () => setIsReady(true) : undefined}
          style={{ visibility: isReady ? 'visible' : 'hidden' }}
        />
      </div>
      {!isReady && (
        <div className="absolute inset-0 bg-[#1a1a2e]" aria-hidden />
      )}

      {/* 顶部警示框：top 考虑 safe area，避免刘海/岛屏遮挡 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 text-center max-w-[calc(100vw-48px)] min-w-[140px] px-6 py-3 rounded-2xl border border-white/15 shadow-md"
        style={{
          top: 'max(56px, calc(env(safe-area-inset-top, 0px) + 24px))',
          backgroundColor: 'rgba(139, 38, 53, 0.5)',
          opacity: isReady ? 1 : 0,
          transition: fadeTransition,
        }}
      >
        <p className="text-white/90 text-[11px] font-semibold uppercase tracking-widest">
          Warning
        </p>
        <p className="text-white font-bold mt-1.5 text-base break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {label}
        </p>
      </div>

      {/* 底部按钮 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-5"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
          opacity: isReady ? 1 : 0,
          transition: fadeTransition,
        }}
      >
        <button
          onClick={handleContinue}
          disabled={closing}
          className="w-full h-14 rounded-2xl bg-[#e94560] text-white font-semibold text-lg flex items-center justify-center shadow-md active:scale-[0.98] transition-transform"
        >
          I Understand, Continue
        </button>
      </div>
    </div>
  );
}
