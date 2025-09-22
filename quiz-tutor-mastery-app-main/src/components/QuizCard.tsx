import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/hooks/useQuizData';

type QuizCardProps = {
  question: QuizQuestion;
  questionIndex: number;
};

export const QuizCard = ({ question, questionIndex }: QuizCardProps) => {
  const { userAnswers, setUserAnswers } = useQuiz();

  const isMultipleCorrect = Array.isArray(question.answers);

  const getCorrectAnswers = () => {
    if (Array.isArray(question.answers)) return question.answers;
    if (question.answer) return [question.answer];
    return [];
  };

  const handleAnswerChange = (option: string) => {
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      const currentAnswers = newAnswers[questionIndex] || [];

      if (isMultipleCorrect) {
        // Multi-select
        if (currentAnswers.includes(option)) {
          newAnswers[questionIndex] = currentAnswers.filter(opt => opt !== option);
        } else {
          newAnswers[questionIndex] = [...currentAnswers, option];
        }
      } else {
        // Single-select
        newAnswers[questionIndex] = [option];
      }

      return newAnswers;
    });
  };

  const isOptionSelected = (option: string) => {
    return userAnswers[questionIndex]?.includes(option) || false;
  };

  const isCorrectAnswer = (option: string) => {
    if (!isOptionSelected(option)) return false;
    const correctAnswers = getCorrectAnswers();
    return correctAnswers.includes(option);
  };

  return (
    <div className="border-white/55 border-2 rounded-xl shadow-sm p-6 mb-6 transition-all">
      <h3 className="text-lg font-semibold mb-4 text-white/80">
        {questionIndex + 1}. {question.question}
      </h3>
      <div className="space-y-3">
        {Object.entries(question.options).map(([optionKey, optionText]) => {
          const selected = isOptionSelected(optionKey);
          const correct = isCorrectAnswer(optionKey);

          return (
            <button
              key={optionKey}
              onClick={() => handleAnswerChange(optionKey)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                "flex items-center justify-between group hover:bg-gray-500",
                selected && correct && "bg-green-50 border-green-200 text-green-900",
                selected && !correct && "bg-red-50 border-red-200 text-red-900",
                !selected && "border border-gray-200"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{optionKey}.</span>
                <span>{optionText}</span>
              </span>
              {selected && (
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full",
                  correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
