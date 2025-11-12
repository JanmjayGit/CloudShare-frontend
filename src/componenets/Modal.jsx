import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  deleteText,
  onConfirm,
  onDelete,
  ConfirmationButtonClass = 'bg-blue-600 hover:bg-blue-700 text-white',
  size = 'md'
}) => {
  
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-30 p-4'
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <X size={30} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {children}
        </div>

        {/* Footer with action buttons */}
        {(confirmText || cancelText) && (
          <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200'>
            {cancelText && (
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
              >
                {cancelText}
              </button>
            )}
            {deleteText && onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors'
              >
                {deleteText}
              </button>
            )}
            {confirmText && onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded-md transition-colors ${ConfirmationButtonClass}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;