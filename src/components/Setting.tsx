import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Volume2, Bell, Info, LogOut, Mail, Rss, CircleQuestionMark, HandHelping, Trash, X, ChevronDown, CheckCircle } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../libs/supabaseClient';
import { useGenericStore } from '../store/useGenericStore';

export function Setting() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showFaqPopup, setShowFaqPopup] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showClearDataPopup, setShowClearDataPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { faqs, fetchFaqs, faqsLoading } = useGenericStore();

  useEffect(() => {
    fetchFaqs();
  }, []);

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
        { icon: CircleQuestionMark, label: 'FAQ', value: '', color: 'from-gray-500 to-gray-600', onClick: () => setShowFaqPopup(true) },
        { icon: HandHelping, label: 'Support', value: '', color: 'from-gray-500 to-gray-600', onClick: () => setShowSupportPopup(true) },
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

  const handleClearData = () => {
    setShowClearDataPopup(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all ${index !== section.items.length - 1 ? 'border-b border-white/10' : ''
                      } ${item.onClick ? 'cursor-pointer' : ''}`}
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
            <button
              onClick={() => setShowClearDataPopup(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all border-b border-white/10"
            >
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

        {showSupportPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1f2635] border border-white/10 rounded-3xl p-6 max-w-sm w-full relative"
            >
              <button
                onClick={() => setShowSupportPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5 fixed ml-[-15px]" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Contact Support</h3>
                <p className="text-gray-400 mb-6">
                  Mail us at mastermentalmath@gmail.com with your query, we will get back to you as soon as possible
                </p>

                <a
                  href="mailto:mastermentalmath@gmail.com"
                  className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Email Us
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {showFaqPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1f2635] border border-white/10 rounded-3xl p-6 max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowFaqPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X className="w-5 h-5 fixed ml-[-15px]" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CircleQuestionMark className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-3">
                {!faqsLoading && faqs.map((faq:any, index:any) => (
                  <div key={index} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: openFaqIndex === index ? 'auto' : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showClearDataPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1f2635] border border-white/10 rounded-3xl p-6 max-w-sm w-full relative"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Clear Data?</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to clear all your data? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearDataPopup(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Yes, Clear
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 bg-[#1f2635] border border-white/10 text-white px-6 py-4 rounded-2xl shadow-xl z-[100] flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Successfully deleted data</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
