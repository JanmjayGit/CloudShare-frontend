import React from 'react'
import { File, Image, Video, Music, FileText, FileSpreadsheet, Globe, Lock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const RecentFiles = ({ files }) => {
  
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return <Image size={20} className="text-purple-500" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
      return <Video size={20} className="text-blue-500" />;
    }
    if (['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(extension)) {
      return <Music size={20} className="text-pink-500" />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <FileText size={20} className="text-amber-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <FileSpreadsheet size={20} className="text-green-700" />;
    }
    return <File size={20} className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>Recent Files</h2>
          <p className='text-sm text-gray-600'>Your latest uploads</p>
        </div>
        <Link 
          to="/my-files" 
          className='text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1'
        >
          View All
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <div className='text-center py-12'>
          <File size={48} className='mx-auto text-gray-300 mb-3' />
          <p className='text-gray-500 text-sm'>No files uploaded yet</p>
          <p className='text-gray-400 text-xs mt-1'>Upload your first file to get started</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {files.map((file, index) => (
            <div
              key={file.id || index}
              className='flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group'
            >
              {/* File Info */}
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <div className='flex-shrink-0'>
                  {getFileIcon(file.name)}
                </div>
                
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate' title={file.name}>
                    {file.name}
                  </p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <span className='text-xs text-gray-500'>
                      {formatFileSize(file.size)}
                    </span>
                    <span className='text-xs text-gray-400'>•</span>
                    <span className='text-xs text-gray-500'>
                      {formatDate(file.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className='flex items-center gap-2 ml-2'>
                <div 
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    file.isPublic 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  title={file.isPublic ? 'Public' : 'Private'}
                >
                  {file.isPublic ? (
                    <>
                      <Globe size={12} />
                      <span className='hidden sm:inline'>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      <span className='hidden sm:inline'>Private</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {files.length > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <Link
            to="/my-files"
            className='w-full block text-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm'
          >
            View All Files
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentFiles;