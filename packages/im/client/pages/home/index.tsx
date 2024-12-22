import React, { } from 'react';
import { EventStreamFetch } from '@/client/lib/eventSource';


export const Home = (): React.JSX.Element => {

  const { fetchStream } = new EventStreamFetch()

  const sendMessage = (params: Record<string, string> = {}) => {
    fetchStream('/api/im/dialog', params)
  }

  const click = () => {
    sendMessage({ chat_id: '1', question: 'hello' })
  }

  return (
    <div>
      <h1>Home</h1>
      <div>输入消息</div>
      <input type="text" />
      <button onClick={click}>发送消息</button>
      <div>回答</div>
      <textarea></textarea>
    </div>
  );
};

export default Home;
