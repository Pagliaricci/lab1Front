import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import ExerciseSlider from '../components/activeRoutine/ExerciseSlider';
import Button from '../components/activeRoutine/Button';
import ExerciseCard from '../components/activeRoutine/ExerciseCard';
import RateRoutineCard from '../components/activeRoutine/RateRoutineCard';
import { toast } from 'react-toastify';

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
    comments: string;
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
                    toast.success('Routine started!');
                    fetchProgress(routine.id, userId);
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
                toast.success('Routine rated successfully!');
                navigate('/home');
            } else {
                setError('Failed to rate routine');
            }
        } catch (err) {
            console.error('Error rating routine:', err);
            setError('Failed to rate routine');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex justify-center items-center">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-gray-600 text-center mt-4">Loading routine...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-orange-50 flex justify-center items-center">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
                    <p className="text-red-600 text-center">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (routineProgress) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl"></div>
                </div>

                {/* Back Button */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={handleArrowBack}
                        className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-orange-200/30"
                    >
                        <TiArrowBackOutline className="text-xl text-orange-600" />
                    </button>
                </div>

                <div className="flex justify-center items-center min-h-screen p-6">
                    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                        {/* Header */}
                        <div className="text-center ">
                            <h1 className="text-4xl font-bold text-orange-600 mb-2">
                                Let's Workout!
                            </h1>
                            <div className="bg-orange-500 px-4 py-2 rounded-full inline-block">
                                <span className="text-white font-semibold">Day {routineProgress.day}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {allDayExercisesDone && !allRoutineExercisesDone && (
                                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl text-center">
                                    <h3 className="text-xl font-bold text-orange-600 mb-2">Great Job!</h3>
                                    <p className="text-gray-600 mb-4">All exercises completed for today!</p>
                                    <div className="flex justify-center space-x-3 mb-4">
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                                `I completed ${progressExercises[routineProgress.day]?.length || 0} exercises today! 💪 #FitnessJourney #FlexFight`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                                        >
                                            Share on X
                                        </a>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                `https://yourwebsite.com?exercisesDone=${progressExercises[routineProgress.day]?.length || 0}`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                                        >
                                            Share on Facebook
                                        </a>
                                    </div>
                                    <button
                                        onClick={handleArrowBack}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Go Back Home
                                    </button>
                                </div>
                            )}

                            {allRoutineExercisesDone && (
                                <div className="bg-green-50/80 border border-green-200/50 p-6 rounded-xl text-center">
                                    <div className="text-4xl mb-3">🏆</div>
                                    <h3 className="text-xl font-bold text-green-700 mb-2">Congratulations!</h3>
                                    <p className="text-green-600 mb-4">You've completed the entire routine!</p>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Finish & Rate Routine
                                    </button>
                                </div>
                            )}

                            {!allDayExercisesDone && (
                                <div className="space-y-4">
                                    {progressExercises[routineProgress.day]?.map((exercise) => (
                                        <ExerciseCard
                                            key={exercise.routineExerciseId}
                                            exercise={exercise}
                                            onComplete={() => {
                                                const updatedProgress = { ...progressExercises };
                                                updatedProgress[routineProgress.day] = updatedProgress[routineProgress.day].map(e =>
                                                    e.routineExerciseId === exercise.routineExerciseId ? { ...e, isDone: true } : e
                                                );
                                                setProgressExercises(updatedProgress);
                                                checkEndOfRoutine(updatedProgress);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rating Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-100/50">
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl"></div>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={handleArrowBack}
                    className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-orange-200/30"
                >
                    <TiArrowBackOutline className="text-xl text-orange-600" />
                </button>
            </div>

            <div className="flex justify-center items-center min-h-screen p-6">
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-orange-600 mb-2">{routine?.name}</h1>
                        <p className="text-gray-600">Design your perfect workout plan</p>
                    </div>

                    {/* Routine Details */}
                    <div className="space-y-6">
                        {/* Routine Name Card */}
                        <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-200/50 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 text-gray-800">Routine Name</h3>
                                    <p className="text-2xl font-bold text-orange-600">{routine?.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Duration and Intensity Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1 text-blue-600">Duration</h3>
                                        <p className="text-xl font-bold text-blue-800">{routine?.duration} Weeks</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50/80 rounded-xl p-6 border border-orange-200/50 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1 text-orange-600">Intensity</h3>
                                        <p className="text-xl font-bold text-orange-800">{routine?.intensity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exercise Slider */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-blue-200/30 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center">
                                Select Day to Preview
                            </h3>
                            <ExerciseSlider
                                duration={routine?.duration || 0}
                                exercisesByDay={exercisesByDay}
                                onDayChange={handleDayChange}
                            />
                        </div>

                        {/* Exercises Preview */}
                        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                                Exercises Preview
                            </h2>
                            {selectedExercises.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedExercises.map((exercise, index) => (
                                        <div key={index} className="bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-orange-200/30">
                                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">{exercise.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                                            <div className="flex gap-3">
                                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Sets: {exercise.sets}
                                                </div>
                                                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Reps: {exercise.reps}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No exercises scheduled for this day</p>
                                    <p className="text-gray-400 text-sm mt-2">Select a different day to see exercises</p>
                                </div>
                            )}
                        </div>

                        {/* Start Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                onClick={handleStartRoutine}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                Start Routine
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveRoutine;