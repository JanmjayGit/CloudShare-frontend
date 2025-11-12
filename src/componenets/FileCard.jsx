// import React from 'react'
// import { useState } from 'react';
// import { Image, Music, Video , FileText, FileIcon, FileSpreadsheet, Globe, Lock, Copy, Eye, Trash, Download} from 'lucide-react';


// const FileCard = ({file, onDelete, onTogglePublic, onDownload, onShareableLink}) => {
//     const[showActions, setShowActions] = useState(false);

//     const getFileIcon = (file) => {
//         const fileExtension = file.name.split('.').pop().toLowerCase();
//         if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)){
//             return <Image size={24} className="text-purple-500"/>
//         }
//         if(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)){
//             return <Video size={24} className="text-blue-500"/>
//         }
//         if(['mp3', 'wav', 'aac', 'flac','m4a','ogg'].includes(fileExtension)){
//             return <Music size={24} className="text-pink-500"/>
//         }
//         if(['pdf', 'doc', 'docx','txt','rft'].includes(fileExtension)){
//             return <FileText size={24} className="text-amber-500"/>
//         }
//         if(['xls', 'xlsx', 'csv'].includes(fileExtension)){
//             return <FileSpreadsheet size={24} className="text-green-700"/>
//         }
//         return <FileIcon size={24} className="text-purple-500"/>
//     }

//     const formatFileSize = (bytes) => {
//         if(bytes < 1024) return `${bytes} B`;
//         else if(bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//         else return `${(bytes / 1048576).toFixed(1)} MB`;
//     }
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
//     }
//   return (
//     <div 
//         onMouseEnter={() => setShowActions(true)}
//         onMouseLeave={() => setShowActions(false)}
//         className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100'>
//         {/* File preview Section */}
//         <div className='h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4'>
//             {getFileIcon(file)}
//         </div>
//         {/* File public/private Section */}
//         <div className='absolute top-2 right-2'>
//             <div className={`rounded-full p-1.5 ${file.isPublic ? 'bg-green-100' : 'bg-gray-100'}`}title={file.isPublic ? "Public" : "Private" } >
//                 {file.isPublic ? (
//                     <Globe size={14} className='text-green-600'/>
//                 ) : (
//                     <Lock size={14} className='text-gray-600'/>
//                 )}
//             </div>
//         </div>
//         {/* File details Section */}
//         <div className='p-4'>
//             <div className='flex justify-between items-start'>
//                 <div className='overflow-hidden'>
//                     <h3 title={file.name} className='font-medium text-gray-900 truncate'>
//                         {file.name}
//                     </h3>
//                     <p className='text-xs text-gray-500 mt-1'>
//                         {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
//                     </p>
//                 </div>
//             </div>
//         </div>
//         {/* File actions Section */}
//         <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
//             <div className='flex gap-3 w-full justify-center'>
//                 {file.isPublic && (
//                     <button
//                         onClick={() => onShareableLink(file.id)}
//                         title='Share Link' 
//                         className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600 cursor-pointer'>
//                         <Copy size={18}/>
//                     </button>
//                 )}

//                 {file.isPublic && (
//                     <a href={`/file/${file.id}`} title="view file" target='_blank' rel='noreferrer' className="flex items-center justify-center p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-blue-500 hover:text-blue-600">
//                         <Eye size={18}/>
//                     </a>
//                 )}
                
//                 <button
//                     onClick={() => onDownload(file)}
//                     title='Download' 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-500 hover:text-green-600'>
//                     <Download size={18} />
//                 </button>

//                 <button
//                     onClick={() => onTogglePublic(file)}
//                     title={file.isPublic ? 'make private' : 'make public'} 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-500 hover:text-amber-700'>
//                     {file.isPublic ? <Lock size={18}/> : <Globe size={18}/>}
//                 </button>

//                 <button
//                     onClick={() => onDelete(file.id)}
//                     title='Delete' 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-500 hover:text-red-600 cursor-pointer'>
//                     <Trash size={18}/>
//                 </button>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default FileCard


// import React, { useState, useEffect } from 'react';
// import { Image, Music, Video , FileText, FileIcon, FileSpreadsheet, Globe, Lock, Copy, Eye, Trash, Download} from 'lucide-react';
// import { useAuth } from '@clerk/clerk-react';
// import axios from 'axios';

// const FileCard = ({file, onDelete, onTogglePublic, onDownload, onShareableLink}) => {
//     const [showActions, setShowActions] = useState(false);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [loadingPreview, setLoadingPreview] = useState(false);
//     const { getToken } = useAuth();

//     const getFileExtension = (fileName) => {
//         return fileName.split('.').pop().toLowerCase();
//     }

