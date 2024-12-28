import React, { useState } from 'react';
import Modal from './ModalComponent'; // Importing the modal
import ExerciseSearchComponent from './ExerciseSearchComponent'; // Importing the ExerciseSearchComponent

interface WeekCardComponentProps {
    weekNumber: number;
    startDay: number; // Added to receive the starting day for the week
}

const WeekCardComponent: React.FC<WeekCardComponentProps> = ({ weekNumber, startDay }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isTrainingDayOpen, setIsTrainingDayOpen] = useState(false); // Control modal visibility

    // Generate an array of days for the week based on the start day
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => startDay + i);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDayClick = (dayIndex: number) => {
        setSelectedDay(dayIndex === selectedDay ? null : dayIndex); // Toggle selection of day
    };

    const handleAddTrainingClick = (event: React.MouseEvent) => {
        event.preventDefault(); // Prevents any default behavior (like form submission)
        setIsTrainingDayOpen(true); // Open modal when clicking 'Add training'
    };

    const closeModal = () => {
        setIsTrainingDayOpen(false); // Close modal when clicking close
    };

    return (
        <div className="w-full border rounded-lg shadow-md mb-4 overflow-hidden">
            <div
                className="p-4 bg-blue-500 text-white font-bold cursor-pointer flex justify-between items-center"
                onClick={toggleExpand}
            >
                <span>Week {weekNumber}</span>
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                </span>
            </div>
            {isExpanded && (
                <div className="pl-2 pr-2 pt-4 pb-4 bg-gray-100">
                    <div className="grid grid-cols-7 gap-2">
                        {daysOfWeek.map((day, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                                        selectedDay === index ? 'bg-blue-200 border-blue-500' : 'bg-white'
                                    }`}
                                    onClick={() => handleDayClick(index)}
                                >
                                    {day}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Conditionally render the Add Training section */}
                    {selectedDay !== null && (
                        <div className="mt-4 flex justify-center">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                                onClick={handleAddTrainingClick}
                            >
                                Add training
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for Add Training */}
            <Modal isOpen={isTrainingDayOpen} onClose={closeModal}>
                <ExerciseSearchComponent onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default WeekCardComponent;
