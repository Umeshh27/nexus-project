import FileUploader from '../features/documents/components/FileUploader';
import DocumentTable from '../features/documents/components/DocumentTable';

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-400 mt-1">Upload and manage your organization's knowledge base files.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
        <FileUploader />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Documents</h2>
        <DocumentTable />
      </div>
    </div>
  );
}
