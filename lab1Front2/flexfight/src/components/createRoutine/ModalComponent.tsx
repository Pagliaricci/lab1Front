import React from 'react';
import { createPortal } from 'react-dom';
import { AddedExercise } from './ExerciseSearchComponent';

interface ModalProps {
    isOpen: boolean;
    onClose: (addedExercises: AddedExercise[]) => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Renderizar el modal usando un portal para que aparezca fuera de la jerarquía del componente
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-orange-500 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Add Training Day</h2>
                    <button
                        onClick={() => onClose([])}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:text-orange-100"
                        title="Close modal"
                    >
                        <span className="text-lg font-bold">×</span>
                    </button>
                </div>
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                    {children}
                </div>
            </div>
        </div>,
        document.body // Renderizar directamente en el body
    );
};

export default Modal;
