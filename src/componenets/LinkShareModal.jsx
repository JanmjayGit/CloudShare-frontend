// import React, { useState } from 'react'
// import { Check, Copy } from 'lucide-react'
// import Modal from './Modal'

// const LinkShareModal = ({ isOpen, onClose, link }) => {
//   const [copied, setCopied] = useState(false)

//   const handleCopy = () => {
//     navigator.clipboard.writeText(link)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2500)
//   }

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Share File"
//       cancelText="Close"         
//       confirmText={copied ? 'Copied!' : 'Copy'} 
//       onConfirm={handleCopy}     
//       ConfirmationButtonClass={
//         copied
//           ? 'bg-green-600 hover:bg-green-700 text-white'
//           : 'bg-blue-600 hover:bg-blue-700 text-white'
//       }
//       size="sm"
//     >
//       <div className="flex flex-col gap-4">
//         <p className="text-gray-700 text-sm">
//           Share this link with others to give them access to this file:
//         </p>

//         {/* Link input + copy icon */}
//         <div className="flex items-center gap-2 border-1 border-blue-500 rounded-md px-3 py-2">
//           <input
//             type="text"
//             value={link}
//             readOnly
//             className="flex-1 text-gray-800 text-sm bg-transparent outline-none"
//           />
//           <button
//             onClick={handleCopy}
//             className={`p-2 rounded-md transition-colors ${
//               copied
//                 ? 'bg-green-100 text-green-600'
//                 : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//             }`}
//           >
//             {copied ? <Check size={18} /> : <Copy size={18} />}
//           </button>
//         </div>

//         {copied && (
//           <p className="text-green-600 text-sm flex items-center gap-1">
//             <Check size={14} /> Link copied to clipboard!
//           </p>
//         )}

//         <p className="text-gray-500 text-xs mt-1">
//           Anyone with this link can access this file.
//         </p>
//       </div>
//     </Modal>
//   )
// }

// export default LinkShareModal


import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";

const LinkShareModal = ({ isOpen, onClose, link, title }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700">
                    Share this link with others to give them access to this file:
                </p>

                <div className="flex items-center border border-blue-500 hover:border-2 rounded-lg overflow-hidden">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-gray-50 outline-none text-gray-700"
                    />
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Copy link"
                    >
                    {isCopied ? (
                        <Check size={18} className="text-green-500" />
                    ) : (
                        <Copy size={18} className="text-gray-700" />
                    )}
                    </button>
                </div>
                {isCopied && (
                    <p className="text-green-600 text-sm flex items-center gap-1">
                        <Check size={14} /> Link copied to clipboard!
                    </p>
                )}

                <p className="text-xs text-gray-500">
                    Anyone with this link can access this file.
                </p>
            </div>

            {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 p-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
                <button
                    onClick={handleCopy}
                    className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                    isCopied
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isCopied ? "Copied!" : "Copy"}
                </button>
                </div>
        </div>
    </div>
  );
};

export default LinkShareModal;
