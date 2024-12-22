import React, { useState } from 'react';
import { EventStreamFetch } from '@/client/lib/eventSource';

interface IMResponse {
  dialog_id: number;
  create_time: number;
  question: string;
  answer: string;
}

export const Home = (): React.JSX.Element => {
  const [state, setState] = useState<string>('');

  const { fetchStream } = new EventStreamFetch();

  const sendMessage = (params: Record<string, string> = {}) => {
    fetchStream('/api/im/dialog', params, (data: IMResponse) => {
      const { answer } = data;
      setState(answer);
    });
  };

  const click = () => {
    sendMessage({ chat_id: '1', question: 'hello' });
  };

  return (
    <div>
      <h1>Home</h1>
      <div>输入消息</div>
      <input type="text" />
      <button onClick={click}>发送消息</button>
      <div>回答</div>
      <pre>{state}</pre>
    </div>
  );
};

export default Home;
