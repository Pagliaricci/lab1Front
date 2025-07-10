import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';

interface UserData {
    userID: string;
    username: string;
    role: string;
    email: string;
    gender: string;
    dateOfBirth: string;
}

const Profile: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
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
                <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <p className="text-lg text-gray-600 ml-3">Loading profile...</p>
                        </div>
                    ) : userData ? (
                        <div className="space-y-6">
                            {/* Profile Icon and Welcome */}
                            <div className="text-center">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200 mx-auto mb-4">
                                    <FaUserCircle className="text-6xl text-orange-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userData.username}!</h2>
                                <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {userData.role}
                                </div>
                            </div>

                            {/* User Information Grid */}
                            <div className="space-y-4">
                                {/* Username */}
                                <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                    <p className="text-sm font-medium text-orange-600 mb-1">Username</p>
                                    <p className="text-orange-800 font-semibold">{userData.username}</p>
                                </div>

                                {/* Email */}
                                <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                    <p className="text-sm font-medium text-orange-600 mb-1">Email</p>
                                    <p className="text-orange-800 font-semibold">{userData.email}</p>
                                </div>

                                {/* Gender */}
                                <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                    <p className="text-sm font-medium text-orange-600 mb-1">Gender</p>
                                    <p className="text-orange-800 font-semibold">{userData.gender}</p>
                                </div>

                                {/* Date of Birth */}
                                <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                    <p className="text-sm font-medium text-orange-600 mb-1">Date of Birth</p>
                                    <p className="text-orange-800 font-semibold">
                                        {new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center pt-4">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Failed to load profile information</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;