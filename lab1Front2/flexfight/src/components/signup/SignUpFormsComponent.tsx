import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiCalendar } from 'react-icons/fi';

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
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAccount = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

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
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
                setIsLoading(false);
                return;
            }

            const message = await response.text();
            toast.success(message);
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong.');
            setIsLoading(false);
        }
    };

    const handleLoginButton = () => {
        navigate('/login');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const invalidKeys = ['e', 'E', '+', '-', '.'];
        if (invalidKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form 
                className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-200/20" 
                onSubmit={handleCreateAccount}
            >
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
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
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
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
                                placeholder="Create a strong password"
                                required
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
                </div>

                {/* Physical Information Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Physical Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Weight */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Weight (kg)
                            </label>
                            <input
                                ref={weightRef}
                                type="text"
                                name="weight"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="70"
                                onKeyPress={handleKeyPress}
                                pattern="\d*"
                            />
                        </div>

                        {/* Height */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                                Height (cm)
                            </label>
                            <input
                                ref={heightRef}
                                type="text"
                                name="height"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="175"
                                onKeyPress={handleKeyPress}
                                pattern="\d*"
                            />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">
                            Date of Birth
                        </label>
                        <div className="flex space-x-2">
                            <input
                                ref={dayRef}
                                className="w-1/3 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                type="text"
                                name="day"
                                placeholder="DD"
                                maxLength={2}
                                onKeyDown={handleKeyDown}
                            />
                            <input
                                ref={monthRef}
                                className="w-1/3 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                type="text"
                                name="month"
                                placeholder="MM"
                                maxLength={2}
                                onKeyDown={handleKeyDown}
                            />
                            <input
                                ref={yearRef}
                                className="w-1/3 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                type="text"
                                name="year"
                                placeholder="YYYY"
                                maxLength={4}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>

                {/* Role and Gender Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Additional Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Role</label>
                            <div className="flex space-x-2">
                                {['User', 'Trainer'].map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setRole(option)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            role === option
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Gender</label>
                            <div className="flex space-x-2">
                                {['Male', 'Female'].map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setGender(option)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            gender === option
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLoginButton}
                        className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                    >
                        Sign In Instead
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUpFormsComponent;