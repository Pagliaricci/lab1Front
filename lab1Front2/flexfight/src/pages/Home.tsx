import { useEffect, useState } from 'react';
import HomeButton from '../components/home/HomeButton';
import { FaDumbbell, FaSave } from 'react-icons/fa';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include', // Send cookies with the request
                });

                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const userData = await response.json();
                    console.log("going to fetch user active routine")
                    fetchActiveRoutine(userData.userID);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                navigate('/login');
            }
        };

        const fetchActiveRoutine = async (userId: string) => {
            try {
                console.log(`going to look for the active routine of user ${userId}`)
                const response = await fetch(`http://localhost:8081/api/routines/getActive?userId=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                

                if (response.ok) {
                    const routine = await response.json();
                    setActiveRoutine(routine?.name || null);
                } else {
                    console.error('No active routine found');
                    setActiveRoutine(null);
                }
            } catch (error) {
                console.error('Error fetching active routine:', error);
                setActiveRoutine(null);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleCreateRoutine = () => {
        navigate('/create-routine');
        console.log('Create Routine clicked');
    };

    const handleSavedRoutines = () => {
        console.log('Saved Routines clicked');
        navigate('/saved-routines');
    };

    const handleSubscribeToACourse = () => {
        console.log('Subscribe to a course clicked');
    };

    const handleProfileButton = () => {
        navigate('/profile');
    };
    
    const handleActiveRoutine = ()=>{
        navigate('/active-routine')
    }

    return (
        <div className="relative min-h-screen bg-gray-800">
            {/* Profile icon with a higher z-index */}
            <FaUserCircle
                className="absolute top-8 right-8 text-4xl transition-transform duration-300 ease-in-out transform hover:scale-110 text-blue-500 cursor-pointer z-10"
                onClick={handleProfileButton}
            />

            {/* Content section */}
            <div className="relative flex flex-col items-center justify-center min-h-screen text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Welcome Back to Your Fitness Journey!</h1>
                <p className="text-xl mb-8">Stay consistent, and success will follow!</p>

                {/* Buttons section */}
                <div className="home flex flex-wrap gap-6 justify-center items-center">
                    <HomeButton
                        name={activeRoutine ? activeRoutine : "Active Routine"}
                        icon={<FaRegCirclePlay />}
                        onClick={handleActiveRoutine}
                        disabled={!activeRoutine} // Disable if no active routine
                    />
                    <HomeButton name="Create Routine" icon={<FaDumbbell />} onClick={handleCreateRoutine} />
                    <HomeButton name="Saved Routines" icon={<FaSave />} onClick={handleSavedRoutines} />
                    <HomeButton name="Subscribe to a Course" icon={<HiOutlinePencilAlt />} onClick={handleSubscribeToACourse} />
                </div>
            </div>
        </div>
    );
}

export default Home;
