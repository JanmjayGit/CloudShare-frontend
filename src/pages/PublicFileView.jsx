// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '@clerk/clerk-react';
// import axios from 'axios';
// import { Copy, Download, File, ImageIcon, Info, Share2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import apiEndpoints from '../util/apiEndpoints';
// import { getAuthRequestConfig } from '../util/auth';
// import LinkShareModal from '../componenets/LinkShareModal';

// const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif'];

// const PublicFileView = () => {
//   const [files, setFiles] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [shareModal, setShareModal] = useState({
//     isOpen: false,
//     link: '',
//   });

//   const { getToken, isSignedIn } = useAuth();
//   const { fileId } = useParams();

//   const getFileExtension = (fileName = '') => fileName.split('.').pop()?.toLowerCase() || '';

//   const isImageFile = (file) => {
//     const mimeType = file?.type?.toLowerCase() || '';
//     const extension = getFileExtension(file?.name);
//     return mimeType.startsWith('image/') || IMAGE_EXTENSIONS.includes(extension);
//   };

//   const formatFileSize = (bytes = 0) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
//     return `${(bytes / 1048576).toFixed(2)} MB`;
//   };

//   const formattedSharedDate = files?.uploadedAt
//     ? new Date(files.uploadedAt).toLocaleDateString()
//     : '';

//   const getDownloadRequestConfig = async () => {
//     const baseConfig = { responseType: 'blob' };

//     if (!isSignedIn) {
//       return baseConfig;
//     }

//     try {
//       return await getAuthRequestConfig(getToken, baseConfig);
//     } catch (authError) {
//       console.log('Could not attach auth token for file request:', authError);
//       return baseConfig;
//     }
//   };

//   useEffect(() => {
//     const getFile = async () => {
//       setLoading(true);
//       try {
//         await getToken();
//         const response = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
//         setFiles(response.data);
//         setError(null);
//       } catch (fetchError) {
//         console.log('Error fetching file:', fetchError);
//         setError('Could not fetch the file. Please try again later.');
//         setFiles(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getFile();
//   }, [fileId, getToken]);

//   useEffect(() => {
//     if (!files || !isImageFile(files)) {
//       setPreviewUrl('');
//       return undefined;
//     }

//     let objectUrl = '';

//     const loadPreview = async () => {
//       setPreviewLoading(true);
//       try {
//         const response = await axios.get(
//           apiEndpoints.DOWNLOAD_FILE(fileId),
//           await getDownloadRequestConfig()
//         );

//         objectUrl = window.URL.createObjectURL(response.data);
//         setPreviewUrl(objectUrl);
//       } catch (previewError) {
//         console.log('Error loading preview:', previewError);
//         setPreviewUrl('');
//       } finally {
//         setPreviewLoading(false);
//       }
//     };

//     loadPreview();

//     return () => {
//       if (objectUrl) {
//         window.URL.revokeObjectURL(objectUrl);
//       }
//     };
//   }, [fileId, files]);

//   const handleDownload = async () => {
//     try {
//       const response = await axios.get(
//         apiEndpoints.DOWNLOAD_FILE(fileId),
//         await getDownloadRequestConfig()
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', files.name);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (downloadError) {
//       console.log('Error downloading file:', downloadError);
//       toast.error('Could not download the file. Please try again later.');
//     }
//   };

//   const openSharemodal = () => {
//     setShareModal({
//       isOpen: true,
//       link: window.location.href,
//     });
//   };

//   const closeShareModal = () => {
//     setShareModal({
//       isOpen: false,
//       link: '',
//     });
//   };

//   if (loading) {
//     return (
//       <div
//         className="flex min-h-screen items-center justify-center px-6"
//         style={{ background: 'radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 35%), var(--bg-base)' }}
//       >
//         <div className="dark-card w-full max-w-md p-8 text-center">
//           <p style={{ color: 'var(--text-secondary)' }}>Loading file...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="flex min-h-screen items-center justify-center px-6"
//         style={{ background: 'radial-gradient(circle at top, rgba(239,68,68,0.14), transparent 35%), var(--bg-base)' }}
//       >
//         <div className="dark-card w-full max-w-md p-8 text-center">
//           <h2 className="text-xl font-semibold text-red-400">Error</h2>
//           <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
//             {error}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!files) {
//     return null;
//   }

