import React from 'react'
import Modal from './Modal'

const ConfirmationDialog = (
    {
        isOpen, 
        onClose, 
        title='Confirm Action', 
        message='Are you sure you want to proceed?', 
        confirmText='Confirm', 
        cancelText='Cancel',
        deleteText='Delete',
        onConfirm,
        onDelete,
        ConfirmationButtonClass='bg-red-600 hover:bg-red-700 text-white',
    }) => {
        
  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
        deleteText={deleteText}
        onConfirm={onConfirm}
        onDelete={onDelete}
        ConfirmationButtonClass={ConfirmationButtonClass}
        size='sm'
    >
        <p className='text-gray-600'>{message}</p>

    </Modal>


  )
}

export default ConfirmationDialog