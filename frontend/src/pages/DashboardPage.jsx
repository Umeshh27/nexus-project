import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser, selectUserRole } from '../features/auth/authSlice';
import { MessageSquare, Mic, Folder, Users } from 'lucide-react';

const ActionCard = ({ title, description, link, icon: Icon, iconBg, btnBg, btnText, topArrow }) => (
  <Link to={link} className="flex flex-col bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative group h-full">
    
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center ${iconBg}`}>
        <Icon size={24} strokeWidth={1.5} className="text-current" />
      </div>
      {topArrow && <span className="text-navy-900 opacity-50">&rarr;</span>}
    </div>
    
    <h3 className="text-2xl font-bold text-navy-900 mb-3">{title}</h3>
    <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
      {description}
    </p>

    <div className="mt-auto flex">
      <span className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white ${btnBg} transition-colors group-hover:opacity-90`}>
        {btnText} &rarr;
      </span>
    </div>
  </Link>
);

export default function DashboardPage() {
  const role = useSelector(selectUserRole);

  const startChatCard = {
    title: "Start Chat",
    description: "Begin a new conversation with Nexus and get instant answers from your organization documents.",
    link: "/chat",
    icon: MessageSquare,
    iconBg: "bg-sky-200 text-navy-900",
    btnBg: "bg-navy-900",
    btnText: "Start Chat"
  };

  const fileManagerCard = {
    title: "File Manager",
    description: "Browse everything you've uploaded so far and keep your knowledge base organized.",
    link: "/documents",
    icon: Folder,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-emerald-500",
    btnText: "View Files",
    topArrow: true
  };

  const voiceAssistantCard = {
    title: "Voice Assistant",
    description: "Use your voice to interact with Nexus and get hands-free help instantly.",
    link: "/voice",
    icon: Mic,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-navy-900",
    btnText: "Start Voice"
  };

  const userManagementCard = {
    title: "User Management",
    description: "Manage organization members, control access permissions, and view system audits.",
    link: "/admin",
    icon: Users,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-rose-500",
    btnText: "Manage Users"
  };

  const gridClass = role === 'admin'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1600px] mx-auto animate-[slideUp_1s_ease-out_0.3s_both]"
    : "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto animate-[slideUp_1s_ease-out_0.3s_both]";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 pb-12 pt-8">
      
      {/* Top Center NEXUS Branding */}
      <div className="mb-10 text-center animate-[popIn_0.8s_ease-out_forwards]">
        <h1 className="font-nexus text-6xl md:text-7xl font-bold tracking-widest text-navy-800 drop-shadow-md">
          NEXUS
        </h1>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; filter: blur(5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); }
        }
        @keyframes slideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}} />

      {/* Responsive Boxes */}
      <div className={gridClass}>
        <ActionCard {...startChatCard} />
        <ActionCard {...fileManagerCard} />
        <ActionCard {...voiceAssistantCard} />
        {role === 'admin' && <ActionCard {...userManagementCard} />}
      </div>
      
    </div>
  );
}