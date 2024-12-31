import React, { useEffect, useState } from 'react';
import RoutineCardComponent from '../components/savedRoutines/RoutineCardComponent';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

const SavedRoutines: React.FC = () => {
    const [routines, setRoutines] = useState<any[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [routineExercises, setRoutineExercises] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleArrowBack = () => {
        navigate('/home');
    };

    const fetchRoutineExercises = async (routineId: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/routines/routineExercises?routineId=${routineId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch routine exercises');
            }

            const data = await response.json();
            setRoutineExercises(data);
        } catch (error) {
            console.error('Error fetching routine exercises:', error);
        }
    };

    const handleRoutineClick = (routineId: string) => {
        if (selectedRoutine === routineId) {
            // Collapse if already selected
            setSelectedRoutine(null);
            setRoutineExercises([]);
        } else {
            // Expand and fetch exercises
            setSelectedRoutine(routineId);
            fetchRoutineExercises(routineId);
        }
    };

    useEffect(() => {
        const fetchUserAndRoutines = async () => {
            try {
                const userResponse = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userData = await userResponse.json();
                const userID = userData.userID;

                const routinesResponse = await fetch(`http://localhost:8081/api/routines/get?userID=${userID}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!routinesResponse.ok) {
                    throw new Error('Failed to fetch routines');
                }

                const routinesData = await routinesResponse.json();
                setRoutines(routinesData);
            } catch (error) {
                console.error('Error fetching user or routines:', error);
            }
        };

        fetchUserAndRoutines();
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-700">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
                <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h1 className="text-4xl font-bold mt-8 mb-8">Saved Routines</h1>
                    {routines.length > 0 ? (
                        routines.map((routine) => (
                            <div key={routine.id}>
                                <RoutineCardComponent
                                    name={routine.name}
                                    duration={routine.duration}
                                    intensity={routine.intensity}
                                    onClick={() => handleRoutineClick(routine.id)}
                                />
                                {selectedRoutine === routine.id && (
                                    <div className="mt-4 bg-gray-200 rounded-lg p-4">
                                        <h2 className="text-xl font-semibold mb-2">Exercises</h2>
                                        {routineExercises.length > 0 ? (
                                            routineExercises.map((exercise) => (
                                                <div key={exercise.id} className="mb-2">
                                                    <p>
                                                        <strong>{exercise.exercise.name}</strong>: {exercise.sets} sets x {exercise.reps} reps
                                                    </p>
                                                    <p>Day: {exercise.day}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No exercises found for this routine.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No saved routines found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedRoutines;
