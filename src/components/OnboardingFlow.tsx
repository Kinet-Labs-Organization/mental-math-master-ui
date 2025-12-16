import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
  Mail,
  Trophy,
  Target,
  Zap,
  
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { setOnboardingFlag } = useUserStore.getState();
  // const { authenticatedUser, setAuthenticatedUser } = useUserStore.getState();

  const correctAnswer = 25; // 10 + 15

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(answer);
    setIsCorrect(userAnswer === correctAnswer);
    setStep(2);
  };

  const handleSocialLogin = (_provider: 'google' | 'facebook' | 'email') => {
    // mark parameter as used for lint
    void _provider;
    setOnboardingFlag();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Test Question */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  {/* <Logo size="xl" variant="full" animated /> */}
                  {/* <Sparkles className="w-10 h-10 text-white" /> */}
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-lg mt-3"
                >
                  Let's start with a quick surprise test
                </motion.p>
              </div>

              {/* Question Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/10 text-center"
              >
                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl px-6 py-3 mb-4">
                    <span className="text-sm text-blue-300">Question 1 of 1</span>
                  </div>
                  <h2 className="text-6xl sm:text-7xl text-white mb-2">10 + 15</h2>
                  <p className="text-gray-400">What's the answer?</p>
                </div>

                <form onSubmit={handleSubmitAnswer} className="space-y-6">
                  <input
                    type="number"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="w-full max-w-xs mx-auto bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center text-3xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full max-w-xs mx-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl py-4 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all group flex items-center justify-center gap-2"
                  >
                    <span>Submit Answer</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Result */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 shadow-2xl relative ${
                    isCorrect
                      ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-green-500/40'
                      : 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-orange-500/40'
                  }`}
                >
                  {/* Pulsing ring effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isCorrect ? 'bg-green-400' : 'bg-orange-400'
                    }`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {isCorrect ? (
                    <CheckCircle className="w-16 h-16 text-white relative z-10" />
                  ) : (
                    <XCircle className="w-16 h-16 text-white relative z-10" />
                  )}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-4xl sm:text-5xl mb-3 bg-clip-text text-transparent ${
                    isCorrect
                      ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400'
                      : 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-400'
                  }`}
                >
                  {isCorrect ? 'Amazing!' : 'All Good!'}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-xl ${isCorrect ? 'text-green-300' : 'text-orange-300'}`}
                >
                  {isCorrect ? '🎉 Spot on!' : '✨ No worries at all'}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`backdrop-blur-xl rounded-3xl p-12 shadow-2xl border relative overflow-hidden ${
                  isCorrect
                    ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-green-500/20'
                    : 'bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border-orange-500/20'
                }`}
              >
                {/* Decorative gradient orbs */}
                <div
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                    isCorrect ? 'bg-green-400' : 'bg-orange-400'
                  }`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20 ${
                    isCorrect ? 'bg-teal-400' : 'bg-red-400'
                  }`}
                />

                <div className="space-y-6 relative z-10">
                  {isCorrect ? (
                    <>
                      <p className="text-gray-200 text-xl leading-relaxed text-center">
                        Imagine solving{' '}
                        <span className="text-white font-medium bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                          way harder problems
                        </span>{' '}
                        this fast.
                      </p>
                      <p className="text-gray-300 text-lg leading-relaxed text-center">
                        We'll make your mental math{' '}
                        <span className="text-emerald-300 font-medium">exponentially better</span>{' '}
                        🚀
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-200 text-xl leading-relaxed text-center">
                        Even simple math can feel{' '}
                        <span className="text-white font-medium bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          tricky under pressure
                        </span>
                        .
                      </p>
                      <p className="text-gray-300 text-lg leading-relaxed text-center">
                        We'll make it{' '}
                        <span className="text-orange-300 font-medium">effortlessly easy</span> for
                        you 💪
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setStep(3)}
                  className={`mt-8 w-full max-w-xs mx-auto text-white rounded-2xl py-4 shadow-lg transition-all group flex items-center justify-center gap-2 ${
                    isCorrect
                      ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40'
                      : 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Information & Login Options */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8 mt-10">
                {/* <motion.div
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] mb-6 shadow-2xl shadow-purple-500/40"
                                >
                                    <Brain className="w-12 h-12 text-white" />
                                </motion.div> */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Your Path to Mastery
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 space-y-8 relative overflow-hidden"
              >
                {/* Decorative gradient orbs */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl opacity-20" />

                {/* Information Cards */}
                <div className="space-y-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4 items-start bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg mb-1.5">Practice Beats Theory</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Mastery isn't about rules—it's about{' '}
                        <span className="text-cyan-300 font-medium">building muscle memory</span>{' '}
                        through practice 💡
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 items-start bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-2xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg mb-1.5">One Step from Greatness</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        You're <span className="text-pink-300 font-medium">one habit away</span>{' '}
                        from Olympiads & World Records 🏆
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 items-start bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl p-5 border border-amber-500/20 hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg mb-1.5">See Results Fast</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        <span className="text-orange-300 font-medium">Measurable progress</span> in
                        weeks with endless adaptive practice ⚡
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Login Options */}
                <div className="pt-4 space-y-4 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-gray-900/80 px-4 text-gray-400">Get started with</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl py-4 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('facebook')}
                      className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-2xl py-4 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Continue with Facebook</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('email')}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl py-4 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Continue with Email</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center text-xs text-gray-500"
              >
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-600'
                  : s < step
                    ? 'w-4 bg-green-500'
                    : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
