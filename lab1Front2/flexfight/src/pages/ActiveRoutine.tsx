import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import ExerciseSlider from '../components/activeRoutine/ExerciseSlider';
import Button from '../components/activeRoutine/Button';
import ExerciseCard from '../components/activeRoutine/ExerciseCard';
import RateRoutineCard from '../components/activeRoutine/RateRoutineCard';

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

export interface FullProgressExercise {
    routineExerciseId: string;
    name: string;
    category: string;
    description: string;
    userId: string;
    routineId: string;
    sets: number;
    reps: number;
    day: number;
    isDone: boolean;
    date: Date;
}

interface RoutineProgress {
    id: string;
    userId: string;
    routineId: string;
    day: number;
    amountOfExercisesDone: number;
    initiationDate: Date;
}

export function checkIfAllRoutineExercisesDone(
    progressExercises: Record<number, FullProgressExercise[]>
): boolean {
    return Object.values(progressExercises).flat().every(exercise => exercise.isDone);
}

export function checkIfAllDayExercisesDone(
    routineProgress: RoutineProgress | null,
    progressExercises: Record<number, FullProgressExercise[]>
): boolean {
    if (!routineProgress) return false;
    return progressExercises[routineProgress.day]?.every(exercise => exercise.isDone) ?? false;
}

