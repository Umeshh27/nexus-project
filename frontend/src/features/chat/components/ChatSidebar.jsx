import { useSelector } from 'react-redux';
import { useGetChatSessionsQuery, useDeleteChatSessionMutation, useCreateChatSessionMutation } from '../chatApi';
import { selectCurrentSessionId } from '../chatSlice';
import { MessageSquare, Plus, Trash2, Folder, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatSidebar({ onSelectSession }) {
  const { data: sessions = [], isLoading } = useGetChatSessionsQuery();
  const [deleteSession] = useDeleteChatSessionMutation();
  const [createSession] = useCreateChatSessionMutation();
  const currentSessionId = useSelector(selectCurrentSessionId);

  const handleNewChat = async () => {
    try {
      const result = await createSession().unwrap();
      onSelectSession(result._id);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId).unwrap();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-[#f4fbff] px-3 py-5">
      <nav className="space-y-3 px-1">
        <button onClick={handleNewChat} className="flex w-full items-center gap-3 rounded-3xl bg-[#223959] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1fab78]">
          <Plus size={18} />
          New Chat
        </button>
        <Link to="/documents" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-[#223959] transition-all duration-200 hover:bg-[#9acee2]/15 hover:text-[#223959]">
          <Folder size={18} />
          Documents
        </Link>
      </nav>

      <div className="mt-6 flex-1 overflow-hidden px-1 pb-2">
        <div className="mb-3 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-400">Recent chats</div>
        <div className="h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#223959]"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-[28px] bg-white px-4 py-5 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50">
              No chats yet.
              <div className="mt-2 text-xs text-slate-400">Create your first chat from above.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session._id}
                  onClick={() => onSelectSession(session._id)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-3xl px-4 py-3 text-sm transition-all duration-200 ${
                    currentSessionId === session._id
                      ? 'bg-[#223959] text-white shadow-lg shadow-[#223959]/10'
                      : 'bg-white text-slate-600 hover:bg-[#9acee2]/10 hover:text-[#223959]'
                  }`}
                >
                  <span className="truncate">{session.title || 'New Chat'}</span>
                  <button onClick={(e) => handleDelete(e, session._id)} className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-1">
        <Link to="/settings" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-[#223959] transition-all duration-200 hover:bg-[#9acee2]/15 hover:text-[#223959]">
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}