//   return (
//     <div
//       className="min-h-screen"
//       style={{
//         background:
//           'radial-gradient(circle at top left, rgba(37,99,235,0.2), transparent 25%), radial-gradient(circle at top right, rgba(14,165,233,0.12), transparent 20%), var(--bg-base)',
//       }}
//     >
//       <header
//         className="sticky top-0 z-10 border-b px-4 py-4 backdrop-blur"
//         style={{
//           background: 'rgba(15, 23, 42, 0.88)',
//           borderColor: 'var(--border-default)',
//         }}
//       >
//         <div className="container mx-auto flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div
//               className="flex h-11 w-11 items-center justify-center rounded-2xl"
//               style={{ background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(96,165,250,0.2)' }}
//             >
//               <Share2 className="text-blue-400" />
//             </div>
//             <div>
//               <span className="block text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
//                 CloudShare
//               </span>
//               <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                 Public file preview
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={openSharemodal}
//             className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition"
//             style={{
//               background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//               color: '#fff',
//               boxShadow: '0 10px 30px rgba(37,99,235,0.22)',
//             }}
//           >
//             <Copy size={16} />
//             Share Link
//           </button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
//         <div className="mx-auto max-w-5xl">
//           <div
//             className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
//           >
//             <section
//               className="overflow-hidden rounded-3xl border"
//               style={{
//                 background: 'linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))',
//                 borderColor: 'var(--border-default)',
//                 boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)',
//               }}
//             >
//               <div
//                 className="flex min-h-[340px] items-center justify-center p-4 md:min-h-[520px] md:p-6"
//                 style={{ background: 'linear-gradient(180deg, rgba(148,163,184,0.05), rgba(15,23,42,0.1))' }}
//               >
//                 {isImageFile(files) ? (
//                   previewLoading ? (
//                     <div className="flex flex-col items-center gap-4">
//                       <div
//                         className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-400"
//                         style={{ borderRightColor: 'rgba(96,165,250,0.25)' }}
//                       />
//                       <p style={{ color: 'var(--text-secondary)' }}>Loading image preview...</p>
//                     </div>
//                   ) : previewUrl ? (
//                     <img
//                       src={previewUrl}
//                       alt={files.name}
//                       className="max-h-[70vh] w-full rounded-2xl object-contain"
//                     />
//                   ) : (
//                     <div className="flex flex-col items-center gap-4 text-center">
//                       <div
//                         className="flex h-20 w-20 items-center justify-center rounded-full"
//                         style={{ background: 'rgba(59,130,246,0.16)' }}
//                       >
//                         <ImageIcon size={36} className="text-blue-400" />
//                       </div>
//                       <p style={{ color: 'var(--text-secondary)' }}>
//                         Preview is unavailable right now, but you can still download the image.
//                       </p>
//                     </div>
//                   )
//                 ) : (
//                   <div className="flex flex-col items-center gap-5 text-center">
//                     <div
//                       className="flex h-24 w-24 items-center justify-center rounded-full"
//                       style={{ background: 'rgba(59,130,246,0.16)' }}
//                     >
//                       <File size={44} className="text-blue-400" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
//                         {files.name}
//                       </h2>
//                       <p className="mt-2 max-w-md" style={{ color: 'var(--text-secondary)' }}>
//                         This file type does not support inline preview on this page yet. You can still share or download it.
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             <aside
//               className="rounded-3xl border p-6 md:p-8"
//               style={{
//                 background: 'linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))',
//                 borderColor: 'var(--border-default)',
//                 boxShadow: '0 24px 60px rgba(2, 6, 23, 0.4)',
//               }}
//             >
//               <div
//                 className="mb-5 inline-flex rounded-full px-3 py-1 text-sm font-medium"
//                 style={{
//                   background: 'rgba(59,130,246,0.12)',
//                   color: '#93c5fd',
//                   border: '1px solid rgba(96,165,250,0.18)',
//                 }}
//               >
//                 {files.type || 'File'}
//               </div>

//               <h1 className="break-words text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
//                 {files.name}
//               </h1>

//               <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
//                 {formatFileSize(files.size)}
//                 <span className="mx-2">&bull;</span>
//                 Shared on {formattedSharedDate}
//               </p>

//               <div className="mt-8 flex flex-col gap-3">
//                 <button
//                   onClick={handleDownload}
//                   className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold transition"
//                   style={{
//                     background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//                     color: '#fff',
//                     boxShadow: '0 18px 35px rgba(37,99,235,0.18)',
//                   }}
//                 >
//                   <Download size={18} />
//                   Download File
//                 </button>

