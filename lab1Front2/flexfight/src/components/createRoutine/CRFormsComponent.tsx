import React, { useRef, useState } from 'react';
import InputTextComponent from '../login/LoginInputTextComponent';
import SignUpInputComponent from '../signup/SignUpInput';
import SwitchComponent from '../signup/SignUpSwitch';

const CRFormsComponent: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const durationRef = useRef<HTMLInputElement>(null);
    const [intensity, setIntensity] = useState('3 times per week');

    const handleCreateRoutine = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            name: nameRef.current?.value,
            duration: durationRef.current?.value,
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateRoutine}>
                <InputTextComponent label="Name of the Routine:" type="text" name="name" ref={nameRef} />
                <SignUpInputComponent label="Duration (in weeks):" name="duration" ref={durationRef} />
                <SwitchComponent
                    label="Intensity(a week):"
                    options={['3 days', '5 days', '7 days', 'Custom']}
                    selectedOption={intensity}
                    onClick={setIntensity}
                />
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Routine
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CRFormsComponent;