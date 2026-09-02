import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    setMessages(prev => [...prev, { text: asked, isBot: false, timestamp: new Date() }]);
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

    setMessages(prev => [...prev, { text, isBot: true, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const asked = input.trim();
    setInput('');
    await pushUserAndReply(asked);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-forest-700 to-forest-500 text-white shadow-xl ring-4 ring-forest-600/20 md:bottom-6"
            aria-label={copy.openAria}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-forest-500/30" />
            <MessageCircle size={22} className="relative" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-4 z-[60] flex h-[min(560px,calc(100dvh-8rem))] w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-2xl border border-forest-100 bg-cream-50 shadow-2xl md:bottom-6"
            dir={rtl ? 'rtl' : 'ltr'}
            lang={lang}
            role="dialog"
            aria-label={copy.title}
          >
            <div className="flex items-start justify-between gap-2 bg-gradient-to-r from-forest-800 to-forest-600 px-3 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <Bot size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{copy.title}</h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-white/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    {copy.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <select
                  id="chat-lang"
                  value={lang}
                  onChange={e => setLang(e.target.value as Lang)}
                  className="max-w-[7.75rem] cursor-pointer rounded-lg border-0 bg-white/15 py-1 pl-1.5 pr-1 text-[11px] font-medium text-white outline-none"
                  aria-label={copy.langAria}
                >
                  {INTERFACE_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="text-ink-900">
                      {l.native}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 transition hover:bg-white/15" aria-label={copy.closeAria}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-forest-50/40 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp.getTime()}-${index}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50 ring-1 ring-forest-100">
                      <Bot size={15} className="text-forest-700" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 shadow-sm ${
                      message.isBot ? 'rounded-tl-md bg-cream-50 text-ink-800 ring-1 ring-forest-100' : 'rounded-tr-md bg-forest-800 text-cream-50'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  {!message.isBot && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-700">
                      <User size={15} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50">
                    <Bot size={15} className="text-forest-700" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-400" style={{ animationDelay: '0.15s' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-400" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-forest-100 bg-cream-50 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {copy.suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void pushUserAndReply(s)}
                    disabled={isLoading}
                    className="rounded-full border border-forest-100 bg-forest-50 px-2.5 py-1 text-[11px] font-medium text-forest-800 transition hover:bg-forest-100 disabled:opacity-50"
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
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder={copy.placeholder}
                  className="input !py-2.5"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-white transition hover:bg-forest-800 disabled:opacity-50"
                  aria-label={copy.sendAria}
                >
                  <Send size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