//                 <button
//                   onClick={openSharemodal}
//                   className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold transition"
//                   style={{
//                     background: 'rgba(148,163,184,0.08)',
//                     color: 'var(--text-primary)',
//                     border: '1px solid var(--border-default)',
//                   }}
//                 >
//                   <Copy size={18} />
//                   Copy Share Link
//                 </button>
//               </div>

//               <div
//                 className="mt-8 rounded-2xl border p-5"
//                 style={{
//                   background: 'rgba(15,23,42,0.45)',
//                   borderColor: 'var(--border-default)',
//                 }}
//               >
//                 <h3 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
//                   File Details
//                 </h3>

//                 <div className="space-y-4 text-sm">
//                   <div className="flex items-start justify-between gap-4">
//                     <span style={{ color: 'var(--text-secondary)' }}>File Name</span>
//                     <span className="max-w-[55%] break-all text-right font-medium" style={{ color: 'var(--text-primary)' }}>
//                       {files.name}
//                     </span>
//                   </div>

//                   <div className="flex items-start justify-between gap-4">
//                     <span style={{ color: 'var(--text-secondary)' }}>File Type</span>
//                     <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
//                       {files.type || 'Unknown'}
//                     </span>
//                   </div>

//                   <div className="flex items-start justify-between gap-4">
//                     <span style={{ color: 'var(--text-secondary)' }}>File Size</span>
//                     <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
//                       {formatFileSize(files.size)}
//                     </span>
//                   </div>

//                   <div className="flex items-start justify-between gap-4">
//                     <span style={{ color: 'var(--text-secondary)' }}>Shared</span>
//                     <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
//                       {formattedSharedDate}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           <div
//             className="mt-6 flex items-center gap-3 rounded-2xl border p-4 shadow-sm"
//             style={{
//               background: 'rgba(37,99,235,0.08)',
//               borderColor: 'rgba(96,165,250,0.18)',
//               color: '#bfdbfe',
//             }}
//           >
//             <Info size={18} className="shrink-0" />
//             <p className="text-sm">
//               This file has been shared publicly. Anyone with the link can preview supported content and download the file.
//             </p>
//           </div>
//         </div>
//       </main>

//       <LinkShareModal
//         isOpen={shareModal.isOpen}
//         onClose={closeShareModal}
//         link={shareModal.link}
//         title="Share File"
//       />
//     </div>
//   );
// };

// export default PublicFileView;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Copy, Download, File, ImageIcon, Info, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiEndpoints from '../util/apiEndpoints';
import LinkShareModal from '../componenets/LinkShareModal';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif'];

