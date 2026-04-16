import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import {useAuth} from '@clerk/clerk-react'
import { UserCreditsContext } from '../context/UserCreditsContext';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import Dashboardupload from '../componenets/Dashboardupload';
import RecentFiles from '../componenets/RecentFiles';
import { Loader2 } from 'lucide-react';
import { getAuthRequestConfig } from '../util/auth';

const Dashboard = () => {

  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [remainingUploads, setRemainingUploads] = useState(5);
  const {getToken, isLoaded, isSignedIn} = useAuth();
  const {fetchUserCredits, updateCredits} = useContext(UserCreditsContext);
  const MAX_FILES = 5;

  const getErrorMessage = (error, fallbackMessage) => {
    if (error?.code === 'ECONNABORTED') {
      return 'The server is taking too long to respond. It may be waking up, so please try again in a moment.';
    }

    return error?.response?.data?.message || fallbackMessage;
  };

  // fetch revent 5 files files 
  useEffect(() => {
    const fetchRecentFiles = async() => {
      if (!isLoaded || !isSignedIn) {
        return;
      }

      setLoading(true);
      try{
        const response = await axios.get(
          apiEndpoints.FETCH_FILES,
          await getAuthRequestConfig(getToken)
        );

        // sort by uploaded At nd take only five most recent files
        const sortedFiles= response.data.sort((a, b) => 
          new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0,5); // recent 5 files in decending order
        setFiles(sortedFiles);
      }catch(error){
        console.log("Error fetching recent files:", error);
        setMessage(getErrorMessage(error, "Error loading recent files. Please try again."));
        setMessageType("error");
      }finally{
        setLoading(false);
      }
    }
    fetchRecentFiles();
  },[getToken, isLoaded, isSignedIn]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if(uploadFiles.length + selectedFiles.length > MAX_FILES){
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
      setMessageType('error');
    }

    // add these new files to existing files 
    setUploadFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setMessage('');
    setMessageType('');
  };

  // remove file 
  const handleRemovefiles = (index) => {
    setUploadFiles(prevfiles => prevfiles.filter((_, i) => i !== index));
    setMessage('')
    setMessageType('');
  };

  // calculate remaining Uploads
  useEffect(() => {
    setRemainingUploads(MAX_FILES - uploadFiles.length);
  }, [uploadFiles]);

  // upload files
  const handleUpload = async () => {
    if(uploadFiles.length === 0){
      setMessageType("error");
      setMessage("Please select atleast one file to upload.");
      return;
    }
    if(uploadFiles.length > MAX_FILES){
      setMessage(`you can only upload a maximum of ${MAX_FILES} files at once`);
      setMessageType("error");
      return;
    }
    setUploading(true);
    setMessage("uploading the files...");
    setMessageType("info");

    const formData = new FormData();
    uploadFiles.forEach((file) => formData.append("files", file));

    try{
      const response = await axios.post(
        apiEndpoints.UPLOAD_FILE,
        formData,
        await getAuthRequestConfig(getToken)
      );

      if(response.data && response.data.remainingCredits !== undefined){
        updateCredits(response.data.remainingCredits);
      }
      setMessage("Files uploaded successfully");
      setMessageType("success");
      setUploadFiles([]);

      // refresh the recent files list
      const res = await axios.get(
        apiEndpoints.FETCH_FILES,
        await getAuthRequestConfig(getToken)
      );

      const sortedFiles= res.data.sort((a, b) => 
          new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0,5); // recent 5 files in decending order
      setFiles(sortedFiles);

      await fetchUserCredits(); // refresh usercredits immedistely after upload

    }catch(error){
      console.error("Error uploading files", error);
      setMessage(getErrorMessage(error, "Error uploading files. Please try again."));
      setMessageType("error");
    }finally{
      setUploading(false);
    }
  };

  
  return (
    <DashboardLayout activeMenu="Dashboard">
       <div className='p-6'>
          <h1 className='text-2xl font-bold mb-2' style={{color:'var(--text-primary)'}}>My Drive</h1>
          <p className='mb-6' style={{color:'var(--text-secondary)'}}>Upload, manage and share your files securely</p>
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'error' ? 'dark-alert-error' : messageType === 'success' ? 'dark-alert-success' : 'dark-alert-info'
            }`}>
              {message}
            </div>
          )}

          <div className='flex flex-col md:flex-row gap-6'>
            {/* left column */}
            <div className='w-full md:w-[40%]'>
              <Dashboardupload
                files={uploadFiles}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                uploading={uploading}
                onRemoveFile={handleRemovefiles}
                remainingUploads={remainingUploads}
              />
            </div>
            {/* right column */}
            <div className='w-full md:w-[60%]'>
              {loading ? (
                <div className='dark-card p-8 flex flex-col items-center gap-3'>
                  <Loader2 size={40} className='text-violet-400 animate-spin' />
                  <p style={{color:'var(--text-secondary)'}}>Loading your files...</p>
                </div>
              ) : (
                <RecentFiles files={files}/>
              )}
            </div>
          </div>
       </div>
    </DashboardLayout>
  )
}

export default Dashboard
