import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentSessionId, selectIsStreaming, addMessage } from '../chatSlice';
import { useSendMessageMutation } from '../chatApi';
import { Send, Mic } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const sessionId = useSelector(selectCurrentSessionId);
  const isStreaming = useSelector(selectIsStreaming);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || isStreaming) return;
    const userMessage = message.trim();
    setMessage('');
    dispatch(addMessage({ role: 'user', content: userMessage, timestamp: new Date().toISOString() }));
    try {
      const result = await sendMessage({ sessionId, message: userMessage }).unwrap();
      dispatch(addMessage({ role: 'assistant', content: result.response, sources: result.sources || [], fromCache: result.fromCache || false, timestamp: new Date().toISOString() }));
    } catch {
      dispatch(addMessage({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date().toISOString() }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3 rounded-[32px] border border-[#9acee2]/30 bg-white px-4 py-3 shadow-sm shadow-slate-200/40">
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff7ff] text-[#223959] transition-colors" title="Voice input (coming soon)" disabled>
          <Mic size={18} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Nexus about your documents..."
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          disabled={!sessionId || isStreaming || isLoading}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#223959] px-5 text-white transition-all duration-200 hover:bg-[#1fab78] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!message.trim() || !sessionId || isStreaming || isLoading}
        >
          <Send size={18} />
        </button>
      </div>
      {!sessionId && (
        <p className="text-center text-sm text-slate-400">Select or create a chat session first to start the conversation.</p>
      )}
    </form>
  );
}
