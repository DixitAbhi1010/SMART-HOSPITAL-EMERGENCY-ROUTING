import { useState, useEffect, useRef } from 'react';
import { AnalysisResult } from '../App';
import { MessageCircle, Send, Bot, User, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  analysis: AnalysisResult;
}

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export function EmergencyChatbot({ analysis }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting based on severity
      const greeting = getInitialGreeting(analysis);
      addBotMessage(greeting, 0);

      // Provide immediate instructions
      setTimeout(() => {
        const instructions = getEmergencyInstructions(analysis);
        addBotMessage(instructions, 1000);
      }, 1500);
    }
  }, [isOpen, analysis]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string, delay = 0) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const response = generateResponse(input, analysis);
    addBotMessage(response, 1000);

    setInput('');
  };

  const quickActions = [
    'What should I do right now?',
    'How to perform CPR?',
    'Breathing exercises',
    'Stop bleeding',
    'Call emergency'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center z-50 group"
          >
            <MessageCircle className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0e27] animate-pulse" />
            <div className="absolute -bottom-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Emergency Assistant
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed z-50 bg-gradient-to-br from-[#1a2340] to-[#0f1624] border-2 border-red-500/50 rounded-2xl shadow-2xl flex flex-col ${
              isExpanded
                ? 'inset-4'
                : 'bottom-6 right-6 w-96 h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Emergency AI Assistant</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Severity Alert */}
            {analysis.severity === 'Critical' && (
              <div className="bg-red-500/20 border-b border-red-500/30 p-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-sm text-red-300">Critical condition detected - Follow instructions carefully</span>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'bot'
                      ? 'bg-gradient-to-br from-red-500 to-pink-600'
                      : 'bg-cyan-600'
                  }`}>
                    {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                    <div className={`px-4 py-2 rounded-2xl ${
                      msg.sender === 'bot'
                        ? 'bg-[#0f1624] border border-gray-700'
                        : 'bg-cyan-600'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{msg.text}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-[#0f1624] border border-gray-700 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map(action => (
                    <button
                      key={action}
                      onClick={() => {
                        setInput(action);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="px-3 py-1 bg-[#0f1624] border border-gray-600 rounded-full text-xs hover:border-cyan-500 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for emergency guidance..."
                  className="flex-1 px-4 py-2 bg-[#0f1624] border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getInitialGreeting(analysis: AnalysisResult): string {
  if (analysis.severity === 'Critical') {
    return `🚨 EMERGENCY DETECTED: ${analysis.condition}\n\nI'm your emergency AI assistant. I'll guide you with immediate first-aid steps while help is on the way. Stay calm and follow my instructions carefully.`;
  } else if (analysis.severity === 'Moderate') {
    return `⚠️ Medical Attention Required: ${analysis.condition}\n\nDon't worry, I'm here to help. I'll provide you with guidance while you're on your way to the hospital.`;
  }
  return `👋 Hello! I see you're experiencing: ${analysis.condition}\n\nI'm your medical AI assistant. I can help answer questions and provide guidance while you prepare for your hospital visit.`;
}

function getEmergencyInstructions(analysis: AnalysisResult): string {
  const condition = analysis.condition.toLowerCase();

  if (condition.includes('cardiac') || condition.includes('heart')) {
    return `⚕️ IMMEDIATE ACTIONS FOR CARDIAC EMERGENCY:

1. STOP all physical activity immediately
2. SIT or LIE DOWN in a comfortable position
3. LOOSEN tight clothing around neck/chest
4. Take prescribed nitroglycerin if available
5. CHEW 1 aspirin (if not allergic) - DO NOT SWALLOW WHOLE
6. Stay calm and breathe slowly

🚨 If unconscious, someone nearby should start CPR immediately

⏱️ Estimated hospital arrival: Help is coming
💊 DO NOT eat or drink anything

I'm monitoring your situation. Ask me anything!`;
  }

  if (condition.includes('breathing') || condition.includes('respiratory')) {
    return `⚕️ IMMEDIATE ACTIONS FOR BREATHING DIFFICULTY:

1. SIT UPRIGHT - don't lie down
2. LOOSEN tight clothing
3. Use rescue inhaler if you have one
4. Practice slow breathing:
   - Breathe IN through nose (4 counts)
   - Breathe OUT through mouth (6 counts)
5. Stay calm - panic makes it worse
6. Open windows for fresh air

🚨 If lips turn blue or breathing stops, call for immediate CPR

I'm here to guide you. How are you feeling now?`;
  }

  if (condition.includes('stroke') || condition.includes('neurological')) {
    return `⚕️ IMMEDIATE ACTIONS FOR NEUROLOGICAL EMERGENCY:

1. LIE DOWN on your side (recovery position)
2. DO NOT eat, drink, or take any medication
3. Note the time symptoms started (CRITICAL INFO)
4. Keep head slightly elevated
5. DO NOT move unnecessarily
6. Stay calm and still

⏱️ TIME IS CRITICAL - every minute counts

🚨 Hospital has been alerted and is preparing

I'll stay with you. Can you type or need voice assistance?`;
  }

  if (condition.includes('trauma') || condition.includes('accident')) {
    return `⚕️ IMMEDIATE ACTIONS FOR TRAUMA:

1. STAY STILL - don't move injured areas
2. Apply pressure to any bleeding wounds
3. DO NOT remove any embedded objects
4. Keep warm with blanket if available
5. Elevate bleeding limbs (if no fracture)
6. DO NOT eat or drink anything

🚨 If bleeding is severe:
   - Apply direct pressure
   - Don't remove the cloth, add more if needed

Help is on the way. Describe your injuries.`;
  }

  return `⚕️ GENERAL FIRST-AID GUIDANCE:

1. Stay calm and rest
2. Note your symptoms
3. Avoid eating/drinking before hospital
4. Prepare any medications you're taking
5. Have someone accompany you if possible

I'm here to answer any questions while you wait.`;
}

function generateResponse(input: string, analysis: AnalysisResult): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('cpr') || lowerInput.includes('resuscitation')) {
    return `🫀 CPR INSTRUCTIONS (For trained individuals only):

1. Check responsiveness - tap and shout
2. Call emergency services
3. Place on firm, flat surface
4. Hand position: Center of chest
5. Compress HARD and FAST:
   - 100-120 compressions/minute
   - Depth: 2 inches (5cm)
   - 30 compressions, then 2 rescue breaths
6. Continue until help arrives

⚠️ If untrained: Do hands-only CPR (compressions only)

🎵 Rhythm tip: Match "Stayin' Alive" song tempo`;
  }

  if (lowerInput.includes('breathing') || lowerInput.includes('breathe')) {
    return `🫁 BREATHING EXERCISE FOR EMERGENCY:

1. Sit upright, shoulders relaxed
2. Place one hand on chest, one on belly
3. Breathe IN slowly through nose (count to 4)
   - Your belly should rise, not chest
4. Hold for 2 seconds
5. Breathe OUT slowly through mouth (count to 6)
   - Purse lips like blowing out candles

Repeat 5-10 times. This activates your body's calm response.

How are you feeling? Better or still struggling?`;
  }

  if (lowerInput.includes('bleeding') || lowerInput.includes('blood')) {
    return `🩹 STOP BLEEDING - IMMEDIATE STEPS:

1. Apply DIRECT PRESSURE with clean cloth
2. Press FIRMLY - don't peek to check
3. Keep pressure for 10-15 minutes
4. If blood soaks through, ADD more cloth (don't remove)
5. Elevate the wound ABOVE heart level (if possible)
6. Once bleeding slows, bandage firmly

⚠️ SEVERE BLEEDING (spurting/won't stop):
- Apply pressure to pressure points
- Use tourniquet only as last resort
- Don't remove impaled objects

Is the bleeding slowing down?`;
  }

  if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
    return `Managing pain while waiting for medical care:

1. Find comfortable position (usually lying down)
2. Apply ice/cold pack (for injuries) - 15min on, 15min off
3. Keep the area still and supported
4. Focus on slow, deep breathing
5. Distract yourself - talk to someone, listen to calm music

⚠️ DO NOT take any medication unless prescribed
⚠️ Avoid putting pressure on injured areas

On a scale 1-10, how is your pain level?`;
  }

  if (lowerInput.includes('scared') || lowerInput.includes('afraid') || lowerInput.includes('panic')) {
    return `It's completely normal to feel scared. You're doing great by seeking help.

🧘 QUICK CALM-DOWN TECHNIQUE:
1. Focus on 5 things you can SEE
2. 4 things you can TOUCH
3. 3 things you can HEAR
4. 2 things you can SMELL
5. 1 thing you can TASTE

This grounds you in the present moment.

Remember: Help is on the way, the hospital is prepared, and you're not alone. I'm here with you.

What specific worry can I help with?`;
  }

  if (lowerInput.includes('what') && lowerInput.includes('do')) {
    return getEmergencyInstructions(analysis);
  }

  if (lowerInput.includes('emergency') || lowerInput.includes('call')) {
    return `📞 EMERGENCY CONTACT NUMBERS:

India Emergency Services:
🚑 Ambulance: 108 / 102
🚨 Police: 100
🚒 Fire: 101
👮 Women Helpline: 1091

Your hospital contact has already been notified through our system. They're preparing for your arrival.

Need me to guide someone else to call on your behalf?`;
  }

  return `I understand your concern about: "${input}"

Based on your ${analysis.severity.toLowerCase()} condition (${analysis.condition}), here's what I recommend:

${analysis.severity === 'Critical'
  ? '🚨 Continue following emergency first-aid steps\n🏥 Help is on the way - hospital is prepared\n⏱️ Every moment counts - stay calm and alert'
  : '⚕️ Keep monitoring your symptoms\n🏥 Hospital is ready to receive you\n📝 Note any changes in your condition'
}

Can you tell me more specifically what you need help with? I can guide you through:
- First aid steps
- Breathing techniques
- Pain management
- Keeping calm
- What to expect at hospital`;
}
