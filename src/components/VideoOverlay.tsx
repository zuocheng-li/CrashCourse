import { useRef, useEffect } from 'react';

interface Props {
  videoSrc: string;
  label: string;
  onContinue: () => void;
}

export default function VideoOverlay({ videoSrc, label, onContinue }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => {
      v.muted = false;
    }).catch(() => {});
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f3460] to-[#1a1a2e]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          loop
          src={videoSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60 flex flex-col items-center justify-end pb-32">
          <div className="glass w-16 h-16 rounded-full flex items-center justify-center mb-3">
            <i className="fas fa-exclamation-triangle text-3xl text-amber-400" />
          </div>
          <p className="text-lg font-semibold">Wrong answer</p>
          <p className="text-white/80 text-sm mt-1 px-6 text-center">
            This is why the rule matters. Watch, then continue.
          </p>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pt-[calc(44px+0.5rem)]">
        <span className="text-white/90 text-sm font-medium">
          {label} — wrong choice
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-4 z-10"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 34px) + 16px)' }}
      >
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-[#e94560] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="fas fa-arrow-right" />
          Continue to next question
        </button>
      </div>
    </div>
  );
}
