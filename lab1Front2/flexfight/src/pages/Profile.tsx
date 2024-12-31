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
        <div className="relative min-h-screen bg-gray-700">
 <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
    <TiArrowBackOutline size={40} onClick={handleArrowBack} />
</div>
            <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
                <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex justify-center">
                        <FaUserCircle className="text-8xl text-gray-500 mb-4" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Profile</h1>
                    {username ? (
                        <p className="text-lg mb-4">Welcome, {username}!</p>
                    ) : (
                        <p className="text-lg mb-4">Loading...</p>
                    )}
                    <div className="flex flex-col items-center space-y-4">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center transition-transform duration-300 transform hover:scale-105"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="mr-2"/> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;