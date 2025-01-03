import { useState, useEffect } from 'react';
import {FullProgressExercise} from '../../pages/ActiveRoutine';

interface ExerciseCardProps {
    exercise: FullProgressExercise;
    onComplete: () => void;
}

interface HistoryExercise {
    weight: number;
    reps: number;
    sets: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onComplete }) => {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [sets, setSets] = useState<number | ''>('');
    const [reps, setReps] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [isDone, setIsDone] = useState(exercise.isDone);
    const [history, setHistory] = useState<HistoryExercise | null>(null);

    useEffect(() => {
        if (isDone) {
            fetchExerciseHistory();
        }
    }, [isDone]);

    const fetchExerciseHistory = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/progress/get-exercise-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: exercise.userId,
                    routineId: exercise.routineId,
                    routineExerciseId: exercise.routineExerciseId,
                }),
            });
            if (response.ok) {
                const data: HistoryExercise = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching exercise history:', error);
        }
    };

    const toggleDescription = () => {
        setIsDescriptionVisible((prev) => !prev);
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value === '' ? '' : Number(value));
    };

    const handleCompleteExercise = async () => {
        try {
            const completedExercise = {
                routineId: exercise.routineId,
                userId: exercise.userId,
                routineExerciseId: exercise.routineExerciseId,
                sets,
                reps,
                weight,
                day: exercise.day,
            };
            const response = await fetch('http://localhost:8081/api/progress/complete-exercise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(completedExercise),
            });
            if (response.ok) {
                setIsDone(true);
                onComplete(); // Notify parent
            }
        } catch (error) {
            console.error('Error completing exercise:', error);
        }
    };


    return (
        <div className={`p-4 rounded-lg shadow-md flex flex-col justify-center space-y-4 ${isDone ? 'bg-green-500' : 'bg-gray-800'}`}>
            <div className="text-center">
                <h3 className={`text-xl font-semibold ${isDone ? 'text-white' : 'text-gray-300'}`}>
                    {exercise.name}
                </h3>
                {isDone && <p className="text-sm font-medium text-gray-200">Exercise Completed!</p>}
            </div>

            {isDone && history && (
                <div className="grid grid-cols-3 gap-4 text-center text-white text-sm">
                    <div>
                        <p className="font-semibold text-lg">{history.sets}</p>
                        <p>Sets</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{history.reps}</p>
                        <p>Reps</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{history.weight} kg</p>
                        <p>Weight</p>
                    </div>
                </div>
            )}

            {!isDone && (
                <>
                    <button
                        className="text-blue-400 text-sm hover:text-blue-500 transition duration-300"
                        onClick={toggleDescription}
                    >
                        {isDescriptionVisible ? 'Hide details' : 'View details'}
                    </button>
                    {isDescriptionVisible && (
                        <p className="bg-gray-700 text-sm text-gray-200 p-2 rounded-lg">
                            {exercise.description}
                        </p>
                    )}
                    <p className="text-gray-300">
                        Target: {exercise.sets} sets x {exercise.reps} reps
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="number"
                            value={sets}
                            onChange={handleInputChange(setSets)}
                            placeholder="Sets"
                            className="w-full p-1 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={reps}
                            onChange={handleInputChange(setReps)}
                            placeholder="Reps"
                            className="w-full p-1 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={weight}
                            onChange={handleInputChange(setWeight)}
                            placeholder="Weight (kg)"
                            className="w-full p-1 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        className="w-full bg-green-500 text-white py-1 rounded-lg hover:bg-green-600 shadow-md transition duration-300"
                        onClick={handleCompleteExercise}
                    >
                        Mark as Complete
                    </button>
                </>
            )}

            {!isDone && (
                <p className="text-sm font-medium text-yellow-400">
                    Pending
                </p>
            )}
        </div>
    );
}

export default ExerciseCard;