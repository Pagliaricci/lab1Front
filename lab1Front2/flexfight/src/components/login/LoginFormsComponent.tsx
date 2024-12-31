import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InputTextComponent from './LoginInputTextComponent';
import ButtonComponent from './LoginButtonComponent';
import { toast } from 'react-toastify';

const LoginFormsComponent: React.FC = () => {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleSubmitClick = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent form from refreshing the page

        const payload = {
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
        };

        try {
            if (!payload.username || !payload.password) {
                toast.error('Please fill in all fields.');
                return;
            }

            const response = await fetch('http://localhost:8081/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',  // Include cookies with the request
            });

            if (!response.ok) {
                toast.error(`Error while logging in`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            const data = await response.json();
            toast.success(`Welcome, ${data.username}!`, {
                position: "top-center",  // Position of the toast (e.g., top-right, top-left, bottom-left, bottom-right)
                autoClose: 5000,        // Auto close after 5 seconds
                hideProgressBar: false, // Optionally hide progress bar
                closeOnClick: true,     // Close on click
                pauseOnHover: true,     // Pause on hover
                draggable: true,        // Enable dragging the toast
                progress: undefined,    // Optionally define custom progress
            });

            // Redirect to home page after successful login
            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong.');
        }
    };

    return (
        <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmitClick}
        >
            <InputTextComponent label="Username:" type="text" name="username" ref={usernameRef} />
            <InputTextComponent label="Password:" type="password" name="password" ref={passwordRef} />
            <div className="flex items-center justify-between">
                <ButtonComponent type="submit" text="Login" variant="primary" />
            </div>
            <div className="flex items-center justify-between">
                <ButtonComponent type="button" text="Sign up" variant="secondary" onclick={handleSignUpClick} />
            </div>
        </form>
    );
};

export default LoginFormsComponent;