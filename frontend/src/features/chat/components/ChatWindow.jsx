import { useSelector } from 'react-redux';
import { selectMessages, selectIsStreaming } from '../chatSlice';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { MessageSquare } from 'lucide-react';

export default function ChatWindow() {
  const messages = useSelector(selectMessages);
  const isStreaming = useSelector(selectIsStreaming);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[#9acee2]/40 bg-white/80 p-10 text-center text-slate-500 shadow-sm shadow-slate-200/40">
              <MessageSquare size={54} className="mb-4 text-[#223959]/30" />
              <h3 className="text-2xl font-semibold text-[#223959]">Your Nexus assistant is ready</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Type a question in the input below to begin a chat with Nexus and explore your documents instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#9acee2]/20 bg-white/80 px-6 py-5 backdrop-blur-sm">
        <ChatInput />
        {isStreaming && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150"></div>
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-300"></div>
            </div>
            Nexus is thinking...
          </div>
        )}
      </div>
    </div>
  );
}
