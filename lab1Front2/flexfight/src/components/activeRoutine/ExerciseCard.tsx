import { useState } from 'react';
import { FullProgressExercise } from '../../pages/ActiveRoutine';

interface ExerciseCardProps {
    exercise: FullProgressExercise;
}


const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [sets, setSets] = useState<number | ''>('');
    const [reps, setReps] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [isDone, setIsDone] = useState(exercise.isDone);


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
                sets: sets,
                reps: reps,
                weight: weight,
                day: exercise.day,
            }
            const response = await fetch('http://localhost:8081/api/progress/complete-exercise', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(completedExercise),
            });
            if (response.ok) {
                setIsDone(true);
            }
        } catch (error) {
            console.error('Error completing exercise:', error);
        }
    };

    return (
        <div className={`p-6 rounded-lg shadow-lg flex flex-col space-y-6 ${isDone ? 'bg-green-500' : 'bg-gray-800'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold ${isDone ? 'text-white' : 'text-gray-200'}`}>
                    {exercise.name}
                </h3>
                {!isDone && (
                    <button
                        className="text-blue-400 text-sm hover:text-blue-500 transition duration-300"
                        onClick={toggleDescription}
                    >
                        {isDescriptionVisible ? 'Hide details' : 'View details'}
                    </button>
                )}
            </div>

            {/* Description */}
            {isDescriptionVisible && !isDone && (
                <div className="bg-gray-700 p-3 rounded-lg text-gray-200 text-sm">
                    {exercise.description}
                </div>
            )}

            {/* Target Info */}
            {!isDone && (
                <div className="text-gray-300">
                    <p className="text-lg font-semibold">
                        Target:
                    </p>
                    <p className="mt-1">
                        {exercise.sets} sets x {exercise.reps} reps
                    </p>
                </div>
            )}

            {/* Inputs */}
            {!isDone && (
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Sets</label>
                        <input
                            type="number"
                            value={sets}
                            onChange={handleInputChange(setSets)}
                            placeholder="0"
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Reps</label>
                        <input
                            type="number"
                            value={reps}
                            onChange={handleInputChange(setReps)}
                            placeholder="0"
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={handleInputChange(setWeight)}
                            placeholder="0"
                            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Complete Button */}
            {!isDone && (
                <button
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 shadow-md transition duration-300"
                    onClick={handleCompleteExercise}
                >
                    Mark as Complete
                </button>
            )}

            {/* Pending Status */}
            {!isDone && (
                <p className="text-center text-yellow-400 font-medium text-sm">
                    Pending
                </p>
            )}
        </div>
    );

}

export default ExerciseCard;