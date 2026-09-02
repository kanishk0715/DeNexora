import { describe, it, expect } from 'vitest';
import { OFFICIAL_LANGUAGES, INTERFACE_LANGUAGES } from './languages';
import { COPY } from './public';
import { CHATBOT, detectChatTopic } from './chatbot';

describe('22 official Indian languages', () => {
  it('catalogues exactly 22 Eighth Schedule languages', () => {
    expect(OFFICIAL_LANGUAGES).toHaveLength(22);
    expect(INTERFACE_LANGUAGES).toHaveLength(23);
  });

  it('has public copy for English and every official language', () => {
    expect(COPY.en.hero.title.length).toBeGreaterThan(0);
    for (const { code, native } of OFFICIAL_LANGUAGES) {
      expect(COPY[code].nav.getStarted.length).toBeGreaterThan(0);
      expect(COPY[code].roles.student.label.length).toBeGreaterThan(0);
      expect(native.length).toBeGreaterThan(0);
    }
  });

  it('has chatbot copy for English and every official language', () => {
    expect(Object.keys(CHATBOT)).toHaveLength(23);
    expect(CHATBOT.en.greeting.length).toBeGreaterThan(0);
    for (const { code } of OFFICIAL_LANGUAGES) {
      expect(CHATBOT[code].title.length).toBeGreaterThan(0);
      expect(CHATBOT[code].replies.panchakarma.length).toBeGreaterThan(0);
      expect(CHATBOT[code].suggestions).toHaveLength(4);
    }
  });

  it('detects AYUSH topics in English and Indic scripts', () => {
    expect(detectChatTopic('Tell me about BAMS')).toBe('bams');
    expect(detectChatTopic('पंचकर्म क्या है')).toBe('panchakarma');
    expect(detectChatTopic('பஞ்சகர்மா')).toBe('panchakarma');
    expect(detectChatTopic('నమస్కారం')).toBe('hello');
  });
});
