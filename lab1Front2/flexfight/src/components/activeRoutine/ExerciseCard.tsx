import { useState, useEffect } from 'react';
import { FullProgressExercise } from '../../pages/ActiveRoutine';

interface ExerciseCardProps {
    exercise: FullProgressExercise;
    onComplete: () => void;
}

interface HistoryExercise {
    weight: number;
    reps: number;
    sets: number;
    comment?: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onComplete }) => {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [sets, setSets] = useState<number | ''>('');
    const [reps, setReps] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [isDone, setIsDone] = useState(exercise.isDone);
    const [history, setHistory] = useState<HistoryExercise | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isDone) {
            fetchExerciseHistory();

            // Poll for updates every 5 seconds
            interval = setInterval(fetchExerciseHistory, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
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
                console.log(data)
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
                onComplete();
            }
        } catch (error) {
            console.error('Error completing exercise:', error);
        }
    };

    return (
        <div className={`p-4 rounded-xl shadow-md flex flex-col justify-center space-y-4 border ${isDone ? 'bg-green-50/80 border-green-200/50' : 'bg-white/80 backdrop-blur-lg border-orange-200/30'}`}>
            <div className="text-center">
                <h3 className={`text-xl font-semibold ${isDone ? 'text-green-700' : 'text-gray-800'}`}>
                    {exercise.name}
                </h3>
                {isDone && <p className="text-sm font-medium text-green-600">Exercise Completed!</p>}
            </div>

            {isDone && history && (
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <p className="font-semibold text-lg text-green-700">{history.sets}</p>
                        <p className="text-gray-600">Sets</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-green-700">{history.reps}</p>
                        <p className="text-gray-600">Reps</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-green-700">{history.weight} kg</p>
                        <p className="text-gray-600">Weight</p>
                    </div>
                    {history.comment && (
                        <div className="col-span-3 mt-2 p-2 bg-blue-50/80 rounded-lg border border-blue-200/50">
                            <h4 className="font-semibold text-blue-700">Trainer comments:</h4>
                            <p className="text-blue-600">{history.comment}</p>
                        </div>
                    )}
                </div>
            )}

            {!isDone && (
                <>
                    <button
                        className="text-blue-500 text-sm hover:text-blue-600 transition duration-300 font-medium"
                        onClick={toggleDescription}
                    >
                        {isDescriptionVisible ? 'Hide details' : 'View details'}
                    </button>
                    {isDescriptionVisible && (
                        <p className="bg-blue-50/50 text-sm text-gray-700 p-3 rounded-lg border border-blue-200/30">
                            {exercise.description}
                        </p>
                    )}
                    <p className="text-gray-600 font-medium">
                        Target: {exercise.sets} sets x {exercise.reps} reps
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="number"
                            value={sets}
                            onChange={handleInputChange(setSets)}
                            placeholder="Sets"
                            className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            value={reps}
                            onChange={handleInputChange(setReps)}
                            placeholder="Reps"
                            className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            value={weight}
                            onChange={handleInputChange(setWeight)}
                            placeholder="Weight (kg)"
                            className="w-full p-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 shadow-md transition duration-300 font-semibold"
                        onClick={handleCompleteExercise}
                    >
                        Mark as Complete
                    </button>
                </>
            )}

            {!isDone && (
                <p className="text-sm font-medium text-orange-500">
                    Pending
                </p>
            )}
        </div>
    );
}

export default ExerciseCard;
