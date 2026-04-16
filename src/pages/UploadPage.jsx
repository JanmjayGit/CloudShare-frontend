import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useAuth } from '@clerk/clerk-react'
import { useRef } from 'react'
import { Upload, X, File, CloudUpload, Loader2 } from 'lucide-react'
import UploadBox from '../componenets/UploadBox';
import axios from 'axios';
import apiEndpoints from '../util/apiEndpoints';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { getAuthRequestConfig } from '../util/auth';

const UploadPage = () => {

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { getToken } = useAuth();
  const { credits, fetchUserCredits, updateCredits } = useContext(UserCreditsContext);
  const MAX_FILES = 5;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
      setMessageType('error');
      return;
    }
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setMessage('');
    setMessageType('');
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setMessage('');
    setMessageType('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one file to upload.");
      setMessageType("error");
      return;
    }
    if (files.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
      setMessageType("error");
      return;
    }
    if (credits <= 0) {
      setMessage("You have no credits remaining. Please upgrade your plan.");
      setMessageType("error");
      return;
    }
    if (files.length > credits) {
      setMessage(`You don't have enough credits. You have ${credits} credits but selected ${files.length} files.`);
      setMessageType("error");
      return;
    }
    setUploading(true);
    setMessage("Uploading files...");
    setMessageType("info");

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      const response = await axios.post(
        apiEndpoints.UPLOAD_FILE,
        formData,
        await getAuthRequestConfig(getToken)
      );
      if (response.data && response.data.remainingCredits !== undefined) {
        updateCredits(response.data.remainingCredits);
      }
      setMessage("Files uploaded successfully!");
      setMessageType("success");
      setFiles([]);
      await fetchUserCredits();
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage(error.response?.data?.message || "Error uploading files. Please try again.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;

  return (
    <DashboardLayout activeMenu="Upload">
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-2' style={{ color: 'var(--text-primary)' }}>Upload Files</h1>
        <p className='mb-6' style={{ color: 'var(--text-secondary)' }}>Upload and manage your files securely in the cloud.</p>
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'dark-alert-error' : messageType === 'success' ? 'dark-alert-success' : 'dark-alert-info'
            }`}>
            {message}
          </div>
        )}
        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFile}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
        />
      </div>
    </DashboardLayout>
  )
}

export default UploadPage
