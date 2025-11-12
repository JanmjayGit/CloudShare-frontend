import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import {useAuth} from '@clerk/clerk-react'
import { UserCreditsContext } from '../context/UserCreditsContext';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import Dashboardupload from '../componenets/Dashboardupload';
import RecentFiles from '../componenets/RecentFiles';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {

  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [remainingUploads, setRemainingUploads] = useState(5);
  const {getToken} = useAuth();
  const {fetchUserCredits, updateCredits} = useContext(UserCreditsContext);
  const MAX_FILES = 5;

  // fetch revent 5 files files 
  useEffect(() => {
    const fetchRecentFiles = async() => {
      setLoading(true);
      try{
        const token = await getToken();
        const response = await axios.get(apiEndpoints.FETCH_FILES, {headers: {
          Authorization: `Bearer ${token}`
        }});

        // sort by uploaded At nd take only five most recent files
        const sortedFiles= response.data.sort((a, b) => 
          new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0,5); // recent 5 files in decending order
        setFiles(sortedFiles);
      }catch(error){
        console.log("Error fetching recent files:", error);
      }finally{
        setLoading(false);
      }
    }
    fetchRecentFiles();
  },[getToken]);

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
      const token = await getToken();
      const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
          Authorization: `Bearer ${token}` // Fixed: added space after Bearer
        }
      });

      if(response.data && response.data.remainingCredits !== undefined){
        updateCredits(response.data.remainingCredits);
      }
      setMessage("Files uploaded successfully");
      setMessageType("success");
      setUploadFiles([]);

      // refresh the recent files list
      const res = await axios.get(apiEndpoints.FETCH_FILES, 
        {headers: {'Authorization': `Bearer ${token}`}}
      );

      const sortedFiles= res.data.sort((a, b) => 
          new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0,5); // recent 5 files in decending order
      setFiles(sortedFiles);

      await fetchUserCredits(); // refresh usercredits immedistely after upload

    }catch(error){
      console.error("Error uploading files", error);
      setMessage(error.response?.data?.message || "Error uploading files. Please try again."); // Fixed typo: respnse -> response
      setMessageType("error");
    }finally{
      setUploading(false);
    }
  };

  
  return (
    <DashboardLayout activeMenu="Dashboard">
       <div className='p-6'>
          <h1 className='text-2xl font-bold mb-6'>My Drive</h1>
          <p className='text-gray-600 mb-6'>Upload, manage and share your files securely</p>
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'error' ? 'bg-red-50 text-red-700' : messageType === 'success' ? 'bg-green-50 text-green-700': 'bg-purple-50 text-purple-700'
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
            {/* rught column */}
            <div className='w-full md:w-[60%]'>
              {loading ? (
                <div className='bg-white rounded-lg shadow p-8 flex flex-col'>
                  <Loader2 size={40} className='text-purple-500 animate-spin' />
                  <p className='text-gray-500'>Loading your files...</p>
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