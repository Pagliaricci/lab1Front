import React from 'react';
import { AddedExercise } from './ExerciseSearchComponent';

interface ModalProps {
    isOpen: boolean;
    onClose: (addedExercises: AddedExercise[]) => void; // Accepting addedExercises as a parameter
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-4 rounded-lg shadow-lg w-[80vw] max-w-5xl flex">
                <button
                    onClick={() => onClose([])} // Close the modal and pass an empty array (no exercises)
                    className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                {children} {/* Render any child components passed to the Modal */}
            </div>
        </div>
    );
};

export default Modal;
