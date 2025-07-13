import React, { useState, useEffect } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import Modal from './ModalComponent';
import ExerciseSearchComponent from './ExerciseSearchComponent';
import { AddedExercise } from './ExerciseSearchComponent';

interface WeekCardComponentProps {
    weekNumber: number;
    startDay: number;
    setExercises: React.Dispatch<React.SetStateAction<any[]>>;
    onDuplicateWeek: (sourceWeek: number, targetWeek: number) => void;
    onUpdateWeekData: (weekNumber: number, exercises: any[]) => void;
    totalWeeks: number;
    weekData: any[];
}

const WeekCardComponent: React.FC<WeekCardComponentProps> = ({ 
    weekNumber, 
    startDay, 
    setExercises, 
    onDuplicateWeek, 
    onUpdateWeekData, 
    totalWeeks, 
    weekData 
}) => {
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isTrainingDayOpen, setIsTrainingDayOpen] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<{ [key: number]: AddedExercise[] }>({});
    const [showDuplicateMenu, setShowDuplicateMenu] = useState(false);

    // Update completedExercises when weekData changes
    useEffect(() => {
        if (weekData.length > 0) {
            const exercisesByDay: { [key: number]: AddedExercise[] } = {};
            weekData.forEach(exercise => {
                const dayIndex = (exercise.day - startDay);
                if (dayIndex >= 0 && dayIndex < 7) {
                    if (!exercisesByDay[dayIndex]) {
                        exercisesByDay[dayIndex] = [];
                    }
                    exercisesByDay[dayIndex].push({
                        id: exercise.id,
                        name: exercise.name || 'Exercise',
                        series: exercise.sets,
                        reps: exercise.reps
                    });
                }
            });
            setCompletedExercises(exercisesByDay);
        }
    }, [weekData, startDay]);

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

            // Create new exercises for the parent component
            const newExercises = addedExercises.map((exercise) => ({
                id: exercise.id,
                sets: exercise.series,
                reps: exercise.reps,
                day: daysOfWeek[selectedDay], // Use the actual day value
                name: exercise.name, // Include name for week data
            }));

            // Update exercises in the parent component (CRFormsComponent)
            setExercises((prev) => [
                ...prev,
                ...newExercises,
            ]);

            // Update week data for duplicating functionality
            const currentWeekExercises = weekData.filter(ex => {
                const dayIndex = ex.day - startDay;
                return dayIndex !== selectedDay; // Remove exercises for this day
            });

            const updatedWeekData = [
                ...currentWeekExercises,
                ...newExercises
            ];

            onUpdateWeekData(weekNumber, updatedWeekData);
        }
        setIsTrainingDayOpen(false);
    };

    const handleDuplicateClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (selectedDay !== null) {
            const sourceWeek = weekNumber;
            const targetWeek = weekNumber + 1 > totalWeeks ? weekNumber : weekNumber + 1;
            onDuplicateWeek(sourceWeek, targetWeek);
        }
    };

    const handleDuplicateToWeek = (targetWeek: number) => {
        onDuplicateWeek(weekNumber, targetWeek);
        setShowDuplicateMenu(false);
    };

    const hasExercises = Object.keys(completedExercises).length > 0;

    return (
        <div className="w-full border border-orange-200 rounded-xl shadow-lg mb-4 overflow-hidden bg-white relative">
            {/* Duplicate Button */}
            {hasExercises && totalWeeks > 1 && (
                <div className="absolute top-2 right-2 z-10">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDuplicateMenu(!showDuplicateMenu);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                            title="Duplicate this week"
                        >
                            <FaCopy size={14} />
                        </button>
                        
                        {/* Duplicate Menu */}
                        {showDuplicateMenu && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-48 max-h-64 overflow-y-auto">
                                <div className="p-3 border-b border-gray-100 text-sm font-semibold text-gray-700 bg-gray-50">
                                    Duplicate to:
                                </div>
                                <div className="py-1">
                                    {Array.from({ length: totalWeeks }, (_, i) => i + 1)
                                        .filter(week => week !== weekNumber)
                                        .map(week => (
                                            <button
                                                type="button"
                                                key={week}
                                                onClick={() => handleDuplicateToWeek(week)}
                                                className="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm text-gray-700 transition-colors duration-200 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                                            >
                                                <span className="font-medium">Week {week}</span>
                                                <span className="text-xs text-gray-500">Click to duplicate</span>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div
                className="p-4 bg-orange-500 text-white font-bold cursor-pointer flex justify-between items-center hover:bg-orange-600 transition-colors duration-200"
                onClick={toggleExpand}
            >
                <span>Week {weekNumber}</span>
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </div>
            {isExpanded && (
                <div className="p-6 bg-orange-50/50">
                    <div className="grid grid-cols-7 gap-3 mb-6">
                        {daysOfWeek.map((day, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-semibold ${
                                        selectedDay === index 
                                            ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' 
                                            : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                    onClick={() => handleDayClick(index)}
                                >
                                    {completedExercises[index] ? <FaCheck className="text-blue-500" /> : day}
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedDay !== null && (
                        <div className="mt-6">
                            {completedExercises[selectedDay] ? (
                                <div className="w-full">
                                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                                        {completedExercises[selectedDay].map((exercise, idx) => (
                                            <div key={idx} className="p-4 bg-white border border-blue-200 text-center rounded-xl shadow-sm w-36 hover:shadow-md transition-shadow duration-200">
                                                <div className="font-bold text-gray-800 mb-2">{exercise.name}</div>
                                                <div className="text-sm text-gray-600 mb-1">Series: {exercise.series}</div>
                                                <div className="text-sm text-gray-600">Reps: {exercise.reps}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                                            onClick={handleAddTrainingClick}
                                        >
                                            Edit Training
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                                        onClick={handleAddTrainingClick}
                                    >
                                        Add training
                                    </button>
                                </div>
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
