import React from 'react';

interface ButtonComponentProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'tertiary';
    onClick?: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, type = 'button', variant = 'primary', onClick }) => {
    const baseClass = 'font-bold text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out';
    const primaryClass = 'bg-gray-500 text-white'; // Un-selected button
    const secondaryClass = 'hover:bg-blue-700 text-white'; // Hovered button
    const tertiaryClass = 'bg-green-500 text-white'; // Selected button

    const buttonClass = variant === 'primary' ? primaryClass :
                        variant === 'tertiary' ? tertiaryClass : '';

    return (
        <button
            type={type}
            className={`${baseClass} ${buttonClass} ${secondaryClass}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonComponent;