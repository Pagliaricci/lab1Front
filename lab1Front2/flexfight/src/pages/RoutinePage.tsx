// RoutinePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import ExerciseSlider from '../components/activeRoutine/ExerciseSlider';
import Button from '../components/activeRoutine/Button';

interface Routine {
    id: string;
    name: string;
    duration: number;
    intensity: string;
    exercises: Exercise[];
}

interface Exercise {
    name: string;
    description: string;
    sets: string;
    reps: string;
    day: number;
}

const RoutinePage: React.FC = () => {
    const { routineId } = useParams<{ routineId: string }>();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoutineDetails();
    }, [routineId]);

    const fetchRoutineDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/routines/${routineId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch routine details');
            }
            const data = await response.json();
            setRoutine(data);
            setSelectedExercises(data.exercises);
        } catch (error) {
            console.error('Error fetching routine details:', error);
        }
    };

    const handleDayChange = (day: number) => {
        // Update selected exercises based on the selected day
        const exercisesForDay = routine?.exercises.filter(exercise => exercise.day === day) || [];
        setSelectedExercises(exercisesForDay);
    };

const handleSubscribe = async (): Promise<void> => {
    // Handle subscription logic here
    console.log('Subscribed to the course');
    return Promise.resolve();
};

    const handleArrowBack = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gray-800 p-6 flex justify-center items-center">
            <div className="w-full max-w-xl bg-gray-900 p-8 rounded-lg shadow-lg">
                <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                    <TiArrowBackOutline size={40} onClick={handleArrowBack} />
                </div>
                <h1 className="text-3xl font-bold text-white text-center mb-6">{routine?.name}</h1>

                <form className="bg-gray-800 p-6 rounded-lg space-y-6">
                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">
                            Routine Name
                        </label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine?.name}
                        </div>
                    </div>

                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">
                            Duration (Weeks)
                        </label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine?.duration} Weeks
                        </div>
                    </div>

                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">
                            Intensity
                        </label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine?.intensity}
                        </div>
                    </div>

                    <ExerciseSlider
                        duration={routine?.duration || 0}
                        exercisesByDay={{}} // Pass the appropriate exercisesByDay data
                        onDayChange={handleDayChange}
                    />

                    <div className="text-center mt-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">Exercises for Selected Day</h2>
                        {selectedExercises.length > 0 ? (
                            <ul className="space-y-4">
                                {selectedExercises.map((exercise, index) => (
                                    <li key={index} className="bg-gray-700 text-white p-4 rounded-lg">
                                        <h3 className="font-bold">{exercise.name}</h3>
                                        <p>{exercise.description}</p>
                                        <p>
                                            Sets: {exercise.sets}, Reps: {exercise.reps}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No exercises for this day.</p>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button label="Subscribe to this course" onClick={handleSubscribe} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoutinePage;