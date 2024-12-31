import React from 'react';

interface HomeButtonProps {
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ name, icon, onClick }) => {
    return (
        <button
            className="w-40 h-40 bg-blue-500 text-white flex flex-col items-center justify-center rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            onClick={onClick}
        >
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-lg font-bold">{name}</div>
        </button>
    );
};

export default HomeButton;