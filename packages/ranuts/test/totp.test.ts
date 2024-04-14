import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOTP } from '@/utils/totp/totp';

describe('totp generation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should generate token with date now = 1971', () => {
    vi.setSystemTime(0);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP').otp).toEqual('282760');
  });

  it('should generate token with date now = 2016', () => {
    vi.setSystemTime(1465324707000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP').otp).toEqual('341128');
  });

  it('should generate correct token at the start of the cycle', () => {
    const start = 1665644340000;
    vi.setSystemTime(start + 1);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP').otp).toEqual('886842');
  });

  it('should generate correct token at the end of the cycle', () => {
    const start = 1665644340000;
    vi.setSystemTime(start - 1);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP').otp).toEqual('134996');
  });

  it('should generate token with a leading zero', () => {
    vi.setSystemTime(1365324707000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP').otp).toEqual('089029');
  });

  it('should generate token from a padded base32 key', () => {
    vi.setSystemTime(1465324707000);
    expect(TOTP.generate('CI2FM6EQCI2FM6EQKU======').otp).toEqual('984195');
  });

  it('should throw if key contains an invalid character', () => {
    vi.setSystemTime(1465324707000);
    expect(() => TOTP.generate('JBSWY3DPEHPK3!@#')).toThrow('Invalid base32 character in key');
  });

  it('should generate longer-lasting token with date now = 2016', () => {
    vi.setSystemTime(1465324707000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP', { period: 60 }).otp).toEqual('313995');
  });

  it('should generate longer token with date now = 2016', () => {
    vi.setSystemTime(1465324707000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP', { digits: 8 }).otp).toEqual('43341128');
  });

  it('should generate SHA-512-based token with date now = 2016', () => {
    vi.setSystemTime(1465324707000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP', { algorithm: 'SHA-512' }).otp).toEqual('093730');
  });

  it('should generate token with timestamp from options', () => {
    expect(TOTP.generate('JBSWY3DPEHPK3PXP', { timestamp: 1465324707000 }).otp).toEqual('341128');
  });

  it('should return all values when values is less then digits', () => {
    vi.setSystemTime(1634193300000);
    expect(TOTP.generate('3IS523AYRNFUE===', { digits: 9 }).otp).toEqual('97859470');
  });

  // it("should trigger leftpad fix", () => {
  //     // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  //     vi.setSystemTime(12312354132421332222222222)
  //     expect(TOTP.generate("JBSWY3DPEHPK3PXP").otp).toEqual("895896")
  // })

  // it("should trigger leftpad fix", () => {
  //     vi.mock("jssha", () => ({
  //         __esModule: true,
  //         default: "mockedDefaultExport",
  //         namedExport: vi.fn(),
  //     }))
  //     // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  //     vi.setSystemTime(12312354132421332222222222)
  //     expect(TOTP.generate("JBSWY3DPEHPK3PXP").otp).toEqual("895896")
  // })

  it('should generate token with correct expires', () => {
    const start = 1665644340000;
    vi.setSystemTime(start - 1);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '134996', expires: start });
    vi.setSystemTime(start);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '886842', expires: start + 30000 });
    vi.setSystemTime(start + 1);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '886842', expires: start + 30000 });
    vi.setSystemTime(start + 29999);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '886842', expires: start + 30000 });
    vi.setSystemTime(start + 30000);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '421127', expires: start + 60000 });
    vi.setSystemTime(start + 30001);
    expect(TOTP.generate('JBSWY3DPEHPK3PXP')).toEqual({ otp: '421127', expires: start + 60000 });
  });
});
