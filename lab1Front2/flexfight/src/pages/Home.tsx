import { useEffect, useState } from 'react';
import HomeButton from '../components/home/HomeButton';
import { FaDumbbell, FaSave } from 'react-icons/fa';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoStatsChart } from "react-icons/io5";
import { GrAchievement } from "react-icons/gr";
import { useLocation } from 'react-router-dom';
import { PiChatsDuotone } from "react-icons/pi";


interface LocationState {
    successMessage?: string;
}

function Home() {
    const navigate = useNavigate();
    const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
    const [routineProgress, setRoutineProgress] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | 1>(1);
    const [userRole, setUserRole] = useState<string | null>(null);
    const location = useLocation() as unknown as { state: LocationState };
    const successMessage = location.state?.successMessage || null;
    const [showMessage, setShowMessage] = useState(!!successMessage);

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => setShowMessage(false), 3000); // Ocultar después de 3s
        }
    }, [showMessage]);

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
                    setUserRole(userData.role);
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
                    const text = await response.text();
                    if (text) {
                        try {
                            const routine = JSON.parse(text);
                            setActiveRoutine(routine?.name || null);
                            setDuration(routine?.duration || 1);
                            if (routine) {
                                fetchRoutineProgress(userId, routine.id);
                            }
                        } catch (parseError) {
                            console.error('Error parsing JSON:', parseError);
                            setActiveRoutine(null);
                        }
                    } else {
                        console.log('No active routine found (empty response)');
                        setActiveRoutine(null);
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
                    body: JSON.stringify({ userId: userId, routineId: routineId, date: Date.now() }),
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
        if (userRole === 'Trainer') {
            navigate('/course-subs');
        }
        else {
            navigate('/subscribe-to-course');
        }
    };

    const handleProfileButton = () => {
        navigate('/profile');
    };

    const handleActiveRoutine = () => {
        navigate('/active-routine');
    };

    const handleStats = () => {
        navigate('/stats');
    };

    const handleChats = () => {
        navigate('/chats');
    };
    
    const handleAchievements = () => {
        navigate('/achievements');
    };

    return (
        <div className="min-h-screen bg-orange-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* Success Message */}
            {showMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-lg border border-white/20 z-50">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            {/* Header with Profile */}
            <div className="relative z-10 flex justify-between items-start p-6">
                <div></div>
                <button
                    onClick={handleProfileButton}
                    className="w-14 h-14 bg-white/80 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-white/30"
                >
                    <FaUserCircle className="text-2xl text-orange-600" />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center px-6 pb-12">
                {/* Welcome Section */}
                <div className="text-center mb-12 max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-orange-600">
                        Welcome Back
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
                        to Your Fitness Journey!
                    </h2>
                    <p className="text-lg text-gray-600 font-medium">
                        Stay consistent, and success will follow! 💪
                    </p>
                </div>

                {/* Active Routine Special Card */}
                {userRole !== 'Trainer' && (
                    <div className="w-full max-w-2xl mb-8">
                        <div className="relative">
                            <div className={`p-6 rounded-2xl backdrop-blur-lg border border-white/30 transition-all duration-300 ${
                                activeRoutine 
                                    ? 'bg-orange-500 cursor-pointer hover:bg-orange-600 hover:scale-[1.02]'
                                    : 'bg-gray-400/50'
                            }`}
                            onClick={activeRoutine ? handleActiveRoutine : undefined}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-4xl text-white">
                                            <FaRegCirclePlay />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">
                                                {activeRoutine || "No Active Routine"}
                                            </h3>
                                            <p className="text-white/80 text-sm">
                                                {activeRoutine ? "Continue your workout" : "Start a new routine"}
                                            </p>
                                        </div>
                                    </div>
                                    {routineProgress !== null && activeRoutine && (
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">
                                                {Math.round(routineProgress)}%
                                            </div>
                                            <div className="text-white/80 text-xs">Complete</div>
                                        </div>
                                    )}
                                </div>
                                
                                {routineProgress !== null && activeRoutine && (
                                    <div className="mt-4">
                                        <div className="bg-white/30 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                                                style={{ width: `${routineProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Actions Grid */}
                <div className="w-full max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                        <HomeButton 
                            name={userRole === 'Trainer' ? "Create Course" : "Create Routine"} 
                            icon={<FaDumbbell />} 
                            onClick={handleCreateRoutine} 
                        />
                        
                        <HomeButton 
                            name={userRole === 'Trainer' ? "Saved Courses" : "Saved Routines"} 
                            icon={<FaSave />} 
                            onClick={handleSavedRoutines} 
                        />

                        <HomeButton 
                            name={userRole === 'Trainer' ? "Course Subscribers" : "Subscribe to Course"} 
                            icon={<HiOutlinePencilAlt />} 
                            onClick={handleSubscribeToACourse} 
                        />

                        {userRole !== 'Trainer' && (
                            <HomeButton 
                                name="My Stats" 
                                icon={<IoStatsChart />} 
                                onClick={handleStats} 
                            />
                        )}

                        {userRole !== 'Trainer' && (
                            <HomeButton 
                                name="Achievements" 
                                icon={<GrAchievement />} 
                                onClick={handleAchievements} 
                            />
                        )}

                        <HomeButton 
                            name="Chats" 
                            icon={<PiChatsDuotone />} 
                            onClick={handleChats} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;