import React from 'react';

interface HomeButtonProps {
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ name, icon, onClick, disabled = false }) => {
    return (
        <button
            className={`group w-full h-32 flex flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform backdrop-blur-lg border border-white/30 ${
                disabled
                    ? 'bg-gray-400/50 text-gray-600 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]'
            }`}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
        >
            <div className={`text-3xl mb-2 transition-transform duration-300 ${!disabled && 'group-hover:scale-110'}`}>
                {icon}
            </div>
            <div className="text-sm font-semibold text-center px-2 leading-tight">
                {name}
            </div>
        </button>
    );
};

export default HomeButton;
