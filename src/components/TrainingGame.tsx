import { useState, useEffect } from 'react';
// Tournament type import removed (not used in this file)
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import type { ITournamentGame, IUseGameStore } from '../store/useGameStore';
import api from '../utils/api';


type GameState = 'ready' | 'playing' | 'input' | 'result';

interface NumberItem {
  value: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
}

export function TrainingGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const { selectedTournamentGame: tournament }: IUseGameStore = useGameStore();

  const generateNumbers = async () => {
    // const min = Math.pow(10, (tournament as ITournamentGame).digitCount - 1);
    // const max = Math.pow(10, (tournament as ITournamentGame).digitCount) - 1;
    const newNumbers: NumberItem[] = [];

    // for (let i = 0; i < (tournament as ITournamentGame).numberCount; i++) {
    //   const value = Math.floor(Math.random() * (max - min + 1)) + min;
    //   const operation = (tournament as ITournamentGame).operations[
    //     Math.floor(Math.random() * (tournament as ITournamentGame).operations.length)
    //   ];
    //   newNumbers.push({ value, operation });
    // }

    // First number is always addition
    // newNumbers[0].operation = 'add';
    const nums = await api.get('flashGame/fg_1');
    nums.data[0].operation = 'add';
    setNumbers(nums.data);

    // setNumbers(newNumbers);

    // Calculate correct answer
    let total = 0;
    newNumbers.forEach(item => {
      if (item.operation === 'add') {
        total += item.value;
      } else {
        total -= item.value;
      }
    });
    setCorrectAnswer(total);
  };

  const startGame = async () => {
    await generateNumbers();
    setCurrentIndex(0);
    setUserAnswer('');
    setGameState('playing');
  };

  const handleValidate = () => {
    const answer = parseInt(userAnswer);
    setIsCorrect(answer === correctAnswer);
    setGameState('result');
  };

  const handlePlayAgain = () => {
    setGameState('ready');
  };

  useEffect(() => {
    if (gameState === 'playing' && currentIndex < numbers.length) {
      const timer = setTimeout(
        () => {
          setCurrentIndex(currentIndex + 1);
        },
        (tournament as ITournamentGame).delay
      );

      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && currentIndex >= numbers.length) {
      setTimeout(() => {
        setGameState('input');
      }, 500);
    }
  }, [gameState, currentIndex, numbers.length, tournament]);

  const currentNumber = numbers[currentIndex];
  const progress = (currentIndex / numbers.length) * 100;

  const onBack = () => {
    navigate('/');
  };

  return (
    <>
      {tournament ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-black">
          {/* Header */}
          <div
            className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-4 sticky top-0 z-50 w-full"
            style={{ position: 'fixed' }}
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${(tournament as ITournamentGame).color} rounded-xl flex items-center justify-center text-xl`}
                >
                  {(tournament as ITournamentGame).icon}
                </div>
                <div>
                  <h2 className="text-lg text-white">{(tournament as ITournamentGame).planet}</h2>
                  <p className="text-xs text-gray-400">
                    {(tournament as ITournamentGame).digitCount} digits •{' '}
                    {(tournament as ITournamentGame).numberCount} numbers
                  </p>
                </div>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              {/* <AnimatePresence mode="wait"> */}
              {/* Ready State */}
              {gameState === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${(tournament as ITournamentGame).color} rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl`}
                  >
                    {(tournament as ITournamentGame).icon}
                  </div>
                  <h2 className="text-3xl mb-4 text-white">Ready to Train?</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {(tournament as ITournamentGame).numberCount} numbers will appear one by one.
                    Calculate the result in your mind!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    Start Training
                  </motion.button>
                </motion.div>
              )}

              {/* Playing State */}
              {gameState === 'playing' && currentNumber && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 mb-12 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full bg-gradient-to-r ${(tournament as ITournamentGame).color}`}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>

                  {/* Number Display */}
                  <motion.div
                    key={currentIndex}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl"
                  >
                    <div className="flex items-center justify-center gap-6 mb-6">
                      {currentNumber.operation === 'add' ? (
                        <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
                          <Plus className="w-8 h-8 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
                          <Minus className="w-8 h-8 text-red-400" />
                        </div>
                      )}
                    </div>
                    <div className="text-7xl sm:text-8xl tabular-nums tracking-tight text-white">
                      {currentNumber.value}
                    </div>
                  </motion.div>

                  {/* Counter */}
                  <div className="mt-8 text-gray-400">
                    {currentIndex + 1} / {numbers.length}
                  </div>
                </motion.div>
              )}

              {/* Input State */}
              {gameState === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
                    <h2 className="text-3xl mb-3 text-white">What's the answer?</h2>
                    <p className="text-gray-400 mb-8">Enter your calculated result</p>

                    <input
                      type="number"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Enter result"
                      autoFocus
                      className="w-full text-4xl text-center bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 mb-6 focus:outline-none focus:border-purple-500 transition-colors tabular-nums text-white placeholder-gray-500"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && userAnswer) {
                          handleValidate();
                        }
                      }}
                    />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleValidate}
                      disabled={!userAnswer}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Validate
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Result State */}
              {gameState === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
                    {isCorrect ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 10 }}
                          className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <Check className="w-12 h-12 text-green-400" />
                        </motion.div>
                        <h2 className="text-3xl mb-3 text-green-400">Success!</h2>
                        <p className="text-gray-400 mb-2">Your answer is correct</p>
                        <div className="text-5xl mb-8 tabular-nums text-white">{correctAnswer}</div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 10 }}
                          className="w-24 h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <X className="w-12 h-12 text-red-400" />
                        </motion.div>
                        <h2 className="text-3xl mb-3 text-red-400">Wrong Answer</h2>
                        <div className="mb-6">
                          <p className="text-gray-400 text-sm mb-1">Your answer</p>
                          <div className="text-3xl text-red-400 line-through mb-4 tabular-nums">
                            {userAnswer}
                          </div>
                          <p className="text-gray-400 text-sm mb-1">Correct answer</p>
                          <div className="text-5xl text-green-400 tabular-nums">
                            {correctAnswer}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-base px-6 py-4 rounded-2xl transition-all border border-white/10 hover:border-white/20"
                      >
                        Back to Dashboard
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlayAgain}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                      >
                        Play Again
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* </AnimatePresence> */}
            </div>
          </div>
        </div>
      ) : (
        <div>Navigating...</div>
      )}
    </>
  );
}
