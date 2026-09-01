import { describe, it, expect } from 'vitest';
import { OFFICIAL_LANGUAGES, INTERFACE_LANGUAGES } from './languages';
import { COPY } from './public';

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
});
