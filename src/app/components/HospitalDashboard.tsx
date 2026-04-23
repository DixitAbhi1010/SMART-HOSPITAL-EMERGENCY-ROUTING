import { useState, useEffect } from 'react';
import { Hospital, AnalysisResult, SymptomData } from '../App';
import { CheckCircle, Clock, AlertTriangle, Activity, Users, Stethoscope, Heart, ArrowRight, Building2, Bell, RefreshCw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  hospital: Hospital;
  analysis: AnalysisResult;
  symptomData: SymptomData;
  onTransferComplete?: () => void;
  onRestart?: () => void;
}

interface PrepStep {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  time: string;
}

export function HospitalDashboard({ hospital, analysis, symptomData, onTransferComplete, onRestart }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferredHospital, setTransferredHospital] = useState<Hospital | null>(null);
  const [prepSteps, setPrepSteps] = useState<PrepStep[]>([]);

  useEffect(() => {
    // Check if hospital can handle the case
    const canHandle = Math.random() > 0.5; // 50% chance for auto-transfer demo

    if (!canHandle && analysis.severity === 'Critical') {
      // Simulate discovering issue after patient data review
      setTimeout(() => {
        setIsTransferring(true);
        findAlternativeHospital();
      }, 3000);
    } else {
      // Normal preparation flow
      initializePreparation();
    }
  }, []);

  const initializePreparation = () => {
    const steps: PrepStep[] = [
      { id: 1, title: 'Patient data received and verified', status: 'pending', time: '' },
      { id: 2, title: `${analysis.recommendedSpecialist} notified and preparing`, status: 'pending', time: '' },
      { id: 3, title: 'Emergency room being prepared', status: 'pending', time: '' },
      { id: 4, title: 'Medical equipment ready', status: 'pending', time: '' },
    ];

    if (analysis.requiresICU) {
      steps.push({ id: 5, title: 'ICU bed reserved and prepared', status: 'pending', time: '' });
    }

    steps.push({ id: 6, title: 'Team ready for patient arrival', status: 'pending', time: '' });

    setPrepSteps(steps);

    // Simulate preparation steps
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setPrepSteps(prev => prev.map((step, i) => {
          if (i < index) return { ...step, status: 'completed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          if (i === index) return { ...step, status: 'in-progress', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          return step;
        }));
      }, (index + 1) * 2000);
    });

    // Mark last step as completed
    setTimeout(() => {
      setPrepSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
    }, (steps.length + 1) * 2000);
  };

  const findAlternativeHospital = () => {
    // Simulate finding alternative hospital
    setTimeout(() => {
      const alternative: Hospital = {
        id: 99,
        name: 'Advanced Specialty Medical Center',
        distance: hospital.distance + 2.5,
        icuBeds: 8,
        specialists: [analysis.recommendedSpecialist, 'General Physician', 'Cardiac Surgeon', 'Neurologist'],
        equipment: ['CT Scanner', 'MRI', 'ECG Machine', 'Ventilator', 'Defibrillator', 'Angiography'],
        rating: 4.8,
        estimatedTime: hospital.estimatedTime + 8,
        matchScore: 96
      };

      setTransferredHospital(alternative);

      // Start preparation at new hospital
      setTimeout(() => {
        setIsTransferring(false);
        initializePreparation();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hospital Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl">Hospital Command Center</h2>
              <p className="text-gray-400">Real-time patient arrival management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400">System Active</span>
          </div>
        </div>
      </motion.div>

      {/* Transfer Alert */}
      <AnimatePresence>
        {isTransferring && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="bg-orange-500 p-4 rounded-full"
              >
                <AlertTriangle className="w-12 h-12" />
              </motion.div>
            </div>
            <h3 className="text-2xl mb-3">Intelligent Auto-Transfer Initiated</h3>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
              Upon reviewing patient data, {hospital.name} has identified that specialized equipment for {analysis.condition} is currently unavailable or a specialist is in surgery.
            </p>
            <p className="text-cyan-400 mb-6 max-w-2xl mx-auto">
              ⚡ AI system is automatically transferring patient to a better-equipped facility...
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span>Scanning available hospitals</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>Transferring patient data</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Notification */}
      <AnimatePresence>
        {transferredHospital && !isTransferring && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl mb-1">Auto-Transfer Successful</h3>
                <p className="text-gray-300">Patient data transferred to better-equipped facility</p>
              </div>
            </div>
            <div className="bg-[#0f1624] border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Original Hospital</div>
                  <div className="text-white">{hospital.name}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">New Hospital</div>
                  <div className="text-white">{transferredHospital.name}</div>
                  <div className="text-xs text-green-400 mt-1">+{transferredHospital.estimatedTime - hospital.estimatedTime} min (Better equipped)</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl">Incoming Patient Alert</h3>
          </div>

          <div className="space-y-4">
            {/* Severity Badge */}
            <div className={`p-4 rounded-xl border-2 ${
              analysis.severity === 'Critical'
                ? 'bg-red-500/20 border-red-500'
                : analysis.severity === 'Moderate'
                ? 'bg-yellow-500/20 border-yellow-500'
                : 'bg-green-500/20 border-green-500'
            }`}>
              <div className="text-sm text-gray-400 mb-1">Severity Level</div>
              <div className="text-2xl">{analysis.severity}</div>
            </div>

            {/* Condition */}
            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-400 mb-1">Diagnosed Condition</div>
              <div className="text-lg text-cyan-300">{analysis.condition}</div>
            </div>

            {/* Symptoms */}
            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Reported Symptoms</div>
              <div className="flex flex-wrap gap-2">
                {symptomData.symptoms.map(symptom => (
                  <span key={symptom} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Resources */}
            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-400 mb-3">Required Resources</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Specialist</span>
                  <span className="text-cyan-400">{analysis.recommendedSpecialist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">ICU Bed</span>
                  <span className={analysis.requiresICU ? 'text-red-400' : 'text-green-400'}>
                    {analysis.requiresICU ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            </div>

            {/* ETA */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 p-4 rounded-xl">
              <div className="text-sm text-gray-400 mb-1">Estimated Arrival Time</div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-xl text-cyan-300">
                  ~{transferredHospital ? transferredHospital.estimatedTime : hospital.estimatedTime} minutes
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preparation Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl">Preparation Status</h3>
              <p className="text-sm text-gray-400">
                Hospital: {transferredHospital ? transferredHospital.name : hospital.name}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {prepSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  step.status === 'completed'
                    ? 'bg-green-500/10 border-green-500/50'
                    : step.status === 'in-progress'
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-[#0f1624] border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'in-progress'
                      ? 'bg-cyan-500'
                      : 'bg-gray-700'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === 'in-progress' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Activity className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white">{step.title}</div>
                    {step.time && (
                      <div className="text-sm text-gray-400 mt-1">{step.time}</div>
                    )}
                  </div>
                  {step.status === 'in-progress' && (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Team Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <div className="text-sm text-gray-400">Medical Team</div>
              </div>
              <div className="text-xl text-white">5 Members</div>
              <div className="text-xs text-green-400 mt-1">Ready & Standby</div>
            </div>

            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
                <div className="text-sm text-gray-400">Specialist</div>
              </div>
              <div className="text-lg text-white">{analysis.recommendedSpecialist}</div>
              <div className="text-xs text-green-400 mt-1">On-site & Alerted</div>
            </div>

            <div className="bg-[#0f1624] border border-gray-700 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-cyan-400" />
                <div className="text-sm text-gray-400">Equipment</div>
              </div>
              <div className="text-xl text-white">All Ready</div>
              <div className="text-xs text-green-400 mt-1">Sterilized & Set</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Message */}
      {prepSteps.length > 0 && prepSteps.every(s => s.status === 'completed') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-3xl mb-3">✅ Hospital Fully Prepared</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            All systems ready. Medical team is standing by for immediate patient care upon arrival.
            The {analysis.recommendedSpecialist} has been briefed and equipment is sterilized and ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
            <div className="bg-[#0f1624] border border-green-500/30 p-4 rounded-xl">
              <div className="text-green-400 mb-1">✓ Emergency Room</div>
              <div className="text-sm text-gray-300">Prepared & Ready</div>
            </div>
            <div className="bg-[#0f1624] border border-green-500/30 p-4 rounded-xl">
              <div className="text-green-400 mb-1">✓ Medical Team</div>
              <div className="text-sm text-gray-300">Briefed & Standby</div>
            </div>
            <div className="bg-[#0f1624] border border-green-500/30 p-4 rounded-xl">
              <div className="text-green-400 mb-1">✓ Equipment</div>
              <div className="text-sm text-gray-300">Sterilized & Set</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span>Monitoring for patient arrival...</span>
          </div>

          <div className="text-sm text-gray-400 mb-6">
            <p className="mb-2">🚨 Emergency Protocol Active</p>
            <p>Upon patient arrival, immediate triage and treatment will begin</p>
          </div>

          {onRestart && (
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Home className="w-4 h-4" />
              Start New Assessment
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
