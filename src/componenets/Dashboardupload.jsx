import React, { useRef } from 'react'
import { Upload, X, File, Loader2, CloudUpload } from 'lucide-react'

const Dashboardupload = ({
  files,
  onFileChange,
  onUpload,
  uploading,
  onRemoveFile,
  remainingUploads
}) => {
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploading) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const syntheticEvent = {
        target: {
          files: droppedFiles
        }
      };
      onFileChange(syntheticEvent);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      {/* Header */}
      <div className='mb-4'>
        <h2 className='text-xl font-bold text-gray-900 mb-1'>Quick Upload</h2>
        <p className='text-sm text-gray-600'>
          {remainingUploads} slot{remainingUploads !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${uploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
            : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileChange}
          disabled={uploading}
          className='hidden'
        />
        
        <CloudUpload 
          size={40} 
          className={`mx-auto mb-3 ${uploading ? 'text-gray-400' : 'text-purple-500'}`}
        />
        
        <h3 className='text-base font-semibold text-gray-900 mb-1'>
          {uploading ? 'Uploading...' : 'Drop files here'}
        </h3>
        
        <p className='text-xs text-gray-500'>
          or click to browse
        </p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-semibold text-gray-900 mb-2'>
            Selected ({files.length})
          </h3>
          
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200'
              >
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <File size={16} className='text-purple-500 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs font-medium text-gray-900 truncate'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {!uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className='ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors'
                    title='Remove file'
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={files.length === 0 || uploading}
        className={`
          w-full mt-4 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2
          transition-all duration-200
          ${files.length === 0 || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className='animate-spin' />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Files
          </>
        )}
      </button>
    </div>
  );
};

export default Dashboardupload;