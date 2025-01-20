import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';

interface Course {
    id: string;
    name: string;
    description: string;
    creator: string;
    duration: number;
    intensity: string;
    price: number;
}

interface Subscriber {
    id: string;
    username: string;
    userId: string;
    progress: RoutineProgress;
    realizedExercises: ExerciseProgressWithDetails[];
}

interface RoutineProgress {
    id: string;
    userId: string;
    routineId: string;
    day: number;
    amountOfExercisesDone: number;
    initiationDate: Date;
    lastUpdated: Date;
}

interface ExerciseProgressWithDetails {
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
    date: Date;
}

const CourseSubscribers: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [subscribers, setSubscribers] = useState<{ [key: string]: Subscriber[] }>({});
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const navigate = useNavigate();

    // Fetch user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.userID);
                } else {
                    console.error('Failed to fetch user ID');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        // Fetch courses the user is trainer of
        const fetchCourses = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:8081/course/trainer/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchUserId();
        fetchCourses();
    }, [userId]);

    // Fetch subscribers for a specific course
    const fetchSubscribers = async (courseId: string) => {
        try {
            const response = await fetch(`http://localhost:8081/course/${courseId}/subscribers`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const responseText = await response.text();
                const data = JSON.parse(responseText); // Parse the response text as JSON
                setSubscribers(prev => ({ ...prev, [courseId]: data }));
            } else {
                console.error('Failed to fetch subscribers');
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        }
    };

    // Toggle subscriber list visibility
    const toggleSubscribers = (courseId: string) => {
        if (subscribers[courseId]) {
            setSubscribers(prev => {
                const newSubscribers = { ...prev };
                delete newSubscribers[courseId];
                return newSubscribers;
            });
        } else {
            fetchSubscribers(courseId);
        }
    };

    // Navigate back to home
    const handleArrowBack = () => {
        navigate('/home');
    };

    // View details of a subscriber
    const handleViewDetails = async (subscriber: Subscriber) => {
        try {
            const response = await fetch(`http://localhost:8081/course/subscribers/${subscriber.userId}/progress/${subscriber.progress.routineId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                // Asegúrate de convertir cada `exercise.date` a un objeto Date
                const exercisesWithDates = data.exercisesProgress.map((exercise: any) => ({
                    ...exercise,
                    date: new Date(exercise.date), // Convertir la fecha a un objeto Date
                }));

                setSelectedSubscriber({
                    ...subscriber,
                    realizedExercises: exercisesWithDates, // Usa el array con las fechas convertidas
                });
            } else {
                console.error('Failed to fetch subscriber progress');
            }
        } catch (error) {
            console.error('Error fetching subscriber progress:', error);
        }
    };

    // Close subscriber progress modal
    const handleCloseModal = () => {
        setSelectedSubscriber(null);
    };

    return (
        <div className="min-h-screen bg-gray-800 p-4">
            <div className="absolute top-4 left-4 cursor-pointer">
                <TiArrowBackOutline size={40} onClick={handleArrowBack} className="text-white" />
            </div>
            <h1 className="text-4xl text-white text-center mb-6">Course Subscribers</h1>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                {courses.map(course => (
                    <div key={course.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-bold">{course.name}</h2>
                        <p>{course.description}</p>
                        <button
                            className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                            onClick={() => toggleSubscribers(course.id)}
                        >
                            {subscribers[course.id] ? 'Hide Subscribers' : 'Show Subscribers'}
                        </button>
                        {subscribers[course.id] && (
                            <ul className="mt-4">
                                {subscribers[course.id].map(subscriber => (
                                    <li key={subscriber.id} className="p-2 border-b">
                                        <span>{subscriber.username}</span>
                                        <button
                                            className="ml-4 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-700"
                                            onClick={() => handleViewDetails(subscriber)}
                                        >
                                            View Details
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for Subscriber Details */}
            {selectedSubscriber && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-auto">
                        <h2 className="text-2xl font-bold text-center text-blue-500 mb-4">{selectedSubscriber.username}'s Progress</h2>
                        <p className="text-gray-700 mb-2">
                            <strong className="text-gray-900">Days Trained:</strong> {selectedSubscriber.progress.day}
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong className="text-gray-900">Exercises Done:</strong> {selectedSubscriber.progress.amountOfExercisesDone}
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">Exercises:</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-100 rounded-lg">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 text-left">Exercise</th>
                                    <th className="py-2 px-4 text-left">Date</th>
                                    <th className="py-2 px-4 text-left">Sets</th>
                                    <th className="py-2 px-4 text-left">Reps</th>
                                    <th className="py-2 px-4 text-left">Weight</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedSubscriber.realizedExercises.map((exercise, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2 px-4">{exercise.exerciseName}</td>
                                        <td className="py-2 px-4">{exercise.date.toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{exercise.sets}</td>
                                        <td className="py-2 px-4">{exercise.reps}</td>
                                        <td className="py-2 px-4">{exercise.weight} kg</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSubscribers;
