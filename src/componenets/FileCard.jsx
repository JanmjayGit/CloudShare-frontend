import React, { useState, useEffect } from 'react';
import { Image, Music, Video , FileText, FileIcon, FileSpreadsheet, Globe, Lock, Copy, Eye, Trash, Download} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import { getAuthRequestConfig } from '../util/auth';

const FileCard = ({file, onDelete, onTogglePublic, onDownload, onShareableLink}) => {
    const [showActions, setShowActions] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const { getToken } = useAuth();

    const getFileExtension = (fileName) => {
        return fileName.split('.').pop().toLowerCase();
    }

    const getFileIcon = (file) => {
        const fileExtension = getFileExtension(file.name);
        if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)){
            return <Image size={40} className="text-purple-400"/>
        }
        if(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)){
            return <Video size={40} className="text-blue-400"/>
        }
        if(['mp3', 'wav', 'aac', 'flac','m4a','ogg'].includes(fileExtension)){
            return <Music size={40} className="text-pink-400"/>
        }
        if(['pdf', 'doc', 'docx','txt','rft'].includes(fileExtension)){
            return <FileText size={40} className="text-amber-400"/>
        }
        if(['xls', 'xlsx', 'csv'].includes(fileExtension)){
            return <FileSpreadsheet size={40} className="text-green-400"/>
        }
        return <FileIcon size={40} className="text-purple-400"/>
    }

    const isImage = (fileName) => {
        const ext = getFileExtension(fileName);
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
    }

    const isVideo = (fileName) => {
        const ext = getFileExtension(fileName);
        return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext);
    }

    const isPDF = (fileName) => {
        const ext = getFileExtension(fileName);
        return ext === 'pdf';
    }

    const isDocument = (fileName) => {
        const ext = getFileExtension(fileName);
        return ['doc', 'docx', 'txt', 'rtf'].includes(ext);
    }

    const isSpreadsheet = (fileName) => {
        const ext = getFileExtension(fileName);
        return ['xls', 'xlsx', 'csv'].includes(ext);
    }

    const isAudio = (fileName) => {
        const ext = getFileExtension(fileName);
        return ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(ext);
    }

    const handleDoubleClick = () => {
        if (file.isPublic) {
            window.open(`/file/${file.id}`, '_blank');
        } else {
            // For private files, download them
            onDownload(file);
        }
    }

    const formatFileSize = (bytes) => {
        if(bytes < 1024) return `${bytes} B`;
        else if(bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        else return `${(bytes / 1048576).toFixed(1)} MB`;
    }
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Load preview for images and videos
    useEffect(() => {
        const loadPreview = async () => {
            if (!isImage(file.name) && !isVideo(file.name)) return;
            
            setLoadingPreview(true);
            try {
                const response = await axios.get(
                    apiEndpoints.DOWNLOAD_FILE(file.id),
                    {
                        ...(await getAuthRequestConfig(getToken)),
                        responseType: 'blob'
                    }
                );
                
                const url = URL.createObjectURL(response.data);
                setPreviewUrl(url);
            } catch (error) {
                console.error('Error loading preview:', error);
            } finally {
                setLoadingPreview(false);
            }
        };

        loadPreview();

        // Cleanup blob URL on unmount
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file.id, file.name]);

    const renderPreview = () => {
        if (loadingPreview && (isImage(file.name) || isVideo(file.name))) {
            return (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400'></div>
                </div>
            );
        }

        if (previewUrl && isImage(file.name)) {
            return (
                <img 
                    src={previewUrl} 
                    alt={file.name}
                    className='w-full h-full object-cover'
                />
            );
        }
        
        if (previewUrl && isVideo(file.name)) {
            return (
                <video 
                    src={previewUrl}
                    className='w-full h-full object-cover'
                    muted
                />
            );
        }

        // Enhanced preview for different file types
        if (isPDF(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <FileText size={48} className='text-amber-400' />
                    <span className='text-xs font-medium' style={{color:'var(--text-secondary)'}}>PDF</span>
                </div>
            );
        }

        if (isDocument(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <FileText size={48} className='text-blue-400' />
                    <span className='text-xs font-medium' style={{color:'var(--text-secondary)'}}>DOC</span>
                </div>
            );
        }

        if (isSpreadsheet(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <FileSpreadsheet size={48} className='text-green-400' />
                    <span className='text-xs font-medium' style={{color:'var(--text-secondary)'}}>EXCEL</span>
                </div>
            );
        }

        if (isAudio(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <Music size={48} className='text-pink-400' />
                    <span className='text-xs font-medium' style={{color:'var(--text-secondary)'}}>AUDIO</span>
                </div>
            );
        }
        
        return (
            <div className='flex items-center justify-center w-full h-full'>
                {getFileIcon(file)}
            </div>
        );
    }

  return (
    <div 
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onDoubleClick={handleDoubleClick}
        className='relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300'
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(139,92,246,0.15)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)'}
    >
        {/* File preview Section */}
        <div className='h-32 dark-file-preview flex items-center justify-center relative overflow-hidden'>
            {renderPreview()}
        </div>
        {/* File public/private Section */}
        <div className='absolute top-2 right-2 z-10'>
            <div className={`rounded-full p-1.5 backdrop-blur-sm ${file.isPublic ? '' : ''}`}
                 style={{background: file.isPublic ? 'rgba(34,197,94,0.2)' : 'rgba(15,23,42,0.7)'}}
                 title={file.isPublic ? "Public" : "Private" } >
                {file.isPublic ? (
                    <Globe size={14} className='text-green-400'/>
                ) : (
                    <Lock size={14} style={{color:'var(--text-secondary)'}}/>
                )}
            </div>
        </div>
        {/* File details Section */}
        <div className='p-4'>
            <div className='flex justify-between items-start'>
                <div className='overflow-hidden w-full'>
                    <h3 title={file.name} className='font-medium truncate text-sm' style={{color:'var(--text-primary)'}}>
                        {file.name}
                    </h3>
                    <p className='text-xs mt-1' style={{color:'var(--text-secondary)'}}>
                        {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                    </p>
                </div>
            </div>
        </div>
        {/* File actions Section */}
        <div className={`absolute inset-0 flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'} z-20`}
             style={{background:'linear-gradient(to top, rgba(0,0,0,0.85), transparent)'}}>
            <div className='flex gap-2 w-full justify-center'>
                {file.isPublic && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShareableLink(file.id);
                        }}
                        title='Share Link' 
                        className='p-2 rounded-full transition-colors cursor-pointer'
                        style={{background:'rgba(255,255,255,0.15)', color:'var(--accent-400)'}}
                        onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                    >
                        <Copy size={16}/>
                    </button>
                )}

                {file.isPublic && (
                    <a 
                        href={`/file/${file.id}`} 
                        title="view file" 
                        target='_blank' 
                        rel='noreferrer' 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center p-2 rounded-full cursor-pointer transition-colors text-blue-400"
                        style={{background:'rgba(255,255,255,0.15)'}}
                        onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                    >
                        <Eye size={16}/>
                    </a>
                )}
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file);
                    }}
                    title='Download' 
                    className='p-2 rounded-full cursor-pointer transition-colors text-green-400'
                    style={{background:'rgba(255,255,255,0.15)'}}
                    onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                    onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                >
                    <Download size={16} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePublic(file);
                    }}
                    title={file.isPublic ? 'make private' : 'make public'} 
                    className='p-2 rounded-full cursor-pointer transition-colors text-amber-400'
                    style={{background:'rgba(255,255,255,0.15)'}}
                    onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                    onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                >
                    {file.isPublic ? <Lock size={16}/> : <Globe size={16}/>}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                    }}
                    title='Delete' 
                    className='p-2 rounded-full transition-colors cursor-pointer text-red-400'
                    style={{background:'rgba(255,255,255,0.15)'}}
                    onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                    onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                >
                    <Trash size={16}/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default FileCard
