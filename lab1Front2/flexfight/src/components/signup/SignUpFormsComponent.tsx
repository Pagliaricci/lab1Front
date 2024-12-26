import React, { useState, useRef } from 'react';
import InputTextComponent from '../login/LoginInputTextComponent';
import ButtonComponent from '../login/LoginButtonComponent';
import { useNavigate } from 'react-router-dom';
import SwitchComponent from './SignUpSwitch';
import SignUpInputComponent from './SignUpInput';
import DateOfBirthComponent from './DateOfBirthComponent';

const SignUpFormsComponent: React.FC = () => {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const weightRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const [role, setRole] = useState('User');
    const [gender, setGender] = useState('Male');

    const handleCreateAccount = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            role,
            weight: weightRef.current?.value,
            height: heightRef.current?.value,
            dateOfBirth: `${yearRef.current?.value}-${monthRef.current?.value}-${dayRef.current?.value}`,
            gender,
        };

        try {
            const response = await fetch('http://localhost:8081/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Your backend returns a string on error
                alert(`Error: ${errorData}`);
                return;
            }

            const message = await response.text();
            alert(message); // "User created successfully"
            navigate('/login'); // Redirect on success
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        }
    };

    const handleLoginButton = () => {
        navigate('/login');
    };

    return (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateAccount}>
            <InputTextComponent label="Username:" type="text" name="username" ref={usernameRef} />
            <InputTextComponent label="Password:" type="password" name="password" ref={passwordRef} />
            <InputTextComponent label="Email:" type="email" name="email" ref={emailRef} />
            <SignUpInputComponent label="Weight(kg):" name="weight" ref={weightRef} />
            <SignUpInputComponent label="Height(cm):" name="height" ref={heightRef} />
            <DateOfBirthComponent label="Date of Birth:" name="dob" dayRef={dayRef} monthRef={monthRef} yearRef={yearRef} />
            <SwitchComponent
                label="Role:"
                option1="User"
                option2="Trainer"
                selectedOption={role}
                onclick={setRole}
            />
            <SwitchComponent
                label="Gender:"
                option1="Male"
                option2="Female"
                selectedOption={gender}
                onclick={setGender}
            />
            <div className="flex items-center justify-between">
                <ButtonComponent type="submit" text="Create account" variant="primary" />
            </div>
            <div className="flex items-center justify-between">
                <ButtonComponent type="button" text="Back to login" variant="secondary" onclick={handleLoginButton} />
            </div>
        </form>
    );
};

export default SignUpFormsComponent;
