import { FaTimes } from 'react-icons/fa';

interface RoutineCardProps {
    name: string;
    duration: number;
    intensity: string;
    onClick?: () => void; // For expanding the card
    isActive: boolean;
    onActivate?: () => void; // For activating/deactivating
    onDelete?: () => void; // For deleting the routine
    onDeactivate?: () => void; // For deactivating
}

const RoutineCardComponent: React.FC<RoutineCardProps> = ({ name, duration, intensity, onClick, isActive, onActivate, onDelete, onDeactivate }) => {
    return (
        <div
            className="bg-white bg-opacity-65 p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-100 relative"
            onClick={onClick} // Trigger onClick when the card is clicked
        >
            {/* X Button for deletion */}
            <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card's onClick
                    onDelete?.();
                }}
            >
                <FaTimes size={16} />
            </button>

            <h2 className="text-2xl font-bold">{name}</h2>
            <p>Duration: {duration} {duration === 1 ? 'week' : 'weeks'}</p>
            <p>Intensity: {intensity}</p>
            <button
                className={`mt-4 py-1 px-3 rounded ${
                    isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card's onClick
                    if (isActive) {
                        onDeactivate?.(); // Deactivate the routine
                    } else {
                        onActivate?.(); // Activate the routine
                    }
                }}
            >
                {isActive ? 'Deactivate' : 'Activate'}
            </button>
        </div>
    );
};

export default RoutineCardComponent;
