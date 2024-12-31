import React from 'react';

interface RoutineCardProps {
    name: string;
    duration: number;
    intensity: string;
    onClick?: () => void; // Add an optional onClick prop
}

const RoutineCardComponent: React.FC<RoutineCardProps> = ({ name, duration, intensity, onClick }) => {
    return (
        <div
            className="bg-white bg-opacity-65 p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-100"
            onClick={onClick} // Trigger onClick when the card is clicked
        >
            <h2 className="text-2xl font-bold">{name}</h2>
            <p>Duration: {duration} {duration === 1 ? 'week' : 'weeks'}</p>
            <p>Intensity: {intensity}</p>
        </div>
    );
};

export default RoutineCardComponent;
