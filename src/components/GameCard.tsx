import { motion } from 'motion/react';
import { Plus, Minus, Divide, X } from 'lucide-react';

interface TournamentCardProps {
  tournament: any;
  onSelect: () => void;
}

export function GameCard({ tournament, onSelect }: TournamentCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-left overflow-hidden group w-full h-full"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Planet Icon */}
        {/* <div className="flex items-start justify-between mb-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${tournament.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
          >
            {tournament.icon}
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white transition-all duration-300" />
        </div> */}
        <img src='https://mxfmj8wrrjv5and6.public.blob.vercel-storage.com/31dbed13-9148-4635-9b09-f6b27a02c84f.png' className={`w-16 h-16 flex items-center justify-center text-3xl shadow-lg mb-4`} />

        {/* Tournament Name */}
        <h3 className="text-2xl mb-2 text-white">{tournament.name}</h3>

        {/* Rules */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{tournament.digitCount} digit numbers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>{tournament.numberCount} numbers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{tournament.delay / 1000}s interval</span>
          </div>
        </div>

        {/* Operations */}
        <div className="flex gap-2">
          {tournament.operations.includes('add') && (
            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs border border-green-500/30">
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </div>
          )}
          {tournament.operations.includes('subtract') && (
            <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs border border-red-500/30">
              <Minus className="w-3 h-3" />
              <span>Sub</span>
            </div>
          )}
          {tournament.operations.includes('multiply') && (
            <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-xs border border-blue-500/30">
              <X className="w-3 h-3" />
              <span>Multiply</span>
            </div>
          )}
          {tournament.operations.includes('divide') && (
            <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full text-xs border border-yellow-500/30">
              <Divide className="w-3 h-3" />
              <span>Divide</span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
