import { useSelector } from 'react-redux';
import { useGetDocumentsQuery, useDeleteDocumentMutation } from '../documentApi';
import { selectCurrentUser } from '../../auth/authSlice';
import RoleBadge from '../../../components/ui/RoleBadge';
import { FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentTable() {
  const { data: documents = [], isLoading } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();
  const currentUser = useSelector(selectCurrentUser);

  const handleDelete = async (docId, docName) => {
    if (!window.confirm(`Delete "${docName}"?`)) return;
    try { await deleteDocument(docId).unwrap(); toast.success('Document deleted'); }
    catch { toast.error('Failed to delete document'); }
  };

  const canDelete = (doc) => currentUser?.role === 'admin' || doc.uploadedBy === currentUser?._id;

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>;
  if (documents.length === 0) return (
    <div className="text-center py-12 text-gray-300">
      <FileText size={48} className="mx-auto mb-3 opacity-30" />
      <p className="font-medium text-gray-400">No documents uploaded yet</p>
      <p className="text-sm mt-1 text-gray-400">Upload files to get started</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Level</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded By</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={16} className="text-navy-500" /><span className="font-medium text-sm">{doc.originalName}</span></div></td>
              <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{doc.fileType}</span></td>
              <td className="px-4 py-3"><RoleBadge role={doc.permissionLevel} /></td>
              <td className="px-4 py-3 text-sm text-gray-500">{doc.uploadedByName || 'Unknown'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {canDelete(doc) && (
                  <button onClick={() => handleDelete(doc._id, doc.originalName)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
