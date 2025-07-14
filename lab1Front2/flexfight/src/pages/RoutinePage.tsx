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
            const { id } = useParams<{ id: string }>();
            const [routine, setRoutine] = useState<Routine | null>(null);
            const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
            const [error, setError] = useState<string | null>(null);
            const navigate = useNavigate();

            useEffect(() => {
                fetchRoutineDetails();
            }, [id]);

            const fetchRoutineDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:8081/api/routines/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch routine details');
                    }
                    const data = await response.json();
                    if (!data) {
                        setError('Routine not found.');
                        setRoutine(null);
                        setSelectedExercises([]);
                        return;
                    }
                    setRoutine(data);
                    // Si no hay exercises, setear array vacío
                    setSelectedExercises(Array.isArray(data.exercises) ? data.exercises : []);
                    setError(null);
                } catch (error) {
                    setError('Error fetching routine details.');
                    setRoutine(null);
                    setSelectedExercises([]);
                }
            };

            const handleDayChange = (day: number) => {
                // Si no hay exercises, devolver array vacío
                const exercisesForDay = Array.isArray(routine?.exercises)
                    ? routine?.exercises.filter(exercise => exercise.day === day)
                    : [];
                setSelectedExercises(exercisesForDay);
            };

            const handleSubscribe = async (): Promise<void> => {
                console.log('Subscribed to the course');
                return Promise.resolve();
            };

            const handleArrowBack = () => {
                navigate('/home');
            };

            return (
                <div className="min-h-screen bg-orange-50 relative overflow-hidden flex items-center justify-center py-12">
                    {/* Decorative blurred circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-200/20 rounded-full blur-2xl"></div>
                    </div>
                    <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                        <button
                            className="absolute top-6 left-6 text-orange-600 hover:text-orange-800 transition"
                            onClick={handleArrowBack}
                            aria-label="Back"
                        >
                            <TiArrowBackOutline size={36} />
                        </button>
                        {error ? (
                            <div className="flex flex-col items-center justify-center h-96">
                                <h2 className="text-2xl font-bold text-red-400 mb-4">{error}</h2>
                                <button
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg mt-4"
                                    onClick={handleArrowBack}
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold text-orange-600 text-center mb-8">{routine?.name}</h1>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            Routine Name
                                        </label>
                                        <div className="bg-orange-100 rounded px-4 py-2 text-gray-800 font-bold text-lg cursor-default select-none">
                                            {routine?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            Duration (Weeks)
                                        </label>
                                        <div className="bg-orange-100 rounded px-4 py-2 text-gray-800 font-bold text-lg cursor-default select-none">
                                            {routine?.duration} Weeks
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            Intensity
                                        </label>
                                        <div className="bg-orange-100 rounded px-4 py-2 text-gray-800 font-bold text-lg cursor-default select-none">
                                            {routine?.intensity}
                                        </div>
                                    </div>
                                    <ExerciseSlider
                                        duration={routine?.duration || 0}
                                        exercisesByDay={{}}
                                        onDayChange={handleDayChange}
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-orange-600 mb-2">
                                            Exercises for Selected Day
                                        </h2>
                                        {selectedExercises.length > 0 ? (
                                            <ul className="space-y-3">
                                                {selectedExercises.map((exercise, index) => (
                                                    <li key={index} className="bg-orange-100 rounded p-4 text-gray-800">
                                                        <h3 className="font-bold">{exercise.name}</h3>
                                                        <p>{exercise.description}</p>
                                                        <p>
                                                            Sets: {exercise.sets}, Reps: {exercise.reps}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No exercises for this routine.</p>
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        <Button label="Subscribe to this course" onClick={handleSubscribe} />
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            );
        };

        export default RoutinePage;