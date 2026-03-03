import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';
import VideoOverlay from '../components/VideoOverlay';
import { useQuizStore } from '../stores/quizStore';
import { useHideTab } from '../components/AppShell';

export default function QuizScreen() {
  const navigate = useNavigate();
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const streak = useQuizStore((s) => s.streak);
  const submitAnswer = useQuizStore((s) => s.submitAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const toggleFavorite = useQuizStore((s) => s.toggleFavorite);
  const resetSession = useQuizStore((s) => s.resetSession);
  const answers = useQuizStore((s) => s.answers);

  const question = questions[currentIndex] ?? null;
  const isDone = currentIndex >= questions.length;
  const progress =
    questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0;

  const hideTab = useHideTab();

  const [wrongVideo, setWrongVideo] = useState<{
    src: string;
    label: string;
  } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    hideTab(wrongVideo !== null);
  }, [wrongVideo, hideTab]);

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!question) return;
      submitAnswer(question.id, correct);

      if (correct) {
        setTimeout(() => {
          nextQuestion();
          setCardKey((k) => k + 1);
        }, 280);
      } else {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setWrongVideo({
            src: question.videoSrc,
            label: question.videoLabel,
          });
        }, 500);
      }
    },
    [question, submitAnswer, nextQuestion],
  );

  const handleVideoContinue = useCallback(() => {
    setWrongVideo(null);
    nextQuestion();
    setCardKey((k) => k + 1);
  }, [nextQuestion]);

  const handleFavorite = useCallback(() => {
    if (question) toggleFavorite(question.id);
  }, [question, toggleFavorite]);

  useEffect(() => {
    setCardKey(0);
  }, [questions]);

  // ─── Done screen ───
  if (isDone) {
    const totalCorrect = answers.filter((a) => a.correct).length;
    const totalWrong = answers.filter((a) => !a.correct).length;

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-160px)]">
        <div className="glass p-8 rounded-2xl text-center max-w-[320px]">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-double text-3xl text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold">You're done!</h2>
          <p className="text-white/80 text-sm mt-2">
            {totalCorrect} correct, {totalWrong} wrong out of{' '}
            {questions.length} questions.
          </p>
          <button
            onClick={() => {
              resetSession();
              setCardKey((k) => k + 1);
            }}
            className="w-full py-3.5 rounded-xl bg-[#e94560] text-white font-semibold flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#e94560]/25 active:scale-[0.98] transition-transform"
          >
            <i className="fas fa-redo" /> Play again
          </button>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-white/70 text-sm mt-6"
        >
          View profile
        </button>
      </div>
    );
  }

  // ─── Active quiz ───
  return (
    <>
      {wrongVideo && (
        <VideoOverlay
          videoSrc={wrongVideo.src}
          label={wrongVideo.label}
          onContinue={handleVideoContinue}
        />
      )}

      <div className="pt-2 pb-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Quiz</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <i className="fas fa-fire-alt" />
            <span>{streak} streak</span>
          </div>
        </header>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#e94560]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-white/70">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="min-h-[420px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {question && (
              <motion.div
                key={cardKey}
                className={`w-full max-w-[340px] ${shaking ? 'card-shake' : ''}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SwipeCard
                  question={question}
                  onResult={handleResult}
                  onFavorite={handleFavorite}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
