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
    <div className='dark-card p-6'>
      {/* Header */}
      <div className='mb-4'>
        <h2 className='text-xl font-bold mb-1' style={{color:'var(--text-primary)'}}>Quick Upload</h2>
        <p className='text-sm' style={{color:'var(--text-secondary)'}}>
          {remainingUploads} slot{remainingUploads !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          uploading ? 'dark-drop-zone-disabled cursor-not-allowed' : 'dark-drop-zone cursor-pointer'
        }`}
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
          className={`mx-auto mb-3 ${uploading ? '' : 'text-violet-400'}`}
          style={uploading ? {color:'var(--text-muted)'} : {}}
        />
        
        <h3 className='text-base font-semibold mb-1' style={{color:'var(--text-primary)'}}>
          {uploading ? 'Uploading...' : 'Drop files here'}
        </h3>
        
        <p className='text-xs' style={{color:'var(--text-muted)'}}>
          or click to browse
        </p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-semibold mb-2' style={{color:'var(--text-primary)'}}>
            Selected ({files.length})
          </h3>
          
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {files.map((file, index) => (
              <div
                key={index}
                className='dark-file-row flex items-center justify-between p-2'
              >
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <File size={16} className='text-violet-400 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs font-medium truncate' style={{color:'var(--text-primary)'}}>
                      {file.name}
                    </p>
                    <p className='text-xs' style={{color:'var(--text-muted)'}}>
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
                    className='ml-2 p-1 rounded transition-colors'
                    style={{color:'var(--red-text)'}}
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
        className='btn-primary w-full mt-4 px-4 py-3 flex items-center justify-center gap-2'
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