import React from 'react';

interface ButtonComponentProps {
    type: "button" | "submit" | "reset";
    text: string;
    variant?: "primary" | "secondary";
    onclick?: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ type, text, variant = "primary", onclick }) => {
    const baseClasses = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";
    const primaryClasses = "bg-blue-500 hover:bg-blue-700 text-white";
    const secondaryClasses = "bg-gray-500 hover:bg-green-700 text-white";

    const buttonClasses = `${baseClasses} ${variant === "primary" ? primaryClasses : secondaryClasses} mb-2`;

    return (
        <button className={buttonClasses} type={type} onClick={onclick}>
            {text}
        </button>
    );
};

export default ButtonComponent;