const PublicFileView = () => {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    link: '',
  });

  const { fileId } = useParams();

  const getFileExtension = (fileName = '') => fileName.split('.').pop()?.toLowerCase() || '';

  const isImageFile = (file) => {
    const mimeType = file?.type?.toLowerCase() || '';
    const extension = getFileExtension(file?.name);
    return mimeType.startsWith('image/') || IMAGE_EXTENSIONS.includes(extension);
  };

  const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const formattedSharedDate = files?.uploadedAt
    ? new Date(files.uploadedAt).toLocaleDateString()
    : '';

  useEffect(() => {
    const getFile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
        setFiles(response.data);
        setError(null);
      } catch (fetchError) {
        console.log('Error fetching file:', fetchError);
        setError('Could not fetch the file. Please try again later.');
        setFiles(null);
      } finally {
        setLoading(false);
      }
    };

    getFile();
  }, [fileId]);

  useEffect(() => {
    if (!files || !isImageFile(files)) {
      setPreviewUrl('');
      return undefined;
    }

    let objectUrl = '';

    const loadPreview = async () => {
      setPreviewLoading(true);
      try {
        const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
          responseType: 'blob',
        });

        objectUrl = window.URL.createObjectURL(response.data);
        setPreviewUrl(objectUrl);
      } catch (previewError) {
        console.log('Error loading preview:', previewError);
        setPreviewUrl('');
      } finally {
        setPreviewLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId, files]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', files.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.log('Error downloading file:', downloadError);
      toast.error('Could not download the file. Please try again later.');
    }
  };

  const openSharemodal = () => {
    setShareModal({
      isOpen: true,
      link: window.location.href,
    });
  };

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      link: '',
    });
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: 'radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 35%), var(--bg-base)' }}
      >
        <div className="dark-card w-full max-w-md p-8 text-center">
          <p style={{ color: 'var(--text-secondary)' }}>Loading file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: 'radial-gradient(circle at top, rgba(239,68,68,0.14), transparent 35%), var(--bg-base)' }}
      >
        <div className="dark-card w-full max-w-md p-8 text-center">
          <h2 className="text-xl font-semibold text-red-400">Error</h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!files) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(37,99,235,0.2), transparent 25%), radial-gradient(circle at top right, rgba(14,165,233,0.12), transparent 20%), var(--bg-base)',
      }}
    >
      <header
        className="sticky top-0 z-10 border-b px-4 py-4 backdrop-blur"
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(96,165,250,0.2)' }}
            >
              <Share2 className="text-blue-400" />
            </div>
            <div>
              <span className="block text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                CloudShare
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Public file preview
              </span>
            </div>
          </div>

          <button
            onClick={openSharemodal}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(37,99,235,0.22)',
            }}
          >
            <Copy size={16} />
            Share Link
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section
              className="overflow-hidden rounded-3xl border"
              style={{
                background: 'linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))',
                borderColor: 'var(--border-default)',
                boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)',
              }}
            >
              <div
                className="flex min-h-[340px] items-center justify-center p-4 md:min-h-[520px] md:p-6"
                style={{ background: 'linear-gradient(180deg, rgba(148,163,184,0.05), rgba(15,23,42,0.1))' }}
              >
                {isImageFile(files) ? (
                  previewLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-400"
                        style={{ borderRightColor: 'rgba(96,165,250,0.25)' }}
                      />
                      <p style={{ color: 'var(--text-secondary)' }}>Loading image preview...</p>
                    </div>
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={files.name}
                      className="max-h-[70vh] w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-full"
                        style={{ background: 'rgba(59,130,246,0.16)' }}
                      >
                        <ImageIcon size={36} className="text-blue-400" />
                      </div>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Preview is unavailable right now, but you can still download the image.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-5 text-center">
                    <div
                      className="flex h-24 w-24 items-center justify-center rounded-full"
                      style={{ background: 'rgba(59,130,246,0.16)' }}
                    >
                      <File size={44} className="text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {files.name}
                      </h2>
                      <p className="mt-2 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                        This file type does not support inline preview on this page yet. You can still share or download it.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside
              className="rounded-3xl border p-6 md:p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))',
                borderColor: 'var(--border-default)',
                boxShadow: '0 24px 60px rgba(2, 6, 23, 0.4)',
              }}
            >
              <div
                className="mb-5 inline-flex rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  color: '#93c5fd',
                  border: '1px solid rgba(96,165,250,0.18)',
                }}
              >
                {files.type || 'File'}
              </div>

              <h1 className="break-words text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {files.name}
              </h1>

              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {formatFileSize(files.size)}
                <span className="mx-2">&bull;</span>
                Shared on {formattedSharedDate}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold transition"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    boxShadow: '0 18px 35px rgba(37,99,235,0.18)',
                  }}
                >
                  <Download size={18} />
                  Download File
                </button>

                <button
                  onClick={openSharemodal}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold transition"
                  style={{
                    background: 'rgba(148,163,184,0.08)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <Copy size={18} />
                  Copy Share Link
                </button>
              </div>

              <div
                className="mt-8 rounded-2xl border p-5"
                style={{
                  background: 'rgba(15,23,42,0.45)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  File Details
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span style={{ color: 'var(--text-secondary)' }}>File Name</span>
                    <span className="max-w-[55%] break-all text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                      {files.name}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span style={{ color: 'var(--text-secondary)' }}>File Type</span>
                    <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                      {files.type || 'Unknown'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span style={{ color: 'var(--text-secondary)' }}>File Size</span>
                    <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatFileSize(files.size)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span style={{ color: 'var(--text-secondary)' }}>Shared</span>
                    <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formattedSharedDate}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div
            className="mt-6 flex items-center gap-3 rounded-2xl border p-4 shadow-sm"
            style={{
              background: 'rgba(37,99,235,0.08)',
              borderColor: 'rgba(96,165,250,0.18)',
              color: '#bfdbfe',
            }}
          >
            <Info size={18} className="shrink-0" />
            <p className="text-sm">
              This file has been shared publicly. Anyone with the link can preview supported content and download the file.
            </p>
          </div>
        </div>
      </main>

      <LinkShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        link={shareModal.link}
        title="Share File"
      />
    </div>
  );
};

export default PublicFileView;
