import { motion } from 'motion/react';
import { Home, TrendingUp, Trophy, Settings, User } from 'lucide-react';

export type NavSection = 'dashboard' | 'progress' | 'leaderboard' | 'profile' | 'settings' | 'blogs';

interface NavigationProps {
  activeSection: NavSection;
   
  // eslint-disable-next-line no-unused-vars
  onSectionChange: (section: NavSection) => void;
}

const navItems = [
  { id: 'dashboard' as NavSection, label: 'Home', icon: Home },
  { id: 'progress' as NavSection, label: 'Progress', icon: TrendingUp },
  { id: 'leaderboard' as NavSection, label: 'Leaderboard', icon: Trophy },
  { id: 'profile' as NavSection, label: 'Profile', icon: User },
  { id: 'settings' as NavSection, label: 'Settings', icon: Settings }
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="sticky-footer bg-white/5 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className="relative px-4 py-2 rounded-xl transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className={`text-base ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 w-full justify-around">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className="relative p-2 rounded-xl transition-all flex-1 flex justify-center"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    className={`relative w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
