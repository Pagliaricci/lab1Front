import React, { useRef, useState, useEffect } from 'react';
import InputTextComponent from '../login/LoginInputTextComponent';
import SwitchComponent from '../signup/SignUpSwitch';
import WeekCardComponent from '../createRoutine/WeekCardComponent';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

const CRFormsComponent: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const [duration, setDuration] = useState(1); // Track the duration state
    const [intensity, setIntensity] = useState('3 times per week');
    const [exercises, setExercises] = useState<any[]>([]); // Track exercises data
    const [userId, setUserId] = useState<string | null>(null); // Track user ID
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

    if (!userId) {
        alert('User ID not found. Please try again.');
        return;
    }

    // Generate the exercises array dynamically based on the week/day
    const exercisesPayload = exercises.map((exercise) => ({
        exerciseId: exercise.id,  // Exercise ID
        sets: exercise.sets.toString(),  // Ensure it's a string, if needed
        reps: exercise.reps.toString(),  // Ensure it's a string, if needed
        day: exercise.day,  // Use the actual day from the exercise object
    }));

    // Create the routine payload
    const payload = {
        name: nameRef.current?.value,
        duration,
        intensity,
        price: 0, // Set price as 0
        creator: userId,  // Use fetched user ID
        exercises: exercisesPayload,  // Include exercises data
    };

    try {
        const response = await fetch('http://localhost:8081/api/routines/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            alert(`Error: ${errorData}`);
            return;
        }

        const message = await response.text();
        alert(message); // "Routine created successfully"
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }
};
    // Handle incrementing and decrementing duration
    const incrementDuration = () => {
        if (duration < 4) setDuration(duration + 1);
    };

    const decrementDuration = () => {
        if (duration > 1) setDuration(duration - 1);
    };

    // Set the dynamic height for the weeks container
    const weekContainerHeight = duration * 220; // Adjust this based on your design

    return (
        <div className="w-full h-full">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack}/>
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
                      onSubmit={handleCreateRoutine}>
                    <InputTextComponent label="Name of the Routine:" type="text" name="name" ref={nameRef}/>
                    <div className="flex items-center mb-4">
                        <label className="mr-2">Duration:</label>
                        <button
                            type="button"
                            className={`py-2 px-4 rounded-l font-bold ${duration <= 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                            onClick={decrementDuration}
                            disabled={duration <= 1}
                        >
                            -
                        </button>
                        <span className="px-4 py-2 bg-white border-t border-b border-gray-300 text-gray-800">
                            {duration} {duration === 1 ? 'week' : 'weeks'}
                        </span>
                        <button
                            type="button"
                            className={`py-2 px-4 rounded-r font-bold ${duration >= 4 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                            onClick={incrementDuration}
                            disabled={duration >= 4}
                        >
                            +
                        </button>
                    </div>
                    <SwitchComponent
                        label="Intensity:"
                        options={['3 times per week', '5 times per week', '7 times per week', 'Custom']}
                        selectedOption={intensity}
                        onClick={setIntensity}
                    />

                    {/* Week Cards Container */}
                    <div className="overflow-y-auto transition-all duration-300"
                         style={{maxHeight: `${weekContainerHeight}px`}}>
                        {Array.from({length: duration}, (_, index) => (
                            <WeekCardComponent
                                key={index}
                                weekNumber={index + 1}
                                startDay={(index * 7) + 1} // Pass the starting day number for each week
                                setExercises={setExercises}  // Pass setExercises to capture the exercises
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create Routine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CRFormsComponent;