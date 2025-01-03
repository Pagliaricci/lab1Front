import React, { useEffect, useState } from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SetRMComponent from '../components/stats/SetRMComponent';

const localizer = momentLocalizer(moment);

const Statistics: React.FC = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [trainingDaysByMonth, setTrainingDaysByMonth] = useState<{ [key: string]: number }>({});

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

    const events = exercises.map(exercise => ({
        title: exercise.exerciseName,
        start: new Date(exercise.date),
        end: new Date(exercise.date),
        allDay: true,
        ...exercise,
    }));

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

    const handleSetRM = (exerciseId: string, rm: number) => {
        console.log(exerciseId, rm);
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack} />
            </div>
            <h1 className="text-5xl font-bold text-white mb-8">Your Fitness Statistics</h1>
            <h1 className="text-3xl font-bold text-white mb-8">Exercise History</h1>
            <div className="flex w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg">
                <div className="w-1/4 bg-gray-200 rounded-lg p-4 mr-4">
                    <h2 className="text-xl font-semibold mb-2">Training Days by Month</h2>
                    {Object.keys(trainingDaysByMonth).map(month => (
                        <p key={month}>
                            <strong>{formatMonth(month)}:</strong> {trainingDaysByMonth[month]} {trainingDaysByMonth[month] === 1 ? 'day' : 'days'}
                        </p>
                    ))}
                    {selectedExercise && (
                        <div className="mt-4 bg-gray-300 rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Exercise Details</h2>
                            <p><strong>Name:</strong> {selectedExercise.exerciseName}</p>
                            <p><strong>Reps:</strong> {selectedExercise.reps}</p>
                            <p><strong>Sets:</strong> {selectedExercise.sets}</p>
                            <p><strong>Weight(Kg):</strong> {selectedExercise.weight}</p>
                        </div>
                    )}
                </div>
                <div className="w-3/4">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        onSelectEvent={handleSelectEvent}
                    />
                </div>
            </div>
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-lg mt-8">
                <SetRMComponent onSetRM={handleSetRM} />
            </div>
        </div>
    );
};

export default Statistics;