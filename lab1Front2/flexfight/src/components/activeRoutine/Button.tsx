
interface ButtonProps {
    label: string;
    onClick: (event: React.MouseEvent) => Promise<void>;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105 ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