const ActiveRoutine: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [routine, setRoutine] = useState<FullRoutine | null>(null);
    const [exercisesByDay, setExercisesByDay] = useState<Record<number, FullRoutineExercise[]>>({});
    const [progressExercises, setProgressExercises] = useState<Record<number, FullProgressExercise[]>>({});
    const [selectedExercises, setSelectedExercises] = useState<FullRoutineExercise[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [routineProgress, setRoutineProgress] = useState<RoutineProgress | null>(null);
    const [allRoutineExercisesDone, setAllRoutineExercisesDone] = useState(false);
    const [allDayExercisesDone, setAllDayExercisesDone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);

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
                setUserId(userData.userID);

                const routineResponse = await fetch(`http://localhost:8081/api/routines/getActive?userId=${userData.userID}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (routineResponse.ok) {
                    const routine = await routineResponse.json();
                    const routineData: FullRoutine = {
                        id: routine.id,
                        name: routine.name,
                        duration: routine.duration,
                        intensity: routine.intensity,
                        exercises: routine.exercises,
                    };
                    setRoutine(routineData);

                    const exercisesByDayMap: Record<number, FullRoutineExercise[]> = {};
                    routineData.exercises.forEach((exercise) => {
                        if (!exercisesByDayMap[exercise.day]) {
                            exercisesByDayMap[exercise.day] = [];
                        }
                        exercisesByDayMap[exercise.day].push(exercise);
                    });
                    setExercisesByDay(exercisesByDayMap);

                    fetchProgress(routineData.id, userData.userID);
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

    async function fetchProgressExercises(routineId: string, userId: string) {
        try {
            const progressExercisesResponse = await fetch(
                'http://localhost:8081/api/progress/get-exercise-progress',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ routineId, userId }),
                }
            );
            if (progressExercisesResponse.ok) {
                const progressExercisesData: FullProgressExercise[] = await progressExercisesResponse.json();
                const progressExercisesMap: Record<number, FullProgressExercise[]> = {};
                progressExercisesData.forEach((exercise) => {
                    if (!progressExercisesMap[exercise.day]) {
                        progressExercisesMap[exercise.day] = [];
                    }
                    progressExercisesMap[exercise.day].push(exercise);
                });
                setProgressExercises(progressExercisesMap);
            } else {
                setProgressExercises({});
            }
        } catch (err) {
            console.error('Error fetching progress exercises:', err);
        }
    }

    const fetchProgress = async (routineId: string, userId: string) => {
        try {
            const progressResponse = await fetch(
                'http://localhost:8081/api/progress/get-routine-progress',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ routineId, userId }),
                }
            );

            if (progressResponse.ok) {
                const progressData: RoutineProgress = await progressResponse.json();
                setRoutineProgress(progressData);
                fetchProgressExercises(routineId, userId);
            } else {
                setRoutineProgress(null);
            }
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    const handleArrowBack = () => {
        navigate('/home');
    };

    const handleStartRoutine = async () => {
        if (routine && userId) {
            try {
                const response = await fetch('http://localhost:8081/api/progress/start-routine', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ routineId: routine.id, userId }),
                });

                if (response.ok) {
                    alert('Routine started!');
                    fetchProgress(routine.id, userId); // Fetch progress after starting
                } else {
                    setError('Failed to start routine');
                }
            } catch (err) {
                console.error('Error starting routine:', err);
                setError('Failed to start routine');
            }
        }
    };

    const checkEndOfRoutine = async (updatedProgress: Record<number, FullProgressExercise[]>) => {
        if (updatedProgress) {
            const allRoutineDone = checkIfAllRoutineExercisesDone(updatedProgress);
            const allDayDone = checkIfAllDayExercisesDone(routineProgress, updatedProgress);
            setAllRoutineExercisesDone(allRoutineDone);
            setAllDayExercisesDone(allDayDone);
        }
    }

    const handleDayChange = (day: number) => {
        if (exercisesByDay[day]) {
            setSelectedExercises(exercisesByDay[day]);
        } else {
            setSelectedExercises([]);
        }
    };

    useEffect(() => {
        if (routineProgress) {
            const allRoutineDone = checkIfAllRoutineExercisesDone(progressExercises);
            const allDayDone = checkIfAllDayExercisesDone(routineProgress, progressExercises);
            setAllRoutineExercisesDone(allRoutineDone);
            setAllDayExercisesDone(allDayDone);
        }
    }, [progressExercises, routineProgress]);

    const handleRatingSubmit = async (routineId: string, rating: number) => {
        try {
            const response = await fetch('http://localhost:8081/api/routines/rate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, routineId, rating }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                navigate('/home', { state: { successMessage: 'Routine rated successfully!' } });
            } else {
                setError('Failed to rate routine');
            }
        } catch (err) {
            console.error('Error rating routine:', err);
            setError('Failed to rate routine');
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (routineProgress) {
        return (
            <div className="min-h-screen bg-gray-800 flex justify-center items-center">
                <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                    <TiArrowBackOutline size={40} onClick={handleArrowBack} />
                </div>
                <div className="w-full max-w-xl bg-gray-900 p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">
                        Let's do some exercises!
                    </h1>
                    <h2 className="text-2xl font-semibold text-white text-center mb-4">
                        Day {routineProgress.day}
                    </h2>
                    <div className="m-2 space-y-4">
                        {allDayExercisesDone && !allRoutineExercisesDone && (
                            <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow-lg">
                                <h3 className="text-xl font-bold">Good Job!</h3>
                                <p>All exercises done for the day.</p>
                            </div>
                        )}
                        {allRoutineExercisesDone && (
                            <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-lg">
                                <h3 className="text-xl font-bold">Congratulations!</h3>
                                <p>All exercises of the routine are completed.</p>
                                <button
                                    className="py-2 px-4 bg-green-700 hover:bg-green-900 text-white font-bold rounded mt-4"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Finish Routine
                                </button>
                            </div>
                        )}
                        {!allDayExercisesDone && progressExercises[routineProgress.day]?.map((exercise) => (
                            <ExerciseCard
                                key={exercise.routineExerciseId}
                                exercise={exercise}
                                onComplete={() => {
                                    const updatedProgress = { ...progressExercises }; // Copy progress
                                    updatedProgress[routineProgress.day] = updatedProgress[routineProgress.day].map(e =>
                                        e.routineExerciseId === exercise.routineExerciseId ? { ...e, isDone: true } : e
                                    );
                                    setProgressExercises(updatedProgress);
                                    checkEndOfRoutine(updatedProgress);
                                }}
                            />
                        ))}
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <RateRoutineCard
                                routineId={routine?.id || ''}
                                onSubmitRating={handleRatingSubmit}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 p-6 flex justify-center items-center">
            <div className="w-full max-w-xl bg-gray-900 p-8 rounded-lg shadow-lg">
                <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                    <TiArrowBackOutline size={40} onClick={handleArrowBack}/>
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
                        exercisesByDay={exercisesByDay}
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
                        <Button label="Start Routine" onClick={handleStartRoutine} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActiveRoutine;