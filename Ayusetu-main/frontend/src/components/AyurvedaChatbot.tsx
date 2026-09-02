import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { nlpChat } from '../lib/api';
import { DEMO_OPPORTUNITIES } from '../data/demo';
import { useLocale } from '../contexts/LocaleContext';
import { INTERFACE_LANGUAGES, type Lang } from '../i18n/languages';
import { detectChatTopic, getChatbotCopy, isChatRtl } from '../i18n/chatbot';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function AyurvedaChatbot() {
  const { lang, setLang } = useLocale();
  const copy = getChatbotCopy(lang);
  const rtl = isChatRtl(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        text: copy.greeting,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  }, [copy.greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const replyFor = (question: string) => copy.replies[detectChatTopic(question)];

  const pushUserAndReply = async (asked: string) => {
    const userMessage: Message = {
      text: asked,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let text = replyFor(asked);
    if (lang === 'en') {
      const extra = DEMO_OPPORTUNITIES.map(o => ({
        id: o._id,
        title: o.title,
        text: `${o.title} at ${o.organization}, ${o.location}. ${o.description} Skills: ${o.requiredSkills.map(s => s.name).join(', ')}.`,
      }));
      const rag = await nlpChat(asked, extra);
      if (rag?.answer) text = rag.answer;
    }

    setMessages(prev => [
      ...prev,
      { text, isBot: true, timestamp: new Date() },
    ]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const asked = input.trim();
    setInput('');
    await pushUserAndReply(asked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0b5c3a] to-[#138808] text-white shadow-2xl transition hover:scale-110"
          aria-label={copy.openAria}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[min(100vw-1.5rem,24rem)] flex-col rounded-2xl border-2 border-[#0b5c3a] bg-white shadow-2xl"
          dir={rtl ? 'rtl' : 'ltr'}
          lang={lang}
        >
          <div className="flex items-start justify-between gap-2 rounded-t-2xl bg-gradient-to-r from-[#0b5c3a] to-[#138808] p-3 text-white">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{copy.title}</h3>
                <p className="text-[11px] leading-snug opacity-90">{copy.subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <label className="sr-only" htmlFor="chat-lang">
                {copy.langAria}
              </label>
              <select
                id="chat-lang"
                value={lang}
                onChange={e => setLang(e.target.value as Lang)}
                className="max-w-[7.5rem] cursor-pointer rounded-lg border-0 bg-white/15 py-1 pl-1.5 pr-1 text-[11px] font-medium text-white outline-none"
                aria-label={copy.langAria}
              >
                {INTERFACE_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="text-ink-900">
                    {l.native}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 transition hover:bg-white/20"
                aria-label={copy.closeAria}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.timestamp.getTime()}-${index}`}
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
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b5c3a]">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
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

          <div className="border-t border-gray-200 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {copy.suggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void pushUserAndReply(s)}
                  disabled={isLoading}
                  className="rounded-full border border-[#0b5c3a]/20 bg-[#e8f3ee] px-2.5 py-1 text-[11px] font-medium text-[#0b5c3a] disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={copy.placeholder}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-[#0b5c3a] focus:outline-none"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5c3a] text-white transition hover:bg-[#084830] disabled:opacity-50"
                aria-label={copy.sendAria}
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