//     const getFileIcon = (file) => {
//         const fileExtension = getFileExtension(file.name);
//         if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)){
//             return <Image size={40} className="text-purple-500"/>
//         }
//         if(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)){
//             return <Video size={40} className="text-blue-500"/>
//         }
//         if(['mp3', 'wav', 'aac', 'flac','m4a','ogg'].includes(fileExtension)){
//             return <Music size={40} className="text-pink-500"/>
//         }
//         if(['pdf', 'doc', 'docx','txt','rft'].includes(fileExtension)){
//             return <FileText size={40} className="text-amber-500"/>
//         }
//         if(['xls', 'xlsx', 'csv'].includes(fileExtension)){
//             return <FileSpreadsheet size={40} className="text-green-700"/>
//         }
//         return <FileIcon size={40} className="text-purple-500"/>
//     }

//     const isImage = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
//     }

//     const isVideo = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext);
//     }
//     const isPDF = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ext === 'pdf';
//     }

//     const isDocument = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ['doc', 'docx', 'txt', 'rtf'].includes(ext);
//     }
//     const isAudio = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(ext);
//     }

//     const isSpreadsheet = (fileName) => {
//         const ext = getFileExtension(fileName);
//         return ['xls', 'xlsx', 'csv'].includes(ext);
//     }

//     const handleDoubleClick = () => {
//         if (file.isPublic) {
//             window.open(`/file/${file.id}`, '_blank');
//         } else if (isImage(file.name) || isVideo(file.name)) {
//             onDownload(file);
//         }
//     }

//     const formatFileSize = (bytes) => {
//         if(bytes < 1024) return `${bytes} B`;
//         else if(bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//         else return `${(bytes / 1048576).toFixed(1)} MB`;
//     }
    
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
//     }

//     // Load preview for images and videos
//     useEffect(() => {
//         const loadPreview = async () => {
//             if (!isImage(file.name) && !isVideo(file.name)) return;
            
//             setLoadingPreview(true);
//             try {
//                 const token = await getToken();
//                 const response = await axios.get(
//                     `http://localhost:8080/api/v1.0/files/download/${file.id}`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                         responseType: 'blob'
//                     }
//                 );
                
//                 const url = URL.createObjectURL(response.data);
//                 setPreviewUrl(url);
//             } catch (error) {
//                 console.error('Error loading preview:', error);
//             } finally {
//                 setLoadingPreview(false);
//             }
//         };

//         loadPreview();

//         // Cleanup blob URL on unmount
//         return () => {
//             if (previewUrl) {
//                 URL.revokeObjectURL(previewUrl);
//             }
//         };
//     }, [file.id, file.name]);

//     const renderPreview = () => {
//         if (loadingPreview) {
//             return (
//                 <div className='flex items-center justify-center w-full h-full'>
//                     <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
//                 </div>
//             );
//         }

//         if (previewUrl && isImage(file.name)) {
//             return (
//                 <img 
//                     src={previewUrl} 
//                     alt={file.name}
//                     className='w-full h-full object-cover'
//                 />
//             );
//         }
        
//         if (previewUrl && isVideo(file.name)) {
//             return (
//                 <video 
//                     src={previewUrl}
//                     className='w-full h-full object-cover'
//                     muted
//                 />
//             );
//         }
        
//         return (
//             <div className='flex items-center justify-center w-full h-full'>
//                 {getFileIcon(file)}
//             </div>
//         );
//     }

//   return (
//     <div 
//         onMouseEnter={() => setShowActions(true)}
//         onMouseLeave={() => setShowActions(false)}
//         onDoubleClick={handleDoubleClick}
//         className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer'>
//         {/* File preview Section */}
//         <div className='h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden'>
//             {renderPreview()}
//         </div>
//         {/* File public/private Section */}
//         <div className='absolute top-2 right-2 z-10'>
//             <div className={`rounded-full p-1.5 backdrop-blur-sm ${file.isPublic ? 'bg-green-100/90' : 'bg-gray-100/90'}`} title={file.isPublic ? "Public" : "Private" } >
//                 {file.isPublic ? (
//                     <Globe size={14} className='text-green-600'/>
//                 ) : (
//                     <Lock size={14} className='text-gray-600'/>
//                 )}
//             </div>
//         </div>
//         {/* File details Section */}
//         <div className='p-4'>
//             <div className='flex justify-between items-start'>
//                 <div className='overflow-hidden w-full'>
//                     <h3 title={file.name} className='font-medium text-gray-900 truncate text-sm'>
//                         {file.name}
//                     </h3>
//                     <p className='text-xs text-gray-500 mt-1'>
//                         {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
//                     </p>
//                 </div>
//             </div>
//         </div>
//         {/* File actions Section */}
//         <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'} z-20`}>
//             <div className='flex gap-2 w-full justify-center'>
//                 {file.isPublic && (
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onShareableLink(file.id);
//                         }}
//                         title='Share Link' 
//                         className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600 cursor-pointer'>
//                         <Copy size={16}/>
//                     </button>
//                 )}

