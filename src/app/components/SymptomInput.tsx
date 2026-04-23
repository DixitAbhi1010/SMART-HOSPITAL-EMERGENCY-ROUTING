import { useState } from 'react';
import { SymptomData } from '../App';
import { CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';

interface Props {
  onSubmit: (data: SymptomData) => void;
}

const commonSymptoms = [
  'Chest pain',
  'Difficulty breathing',
  'High blood pressure',
  'Sweating',
  'Dizziness',
  'Severe headache',
  'Fever',
  'Vomiting',
  'Abdominal pain',
  'Numbness',
  'Seizure',
  'Unconsciousness'
];

export function SymptomInput({ onSubmit }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length > 0) {
      onSubmit({
        symptoms: selectedSymptoms,
        additionalInfo
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-[#1a2340] to-[#0f1624] rounded-2xl shadow-2xl border border-cyan-500/30 p-8">
        <div className="mb-6">
          <h2 className="text-3xl mb-2">Emergency Symptom Assessment</h2>
          <p className="text-gray-400">Please select or enter the symptoms you're experiencing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Symptoms Grid */}
          <div>
            <label className="block mb-3 text-cyan-400">Common Symptoms</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {commonSymptoms.map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-[#0f1624] border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{symptom}</span>
                    {selectedSymptoms.includes(symptom) && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div>
            <label className="block mb-3 text-cyan-400">Add Other Symptoms</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
                placeholder="Type any other symptoms..."
                className="flex-1 px-4 py-3 bg-[#0f1624] border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={addCustomSymptom}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div>
              <label className="block mb-3 text-cyan-400">Selected Symptoms ({selectedSymptoms.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(symptom => (
                  <span
                    key={symptom}
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-300 flex items-center gap-2 text-sm"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div>
            <label className="block mb-3 text-cyan-400">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Describe the severity, duration, or any other relevant details..."
              rows={4}
              className="w-full px-4 py-3 bg-[#0f1624] border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Warning Message */}
          {selectedSymptoms.length === 0 && (
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                Please select at least one symptom to continue with the analysis
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={selectedSymptoms.length === 0}
            className={`w-full py-4 rounded-lg transition-all ${
              selectedSymptoms.length > 0
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/50'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            Analyze Symptoms with AI
          </button>
        </form>
      </div>
    </div>
  );
}
