import React from 'react';

interface HomeButtonProps {
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean; // New optional prop
}

const HomeButton: React.FC<HomeButtonProps> = ({ name, icon, onClick, disabled = false }) => {
    return (
        <button
            className={`w-40 h-40 flex flex-col items-center justify-center rounded-lg shadow-lg transition duration-300 ease-in-out transform ${
                disabled
                    ? 'bg-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-xl'
            }`}
            onClick={!disabled ? onClick : undefined} // Prevent click if disabled
            disabled={disabled} // Set disabled state
        >
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-lg font-bold">{name}</div>
        </button>
    );
};

export default HomeButton;
