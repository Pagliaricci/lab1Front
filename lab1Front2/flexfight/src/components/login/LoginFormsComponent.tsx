import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const LoginFormsComponent: React.FC = () => {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleSubmitClick = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const payload = {
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
        };

        try {
            if (!payload.username || !payload.password) {
                toast.error('Please fill in all fields.');
                setIsLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8081/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (!response.ok) {
                // Custom error for unregistered user
                toast.error(
                    <div className="flex items-center gap-2">
                        <FiUser className="text-rose-500 text-lg" />
                        <span>No account found with that username. Please register first.</span>
                    </div>,
                    {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        style: {
                            background: '#FEE2E2', // rojo pastel
                            color: '#991B1B', // rojo apagado
                            borderRadius: '0.75rem',
                            border: '1px solid #FCA5A5',
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                            textAlign: 'center',
                        },
                        icon: false,
                    }
                );
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            toast.success(
                <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 text-lg" />
                    <span className="text-green-700">Welcome, {data.username}!</span>
                </div>,
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    style: {
                        background: '#DCFCE7', // verde pastel
                        color: '#166534', // verde apagado
                        borderRadius: '0.75rem',
                        border: '1px solid #86EFAC',
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                    },
                    icon: false,
                }
            );

            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong.');
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form
                className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-200/20"
                onSubmit={handleSubmitClick}
            >
                {/* Username Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                        Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            ref={usernameRef}
                            type="text"
                            name="username"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            ref={passwordRef}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing in...
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                    </div>
                </div>

                {/* Sign Up Button */}
                <button
                    type="button"
                    onClick={handleSignUpClick}
                    className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default LoginFormsComponent;