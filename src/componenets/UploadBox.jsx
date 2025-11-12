import React, { useRef } from 'react'
import { Upload, X, File, Loader2, CloudUpload } from 'lucide-react'

const UploadBox = ({
  files,
  onFileChange,
  onUpload,
  uploading,
  onRemoveFile,
  remainingCredits,
  isUploadDisabled
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
      // Create a synthetic event object to pass to onFileChange
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
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Upload Files</h2>
        <p className='text-gray-600'>
          Upload your files to the cloud. You have <span className='font-semibold text-purple-600'>{remainingCredits} credits</span> remaining.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
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
          size={48} 
          className={`mx-auto mb-4 ${uploading ? 'text-gray-400' : 'text-purple-500'}`}
        />
        
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {uploading ? 'Uploading...' : 'Drag & Drop files here'}
        </h3>
        
        <p className='text-sm text-gray-500 mb-4'>
          or click to browse from your computer
        </p>
        
        <p className='text-xs text-gray-400'>
          Maximum 5 files at once • Each file uses 1 credit
        </p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Selected Files ({files.length})
          </h3>
          
          <div className='space-y-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <File size={20} className='text-purple-500 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {!uploading && (
                  <button
                    onClick={() => onRemoveFile(index)}
                    className='ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors'
                    title='Remove file'
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          {files.length > 0 && (
            <span>
              {files.length} file{files.length !== 1 ? 's' : ''} selected • 
              Will use {files.length} credit{files.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <button
          onClick={onUpload}
          disabled={isUploadDisabled || uploading}
          className={`
            px-6 py-3 rounded-lg font-semibold flex items-center gap-2
            transition-all duration-200
            ${isUploadDisabled || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className='animate-spin' />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Files
            </>
          )}
        </button>
      </div>

      {/* Warning Messages */}
      {files.length > 5 && (
        <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
          You can only upload maximum 5 files at once. Please remove some files.
        </div>
      )}
      
      {files.length > remainingCredits && remainingCredits > 0 && (
        <div className='mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm'>
          You don't have enough credits. You selected {files.length} files but have only {remainingCredits} credits remaining.
        </div>
      )}
      
      {remainingCredits <= 0 && (
        <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
          You have no credits remaining. Please upgrade your plan to upload more files.
        </div>
      )}
    </div>
  );
};

export default UploadBox;