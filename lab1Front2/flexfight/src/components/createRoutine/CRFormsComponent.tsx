import React, { useRef, useState } from 'react';
import InputTextComponent from '../login/LoginInputTextComponent';
import SwitchComponent from '../signup/SignUpSwitch';
import WeekCardComponent from '../createRoutine/WeekCardComponent';

const CRFormsComponent: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const [duration, setDuration] = useState(1); // Track the duration state
    const [intensity, setIntensity] = useState('3 times per week');

    const handleCreateRoutine = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            name: nameRef.current?.value,
            duration,
            intensity,
        };

        try {
            const response = await fetch('http://localhost:8081/routines/create', {
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
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
                      onSubmit={handleCreateRoutine}>
                    <InputTextComponent label="Name of the Routine:" type="text" name="name" ref={nameRef}/>
                    <div className="flex items-center mb-4">
                        <label className="mr-2">Duration:</label>
                        <button
                            type="button"
                            className={`py-2 px-4 rounded-l font-bold ${
                                duration <= 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
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
                            className={`py-2 px-4 rounded-r font-bold ${
                                duration >= 4 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
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
                    <div
                        className="overflow-y-auto transition-all duration-300"
                        style={{maxHeight: `${weekContainerHeight}px`}} // Dynamically adjust height
                    >
                        {Array.from({length: duration}, (_, index) => (
                            <WeekCardComponent
                                key={index}
                                weekNumber={index + 1}
                                startDay={(index * 7) + 1} // Pass the starting day number for each week
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
