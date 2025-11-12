import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import { Copy, Info, Share2, Download , File} from 'lucide-react';
import LinkShareModal from '../componenets/LinkShareModal';


const PublicFileView = () => {

  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    link:''
  });
  const{getToken } = useAuth();
  const { fileId } = useParams();

  // Fetch public file details
  useEffect (() => {
    const getFile = async () => {
      setLoading (true);
      try{
        const token = await getToken();
        const response = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
        setFiles(response.data);
        setError(null);
      }catch(error){
        console.log("Error fetching file:", error);
        setError("Could not fetch the file. Please try again later.");
        setFiles (null);
      }finally{
        setLoading(false);
      }
    };
    getFile();
  }, [fileId, getToken]);

  // handle file download
  const handleDownload = async () => {
    try{
      const token = await getToken();
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
        responseType: 'blob',
        });
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', files.name); // Use the file's original name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    }catch(error){
      console.log("Error downloading file:", error);
      toast.error("Could not download the file. Please try again later.");
    }
  };

  const openSharemodal =() => {
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

  if(loading){
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <p className='text-gray-600'>Loading file...</p>
      </div>
    );
  }

  if(error){
    return(
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <div className='text-center p-8 bg-white rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-red-600'>Error</h2>
          <p className='mt-2 text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  if(!files){
    return null;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <header className='p-4 border-b bg-white'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Share2 className='text-blue-600'/>
            <span className='text-xl font-bold text-gray-800 '>CloudShare</span>
          </div>
          <button 
            onClick={openSharemodal}
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
          >
            <Copy size={16} />
            Share Link
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className='container mx-auto p-4 md:p-8 flex justify-center'>
        <div className='w-full max-w-3xl'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-md p-8 text-center'>
            <div className='flex justify-center mb-4'>
              <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center'>
                <File size={40} className='text-blue-500'/>
              </div>
            </div>
            <h1 className='text-2xl font-semibold text-gray-800 break-words'>
              {files.name}
            </h1>
            <p className='text-sm text-gray-500 mt-2'>
              {(files.size / 1024).toFixed(2)} KB
              <span className='mx-2'>&bull;</span>
              Shared on {new Date(files.uploadedAt).toLocaleDateString()}
            </p>

            <div className='my-6'>
              <span className='inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-lg'>{files.type || "Files"}</span>
            </div>
            <div className='flex justify-center my-8'>
              <button 
                onClick={handleDownload}
                className='bg-gray-800 space-x-2 text-white items-center justify-center px-6 py-3 rounded-lg hover:bg-gray-600 transition'
              >
                <Download size={18} className='inline-block' />
                <span className="font-medium">Download File</span>
              </button>
            </div>

            <hr  className='my-8'/>
            <div>
              <h3 className='text-lg font-semibold text-left text-gray-800 mb-4'>
                File Details
              </h3>
              <div className='text-left text-sm space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>File Name:</span>
                  <span className='font-medium text-gray-800 break-all'>{files.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>File Type:</span>
                  <span className='font-medium text-gray-800'>{files.type}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>File Size:</span>
                  <span className='font-medium text-gray-800'>{(files.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Shared:</span>
                  <span className='font-medium text-gray-800'>{new Date(files.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center shadow-sm'>
            <Info size={16} className='inline-block mr-2'/>
            <p className='text-sm'>
              This file has been shared publicly. Anyone with the link can access and download this file.
            </p>
          </div>
        </div>
      </main>
      {/* Share Modal */}
      <LinkShareModal 
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        link={shareModal.link}
        title="Share File"
      />
    </div>
  )
}

export default PublicFileView