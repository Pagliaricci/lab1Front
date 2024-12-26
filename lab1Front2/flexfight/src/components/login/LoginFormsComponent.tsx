import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InputTextComponent from './LoginInputTextComponent';
import ButtonComponent from './LoginButtonComponent';

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
                alert('Please fill in all fields.');
                return;
            }
            const response = await fetch('http://localhost:8081/users/login', {
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
            alert(message); // "Login successful"
            // Uncomment the line below to navigate on success
            // navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        }
    };

    return (
        <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmitClick} // Attach to onSubmit instead of onClick
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
