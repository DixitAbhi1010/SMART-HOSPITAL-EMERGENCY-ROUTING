import { useState } from 'react';
import { Play, Settings, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onQuickDemo: (scenario: string) => void;
}

export function DemoControls({ onQuickDemo }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const demoScenarios = [
    {
      id: 'cardiac',
      name: 'Cardiac Emergency',
      symptoms: ['Chest pain', 'Sweating', 'High blood pressure'],
      severity: 'Critical',
      icon: '❤️'
    },
    {
      id: 'breathing',
      name: 'Breathing Difficulty',
      symptoms: ['Difficulty breathing', 'Dizziness'],
      severity: 'Critical',
      icon: '🫁'
    },
    {
      id: 'moderate',
      name: 'Fever & Pain',
      symptoms: ['Fever', 'Abdominal pain'],
      severity: 'Moderate',
      icon: '🌡️'
    }
  ];

  return (
    <>
      {/* Demo Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform group"
        title="Quick Demo Scenarios"
      >
        <Play className="w-5 h-5" />
        <div className="absolute -bottom-8 right-0 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Quick Demo
        </div>
      </motion.button>

      {/* Demo Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-[#1a2340] to-[#0f1624] border-l-2 border-purple-500/50 z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl">Quick Demo</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Select a scenario to quickly demonstrate the system's capabilities
              </p>

              <div className="space-y-4">
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      onQuickDemo(scenario.id);
                      setIsOpen(false);
                    }}
                    className="w-full bg-[#0f1624] border border-gray-700 hover:border-purple-500 rounded-xl p-4 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4>{scenario.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            scenario.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {scenario.severity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          {scenario.symptoms.map(s => (
                            <div key={s}>• {s}</div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                          <span>Run Demo</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-gray-300">
                💡 <strong>Tip:</strong> These scenarios will automatically populate symptoms and progress through the system workflow
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
