import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Volume2, Bell, Info, LogOut, Mail, Rss, CircleQuestionMark, HelpCircle, Trash } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../libs/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function Setting() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        { icon: Volume2, label: 'Sound Effects', type: 'toggle', value: soundEnabled, onChange: setSoundEnabled, color: 'from-blue-500 to-cyan-600' },
        { icon: Bell, label: 'Notifications', type: 'toggle', value: notificationsEnabled, onChange: setNotificationsEnabled, color: 'from-purple-500 to-pink-600' },
        {
          icon: Mail,
          label: 'News Letter',
          type: 'toggle',
          value: newsletterEnabled,
          onChange: setNewsletterEnabled,
          color: 'from-indigo-500 to-purple-600',
        },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'App Version', value: '1.0.0', color: 'from-gray-500 to-gray-600' },
        { icon: CircleQuestionMark, label: 'FAQ', value: '1.0.0', color: 'from-gray-500 to-gray-600' },
        { icon: HelpCircle, label: 'Support', value: '1.0.0', color: 'from-gray-500 to-gray-600' },
      ],
    },
  ];

  const { removeAuthenticatedUser } = useUserStore();

  const handleSignOut = async () => {
    await supabaseSignOut();
    removeAuthenticatedUser();
  };

  const supabaseSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6 shadow-lg">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your experience</p>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-6"
          >
            <h2 className="text-xl text-white mb-4 px-2">{section.title}</h2>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              {section.items.map((item: any, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all ${index !== section.items.length - 1 ? 'border-b border-white/10' : ''
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base text-white">{item.label}</span>
                    </div>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${item.value ? 'bg-green-500' : 'bg-white/10'
                          }`}
                      >
                        <motion.div
                          animate={{ x: item.value ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    ) : (
                      <span className="text-base text-gray-400">{item.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl text-white mb-4 px-2">Account</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Trash className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-white">Clear Data</span>
              </div>
            </button>
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-all group"
              onClick={handleSignOut}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center group-hover:bg-red-500/30">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-base text-red-400">Sign Out</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Made with ❤️ for mental math enthusiasts</p>
        </div>
      </div>
    </div>
  );
}
