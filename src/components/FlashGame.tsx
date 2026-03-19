import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, Check, X, Divide } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useUserStore } from '../store/useUserStore';
import type { IGame } from '../store/useGameStore';
import tickSoundAsset from '../assets/sound.mp3';
import config from '../config/env';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';

type GameState = 'ready' | 'playing' | 'input' | 'result';

interface NumberItem {
  value: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
}

export function FlashGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [tickSound] = useState(() => new Audio(tickSoundAsset));
  const [timer, setTimer] = useState(5);
  const hasSavedResultRef = useRef(false);
  const [icon, setIcon] = useState<any>();

  const { selectedGame, game, fetchGame, gameLoading, setGame } = useGameStore();
  const { settingsData, fetchSettingsData } = useUserStore();

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const generateNumbers = () => {
    const nums = JSON.parse(JSON.stringify(game));
    if (!nums || nums.length === 0) {
      return;
    }
    hasSavedResultRef.current = false;
    // nums[0].operation = 'add'
    // nums[0].operation = '';
    setNumbers(nums);
    // Calculate correct answer
    let total = 0;
    nums.forEach((item: any) => {
      if (item.operation === 'add') {
        total += item.value;
      } else if (item.operation === 'subtract') {
        total -= item.value;
      } else if (item.operation === 'multiply') {
        total *= item.value;
      } else if (item.operation === 'divide') {
        total /= item.value;
      } else {
        total = item.value;
      }
    });
    setCorrectAnswer(total);
    setCurrentIndex(0);
    setUserAnswer('');
    setGameState('playing');
  };

  const startGame = () => {
    // Unlock audio context on user interaction
    tickSound.play().then(() => {
      tickSound.pause();
      tickSound.currentTime = 0;
    }).catch(() => { });

    fetchGame();
  }

  const handleValidate = () => {
    const normalizedAnswer = userAnswer.trim();
    const parsedAnswer = normalizedAnswer === '' ? null : Number(normalizedAnswer);
    const answerIsCorrect =
      parsedAnswer !== null && Number.isFinite(parsedAnswer) && parsedAnswer === correctAnswer;

    setIsCorrect(answerIsCorrect);
    setGameState('result');
    void saveGame(answerIsCorrect);
  };

  const savedValidate = useRef(handleValidate);
  useEffect(() => {
    savedValidate.current = handleValidate;
  });

  const handlePlayAgain = () => {
    setGameState('ready');
  };

  const saveGame = async (answerIsCorrect: boolean) => {
    if (!selectedGame || numbers.length === 0 || hasSavedResultRef.current) {
      return;
    }

    if(selectedGame.id === 'custom') {
      return;
    }

    hasSavedResultRef.current = true;

    try {
      await api.post(ApiURL.game.saveGame, {
        gameId: (selectedGame as IGame).id,
        gameName: (selectedGame as IGame).name,
        gameMode: 'flash',
        correctAnswerGiven: answerIsCorrect ? 1 : 0,
        wrongAnswerGiven: answerIsCorrect ? 0 : 1,
        answeredAt: new Date().toISOString(),
      });
    } catch (error) {
      hasSavedResultRef.current = false;
      console.error('Failed to save flash game:', error);
    }
  };

  useEffect(() => {
    console.log(selectedGame);
    const gameIcon = selectedGame.id !== 'custom' ? (selectedGame as IGame | null)?.icon : 1;
    setIcon(gameIcon);
  }, [selectedGame]);

  useEffect(() => {
    if (!game) return;
    generateNumbers();
  }, [game]);

  useEffect(() => {
    if (gameState === 'input') {
      setTimer(5);
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        if (savedValidate.current) {
          savedValidate.current();
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && currentIndex < numbers.length) {
      if (settingsData?.soundEffect !== false) {
        tickSound.currentTime = 0;
        tickSound.play().catch(e => console.error("Error playing sound:", e));
      }

      const timer = setTimeout(
        () => {
          setCurrentIndex(currentIndex + 1);
        },
        (selectedGame as IGame).delay
      );

      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && currentIndex >= numbers.length) {
      setTimeout(() => {
        setGameState('input');
      }, 500);
    }
  }, [gameState, currentIndex, numbers.length, selectedGame, settingsData, tickSound]);

  const currentNumber = numbers[currentIndex];
  const progress = ((currentIndex + 1) / numbers.length) * 100;

  const onBack = () => {
    setGame(null);
    navigate('/');
  };

  return (
    <>
      {selectedGame ? (
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
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center text-xl`}
                >
                  <img src={`${config.imageBaseURL}/${icon}.png`} />
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

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-4 pt-32 md:pt-28">

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
                    className={`w-32 h-32 bg-gradient-to-br rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl`}
                  >
                    {/* <img src={`${config.imageBaseURL}/${selectedGame ? (selectedGame as IGame).icon : '1'}.png`} /> */}
                    <img src={`${config.imageBaseURL}/${icon}.png`} />
                  </div>
                  <h2 className="text-3xl mb-4 text-white">Ready to Train?</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {(selectedGame as IGame).numberCount} numbers will appear one by one.
                    Calculate the result in your mind!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    {gameLoading ? 'Loading...' : 'Start Training'}
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
                      className={`h-full bg-gradient-to-r from-purple-500 to-pink-600`}
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
                    <div className="flex items-center justify-center gap-6 mb-6 min-h-16">
                      {currentNumber.operation === 'add' && (
                        <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
                          <Plus className="w-8 h-8 text-green-400" />
                        </div>
                      )}
                      {currentNumber.operation === 'subtract' && (
                        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
                          <Minus className="w-8 h-8 text-red-400" />
                        </div>
                      )}
                      {currentNumber.operation === 'multiply' && (
                        <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                          <X className="w-8 h-8 text-blue-400" />
                        </div>
                      )}
                      {currentNumber.operation === 'divide' && (
                        <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl flex items-center justify-center">
                          <Divide className="w-8 h-8 text-yellow-400" />
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
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-white/10"
                          strokeWidth="7"
                          stroke="currentColor"
                          fill="transparent"
                          r={40}
                          cx="50"
                          cy="50"
                        />
                        <motion.circle
                          className="text-purple-500"
                          strokeWidth="7"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={40}
                          cx="50"
                          cy="50"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          transition={{ duration: 5, ease: 'linear' }}
                        />
                      </svg>
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold tabular-nums">{timer}</span>
                      </div>
                    </div>
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
        <Navigate to="/" replace />
      )}
    </>
  );
}
