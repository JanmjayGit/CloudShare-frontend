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
      className='dark-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className={`dark-modal-panel w-full ${sizeClasses[size]} transform transition-all animate-fade-up`}>
        {/* Header */}
        <div className='flex items-center justify-between p-6' style={{borderBottom:'1px solid var(--border-default)'}}>
          <h2 className='text-xl font-semibold' style={{color:'var(--text-primary)'}}>{title}</h2>
          <button
            onClick={onClose}
            className='transition-colors'
            style={{color:'var(--text-secondary)'}}
            onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'}
            onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}
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
          <div className='flex items-center justify-end gap-3 p-6' style={{borderTop:'1px solid var(--border-default)'}}>
            {cancelText && (
              <button
                onClick={onClose}
                className='btn-secondary px-4 py-2'
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
                className='px-4 py-2 rounded-md transition-colors font-medium text-white'
                style={{background:'rgba(239,68,68,0.85)'}}
                onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,1)'}
                onMouseOut={e => e.currentTarget.style.background='rgba(239,68,68,0.85)'}
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