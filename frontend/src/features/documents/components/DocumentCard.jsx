import { FileText } from 'lucide-react';
import RoleBadge from '../../../components/ui/RoleBadge';

export default function DocumentCard({ document }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-navy-50 rounded-lg p-2"><FileText size={20} className="text-navy-500" /></div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{document.originalName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{(document.fileSize / 1024).toFixed(1)} KB • {new Date(document.createdAt).toLocaleDateString()}</p>
        </div>
        <RoleBadge role={document.permissionLevel} />
      </div>
    </div>
  );
}
