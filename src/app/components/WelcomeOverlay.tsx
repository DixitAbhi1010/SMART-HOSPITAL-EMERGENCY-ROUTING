import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Hospital, Bell, X, Play } from 'lucide-react';

export function WelcomeOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => setShow(true), 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-3xl shadow-2xl border-2 border-cyan-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-t-3xl relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Heart className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl mb-1">Welcome to Smart Hospital Emergency Routing</h2>
                    <p className="text-cyan-100">AI-Powered Healthcare Decision Support System</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-xl text-gray-300">
                    Delivering the right care at the right place, at the right time
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#0f1624] border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <Brain className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-xl">AI Symptom Analysis</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Advanced AI analyzes your symptoms in real-time and determines severity level (Critical/Moderate/Normal)
                    </p>
                  </div>

                  <div className="bg-[#0f1624] border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <Hospital className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-xl">Smart Hospital Matching</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Finds hospitals with required specialists, ICU beds, and equipment - not just the nearest one
                    </p>
                  </div>

                  <div className="bg-[#0f1624] border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <Bell className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-xl">Pre-Arrival Alerts</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Sends patient data to the hospital before arrival so medical teams can prepare in advance
                    </p>
                  </div>

                  <div className="bg-[#0f1624] border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Heart className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-xl">Emergency Chatbot</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      24/7 AI assistant provides first-aid guidance and emergency instructions while waiting for care
                    </p>
                  </div>
                </div>

                {/* How it Works */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-xl mb-4 text-center">How It Works</h3>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">📋</div>
                      <div className="text-gray-300">Enter Symptoms</div>
                    </div>
                    <div className="text-cyan-400">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">🧠</div>
                      <div className="text-gray-300">AI Analysis</div>
                    </div>
                    <div className="text-cyan-400">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">🏥</div>
                      <div className="text-gray-300">Hospital Match</div>
                    </div>
                    <div className="text-cyan-400">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">🚨</div>
                      <div className="text-gray-300">Pre-Alert</div>
                    </div>
                    <div className="text-cyan-400">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <div className="text-gray-300">Hospital Ready</div>
                    </div>
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-center text-sm text-gray-400 mb-6">
                  <p>Developed by Team NEXUS</p>
                  <p className="mt-1">Abhishek Dixit • Girish Kumar Yadav • Anjali Rawat</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleClose}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                >
                  <Play className="w-5 h-5" />
                  <span className="text-lg">Start Emergency Assessment</span>
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  💡 Tip: Use the Quick Demo button (top-right) to see sample scenarios
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
