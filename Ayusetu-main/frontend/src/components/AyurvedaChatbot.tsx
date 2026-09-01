import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function AyurvedaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Namaste! I\'m your Ayurveda AI assistant. Ask me about Ayurveda education, internships, opportunities, or career guidance!',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAyurvedaResponse = (question: string): string => {
    const lower = question.toLowerCase();

    // Ayurveda education questions
    if (lower.includes('bams') || lower.includes('degree') || lower.includes('course')) {
      return 'BAMS (Bachelor of Ayurvedic Medicine and Surgery) is a 5.5-year degree program including internship. Students learn traditional Ayurvedic medicine, surgery, and modern medical sciences. After BAMS, you can pursue MD in Ayurveda or start practicing.';
    }
    if (lower.includes('internship') || lower.includes('clinical training')) {
      return 'Ayurveda internships include clinical rotations in Panchakarma, Kayachikitsa, Shalya Tantra, and specialty departments. We connect students with AIIA, state hospitals, and wellness centers for hands-on experience.';
    }
    if (lower.includes('job') || lower.includes('career') || lower.includes('opportunity')) {
      return 'Ayurveda careers include: Government hospitals, Private clinics, Wellness centers, Pharmaceutical companies, Research institutes, Teaching positions, and Panchakarma centers. Check our Opportunities section for current openings!';
    }
    if (lower.includes('skill') || lower.includes('assessment') || lower.includes('evaluate')) {
      return 'Our skill assessment evaluates your knowledge in Ayurvedic principles, clinical diagnosis, Panchakarma procedures, and medicinal plants. Complete the assessment to get personalized recommendations and match with suitable opportunities!';
    }
    if (lower.includes('panchakarma')) {
      return 'Panchakarma is Ayurveda\'s detoxification therapy including Vamana, Virechana, Basti, Nasya, and Raktamokshana. Many hospitals hire specialized Panchakarma therapists. Practical training is essential!';
    }
    if (lower.includes('research') || lower.includes('phd')) {
      return 'Ayurveda research opportunities include MD/MS programs, PhD in Ayurveda, CCRAS fellowships, and collaborative research with institutions. Areas include drug development, clinical trials, and traditional knowledge documentation.';
    }
    if (lower.includes('salary') || lower.includes('pay') || lower.includes('income')) {
      return 'Ayurveda doctor salaries range from ₹3-8 lakhs/year for freshers in government, ₹4-12 lakhs in private sector, and ₹15+ lakhs for experienced practitioners. Specialized skills in Panchakarma or Ksharsutra can increase earning potential.';
    }
    if (lower.includes('aiia') || lower.includes('all india institute')) {
      return 'All India Institute of Ayurveda (AIIA) is a premier institute in Delhi offering BAMS, MD/MS, PhD, and specialized training. It provides excellent clinical exposure and research opportunities under Ministry of Ayush.';
    }
    if (lower.includes('ministry') || lower.includes('ayush')) {
      return 'Ministry of Ayush promotes Ayurveda education, research, and practice. It manages national institutes, offers scholarships, and creates opportunities for Ayurveda professionals across India.';
    }
    if (lower.includes('fdp') || lower.includes('faculty development')) {
      return 'Faculty Development Programs help Ayurveda teachers enhance teaching skills, research methods, and clinical expertise. Check our Faculty section for upcoming FDPs and workshops!';
    }
    if (lower.includes('portfolio') || lower.includes('profile')) {
      return 'Create your AyuSetu portfolio to showcase your skills, certifications, clinical experience, and research work. A complete profile increases visibility to recruiters and helps with opportunity matching!';
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste')) {
      return 'Namaste! How can I help you with Ayurveda education or career today? Ask me about courses, internships, jobs, or skills!';
    }
    if (lower.includes('help') || lower.includes('what can you do')) {
      return 'I can help with: ✓ Ayurveda education info ✓ Internship opportunities ✓ Job/career guidance ✓ Skill assessment ✓ Faculty programs ✓ Portfolio building ✓ Ministry schemes. What would you like to know?';
    }

    // Default response with suggestions
    return 'I can help you with Ayurveda education and careers! Try asking: "Tell me about BAMS course", "How to find internships?", "Career opportunities in Ayurveda", or "What is skill assessment?"';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse: Message = {
        text: getAyurvedaResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0b5c3a] to-[#138808] text-white shadow-2xl transition hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl border-2 border-[#0b5c3a] bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#0b5c3a] to-[#138808] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Ayurveda AI Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 transition hover:bg-white/20"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {message.isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Bot size={16} className="text-[#0b5c3a]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-gradient-to-r from-[#0b5c3a] to-[#138808] text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b5c3a]">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Bot size={16} className="text-[#0b5c3a]" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Ayurveda..."
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-[#0b5c3a] focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5c3a] text-white transition hover:bg-[#084830] disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
