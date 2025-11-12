import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout'
import { useState } from 'react';
import { Copy, Download, Eye, File, Globe, Grid, List, Lock, Trash} from 'lucide-react';
import { Image, Music, Video , FileText, FileIcon, FileSpreadsheet} from 'lucide-react';
import {useAuth} from '@clerk/clerk-react'
import axios from 'axios';
import toast from 'react-hot-toast';
import FileCard from '../componenets/FileCard';
import apiEndpoints from '../util/apiEndpoints';
import ConfirmationDialog from '../componenets/ConfirmationDialog';
import LinkShareModal from '../componenets/LinkShareModal';

const MyFiles = () => {

  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const {getToken} = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    fileId: null,
  });
  const [shareableLink, setShareableLink] = useState({
    isOpen: false,
    fileId: null,
    link: '',
  });

  const getFileIcon = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)){
            return <Image size={24} className="text-purple-500"/>
        }
        if(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)){
            return <Video size={24} className="text-blue-500"/>
        }
        if(['mp3', 'wav', 'aac', 'flac','m4a','ogg'].includes(fileExtension)){
            return <Music size={24} className="text-pink-500"/>
        }
        if(['pdf', 'doc', 'docx','txt','rft'].includes(fileExtension)){
            return <FileText size={24} className="text-amber-500"/>
        }
        if(['xls', 'xlsx', 'csv'].includes(fileExtension)){
            return <FileSpreadsheet size={24} className="text-green-700"/>
        }
        return <FileIcon size={24} className="text-purple-500"/>
    }

    // for file name too long...
  const truncateFileName = (fileName, maxLength = 40) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4);
    
    return `${truncatedName}....${extension}`;
  }

  const fetchFiles = async () => {
    try{
      const token = await getToken();
      const response = await axios.get(apiEndpoints.FETCH_FILES, {headers: {Authorization: `Bearer ${token}`}});
      if(response.status === 200){    
        setFiles(response.data);
      }
    }catch(error){
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files. Please try again later.', error.message);
    }
  }

  // toggle the public to private status of a file or public to private
  const togglePublic = async (fileToUpdate) => {
    try{
      const token = await getToken();
      await axios.patch(apiEndpoints.TOGGLE_FILE(fileToUpdate.id), {},{headers: {Authorization: `Bearer ${token}`}});
      setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic} : file));
    }catch(error){
      console.error('Error toggling file status', error);
      toast.error('Error toggling file status', error.message);
    }
  }

  // handle file download
  const downloadFile = async (file) => {
    try{
      const token = await getToken();
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {
        headers: {Authorization: `Bearer ${token}`},
        responseType: 'blob',
      });
      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      // Append to the document and trigger click
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
      toast.success('File downloaded successfully!');
    }catch(error){
      console.error('Error downloading file', error);
      toast.error('Error downloading file', error.message);
    }
  }
  

  // close delete confirmation dialog
  const closeDeleteConfimation = () => {
    setDeleteConfirmation({
      isOpen: false,
      fileId: null,
    });
  }

  // open the delete confirmation dialog
  const openDeleteConfirmation = (fileId) => {
    setDeleteConfirmation({
      isOpen: true,
      fileId
    });
  }

  // delete file after confirmation
  const handleDelete = async () => {
    const fileId = deleteConfirmation.fileId;
    if(!fileId) return;

    try{
      const token = await getToken();
      const response = await axios.delete(apiEndpoints.DELETE_FILE(fileId), {headers: {Authorization: `Bearer ${token}`}});
      if(response.status === 204){
        setFiles(files.filter((file) => file.id !== fileId));
        closeDeleteConfimation();
      }
      
      toast.success('File deleted successfully!');
    }catch(error){
      console.error('Error deleting file', error);
      toast.error('Error deleting file', error.message);
    }
  }

  // open shareable link dialog
  const openShareableLink = (fileId) => {
    const link = `${window.location.origin}/file/${fileId}`;
    setShareableLink({
      isOpen: true,
      fileId,
      link
    });
  }

  // close shareable link dialog
  const closeShareableLink = () => {
    setShareableLink({
      isOpen: false,
      fileId: null,
      link: ''
    });
  }
  
  useEffect(() => {
    fetchFiles();
  },[getToken]);

  return (
    <DashboardLayout activeMenu="My Files">
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>My Files {files.length}</h2>
            <div className='flex items-center gap-3'>
              <List
                onClick={() => setViewMode('list')} 
                size={24} 
                className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'}`}
              />
              <Grid 
                size={24}
                onClick={() => setViewMode('grid')} 
                className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'}`}
              />
            </div>
          </div>
          {files.length === 0 ? (
            <div className='bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center'>
              <File 
                size={60}
                className='text-purple-300 mb-4'
              />
              <h3 className='text-xl font-medium text-gray-700 mb-2'>No Files Found</h3>
              <p 
                className='text-gray-500 text-center max-w-md mb-6'>
                Start uploading files to see them listed here. You can upload documents, images, and other files to share and manage them securely
              </p>
              <button
                onClick={() => navigate("/upload")} 
                className='px-4 py-2 bg-purple-500 rounded-md text-white hover:bg-purple-600 transition-colors'>
                Go to upload
              </button>
            </div>
          ) : (
            viewMode === "grid" ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {files.map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file}
                    onDelete={openDeleteConfirmation}
                    onTogglePublic={togglePublic}
                    onDownload={downloadFile}
                    onShareableLink={openShareableLink}
                  />
                ))}
              </div>
            ): ( 
              // list view
              <div className='overflow-x-auto bg-white rounded-lg shadow'>
                <table className='min-w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Size</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Uploaded</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Sharing</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {files.map((file) => (
                      <tr key={file.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600'>
                            <div className='flex items-center gap-2'>
                              {getFileIcon(file)}
                              {/* {file.name} */}
                              <span title={file.name}>{truncateFileName(file.name)}</span>
                            </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600'>
                            {(file.size / 1024).toFixed(1)}KB
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600'>
                            {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600'>
                            <div className='flex items-center gap-4'>
                              <button
                                onClick={() => togglePublic(file)} 
                                className='flex items-center gap-2 cursor-pointer group'>
                                {file.isPublic ? (
                                  <>
                                    <Globe size={16} className='text-green-500'/>
                                    <span className='group-hover:underline'>Public</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock size={16} className='text-gray-500 '/>
                                    <span className='group-hover:underline'>Private</span>
                                  </>
                                )}
                              </button>
                              {file.isPublic && (
                                <button
                                  onClick={() => openShareableLink(file.id)} 
                                  className='flex items-center gap-2 cursor-pointer group text-blue-600'>
                                  <Copy size={16} />
                                  <span className='group-hover:underline'>Share Link</span>
                                </button>
                              )}
                            </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600'>
                          <div className='grid grid-cols-3 gap-4'>
                            <div className='flex justify-center'>
                              <button
                                onClick={() => downloadFile(file)}
                                title='Download' 
                                className='text-gray-500 hover:text-green-600'>
                                <Download size={18}/>
                              </button>
                            </div>
                            <div className='flex justify-center'>
                              <button
                                onClick={() => openDeleteConfirmation(file.id)}
                                title='Delete' 
                                className='text-red-600'>
                                <Trash size={18}/>
                              </button>
                            </div>
                            <div className='flex justify-center'>
                              {file.isPublic ? (
                                <a href={`/file/${file.id}`} title="view file" target='_blank' rel='noreferrer' className="text-gray-500 hover:text-blue-600">
                                  <Eye size={18}/>
                                </a>
                              ) : (
                                <span className='w-[18px]'></span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))} 
                  </tbody>
                </table>
              </div>
            )
          )}
          {/* delete confirmation dialog */}
          <ConfirmationDialog
            isOpen={deleteConfirmation.isOpen}
            onClose={() => closeDeleteConfimation()}
            title="Delete File"
            message="Are you sure you want to delete this file? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            ConfirmationButtonClass="bg-red-600 hover:bg-red-700 text-white"
            onConfirm={handleDelete} 
          />

          {/* shareable link modal */}
          <LinkShareModal 
            isOpen={shareableLink.isOpen}
            onClose={closeShareableLink}
            link={shareableLink.link}
            title="Share File"
          />
        </div>
    </DashboardLayout>
  )
}

export default MyFiles