import React, { useRef, useState, useEffect } from 'react';
import InputTextComponent from '../login/LoginInputTextComponent';
import SwitchComponent from '../signup/SignUpSwitch';
import WeekCardComponent from '../createRoutine/WeekCardComponent';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CRFormsComponent: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const [duration, setDuration] = useState(1);
    const [intensity, setIntensity] = useState('3 times per week');
    const [exercises, setExercises] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userData = await response.json();
                setUserId(userData.userID);
                setUserRole(userData.role);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    const handleArrowBack = () => {
        navigate('/home');
    };

    const handleCreateRoutine = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (!userId) {
            toast.error('User ID not found. Please try again.');
            setIsLoading(false);
            return;
        }

        // Generate the exercises array dynamically based on the week/day
        const exercisesPayload = exercises.map((exercise) => ({
            exerciseId: exercise.id,
            sets: exercise.sets.toString(),
            reps: exercise.reps.toString(),
            day: exercise.day,
        }));

        // Create the routine payload
        const payload = {
            name: nameRef.current?.value,
            duration,
            intensity,
            price: userRole === 'Trainer' ? price : 0,
            creator: userId,
            exercises: exercisesPayload,
        };

        try {
            const response = await fetch('http://localhost:8081/api/routines/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
                setIsLoading(false);
                return;
            }

            const message = await response.text();
            toast.success(message);
            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong.');
            setIsLoading(false);
        }
    };

    const incrementDuration = () => {
        if (duration < 4) setDuration(duration + 1);
    };

    const decrementDuration = () => {
        if (duration > 1) setDuration(duration - 1);
    };

    const weekContainerHeight = duration * 220;

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
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-orange-600 mb-2">
                            Create {userRole === 'Trainer' ? 'Course' : 'Routine'}
                        </h1>
                        <p className="text-gray-600">Design your perfect workout plan</p>
                    </div>

                    {/* Main Form */}
                    <form 
                        className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 space-y-6 border border-orange-100/50"
                        onSubmit={handleCreateRoutine}
                    >
                        {/* Course/Routine Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Name of the {userRole === 'Trainer' ? 'Course' : 'Routine'}:
                            </label>
                            <input
                                ref={nameRef}
                                type="text"
                                name="name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder={`Enter ${userRole === 'Trainer' ? 'course' : 'routine'} name`}
                                required
                            />
                        </div>

                        {/* Duration Controls */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Duration:</label>
                            <div className="flex items-center justify-center space-x-1 bg-orange-50 rounded-xl p-1 w-fit mx-auto border border-orange-200">
                                <button
                                    type="button"
                                    className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                                        duration <= 1 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white shadow-sm border border-orange-200'
                                    }`}
                                    onClick={decrementDuration}
                                    disabled={duration <= 1}
                                >
                                    -
                                </button>
                                
                                <div className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold min-w-[120px] text-center shadow-sm">
                                    {duration} {duration === 1 ? 'week' : 'weeks'}
                                </div>
                                
                                <button
                                    type="button"
                                    className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                                        duration >= 4 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white shadow-sm border border-orange-200'
                                    }`}
                                    onClick={incrementDuration}
                                    disabled={duration >= 4}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Intensity Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Intensity:</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['3 times per week', '5 times per week', '7 times per week', 'Custom'].map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setIntensity(option)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            intensity === option
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Field for Trainers */}
                        {userRole === 'Trainer' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    Course Price:
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={price ?? ''}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Week Cards Container */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Weekly Schedule
                            </h3>
                            <div 
                                className="overflow-y-auto transition-all duration-300 space-y-4 max-h-96 bg-gray-50/50 rounded-xl p-4 border border-gray-200"
                                style={{maxHeight: `${weekContainerHeight}px`}}
                            >
                                {Array.from({length: duration}, (_, index) => (
                                    <WeekCardComponent
                                        key={index}
                                        weekNumber={index + 1}
                                        startDay={(index * 7) + 1}
                                        setExercises={setExercises}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating {userRole === 'Trainer' ? 'Course' : 'Routine'}...
                                    </div>
                                ) : (
                                    `Create ${userRole === 'Trainer' ? 'Course' : 'Routine'}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CRFormsComponent;