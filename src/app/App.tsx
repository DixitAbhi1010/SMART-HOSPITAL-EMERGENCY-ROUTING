import { useState } from 'react';
import { SymptomInput } from './components/SymptomInput';
import { AnalysisResults } from './components/AnalysisResults';
import { HospitalRecommendations } from './components/HospitalRecommendations';
import { PreArrivalAlert } from './components/PreArrivalAlert';
import { EmergencyChatbot } from './components/EmergencyChatbot';
import { HospitalDashboard } from './components/HospitalDashboard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { DemoControls } from './components/DemoControls';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { Activity, Heart, Monitor } from 'lucide-react';

export type SeverityLevel = 'Critical' | 'Moderate' | 'Normal';

export interface SymptomData {
  symptoms: string[];
  additionalInfo: string;
}

export interface AnalysisResult {
  severity: SeverityLevel;
  condition: string;
  recommendedSpecialist: string;
  requiresICU: boolean;
  urgency: string;
}

export interface Hospital {
  id: number;
  name: string;
  distance: number;
  icuBeds: number;
  specialists: string[];
  equipment: string[];
  rating: number;
  estimatedTime: number;
  matchScore: number;
}

export default function App() {
  const [step, setStep] = useState<'input' | 'analysis' | 'hospitals' | 'alert' | 'dashboard'>('input');
  const [symptomData, setSymptomData] = useState<SymptomData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleSymptomSubmit = (data: SymptomData) => {
    setSymptomData(data);

    // AI-based analysis logic
    const analysisResult = analyzeSymptoms(data);
    setAnalysis(analysisResult);
    setStep('analysis');
    setShowChatbot(true);

    // Auto-advance to hospitals after 2 seconds
    setTimeout(() => {
      setStep('hospitals');
    }, 2000);
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep('alert');
  };

  const handleAlertSent = () => {
    // Move to hospital dashboard view
    setTimeout(() => {
      setStep('dashboard');
    }, 500);
  };

  const handleStartOver = () => {
    setStep('input');
    setSymptomData(null);
    setAnalysis(null);
    setSelectedHospital(null);
    setShowChatbot(false);
  };

  const handleQuickDemo = (scenarioId: string) => {
    const demoData: Record<string, { symptoms: string[]; additionalInfo: string }> = {
      cardiac: {
        symptoms: ['Chest pain', 'Sweating', 'High blood pressure'],
        additionalInfo: 'Sharp pain in chest, difficulty breathing, started 15 minutes ago'
      },
      breathing: {
        symptoms: ['Difficulty breathing', 'Dizziness', 'Fever'],
        additionalInfo: 'Severe breathing difficulty, oxygen feels low'
      },
      moderate: {
        symptoms: ['Fever', 'Abdominal pain', 'Vomiting'],
        additionalInfo: 'High fever since morning, severe stomach pain'
      }
    };

    const data = demoData[scenarioId];
    if (data) {
      handleSymptomSubmit(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1429] text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-[#0a0e27]/80 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl tracking-tight">Smart Hospital Emergency Routing</h1>
                <p className="text-sm text-cyan-400">AI-Powered Healthcare Decision Support</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {step === 'dashboard' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-sm">
                  <Monitor className="w-4 h-4 text-green-400" />
                  <span className="text-green-300">Hospital View</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-gray-300">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { key: 'input', label: 'Symptom Input', icon: '📋' },
            { key: 'analysis', label: 'AI Analysis', icon: '🧠' },
            { key: 'hospitals', label: 'Hospital Match', icon: '🏥' },
            { key: 'alert', label: 'Pre-Arrival Alert', icon: '🚨' },
            { key: 'dashboard', label: 'Hospital Ready', icon: '✅' }
          ].map((s, idx, arr) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  step === s.key
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 scale-110 shadow-lg shadow-cyan-500/50'
                    : getStepIndex(step) > idx
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                }`}>
                  {s.icon}
                </div>
                <span className={`text-xs mt-2 ${step === s.key ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`h-0.5 flex-1 transition-all ${
                  getStepIndex(step) > idx ? 'bg-green-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'input' && <SymptomInput onSubmit={handleSymptomSubmit} />}
        {step === 'analysis' && analysis && <AnalysisResults analysis={analysis} />}
        {step === 'hospitals' && analysis && (
          <HospitalRecommendations
            analysis={analysis}
            onSelectHospital={handleHospitalSelect}
          />
        )}
        {step === 'alert' && selectedHospital && analysis && symptomData && (
          <PreArrivalAlert
            hospital={selectedHospital}
            analysis={analysis}
            symptomData={symptomData}
            onAlertSent={handleAlertSent}
            onStartOver={handleStartOver}
          />
        )}
        {step === 'dashboard' && selectedHospital && analysis && symptomData && (
          <HospitalDashboard
            hospital={selectedHospital}
            analysis={analysis}
            symptomData={symptomData}
            onRestart={handleStartOver}
          />
        )}
      </div>

      {/* Emergency Chatbot - Available after analysis */}
      {showChatbot && analysis && <EmergencyChatbot analysis={analysis} />}

      {/* Demo Controls */}
      {step === 'input' && <DemoControls onQuickDemo={handleQuickDemo} />}

      {/* Welcome Overlay */}
      <WelcomeOverlay />

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
          <p>Team NEXUS - Smart Hospital Availability & Emergency Routing System</p>
          <p className="mt-1">Delivering the right care at the right place, at the right time</p>
        </div>
      </div>
      </div>
    </div>
  );
}

function getStepIndex(step: string): number {
  const steps = ['input', 'analysis', 'hospitals', 'alert', 'dashboard'];
  return steps.indexOf(step);
}

function analyzeSymptoms(data: SymptomData): AnalysisResult {
  const symptomsText = data.symptoms.join(' ').toLowerCase() + ' ' + data.additionalInfo.toLowerCase();

  // Critical conditions
  if (
    (symptomsText.includes('chest pain') || symptomsText.includes('heart')) &&
    (symptomsText.includes('sweating') || symptomsText.includes('high bp') || symptomsText.includes('pressure'))
  ) {
    return {
      severity: 'Critical',
      condition: 'Possible Cardiac Emergency',
      recommendedSpecialist: 'Cardiologist',
      requiresICU: true,
      urgency: 'Immediate attention required - potential heart attack'
    };
  }

  if (symptomsText.includes('stroke') || symptomsText.includes('paralysis') || symptomsText.includes('seizure')) {
    return {
      severity: 'Critical',
      condition: 'Neurological Emergency',
      recommendedSpecialist: 'Neurologist',
      requiresICU: true,
      urgency: 'Immediate attention required - neurological crisis'
    };
  }

  if (symptomsText.includes('breathing') || symptomsText.includes('breathless') || symptomsText.includes('asthma attack')) {
    return {
      severity: 'Critical',
      condition: 'Respiratory Emergency',
      recommendedSpecialist: 'Pulmonologist',
      requiresICU: true,
      urgency: 'Immediate attention required - respiratory distress'
    };
  }

  if (symptomsText.includes('accident') || symptomsText.includes('trauma') || symptomsText.includes('fracture')) {
    return {
      severity: 'Critical',
      condition: 'Trauma Emergency',
      recommendedSpecialist: 'Trauma Surgeon',
      requiresICU: true,
      urgency: 'Immediate attention required - trauma care needed'
    };
  }

  // Moderate conditions
  if (symptomsText.includes('fever') || symptomsText.includes('infection') || symptomsText.includes('pain')) {
    return {
      severity: 'Moderate',
      condition: 'Acute Medical Condition',
      recommendedSpecialist: 'General Physician',
      requiresICU: false,
      urgency: 'Urgent but manageable - medical evaluation needed'
    };
  }

  if (symptomsText.includes('stomach') || symptomsText.includes('abdominal') || symptomsText.includes('vomiting')) {
    return {
      severity: 'Moderate',
      condition: 'Gastrointestinal Issue',
      recommendedSpecialist: 'Gastroenterologist',
      requiresICU: false,
      urgency: 'Urgent evaluation recommended'
    };
  }

  // Normal/Basic conditions
  return {
    severity: 'Normal',
    condition: 'General Medical Consultation',
    recommendedSpecialist: 'General Physician',
    requiresICU: false,
    urgency: 'Basic medical care needed - non-emergency'
  };
}
