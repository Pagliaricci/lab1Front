import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import Modal from './ModalComponent';
import ExerciseSearchComponent from './ExerciseSearchComponent';
import { AddedExercise } from './ExerciseSearchComponent';

interface WeekCardComponentProps {
    weekNumber: number;
    startDay: number;
    setExercises: React.Dispatch<React.SetStateAction<any[]>>; // Function to update the exercises
}

const WeekCardComponent: React.FC<WeekCardComponentProps> = ({ weekNumber, startDay, setExercises }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isTrainingDayOpen, setIsTrainingDayOpen] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<{ [key: number]: AddedExercise[] }>({});

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => startDay + i);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDayClick = (dayIndex: number) => {
        setSelectedDay(dayIndex === selectedDay ? null : dayIndex);
    };

    const handleAddTrainingClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsTrainingDayOpen(true);
    };

    const closeModal = (addedExercises: AddedExercise[]) => {
        if (addedExercises.length > 0 && selectedDay !== null) {
            // Update completed exercises for the day
            setCompletedExercises((prev) => ({
                ...prev,
                [selectedDay]: addedExercises,
            }));

            // Update exercises in the parent component (CRFormsComponent)
            setExercises((prev) => [
                ...prev,
                ...addedExercises.map((exercise) => ({
                    id: exercise.id,
                    sets: exercise.series,
                    reps: exercise.reps,
                })),
            ]);
        }
        setIsTrainingDayOpen(false);
    };

    return (
        <div className="w-full border rounded-lg shadow-md mb-4 overflow-hidden">
            <div
                className="p-4 bg-blue-500 text-white font-bold cursor-pointer flex justify-between items-center"
                onClick={toggleExpand}
            >
                <span>Week {weekNumber}</span>
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
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
                                    {completedExercises[index] ? <FaCheck className="text-green-500" /> : day}
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedDay !== null && (
                        <div className="mt-4 flex flex-col items-center">
                            {completedExercises[selectedDay] ? (
                                <div className="flex flex-wrap justify-center gap-4">
                                    {completedExercises[selectedDay].map((exercise, idx) => (
                                        <div key={idx} className="p-2 bg-gray-200 text-center rounded-lg shadow-sm w-32">
                                            <div className="font-bold">{exercise.name}</div>
                                            <div className="text-sm">Series: {exercise.series}</div>
                                            <div className="text-sm">Reps: {exercise.reps}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                                    onClick={handleAddTrainingClick}
                                >
                                    Add training
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {isTrainingDayOpen && (
                <Modal onClose={() => setIsTrainingDayOpen(false)} isOpen={isTrainingDayOpen}>
                    <ExerciseSearchComponent onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};

export default WeekCardComponent;
