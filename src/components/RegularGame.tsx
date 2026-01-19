import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, List, X, Check, Timer, Plus, Divide, Minus } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import type { IGame } from '../store/useGameStore';
import { ViewAllQuestionsDialog } from './ViewAllQuestionsDialog';

interface Question {
  id: number;
  question: any;
  answer: string;
}

type GameState = 'ready' | 'playing' | 'submitted';

export function RegularGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const { selectedGame, game, fetchGame, gameLoading, setGame } = useGameStore();

  const evaluateAnswer = (numList: number[], operationList: string[]): number => {
  let result = numList[0];
  
  for (let i = 1; i < numList.length; i++) {
    const operation = operationList[i];
    const currentNum = numList[i];
    
    switch (operation) {
      case 'add':
        result += currentNum;
        break;
      case 'subtract':
        result -= currentNum;
        break;
      case 'multiply':
        result *= currentNum;
        break;
      case 'divide':
        result /= currentNum;
        break;
      default:
        // Handle empty string or unknown operations
        break;
    }
  }
  
  return result;
};


  const generateQuestions = () => {
  const questionsList: Question[] = [];
  for (let i = 0; i < game.length; i++) {
    const numList = [];
    let operationList = [];
    for (let j = 0; j < game[i].length; j++) {
      numList.push(game[i][j].value);
      operationList.push(game[i][j].operation);
    }
    const question = QuestionTemplate(numList, operationList);
    // const answer =
    //   operation === '+'
    //     ? (num1 + num2 + num3 + num4).toString()
    //     : (num1 - num2 - num3 - num4).toString();
    const answer = evaluateAnswer(numList, operationList).toString();

    questionsList.push({
      id: i,
      question,
      answer,
    });
  }
  console.log(questionsList);

  setQuestions(questionsList);
  setGameState('playing');
};

  useEffect(() => {
    if (!game) return;
    generateQuestions();
  }, [game]);
  
  useEffect(() => {
    if (gameState !== 'playing') {
      return;
    }
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    fetchGame();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      slideLeft();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      slideRight();
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
    const windMaxIndex =
      index + WINDOWSIZE - 1 >= questions.length ? questions.length - 1 : index + WINDOWSIZE - 1;
    const windMinIndex = windMaxIndex - WINDOWSIZE + 1;
    setSlidingWindowParams({
      ...slidingWindowParams,
      currentWindowIndex: index,
      currentWindowMin: windMinIndex,
      currentWindowMax: windMaxIndex,
      list: questions.slice(windMinIndex, windMaxIndex + 1),
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setGameState('submitted');
  };

  const isAnswered = (questionId: number) => {
    return answers[questionId] !== undefined && answers[questionId] !== '';
  };

  const isCorrect = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question && answers[questionId] === question.answer;
  };

  const allQuestionsAnswered = questions.every(q => isAnswered(q.id));

  const WINDOWSIZE = 5;
  

const [slidingWindowParams, setSlidingWindowParams] = useState<any>({
    windowSize: WINDOWSIZE,
    list: [],
    current: 0,
    currentWindowIndex: 0,
    currentWindowMin: 0,
    currentWindowMax: WINDOWSIZE - 1,
  });

  useEffect(() => {
    if (questions.length > 0) {
      setSlidingWindowParams({
        windowSize: WINDOWSIZE,
        list: questions.slice(0, WINDOWSIZE),
        current: 0,
        currentWindowIndex: 0,
        currentWindowMin: 0,
        currentWindowMax: WINDOWSIZE - 1,
      });
    }
  }, [questions]);

  const slideLeft = () => {
    if (slidingWindowParams.currentWindowIndex - 1 >= slidingWindowParams.currentWindowMin) {
      setSlidingWindowParams({
        ...slidingWindowParams,
        currentWindowIndex: slidingWindowParams.currentWindowIndex - 1,
      });
    } else if (
      slidingWindowParams.currentWindowIndex - 1 < slidingWindowParams.currentWindowMin &&
      slidingWindowParams.currentWindowIndex - 1 >= 0
    ) {
      setSlidingWindowParams({
        ...slidingWindowParams,
        currentWindowIndex: slidingWindowParams.currentWindowIndex - 1,
        currentWindowMin: slidingWindowParams.currentWindowMin - 1,
        currentWindowMax: slidingWindowParams.currentWindowMax - 1,
        list: questions.slice(
          slidingWindowParams.currentWindowMin - 1,
          slidingWindowParams.currentWindowMax - 1 + 1
        ),
      });
    }
  };

  const slideRight = () => {
    if (slidingWindowParams.currentWindowIndex + 1 <= slidingWindowParams.currentWindowMax) {
      setSlidingWindowParams({
        ...slidingWindowParams,
        currentWindowIndex: slidingWindowParams.currentWindowIndex + 1,
      });
    } else if (
      slidingWindowParams.currentWindowIndex + 1 > slidingWindowParams.currentWindowMax &&
      slidingWindowParams.currentWindowIndex + 1 < questions.length
    ) {
      setSlidingWindowParams({
        ...slidingWindowParams,
        currentWindowIndex: slidingWindowParams.currentWindowIndex + 1,
        currentWindowMin: slidingWindowParams.currentWindowMin + 1,
        currentWindowMax: slidingWindowParams.currentWindowMax + 1,
        list: questions.slice(
          slidingWindowParams.currentWindowMin + 1,
          slidingWindowParams.currentWindowMax + 1 + 1
        ),
      });
    }
  };

  const onBack = () => {
    setGame(null);
    navigate('/');
  };

  if (!selectedGame) {
    return <Navigate to="/" replace />;
  }

  if (gameState === 'submitted') {
    return (
      <div>
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-4 top-0 z-50 w-full fixed pt-16 pb-6 md:pt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
        <div className="min-h-screen flex justify-center p-4 mb-8 pt-36 md:pt-24">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl text-white mb-2">Practice Complete!</h2>
                <p className="text-gray-400">Here are your results</p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex justify-around">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Score</p>
                    <div className="text-4xl text-white">
                      {score}
                      <span className="text-2xl text-gray-400">/{questions.length}</span>
                    </div>
                    <p className="text-lg text-gray-300">
                      {Math.round((score / questions.length) * 100)}%
                    </p>
                  </div>
                  <div className="w-px bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Time Taken</p>
                    <div className="text-4xl text-white">{formatTime(time)}</div>
                    <p className="text-lg text-gray-300">{time} seconds</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white text-lg px-2">Review Answers</h3>
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
                      className={`bg-white/5 rounded-xl p-4 border ${
                        isCorrect(q.id)
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-red-500/30 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Question {index + 1}</p>
                          <div className="text-white">{q.question}</div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Your answer</p>
                          <p className={`${isCorrect(q.id) ? 'text-green-400' : 'text-red-400'}`}>
                            {answers[q.id] || 'Not answered'}
                          </p>
                          {!isCorrect(q.id) && (
                            <p className="text-gray-400 text-sm mt-1">Correct: {q.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div
          className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 pb-4 pt-14 sticky top-0 z-50 w-full"
          style={{ position: 'fixed' }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center text-xl`}
              >
                <img src={(selectedGame as IGame).icon} />
              </div>
              <div>
                <h2 className="text-lg text-white">{(selectedGame as IGame).name}</h2>
                <p className="text-xs text-gray-400">
                  {(selectedGame as IGame).digitCount} digits •{' '}
                  {(selectedGame as IGame).numberCount} numbers
                </p>
              </div>
            </div>
            <div className="w-16"></div>
          </div>
        </div>

        {gameState === 'ready' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div
                className={`w-32 h-32 bg-gradient-to-br rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl`}
              >
                <img src={(selectedGame as IGame).icon} />
              </div>
              <h2 className="text-3xl mb-4 text-white">Ready to Train?</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You will be presented with {(selectedGame as IGame).numberCount} questions.
                Answer them as quickly and accurately as possible.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                { !gameLoading ? 'Start Training' : 'Loading' }
              </motion.button>
            </motion.div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 ? (
          <div className="flex flex-col">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-4 top-0 z-50 w-full fixed pt-14 md:pt-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Exit</span>
                </button>
                <div className="flex items-center gap-2 text-white text-lg">
                  <Timer className="w-5 h-5 text-gray-400" />
                  <span>{formatTime(time)}</span>
                </div>
                <div className="h-10 bg-gradient-to-br rounded-xl flex items-center justify-center text-xl text-white">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-all">
                  <List className="w-5 h-5" />
                  <ViewAllQuestionsDialog
                    questions={questions}
                    handleQuestionNavigate={handleQuestionNavigate}
                    currentQuestionIndex={currentQuestionIndex}
                    isAnswered={isAnswered}
                    answers={answers}
                    handleSubmit={handleSubmit}
                    allQuestionsAnswered={allQuestionsAnswered}
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-32 pb-24">
              <div className="max-w-7xl">
                {/* Main Content */}
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-2xl">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10">
                      {/* Question */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                            <span className="text-white text-xl">{currentQuestionIndex + 1}</span>
                          </div>
                          <h3 className="text-gray-400">
                            Question {currentQuestionIndex + 1} of {questions.length}
                          </h3>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                          <div className="text-2xl sm:text-2xl text-white text-center tracking-wider">
                            {currentQuestion.question}
                          </div>
                        </div>
                      </div>

                      {/* Answer Input */}
                      <div className="mb-8">
                        <label className="block text-gray-400 mb-3">Your Answer</label>
                        <input
                          type="number"
                          value={answers[currentQuestion.id] || ''}
                          onChange={e => handleAnswerChange(e.target.value)}
                          placeholder="Enter your answer"
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-500"
                          autoFocus
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handlePrevious}
                          disabled={currentQuestionIndex === 0}
                          className={`w-[110px] flex justify-center items-center p-1 rounded-xl border transition-all ${
                            currentQuestionIndex === 0
                              ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </button>

                        <div className="flex gap-2">
                          {slidingWindowParams.list.map((ele: Question) => (
                            <div
                              key={ele.id}
                              className={`w-2 h-2 rounded-full transition-all ${
                                ele.id === slidingWindowParams.currentWindowIndex
                                  ? 'bg-purple-500 w-4'
                                  : isAnswered(ele.id)
                                    ? 'bg-green-500'
                                    : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={handleNext}
                          disabled={currentQuestionIndex === questions.length - 1}
                          className={`w-[110px] flex justify-center items-center p-1 rounded-xl border transition-all ${
                            currentQuestionIndex === questions.length - 1
                              ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900/50 backdrop-blur-xl border-t border-white/10 p-4">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg text-lg font-semibold"
                >
                  Submit Answers
                </button>
              </div>
            </div>
          </div>
        ) : (
          gameState === 'playing' && <div>Loading questions...</div>
        )}
      </div>
    </>
  );
}

const QuestionTemplate = (numbers: number[], operation: string[]) => {
  return (
    <div>
      {numbers.map((num: number, index: number) => {
        return (
          <div key={index} className="h-[40px]">
            <div className="text-2xl sm:text-2xl text-white">
              {index > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="w-[100px]">{
                    operation[index] === 'add' && <Plus/>
                  }{
                    operation[index] === 'subtract' && <Minus/>
                  }{
                    operation[index] === 'multiply' && <X/>
                  }{
                    operation[index] === 'divide' && <Divide/>
                  }</div>
                  <div className="w-[100px]">{num}</div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="w-[100px]"></div>
                  <div className="w-[100px]">{num}</div>
                </div>
              )}
            </div>
            <br />
          </div>
        );
      })}
    </div>
  );
};
