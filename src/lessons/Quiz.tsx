import { useState } from 'react';
import { Rich } from '@/lessons/RichText';

interface QuizProps {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

/** Anında geri bildirimli kendini sınama sorusu. */
export function Quiz({ question, options, answer, explain }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === answer;

  return (
    <div className={`quiz${answered ? (correct ? ' correct' : ' wrong') : ''}`}>
      <span className="quiz-tag">Kendini Sına</span>
      <p className="quiz-question">
        <Rich text={question} />
      </p>
      <div className="quiz-options" role="group" aria-label="Cevap seçenekleri">
        {options.map((opt, i) => {
          let cls = 'quiz-option';
          if (answered) {
            if (i === answer) cls += ' is-answer';
            else if (i === picked) cls += ' is-picked-wrong';
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
              <Rich text={opt} />
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="quiz-feedback" role="status">
          <strong>{correct ? 'Doğru! ' : 'Yanlış. '}</strong>
          <Rich text={explain} />
          <button type="button" className="quiz-retry" onClick={() => setPicked(null)}>
            Tekrar dene
          </button>
        </div>
      )}
    </div>
  );
}
