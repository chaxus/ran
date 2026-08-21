import React, { useEffect, useRef, useState } from 'react';
import { streamDialog } from '@/client/lib/eventSource';
import type { DialogStream } from '@/client/lib/eventSource';
import type { StreamSnapshot } from 'ranuts/stream';

/**
 * Streaming dialog demo.
 *
 * The component holds a {@link StreamSnapshot} rather than a string, because that is what
 * the fold already produces: text, reasoning, usage, and whether the turn is finished all
 * arrive together and stay consistent with each other. Concatenating deltas in the view
 * would put ordering and interleaving back where they do not belong.
 *
 * @returns The page.
 */
export const Home = (): React.JSX.Element => {
  const [question, setQuestion] = useState('春江花月夜');
  const [snapshot, setSnapshot] = useState<StreamSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const streamRef = useRef<DialogStream | null>(null);

  // A request outliving its component would keep calling setState after unmount.
  useEffect(() => () => streamRef.current?.close(), []);

  const send = (): void => {
    streamRef.current?.close();
    setSnapshot(null);
    setError(null);
    setRunning(true);
    streamRef.current = streamDialog(
      '/api/im/dialog',
      { chat_id: '1', question },
      {
        onUpdate: setSnapshot,
        onEnd: (final, failure) => {
          setSnapshot(final);
          setRunning(false);
          streamRef.current = null;
          if (failure !== undefined) setError(failure.message);
        },
      },
    );
  };

  const stop = (): void => {
    streamRef.current?.close();
  };

  const text =
    snapshot === null
      ? ''
      : snapshot.blocks.reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');

  return (
    <div>
      <h1>Home</h1>
      <div>输入消息</div>
      <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} />
      <button onClick={send} disabled={running}>
        发送消息
      </button>
      <button onClick={stop} disabled={!running}>
        停止
      </button>
      <div>回答</div>
      <pre>{text}</pre>
      {error !== null && <p role="alert">{error}</p>}
      {snapshot?.usage !== undefined && <p>tokens: {snapshot.usage.outputTokens}</p>}
    </div>
  );
};

export default Home;
