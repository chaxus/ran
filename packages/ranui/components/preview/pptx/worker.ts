import processPptx from '@/components/preview/pptx/process_pptx';

processPptx(
  (func) => {
    self.onmessage = (e) => func(e.data);
  },
  (msg) => self.postMessage(msg),
);
