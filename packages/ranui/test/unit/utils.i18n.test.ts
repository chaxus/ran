import { describe, expect, it } from 'vitest';
import { I18nCore as OwnerI18nCore, createI18n as ownerCreateI18n, useI18n as ownerUseI18n } from 'ranuts/i18n';
import { I18nCore, createI18n, useI18n } from '@/utils/i18n';

describe('i18n facade', () => {
  it('shares the engine and singleton with ranuts', () => {
    expect(I18nCore).toBe(OwnerI18nCore);
    expect(createI18n).toBe(ownerCreateI18n);
    expect(useI18n).toBe(ownerUseI18n);
  });
});
