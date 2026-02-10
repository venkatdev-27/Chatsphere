import React, { useEffect } from 'react';

const ImagePreviewModal = ({ imageSrc, type = 'image', onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!imageSrc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fadeIn" onClick={onClose}>
            <div className={`relative max-w-full max-h-full p-4 flex items-center justify-center ${type === 'document' ? 'w-full h-full' : ''}`}>
                {type === 'document' ? (
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(imageSrc)}&embedded=true`}
                        className="w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl"
                        frameBorder="0"
                        title="Document Preview"
                    />
                ) : (
                    <img
                        src={imageSrc}
                        alt="Preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
                    />
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all focus:outline-none"
                    aria-label="Close preview"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
