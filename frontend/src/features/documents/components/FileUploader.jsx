import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadDocumentMutation } from '../documentApi';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [permissionLevel, setPermissionLevel] = useState('member');
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

  const onDrop = useCallback((acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED_TYPES, maxSize: 10 * 1024 * 1024,
    onDropRejected: (rejections) => rejections.forEach((r) => r.errors.forEach((e) => toast.error(e.message))),
  });

  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (files.length === 0) return toast.error('No files selected');
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('permissionLevel', permissionLevel);
      try { await uploadDocument(formData).unwrap(); toast.success(`${file.name} uploaded`); }
      catch { toast.error(`Failed to upload ${file.name}`); }
    }
    setFiles([]);
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-navy-500 bg-navy-50' : 'border-gray-200 hover:border-navy-400 hover:bg-gray-50'}`}>
        <input {...getInputProps()} />
        <Upload size={36} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">{isDragActive ? 'Drop files here...' : 'Drag & drop files, or click to browse'}</p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT — Max 10MB per file</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
              <FileText size={16} className="text-navy-500" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
              <button onClick={() => removeFile(i)} className="p-1 hover:bg-gray-200 rounded transition-colors"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Access Level</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" value={permissionLevel} onChange={(e) => setPermissionLevel(e.target.value)}>
              <option value="admin">Admin Only</option>
              <option value="member">Members & Admins</option>
              <option value="guest">Everyone (incl. Guests)</option>
            </select>
          </div>
          <button onClick={handleUpload} className="flex items-center gap-2 bg-navy-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-600 transition-colors disabled:opacity-50 mt-5" disabled={isLoading}>
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Upload size={14} />}
            Upload {files.length} file{files.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
