import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuiz, QuizQuestion } from '../../services/api';
import './Quiz.css';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    
    setSelectedIdx(idx);
    const correct = questions[currentIdx].correct === idx;
    if (correct) setScore(score + 1);
    
    setFeedback(correct ? "✅ Correct! " + questions[currentIdx].explanation : "❌ Not quite. " + questions[currentIdx].explanation);
  };

  const nextQuestion = () => {
    const next = currentIdx + 1;
    if (next < questions.length) {
      setCurrentIdx(next);
      setSelectedIdx(null);
      setFeedback(null);
    } else {
      setShowScore(true);
    }
  };

  if (loading) return <div className="quiz-loading">Preparing your challenge...</div>;

  return (
    <section id="quiz" className="section quiz-section" aria-labelledby="quizTitle">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Challenge</span>
          <h2 className="section-title" id="quizTitle">Test Your Knowledge</h2>
          <p className="section-desc">Prove your financial literacy with this quick quiz.</p>
        </div>

        <div className="quiz-container">
          <AnimatePresence mode="wait">
            {!showScore ? (
              <motion.div 
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="quiz-card"
              >
                <div className="quiz-progress">
                    Question {currentIdx + 1} of {questions.length}
                    <div className="progress-bar"><div className="fill" style={{ width: `${((currentIdx + 1)/questions.length)*100}%` }}></div></div>
                </div>
                <h3>{questions[currentIdx].question}</h3>
                <div className="quiz-options" role="radiogroup" aria-label="Answer options">
                  {questions[currentIdx].options.map((opt, i) => (
                    <button 
                      key={i}
                      className={`option-btn ${selectedIdx === i ? (questions[currentIdx].correct === i ? 'correct' : 'wrong') : ''}`}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedIdx !== null}
                      aria-pressed={selectedIdx === i}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="quiz-feedback" 
                    id="quizFeedback"
                    aria-live="assertive"
                    role="alert"
                  >
                    <p>{feedback}</p>
                    <button className="btn btn-primary" onClick={nextQuestion}>
                      {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="score-card"
              >
                <div className="score-circle">
                  <span className="number">{score}</span>
                  <span className="total">/ {questions.length}</span>
                </div>
                <h3>Your Score</h3>
                <p>{score >= 8 ? 'Master of Finance!' : score >= 5 ? 'Building a strong foundation.' : 'Keep learning, you got this!'}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Quiz;
