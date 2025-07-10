import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';

const Profile: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',  // Send cookies with the request
                });

                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const data = await response.json();
                    setUsername(data.username);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8081/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleArrowBack = () => {
        navigate('/home');
    }

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

            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Profile</h1>
                    <p className="text-gray-600">Manage your account settings</p>
                </div>

                {/* Profile Card */}
                <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Profile Icon */}
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                            <FaUserCircle className="text-6xl text-orange-500" />
                        </div>

                        {/* Welcome Message */}
                        <div className="text-center">
                            {username ? (
                                <p className="text-xl font-semibold text-gray-800">Welcome, {username}!</p>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                                    <p className="text-lg text-gray-600">Loading...</p>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;