import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorialScreen.css';

const SLIDES = [
  {
    video: './tutorialVideos/swipe and  learn form wrong case.mov',
    title: 'Swipe & Learn',
    desc: 'Swipe to answer — wrong answers show real crash videos',
  },
  {
    video: './tutorialVideos/review wrong question anytime.mov',
    title: 'Review Anytime',
    desc: 'Go back and review any question you got wrong',
  },
  {
    video: './tutorialVideos/go. to profile to check progress.mov',
    title: 'Track Progress',
    desc: "Check your profile to see how you're doing",
  },
];

export default function TutorialScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const startXRef = useRef(0);
  const moveXRef = useRef(0);
  const draggingRef = useRef(false);

  const goTo = useCallback((index: number) => {
    let next = index;
    if (next < 0) next = SLIDES.length - 1;
    if (next >= SLIDES.length) next = 0;
    setCurrent(next);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    draggingRef.current = true;
    moveXRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    moveXRef.current = e.touches[0].clientX - startXRef.current;
  };
  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (moveXRef.current < -40) goTo(current + 1);
    else if (moveXRef.current > 40) goTo(current - 1);
    moveXRef.current = 0;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    draggingRef.current = true;
    moveXRef.current = 0;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    moveXRef.current = e.clientX - startXRef.current;
  };
  const onMouseUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (moveXRef.current < -40) goTo(current + 1);
    else if (moveXRef.current > 40) goTo(current - 1);
    moveXRef.current = 0;
  };

  return (
    <div className="tutorial-page -mx-5 px-0 flex flex-col items-center justify-center min-h-[calc(100dvh-44px)]"
      style={{ gap: 0 }}
    >
      {/* Video Carousel */}
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => { draggingRef.current = false; }}
        >
          {SLIDES.map((slide, i) => (
            <div key={i} className="carousel-slide">
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={slide.video}
                muted
                playsInline
                loop
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="dot-indicators">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Slide description */}
      <div className="slide-description">
        <h3>{SLIDES[current].title}</h3>
        <p>{SLIDES[current].desc}</p>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center px-6 mt-4 w-full">
        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-[280px] py-3.5 rounded-xl bg-[#e94560] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e94560]/25 active:scale-[0.98] transition-transform"
        >
          <i className="fas fa-sign-in-alt" /> Login
        </button>
        <p className="text-white/60 text-sm mt-3">
          New here?{' '}
          <span
            className="text-[#e94560] font-semibold cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
