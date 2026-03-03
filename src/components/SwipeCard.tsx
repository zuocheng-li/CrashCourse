import { useState, useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion';
import type { Question } from '../data/questions';

const COMMIT_DISTANCE = 80;
const FLICK_VELOCITY = 300;
const EXIT_X = 420;

interface Props {
  question: Question;
  /** Called after the card exits. `correct` already evaluated. */
  onResult: (correct: boolean) => void;
  onFavorite: () => void;
}

export default function SwipeCard({ question, onResult, onFavorite }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(
    x,
    [-EXIT_X, -150, 0, 150, EXIT_X],
    [0, 1, 1, 1, 0],
  );
  const committed = useRef(false);

  const canSubmit =
    question.type === 'true_false' || selectedIndex !== null;

  const evaluate = useCallback(
    (direction: 'left' | 'right'): boolean => {
      if (question.type === 'true_false') {
        return (
          (direction === 'right' && question.answer === true) ||
          (direction === 'left' && question.answer === false)
        );
      }
      if (question.options && selectedIndex !== null) {
        return question.options[selectedIndex].correct;
      }
      return false;
    },
    [question, selectedIndex],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (committed.current) return;

      const dx = info.offset.x;
      const vx = info.velocity.x;
      const dy = info.offset.y;

      // Swipe up → favorite (snap back)
      if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
        onFavorite();
        animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
        return;
      }

      const isFlick = Math.abs(vx) > FLICK_VELOCITY && Math.abs(dx) > 18;
      const isDistance = Math.abs(dx) > COMMIT_DISTANCE;

      if (!canSubmit || (!isFlick && !isDistance)) {
        // Snap back to center
        animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
        return;
      }

      committed.current = true;
      const direction = dx > 0 ? 'right' : 'left';
      const correct = evaluate(direction);
      const target = dx > 0 ? EXIT_X : -EXIT_X;

      if (correct) {
        // Fly out, then callback
        animate(x, target, { duration: 0.25, ease: 'easeOut' }).then(() =>
          onResult(true),
        );
      } else {
        // Snap back then shake (parent handles shake via onResult(false))
        animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 }).then(
          () => {
            committed.current = false;
            onResult(false);
          },
        );
      }
    },
    [canSubmit, evaluate, onResult, onFavorite, x],
  );

  return (
    <div className="relative">
      <motion.div
        className="glass overflow-hidden rounded-[20px] shadow-2xl cursor-grab active:cursor-grabbing select-none"
        style={{ x, rotate, opacity, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
      >
        {/* Header image */}
        <div className="h-28 relative bg-gradient-to-br from-[#0f3460]/90 to-[#e94560]/50 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=680&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <i className="fas fa-traffic-light text-3xl text-white/80 relative z-10 drop-shadow-lg" />
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
            {question.type === 'true_false' ? 'True or False' : 'Choose one'}
          </p>
          <p className="text-lg font-medium leading-snug text-white">
            {question.statement}
          </p>

          {question.type === 'true_false' ? (
            <div className="flex gap-4 mt-6">
              <span className="px-4 py-2 rounded-xl bg-red-500/20 text-red-200 text-sm font-medium">
                False
              </span>
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 text-sm font-medium">
                True
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-6">
              {question.options?.map((opt, i) => (
                <button
                  key={i}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(i);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors text-white/90
                    ${
                      selectedIndex === i
                        ? 'bg-white/15 ring-2 ring-[#e94560]'
                        : 'bg-white/10 border border-white/20 hover:bg-white/15'
                    }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Hints below card */}
      {question.type === 'true_false' ? (
        <div className="flex items-center justify-center gap-8 mt-6 text-white/60 text-sm">
          <span>
            <i className="fas fa-arrow-left mr-1" /> False
          </span>
          <span>
            <i className="fas fa-arrow-up mr-1" /> Favorite
          </span>
          <span>
            True <i className="fas fa-arrow-right ml-1" />
          </span>
        </div>
      ) : (
        <p className="text-center text-white/50 text-sm mt-4">
          {selectedIndex === null
            ? 'Pick one option, then swipe to submit.'
            : 'Now swipe left or right to check your answer.'}
        </p>
      )}
    </div>
  );
}
