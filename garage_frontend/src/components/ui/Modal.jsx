import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div >
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header p-5 border-b">
                        <h2 style={{ margin: 25 }}>{title}</h2>
                    </div>
                    <button
                        className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors z-10"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <div className="modal-body p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
