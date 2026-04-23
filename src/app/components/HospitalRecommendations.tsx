import { AnalysisResult, Hospital } from '../App';
import { MapPin, Clock, Star, Bed, Stethoscope, CheckCircle, Award, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  analysis: AnalysisResult;
  onSelectHospital: (hospital: Hospital) => void;
}

export function HospitalRecommendations({ analysis, onSelectHospital }: Props) {
  const hospitals = generateHospitals(analysis);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl mb-2">Hospital Recommendations</h2>
        <p className="text-gray-400">
          Matched based on your condition: <span className="text-cyan-400">{analysis.condition}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hospitals.map((hospital, index) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border-2 p-6 relative overflow-hidden ${
              index === 0
                ? 'border-green-500 shadow-green-500/20'
                : 'border-cyan-500/30'
            }`}
          >
            {/* Best Match Badge */}
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-2 rounded-bl-2xl flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">Best Match</span>
              </div>
            )}

            {/* Hospital Header */}
            <div className="mb-6 mt-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-2xl mb-2">{hospital.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{hospital.distance} km away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>~{hospital.estimatedTime} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300">{hospital.rating}</span>
                </div>
              </div>

              {/* Match Score */}
              <div className="bg-[#0f1624] p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Suitability Score</span>
                  <span className="text-lg text-cyan-400">{hospital.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hospital.matchScore}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={`h-full ${
                      hospital.matchScore >= 90
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : hospital.matchScore >= 70
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {/* ICU Beds */}
              <div className="bg-[#0f1624] border border-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm">ICU Beds Available</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    hospital.icuBeds > 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {hospital.icuBeds > 0 ? `${hospital.icuBeds} beds` : 'Full'}
                  </span>
                </div>
              </div>

              {/* Specialists */}
              <div className="bg-[#0f1624] border border-gray-700 p-3 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Stethoscope className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-2">Available Specialists</div>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialists.map(spec => (
                        <span
                          key={spec}
                          className={`px-2 py-1 rounded-md text-xs ${
                            spec === analysis.recommendedSpecialist
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {spec === analysis.recommendedSpecialist && (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-[#0f1624] border border-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Medical Equipment</div>
                <div className="flex flex-wrap gap-2">
                  {hospital.equipment.map(eq => (
                    <span key={eq} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-xs text-cyan-300">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSelectHospital(hospital)}
              className={`w-full py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                index === 0
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30'
              }`}
            >
              <Navigation className="w-5 h-5" />
              Select & Send Pre-Arrival Alert
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function generateHospitals(analysis: AnalysisResult): Hospital[] {
  const baseHospitals = [
    {
      id: 1,
      name: 'City Medical Center',
      specialists: ['Cardiologist', 'Neurologist', 'General Physician', 'Trauma Surgeon'],
      equipment: ['ECG Machine', 'CT Scanner', 'MRI', 'Ventilator', 'Defibrillator']
    },
    {
      id: 2,
      name: 'Apollo Heart Institute',
      specialists: ['Cardiologist', 'Cardiac Surgeon', 'General Physician'],
      equipment: ['ECG Machine', 'Angiography', 'Echocardiogram', 'Defibrillator']
    },
    {
      id: 3,
      name: 'Neuro Care Hospital',
      specialists: ['Neurologist', 'Neurosurgeon', 'General Physician'],
      equipment: ['CT Scanner', 'MRI', 'EEG Machine', 'Ventilator']
    },
    {
      id: 4,
      name: 'Metro General Hospital',
      specialists: ['General Physician', 'Gastroenterologist', 'Pulmonologist'],
      equipment: ['X-Ray', 'Ultrasound', 'Blood Analyzer', 'Oxygen Support']
    },
    {
      id: 5,
      name: 'Sunrise Medical Complex',
      specialists: ['Trauma Surgeon', 'Orthopedic', 'General Physician', 'Pulmonologist'],
      equipment: ['X-Ray', 'CT Scanner', 'Ventilator', 'Blood Bank']
    },
    {
      id: 6,
      name: 'Valley Healthcare Center',
      specialists: ['General Physician', 'Pediatrician', 'Gastroenterologist'],
      equipment: ['Ultrasound', 'Blood Analyzer', 'Oxygen Support']
    }
  ];

  return baseHospitals
    .map(h => ({
      ...h,
      distance: parseFloat((Math.random() * 8 + 1).toFixed(1)),
      icuBeds: Math.floor(Math.random() * 6),
      rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
      estimatedTime: Math.floor(Math.random() * 20 + 5),
      matchScore: calculateMatchScore(h, analysis)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}

function calculateMatchScore(hospital: any, analysis: AnalysisResult): number {
  let score = 50;

  if (hospital.specialists.includes(analysis.recommendedSpecialist)) {
    score += 30;
  }

  if (analysis.requiresICU && hospital.icuBeds > 0) {
    score += 15;
  } else if (!analysis.requiresICU) {
    score += 10;
  }

  if (hospital.rating >= 4.5) {
    score += 5;
  }

  return Math.min(Math.floor(score), 99);
}