//                 {file.isPublic && (
//                     <a 
//                         href={`/file/${file.id}`} 
//                         title="view file" 
//                         target='_blank' 
//                         rel='noreferrer' 
//                         onClick={(e) => e.stopPropagation()}
//                         className="flex items-center justify-center p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-blue-500 hover:text-blue-600">
//                         <Eye size={16}/>
//                     </a>
//                 )}
                
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onDownload(file);
//                     }}
//                     title='Download' 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-500 hover:text-green-600'>
//                     <Download size={16} />
//                 </button>

//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onTogglePublic(file);
//                     }}
//                     title={file.isPublic ? 'make private' : 'make public'} 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-500 hover:text-amber-700'>
//                     {file.isPublic ? <Lock size={16}/> : <Globe size={16}/>}
//                 </button>

//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete(file.id);
//                     }}
//                     title='Delete' 
//                     className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-500 hover:text-red-600 cursor-pointer'>
//                     <Trash size={16}/>
//                 </button>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default FileCard


import React, { useState, useEffect } from 'react';
import { Image, Music, Video , FileText, FileIcon, FileSpreadsheet, Globe, Lock, Copy, Eye, Trash, Download} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';

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
            return <Image size={40} className="text-purple-500"/>
        }
        if(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)){
            return <Video size={40} className="text-blue-500"/>
        }
        if(['mp3', 'wav', 'aac', 'flac','m4a','ogg'].includes(fileExtension)){
            return <Music size={40} className="text-pink-500"/>
        }
        if(['pdf', 'doc', 'docx','txt','rft'].includes(fileExtension)){
            return <FileText size={40} className="text-amber-500"/>
        }
        if(['xls', 'xlsx', 'csv'].includes(fileExtension)){
            return <FileSpreadsheet size={40} className="text-green-700"/>
        }
        return <FileIcon size={40} className="text-purple-500"/>
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
                const token = await getToken();
                const response = await axios.get(
                    apiEndpoints.DOWNLOAD_FILE(file.id),
                    {
                        headers: { Authorization: `Bearer ${token}` },
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
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
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
                    <FileText size={48} className='text-amber-500' />
                    <span className='text-xs font-medium text-gray-600'>PDF</span>
                </div>
            );
        }

        if (isDocument(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <FileText size={48} className='text-blue-500' />
                    <span className='text-xs font-medium text-gray-600'>DOC</span>
                </div>
            );
        }

        if (isSpreadsheet(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <FileSpreadsheet size={48} className='text-green-600' />
                    <span className='text-xs font-medium text-gray-600'>EXCEL</span>
                </div>
            );
        }

        if (isAudio(file.name)) {
            return (
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <Music size={48} className='text-pink-500' />
                    <span className='text-xs font-medium text-gray-600'>AUDIO</span>
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
        className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer'>
        {/* File preview Section */}
        <div className='h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden'>
            {renderPreview()}
        </div>
        {/* File public/private Section */}
        <div className='absolute top-2 right-2 z-10'>
            <div className={`rounded-full p-1.5 backdrop-blur-sm ${file.isPublic ? 'bg-green-100/90' : 'bg-gray-100/90'}`} title={file.isPublic ? "Public" : "Private" } >
                {file.isPublic ? (
                    <Globe size={14} className='text-green-600'/>
                ) : (
                    <Lock size={14} className='text-gray-600'/>
                )}
            </div>
        </div>
        {/* File details Section */}
        <div className='p-4'>
            <div className='flex justify-between items-start'>
                <div className='overflow-hidden w-full'>
                    <h3 title={file.name} className='font-medium text-gray-900 truncate text-sm'>
                        {file.name}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1'>
                        {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                    </p>
                </div>
            </div>
        </div>
        {/* File actions Section */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'} z-20`}>
            <div className='flex gap-2 w-full justify-center'>
                {file.isPublic && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShareableLink(file.id);
                        }}
                        title='Share Link' 
                        className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600 cursor-pointer'>
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
                        className="flex items-center justify-center p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-blue-500 hover:text-blue-600">
                        <Eye size={16}/>
                    </a>
                )}
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file);
                    }}
                    title='Download' 
                    className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-500 hover:text-green-600'>
                    <Download size={16} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePublic(file);
                    }}
                    title={file.isPublic ? 'make private' : 'make public'} 
                    className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-500 hover:text-amber-700'>
                    {file.isPublic ? <Lock size={16}/> : <Globe size={16}/>}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                    }}
                    title='Delete' 
                    className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-500 hover:text-red-600 cursor-pointer'>
                    <Trash size={16}/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default FileCard