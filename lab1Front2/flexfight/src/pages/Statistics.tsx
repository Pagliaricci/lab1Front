import React, { useEffect, useState } from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SetRMComponent from '../components/stats/SetRMComponent';
import SetWeightComponent from '../components/stats/SetWeightComponent';
import DaysTrainedObjective from '../components/stats/DaysTrainedObjective';
import { toast } from 'react-toastify';

const Statistics: React.FC = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [userHeight, setUserHeight] = useState<number | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [trainingDaysByMonth, setTrainingDaysByMonth] = useState<{ [key: string]: number }>({});
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [exercisesForDate, setExercisesForDate] = useState<any[]>([]);

    const toastSuccessStyle = {
        background: '#d1fae5',
        color: '#065f46',
        fontWeight: '500',
        borderRadius: '0.375rem',
        padding: '0.75rem 1.25rem',
        boxShadow: '0 10px 15px -3px rgba(5, 31, 70, 0.1), 0 4px 6px -2px rgba(5, 31, 70, 0.05)',
    };

    const toastErrorStyle = {
        background: '#fee2e2',
        color: '#991b1b',
        fontWeight: '500',
        borderRadius: '0.375rem',
        padding: '0.75rem 1.25rem',
        boxShadow: '0 10px 15px -3px rgba(5, 31, 70, 0.1), 0 4px 6px -2px rgba(5, 31, 70, 0.05)',
    };

    const tabs = [
        { id: 'overview', label: 'Training Overview', icon: '📊' },
        { id: 'maxrep', label: 'Max Rep', icon: '💪' },
        { id: 'weight', label: 'Weight', icon: '⚖️' },
        { id: 'bmi', label: 'BMI', icon: '📏' }
    ];

    const handleArrowBack = () => {
        navigate('/home');
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const userData = await response.json();
                    setUserId(userData.userID);
                    fetchExercises(userData.userID);
                    fetchUserHeight(userData.userID);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                navigate('/login');
            }
        };

        const fetchExercises = async (id: string) => {
            try {
                const response = await fetch('http://localhost:8081/api/progress/get-user-history', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'userId': id,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setExercises(data);
                    calculateTrainingDaysByMonth(data);
                } else {
                    console.error('Error fetching exercises');
                }
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        const fetchUserHeight = async (id: string) => {
            try {
                const response = await fetch('http://localhost:8081/users/get-height', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: id }),
                });
                if (response.ok) {
                    const height = await response.json();
                    setUserHeight(height);
                } else {
                    console.error('Error fetching user height');
                }
            } catch (error) {
                console.error('Error fetching user height:', error);
            }
        };

        const calculateTrainingDaysByMonth = (exercises: any[]) => {
            const daysByMonth: { [key: string]: Set<string> } = {};

            exercises.forEach(exercise => {
                const date = new Date(exercise.date);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                if (!daysByMonth[monthKey]) {
                    daysByMonth[monthKey] = new Set();
                }
                daysByMonth[monthKey].add(date.toDateString());
            });

            const trainingDays = Object.keys(daysByMonth).reduce((acc, monthKey) => {
                acc[monthKey] = daysByMonth[monthKey].size;
                return acc;
            }, {} as { [key: string]: number });

            setTrainingDaysByMonth(trainingDays);
        };

        checkAuth();
    }, [navigate]);

    const handleSetRM = async (exerciseId: string, reps: number, weight: number) => {
        console.log('Setting RM:', exerciseId, reps, weight, userId);
        try {
            const response = await fetch('http://localhost:8081/api/rm/set-rm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: userId, exerciseId: exerciseId, reps: reps, weight: weight, date: new Date() }),
            });

            if (response.ok) {
                const oneRepMax = await response.json();
                toast.success(`1RM calculated successfully: ${oneRepMax.toFixed(2)} kg`, {
                    style: toastSuccessStyle,
                    position: 'top-center',
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`, {
                    style: toastErrorStyle,
                    position: 'top-center',
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error setting RM:', error);
        }
    };

    const handleSelectEvent = (event: any) => {
        if (selectedExercise && selectedExercise.id === event.id) {
            setSelectedExercise(null);
        } else {
            setSelectedExercise(event);
        }
    };

    const formatMonth = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return `${date.getFullYear()}-${date.toLocaleString('default', { month: 'long' })}`;
    };

    const events = exercises.map(exercise => ({
        title: exercise.exerciseName,
        start: new Date(exercise.date),
        end: new Date(exercise.date),
        allDay: true,
        ...exercise,
    }));

    const currentMonthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    const daysTrainedThisMonth = trainingDaysByMonth[currentMonthKey] || 0;

    // Calendar functions
    const handleDateClick = (value: Date) => {
        setSelectedDate(value);
        const dateString = value.toDateString();
        const exercisesOnDate = exercises.filter(exercise => 
            new Date(exercise.date).toDateString() === dateString
        );
        setExercisesForDate(exercisesOnDate);
    };

    const tileClassName = ({ date }: { date: Date }) => {
        const dateString = date.toDateString();
        const hasExercises = exercises.some(exercise => 
            new Date(exercise.date).toDateString() === dateString
        );
        return hasExercises ? 'training-day' : '';
    };

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

            <div className="flex flex-col items-center min-h-screen p-6 pt-20">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Your Fitness Statistics</h1>
                    <p className="text-gray-600">Track your progress and achievements</p>
                </div>

                {/* Tabs Navigation */}
                <div className="w-full max-w-4xl mb-6">
                    <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-2 border border-orange-100/50">
                        <div className="flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-orange-50'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="w-full max-w-6xl">
                    {/* Training Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Training Overview Section */}
                            <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Training Overview</h2>
                                
                                {/* Monthly Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-200/50">
                                        <h3 className="text-sm font-medium text-blue-600 mb-1">This Month</h3>
                                        <p className="text-2xl font-bold text-blue-800">{daysTrainedThisMonth} days</p>
                                    </div>
                                    <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                        <h3 className="text-sm font-medium text-orange-600 mb-1">Total Sessions</h3>
                                        <p className="text-2xl font-bold text-orange-800">{exercises.length}</p>
                                    </div>
                                    <div className="bg-green-50/80 rounded-lg p-4 border border-green-200/50">
                                        <h3 className="text-sm font-medium text-green-600 mb-1">Active Months</h3>
                                        <p className="text-2xl font-bold text-green-800">{Object.keys(trainingDaysByMonth).length}</p>
                                    </div>
                                    <div className="bg-purple-50/80 rounded-lg p-4 border border-purple-200/50">
                                        <h3 className="text-sm font-medium text-purple-600 mb-1">Average/Month</h3>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {Object.keys(trainingDaysByMonth).length > 0 ? 
                                                Math.round(Object.values(trainingDaysByMonth).reduce((a, b) => a + b, 0) / Object.keys(trainingDaysByMonth).length) 
                                                : 0} days
                                        </p>
                                    </div>
                                </div>

                                {/* Monthly Breakdown */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200/50">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Days by Month</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Object.keys(trainingDaysByMonth).sort().reverse().map(month => (
                                            <div key={month} className="bg-white/80 rounded-lg p-3 border border-gray-200/30">
                                                <p className="text-sm font-medium text-gray-600">{formatMonth(month)}</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {trainingDaysByMonth[month]} {trainingDaysByMonth[month] === 1 ? 'day' : 'days'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Training Calendar */}
                                <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Training Calendar</h2>
                                    <p className="text-sm text-gray-600 mb-4">Click on a date to see exercises for that day. Training days are highlighted in orange.</p>
                                    
                                    <div className="calendar-container">
                                        <Calendar
                                            onClickDay={handleDateClick}
                                            tileClassName={tileClassName}
                                            value={selectedDate}
                                            className="custom-calendar"
                                        />
                                    </div>
                                </div>

                                {/* Exercises for Selected Date */}
                                <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                                        {selectedDate ? `Exercises for ${selectedDate.toLocaleDateString()}` : 'Select a Date'}
                                    </h2>
                                    
                                    {selectedDate && exercisesForDate.length > 0 ? (
                                        <div className="space-y-3 max-h-80 overflow-y-auto">
                                            {exercisesForDate.map((exercise, index) => (
                                                <div 
                                                    key={index} 
                                                    className="bg-white/80 backdrop-blur-lg p-4 rounded-lg border border-orange-200/30 cursor-pointer hover:bg-orange-50/50 transition-colors duration-200"
                                                    onClick={() => setSelectedExercise(exercise)}
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{exercise.exerciseName}</p>
                                                                <p className="text-sm text-gray-600">{new Date(exercise.date).toLocaleTimeString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                                    {exercise.sets}×{exercise.reps}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                                {exercise.weight} kg
                                                            </span>
                                                            <span className="text-xs text-gray-500">Click for details</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : selectedDate && exercisesForDate.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No exercises recorded for this date</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Click on a date in the calendar to see your exercises</p>
                                            <p className="text-sm text-orange-600 mt-2">Orange highlighted dates have training sessions</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Exercise Details Section */}
                            {selectedExercise && (
                                <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Exercise Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-blue-50/80 rounded-lg p-3 border border-blue-200/50">
                                            <p className="text-sm font-medium text-blue-600">Exercise</p>
                                            <p className="text-blue-800 font-semibold">{selectedExercise.exerciseName}</p>
                                        </div>
                                        <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/50">
                                            <p className="text-sm font-medium text-orange-600">Sets</p>
                                            <p className="text-orange-800 font-semibold">{selectedExercise.sets}</p>
                                        </div>
                                        <div className="bg-green-50/80 rounded-lg p-3 border border-green-200/50">
                                            <p className="text-sm font-medium text-green-600">Reps</p>
                                            <p className="text-green-800 font-semibold">{selectedExercise.reps}</p>
                                        </div>
                                        <div className="bg-purple-50/80 rounded-lg p-3 border border-purple-200/50">
                                            <p className="text-sm font-medium text-purple-600">Weight</p>
                                            <p className="text-purple-800 font-semibold">{selectedExercise.weight} kg</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedExercise(null)}
                                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            )}

                            {/* Training Days Objective */}
                            <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                                <DaysTrainedObjective userId={userId} trainingDaysByMonth={trainingDaysByMonth} daysTrainedThisMonth={daysTrainedThisMonth}/>
                            </div>
                        </div>
                    )}

                    {/* Max Rep Tab */}
                    {activeTab === 'maxrep' && (
                        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-orange-100/50 overflow-hidden">
                            <SetRMComponent onSetRM={handleSetRM} userId={userId}/>
                        </div>
                    )}

                    {/* Weight Tab */}
                    {activeTab === 'weight' && (
                        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-orange-100/50 overflow-hidden">
                            <SetWeightComponent userId={userId} userHeight={userHeight}/>
                        </div>
                    )}

                    {/* BMI Tab */}
                    {activeTab === 'bmi' && (
                        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-orange-100/50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">BMI Calculator & Tracking</h2>
                            
                            {userHeight && (
                                <div className="space-y-6">
                                    {/* BMI Calculator */}
                                    <div className="bg-blue-50/80 rounded-lg p-6 border border-blue-200/50">
                                        <h3 className="text-xl font-semibold text-blue-800 mb-4">BMI Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-blue-600">Your Height</p>
                                                <p className="text-2xl font-bold text-blue-800">{userHeight} cm</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-blue-600">BMI Formula</p>
                                                <p className="text-sm text-blue-700">Weight (kg) / Height² (m)</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-blue-600">BMI Categories</p>
                                                <div className="text-xs text-blue-700 space-y-1">
                                                    <p>Underweight: &lt; 18.5</p>
                                                    <p>Normal: 18.5 - 24.9</p>
                                                    <p>Overweight: 25 - 29.9</p>
                                                    <p>Obese: ≥ 30</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BMI will be calculated automatically with weight data */}
                                    <div className="bg-orange-50/80 rounded-lg p-6 border border-orange-200/50">
                                        <h3 className="text-xl font-semibold text-orange-800 mb-4">Track Your Weight</h3>
                                        <p className="text-orange-700 mb-4">Your BMI will be automatically calculated when you log your weight in the Weight tab.</p>
                                        <button
                                            onClick={() => setActiveTab('weight')}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                        >
                                            Go to Weight Tracking
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!userHeight && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Height information not available. Please update your profile.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;

