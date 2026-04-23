import { useState } from 'react';
import { Hospital, AnalysisResult, SymptomData } from '../App';
import { CheckCircle, MapPin, Clock, AlertTriangle, Send, RefreshCw, Phone, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  hospital: Hospital;
  analysis: AnalysisResult;
  symptomData: SymptomData;
  onAlertSent?: () => void;
  onStartOver: () => void;
}

export function PreArrivalAlert({ hospital, analysis, symptomData, onAlertSent, onStartOver }: Props) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendAlert = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      // Notify parent that alert was sent
      if (onAlertSent) {
        setTimeout(() => {
          onAlertSent();
        }, 3000);
      }
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {!sent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl mb-2">Pre-Arrival Alert Confirmation</h2>
            <p className="text-gray-400">Review patient data being sent to {hospital.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Hospital Info */}
            <div className="space-y-4">
              <div className="bg-[#0f1624] border border-gray-700 p-5 rounded-xl">
                <div className="text-sm text-gray-400 mb-3">Selected Hospital</div>
                <h3 className="text-xl mb-3">{hospital.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{hospital.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Estimated arrival: ~{hospital.estimatedTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>Emergency: +91-{Math.floor(Math.random() * 9000000000 + 1000000000)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="text-sm text-green-200">
                    <div className="mb-1">Required specialist available</div>
                    <div className="text-green-400">{analysis.recommendedSpecialist}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Data Being Sent */}
            <div className="space-y-4">
              <div className="bg-[#0f1624] border border-gray-700 p-5 rounded-xl">
                <div className="text-sm text-gray-400 mb-3">Patient Information</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Symptoms</div>
                    <div className="flex flex-wrap gap-1">
                      {symptomData.symptoms.map(s => (
                        <span key={s} className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Condition</div>
                    <div className="text-sm text-white">{analysis.condition}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Severity Level</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      analysis.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400'
                        : analysis.severity === 'Moderate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {analysis.severity}
                    </span>
                  </div>
                  {symptomData.additionalInfo && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Additional Details</div>
                      <div className="text-sm text-gray-300 bg-[#0a0e1a] p-2 rounded">
                        {symptomData.additionalInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          {analysis.severity === 'Critical' && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <div className="text-red-300 mb-1">Critical Condition Detected</div>
                <div className="text-sm text-red-200">
                  The hospital has been notified of the emergency. Medical team will be prepared for immediate care upon arrival.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSendAlert}
              disabled={sending}
              className={`flex-1 py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                sending
                  ? 'bg-gray-700 cursor-wait'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30'
              }`}
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Alert...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Pre-Arrival Alert</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border-2 border-green-500 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16" />
          </motion.div>

          <h2 className="text-3xl mb-3">Alert Sent Successfully!</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {hospital.name} has been notified of your arrival. The medical team is preparing to receive you.
          </p>

          <div className="bg-[#0f1624] border border-gray-700 p-6 rounded-xl mb-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-left text-sm">
                  <div className="text-gray-400 mb-1">Patient data transmitted</div>
                  <div className="text-white">Hospital staff can now review your symptoms and prepare necessary equipment</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-left text-sm">
                  <div className="text-gray-400 mb-1">{analysis.recommendedSpecialist} notified</div>
                  <div className="text-white">Specialist will be available upon your arrival</div>
                </div>
              </div>
              {analysis.requiresICU && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="text-left text-sm">
                    <div className="text-gray-400 mb-1">ICU bed reserved</div>
                    <div className="text-white">Intensive care unit is being prepared</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl mb-8 max-w-2xl mx-auto">
            <div className="text-sm text-gray-400 mb-3">Next Steps</div>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div className="text-gray-300">Proceed to {hospital.name} ({hospital.distance} km, ~{hospital.estimatedTime} min)</div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div className="text-gray-300">For emergency assistance, call hospital at +91-{Math.floor(Math.random() * 9000000000 + 1000000000)}</div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl mb-6">
            <div className="text-sm text-cyan-300 text-center mb-3">
              🏥 Your data has been sent to the hospital. They are now preparing for your arrival.
            </div>
            <button
              onClick={onAlertSent}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              View Hospital Preparation Dashboard
            </button>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onStartOver}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Start New Assessment
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
