import { useEffect, useState } from 'react';
import HomeButton from '../components/home/HomeButton';
import { FaDumbbell, FaSave } from 'react-icons/fa';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoStatsChart } from "react-icons/io5";


function Home() {
    const navigate = useNavigate();
    const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
    const [routineProgress, setRoutineProgress] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | 1>(1);


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
                    fetchActiveRoutine(userData.userID);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                navigate('/login');
            }
        };

        const fetchActiveRoutine = async (userId: string) => {
            try {
                const response = await fetch(`http://localhost:8081/api/routines/getActive?userId=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const routine = await response.json();
                    setActiveRoutine(routine?.name || null);
                    console.log(routine);
                    console.log(routine?.duration);
                    setDuration(routine?.duration || 1);
                    if (routine) {
                        fetchRoutineProgress(userId, routine.id);
                    }
                } else {
                    console.error('No active routine found');
                    setActiveRoutine(null);
                }
            } catch (error) {
                console.error('Error fetching active routine:', error);
                setActiveRoutine(null);
            }
        };

        const fetchRoutineProgress = async (userId: string, routineId: string) => {
            try {
                const response = await fetch('http://localhost:8081/api/progress/update-progress-day', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ userId: userId,routineId: routineId, date: Date.now() }),
                });

                if (response.ok) {
                    const progress = await response.json();
                    if (progress) {
                        setRoutineProgress((progress.day / (duration * 7)) * 100); // Assuming 28 days
                    }
                } else {
                    setRoutineProgress(null); // If no progress is found
                }
            } catch (error) {
                console.error('Error fetching routine progress:', error);
                setRoutineProgress(null);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleCreateRoutine = () => {
        navigate('/create-routine');
        console.log('Create Routine clicked');
    };

    const handleSavedRoutines = () => {
        navigate('/saved-routines');
    };

    const handleSubscribeToACourse = () => {
        console.log('Subscribe to a course clicked');
    };

    const handleProfileButton = () => {
        navigate('/profile');
    };

    const handleActiveRoutine = () => {
        navigate('/active-routine');
    };
    const handleStats = () => {
        navigate('/stats');
    }

    return (
        <div className="relative min-h-screen bg-gray-800">
            {/* Profile icon */}
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
                    <div className="relative">
                        <HomeButton
                            name={activeRoutine ? activeRoutine : "Active Routine"}
                            icon={<FaRegCirclePlay />}
                            onClick={handleActiveRoutine}
                            disabled={!activeRoutine} // Disable if no active routine
                        />
                        {routineProgress !== null && (
                            <div className="absolute bottom-2 left-2 right-2 h-2 bg-gray-300 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: `${routineProgress}%` }}
                                />
                            </div>
                        )}
                    </div>
                    <HomeButton name="Create Routine" icon={<FaDumbbell />} onClick={handleCreateRoutine} />
                    <HomeButton name="Saved Routines" icon={<FaSave />} onClick={handleSavedRoutines} />
                    <HomeButton name="My Stats" icon={<IoStatsChart />} onClick={handleStats} />
                    <HomeButton name="Subscribe to a Course" icon={<HiOutlinePencilAlt />} onClick={handleSubscribeToACourse} />
                </div>
            </div>
        </div>
    );
}

export default Home;
