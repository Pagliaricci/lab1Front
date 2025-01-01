// src/pages/ActiveRoutine.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import ExerciseSlider from '../components/activeRoutine/ExerciseSlider';
import Button from '../components/activeRoutine/Button';

interface FullRoutineExercise {
    name: string;
    description: string;
    sets: string;
    reps: string;
    day: number;
}

interface FullRoutine {
    id: string;
    name: string;
    duration: number;
    intensity: string;
    exercises: FullRoutineExercise[];
}

const ActiveRoutine: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [routine, setRoutine] = useState<FullRoutine | null>(null);
    const [exercisesForDay, setExercisesForDay] = useState<FullRoutineExercise[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const authResponse = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (authResponse.status === 401) {
                    navigate('/login');
                    return;
                }

                const userData = await authResponse.json();
                const userId = userData.userID;

                const routineResponse = await fetch(`http://localhost:8081/api/routines/getActive?userId=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (routineResponse.ok) {
                    const routineData: FullRoutine = await routineResponse.json();
                    setRoutine(routineData);
                } else {
                    setRoutine(null);
                }
            } catch (err) {
                console.error('Error fetching routine:', err);
                setError('Failed to fetch routine');
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, [navigate]);

    const handleStartRoutine = () => {
        alert('Routine started!');
    };

    const handleArrowBack = () => {
        navigate('/home');
    };

    const handleDayChange = (day: number) => {
        if (routine) {
            const exercisesForSelectedDay = routine.exercises.filter(exercise => exercise.day === day);
            setExercisesForDay(exercisesForSelectedDay);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    if (!routine) return <p>No active routine found</p>;

    // Map exercises to days
    const exercisesByDay: Record<number, FullRoutineExercise[]> = {};
    routine.exercises.forEach((exercise) => {
        if (!exercisesByDay[exercise.day]) {
            exercisesByDay[exercise.day] = [];
        }
        exercisesByDay[exercise.day].push(exercise);
    });

    return (
        <div className="min-h-screen bg-gray-800 p-6 flex justify-center items-center">
            <div className="w-full max-w-xl bg-gray-900 p-8 rounded-lg shadow-lg">
                <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                    <TiArrowBackOutline size={40} onClick={handleArrowBack} />
                </div>
                <h1 className="text-3xl font-bold text-white text-center mb-6">{routine.name}</h1>

                <form className="bg-gray-800 p-6 rounded-lg space-y-6">
                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">Routine Name</label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine.name}
                        </div>
                    </div>

                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">Duration (Weeks)</label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine.duration} Weeks
                        </div>
                    </div>

                    <div className="text-center">
                        <label className="block text-gray-300 text-xl font-semibold mb-2">Intensity</label>
                        <div className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full text-center">
                            {routine.intensity}
                        </div>
                    </div>

                    <ExerciseSlider duration={routine.duration} exercisesByDay={exercisesByDay} onDayChange={handleDayChange} />

                    <div className="mt-6">
                        {exercisesForDay.length > 0 ? (
                            <div>
                                {exercisesForDay.map((exercise, index) => (
                                    <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg shadow-md">
                                        <h3 className="text-xl font-semibold text-gray-100">{exercise.name}</h3>
                                        <p className="text-gray-300">{exercise.description}</p>
                                        <p className="text-gray-300">Sets: {exercise.sets} | Reps: {exercise.reps}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No exercises for this date</p>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button label="Start Routine" onClick={handleStartRoutine} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActiveRoutine;