import { User, Bot, FileText } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-navy-500 text-white flex items-center justify-center flex-shrink-0">
          <Bot size={16} />
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-navy-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.sources.map((source, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                <FileText size={10} />
                {source.filename} {source.page && `p.${source.page}`}
              </span>
            ))}
          </div>
        )}
        {message.fromCache && <span className="inline-block text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full mt-1">Answered from cache</span>}
        <p className="text-[10px] text-gray-300 mt-1">{message.timestamp && new Date(message.timestamp).toLocaleTimeString()}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
