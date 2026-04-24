import { Trophy } from "lucide-react";
import { useState } from "react";
import QuizModal from "./QuizModal.jsx";

const TopicQuizBanner = ({ topicId, topicTitle, onVerified }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" />
            <span className="text-sm font-semibold text-white">Topic Complete: {topicTitle}</span>
          </div>
          <div className="mt-1 text-xs text-[#666]">
            Take the verification quiz for this topic to save your score.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsQuizOpen(true)}
          className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm text-white transition-all duration-200 hover:bg-indigo-500"
        >
          Start Quiz →
        </button>
      </div>

      {isQuizOpen && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          topicId={topicId}
          topicTitle={topicTitle}
          quizType="topic"
          onPassed={() => {
            setIsQuizOpen(false);
            onVerified?.();
          }}
        />
      )}
    </>
  );
};

export default TopicQuizBanner;
