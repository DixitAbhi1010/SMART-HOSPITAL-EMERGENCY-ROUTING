import { AnalysisResult } from '../App';
import { Brain, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  analysis: AnalysisResult;
}

export function AnalysisResults({ analysis }: Props) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'from-red-600 to-orange-600';
      case 'Moderate':
        return 'from-yellow-600 to-orange-500';
      case 'Normal':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="w-12 h-12" />;
      case 'Moderate':
        return <Activity className="w-12 h-12" />;
      case 'Normal':
        return <CheckCircle className="w-12 h-12" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full"
            >
              <Brain className="w-16 h-16" />
            </motion.div>
          </div>
          <h2 className="text-3xl mb-2">AI Analysis Complete</h2>
          <p className="text-gray-400">Processing symptoms and determining severity level...</p>
        </div>

        <div className="space-y-6">
          {/* Severity Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-gradient-to-r ${getSeverityColor(analysis.severity)} p-6 rounded-xl`}
          >
            <div className="flex items-center gap-4">
              <div className="text-white">
                {getSeverityIcon(analysis.severity)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/80 mb-1">Severity Level</div>
                <div className="text-3xl">{analysis.severity}</div>
              </div>
            </div>
          </motion.div>

          {/* Condition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f1624] border border-gray-700 p-6 rounded-xl"
          >
            <div className="text-sm text-gray-400 mb-2">Detected Condition</div>
            <div className="text-2xl text-cyan-300">{analysis.condition}</div>
          </motion.div>

          {/* Requirements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-[#0f1624] border border-gray-700 p-5 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Required Specialist</div>
              <div className="text-xl text-white">{analysis.recommendedSpecialist}</div>
            </div>
            <div className="bg-[#0f1624] border border-gray-700 p-5 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">ICU Requirement</div>
              <div className={`text-xl ${analysis.requiresICU ? 'text-red-400' : 'text-green-400'}`}>
                {analysis.requiresICU ? 'Required' : 'Not Required'}
              </div>
            </div>
          </motion.div>

          {/* Urgency Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-5 rounded-xl border ${
              analysis.severity === 'Critical'
                ? 'bg-red-500/10 border-red-500/30'
                : analysis.severity === 'Moderate'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-green-500/10 border-green-500/30'
            }`}
          >
            <div className="text-sm text-gray-400 mb-2">Urgency Assessment</div>
            <div className="text-white">{analysis.urgency}</div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-3 text-cyan-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
              <span className="ml-2">Finding suitable hospitals...</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
