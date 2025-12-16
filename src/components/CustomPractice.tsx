import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Plus, Minus, Play, ChevronDown } from 'lucide-react';

type CustomPracticeSettings = {
  digitCount: number;
  operations: ('add' | 'subtract')[];
  numberCount: number;
  delay: number;
};

interface CustomPracticeProps {
  // Name is only for readability in the type; eslint may flag it as unused — disable the rule for this line
  // eslint-disable-next-line no-unused-vars
  onStart: (settings: CustomPracticeSettings) => void;
}

export function CustomPractice({ onStart }: CustomPracticeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [digitCount, setDigitCount] = useState(3);
  const [operations, setOperations] = useState<('add' | 'subtract')[]>(['add', 'subtract']);
  const [numberCount, setNumberCount] = useState(5);
  const [delay, setDelay] = useState(1000);

  const toggleOperation = (operation: 'add' | 'subtract') => {
    if (operations.includes(operation)) {
      if (operations.length > 1) {
        setOperations(operations.filter(op => op !== operation));
      }
    } else {
      setOperations([...operations, operation]);
    }
  };

  const handleStart = () => {
    onStart({ digitCount, operations, numberCount, delay });
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-4 px-2 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl text-white">Custom Practice</h2>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Digit Count */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Number of Digits</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(count => (
                  <button
                    key={count}
                    onClick={() => setDigitCount(count)}
                    className={`flex-1 py-3 rounded-xl text-base transition-all ${
                      digitCount === count
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Count */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Total Numbers</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumberCount(Math.max(3, numberCount - 1))}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-white/10 border border-white/20 rounded-xl py-3 text-center text-white text-xl">
                  {numberCount}
                </div>
                <button
                  onClick={() => setNumberCount(Math.min(20, numberCount + 1))}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Operations */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Operations</label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleOperation('add')}
                  className={`flex-1 py-3 rounded-xl text-base transition-all flex items-center justify-center gap-2 ${
                    operations.includes('add')
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => toggleOperation('subtract')}
                  className={`flex-1 py-3 rounded-xl text-base transition-all flex items-center justify-center gap-2 ${
                    operations.includes('subtract')
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span>Subtract</span>
                </button>
              </div>
            </div>

            {/* Delay */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Interval (seconds)</label>
              <div className="flex gap-2">
                {[0.5, 0.75, 1, 1.5, 2].map(seconds => (
                  <button
                    key={seconds}
                    onClick={() => setDelay(seconds * 1000)}
                    className={`flex-1 py-3 rounded-xl text-base transition-all ${
                      delay === seconds * 1000
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Custom Practice</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
