import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-voice-button`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const voiceButtonText = defineText({
  en: {
    'voiceButton.cancelHint': 'Release to cancel',
    'voiceButton.holdHint': 'Release to keep · slide up to cancel',
    'voiceButton.start': 'Start voice input',
    'voiceButton.stop': 'Stop voice input',
  },
  zh: {
    'voiceButton.cancelHint': '松开取消',
    'voiceButton.holdHint': '松开保留 · 上滑取消',
    'voiceButton.start': '开始语音输入',
    'voiceButton.stop': '停止语音输入',
  },
  ja: {
    'voiceButton.cancelHint': '指を離すとキャンセル',
    'voiceButton.holdHint': '指を離すと確定 · 上にスライドでキャンセル',
    'voiceButton.start': '音声入力を開始',
    'voiceButton.stop': '音声入力を停止',
  },
  ko: {
    'voiceButton.cancelHint': '손을 떼면 취소',
    'voiceButton.holdHint': '손을 떼면 유지 · 위로 밀어서 취소',
    'voiceButton.start': '음성 입력 시작',
    'voiceButton.stop': '음성 입력 중지',
  },
  es: {
    'voiceButton.cancelHint': 'Suelta para cancelar',
    'voiceButton.holdHint': 'Suelta para conservar · desliza hacia arriba para cancelar',
    'voiceButton.start': 'Iniciar entrada de voz',
    'voiceButton.stop': 'Detener entrada de voz',
  },
  pt: {
    'voiceButton.cancelHint': 'Solte para cancelar',
    'voiceButton.holdHint': 'Solte para manter · deslize para cima para cancelar',
    'voiceButton.start': 'Iniciar entrada de voz',
    'voiceButton.stop': 'Parar entrada de voz',
  },
  de: {
    'voiceButton.cancelHint': 'Zum Abbrechen loslassen',
    'voiceButton.holdHint': 'Zum Behalten loslassen · zum Abbrechen nach oben wischen',
    'voiceButton.start': 'Spracheingabe starten',
    'voiceButton.stop': 'Spracheingabe beenden',
  },
  fa: {
    'voiceButton.cancelHint': 'برای لغو رها کنید',
    'voiceButton.holdHint': 'برای نگه‌داشتن رها کنید · برای لغو به بالا بکشید',
    'voiceButton.start': 'شروع ورودی صوتی',
    'voiceButton.stop': 'توقف ورودی صوتی',
  },
});
