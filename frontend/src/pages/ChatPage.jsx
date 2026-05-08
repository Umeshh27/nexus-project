import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentSession, setMessages } from '../features/chat/chatSlice';
import { useGetChatSessionQuery } from '../features/chat/chatApi';
import ChatSidebar from '../features/chat/components/ChatSidebar';
import ChatWindow from '../features/chat/components/ChatWindow';

export default function ChatPage() {
  const dispatch = useDispatch();
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const { data: session } = useGetChatSessionQuery(selectedSessionId, {
    skip: !selectedSessionId,
  });

  useEffect(() => {
    if (selectedSessionId && session?.messages) {
      dispatch(setMessages(session.messages));
    } else if (!selectedSessionId) {
      dispatch(setMessages([]));
    }
  }, [selectedSessionId, session, dispatch]);

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    dispatch(setCurrentSession(sessionId));
    dispatch(setMessages([]));
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-[#eef7ff]">
      <div className="mx-auto flex max-w-[1350px] gap-5 rounded-[36px] bg-white p-4 shadow-[0_24px_80px_rgba(34,57,89,0.08)]">
        <ChatSidebar onSelectSession={handleSelectSession} />
        <main className="flex-1 rounded-[32px] bg-[#f9fcff] shadow-sm shadow-slate-200/40">
          {/* <div className="mb-6 rounded-[32px] border border-[#9acee2]/25 bg-white/90 px-6 py-5 shadow-sm shadow-slate-200/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Live chat</p>
                <h1 className="mt-2 text-3xl font-black text-[#223959]">Nexus Assistant</h1>
              </div>
              <div className="rounded-3xl bg-[#223959] px-4 py-2 text-sm font-semibold text-white">Member Mode</div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Ask any question about your uploaded documents and get instant answers from your organization knowledge base.</p>
          </div> */}

          <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-[32px] border border-[#9acee2]/20 bg-[#eff7ff] shadow-inner shadow-slate-200/40">
            <ChatWindow />
          </div>
        </main>
      </div>
    </div>
  );
}
