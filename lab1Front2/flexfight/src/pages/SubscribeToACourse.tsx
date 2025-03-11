import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import MercadoPagoButton from '../components/mercadoPago/ MercadoPagoButton';
import { initMercadoPago } from '@mercadopago/sdk-react';
import dotenv from 'dotenv';

dotenv.config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;



interface Course {
    id: string;
    name: string;
    description: string;
    creator: string;
    duration: number;
    intensity: string;
    price: number;
    subscribed: boolean;
    rating: number;
}

const SubscribeToACourse: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        
        initMercadoPago(PUBLIC_KEY);
        
        
        // Obtener la preferencia desde el backend
        const createPreference = async () => {
            try {
                const response = await fetch('http://localhost:8081/payments/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: "ID_DEL_CURSO", price: 100 }) // Personaliza estos datos
                });

                const data = await response.json();
                setPreferenceId(data.preferenceId);
            } catch (error) {
                console.error('Error creating payment preference:', error);
            }
        };

        createPreference();

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

        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8081/course/all', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                    if (userId) fetchSubscribedStatus(data);
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

    const fetchSubscribedStatus = async (coursesToCheck: Course[]) => {
        if (userId && coursesToCheck.length > 0) {
            const updatedCourses = await Promise.all(
                coursesToCheck.map(async (course) => {
                    try {
                        const response = await fetch(
                            `http://localhost:8081/course/isSubscribed?userId=${userId}&routineId=${course.id}`,
                            {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );

                        if (response.ok) {
                            const isSubscribed = await response.json();
                            return { ...course, subscribed: isSubscribed };
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching subscription status for course ${course.id}:`,
                            error
                        );
                    }
                    return course;
                })
            );
            setCourses(updatedCourses);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:8081/course/search?query=${searchQuery}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCourses(data);
                if (userId) fetchSubscribedStatus(data);
            } else {
                console.error('Failed to search courses');
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        }
    };

    const handleSubscribe = async (course: Course) => {
        if (!userId) {
            alert('User ID not found. Please try again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    title: course.name,
                    price: course.price
                }),
            });
            // const response = await fetch('http://localhost:8081/course/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId, routineId: courseId }),
            // });

            if (response.ok) {
                const data = await response.json();
                setPreferenceId(data.preferenceId);
                setSelectedCourse(course.id);
                // const updatedCourses = courses.map(course =>
                //     course.id === courseId ? { ...course, subscribed: true } : course
                // );
                // setCourses(updatedCourses);
            } else {
                console.error('Failed to subscribe to course');
            }
        } catch (error) {
            console.error('Error subscribing to course:', error);
        }
    };

    const handleUnsubscribe = async (courseId: string) => {
        if (!userId) {
            alert('User ID not found. Please try again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/course/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, routineId: courseId }),
            });

            if (response.ok) {
                const updatedCourses = courses.map(course =>
                    course.id === courseId ? { ...course, subscribed: false } : course
                );
                setCourses(updatedCourses);
            } else {
                console.error('Failed to unsubscribe from course');
            }
        } catch (error) {
            console.error('Error unsubscribing from course:', error);
        }
    };

    const handleArrowBack = () => {
        navigate('/home');
    };

    const sortCoursesByRating = () => {
        setCourses(prevCourses => [...prevCourses].sort((a, b) => b.rating - a.rating));
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack} />
            </div>
            <h1 className="text-5xl font-bold text-white mb-8">Subscribe to a Course</h1>
            <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg">
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Search for courses..."
                    />
                    <button
                        onClick={handleSearch}
                        className="mt-2 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    >
                        Search
                    </button>
                    <button
                        onClick={sortCoursesByRating}
                        className="mt-2 ml-2 py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                    >
                        Sort by Rating
                    </button>
                </div>
                {courses.length === 0 ? (
                    <p className="text-gray-400">No courses available.</p>
                ) : (
                    courses.map(course => (
                        <div key={course.id} className="p-4 mb-4 border rounded-lg bg-gray-100 shadow-inner">
                            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                            <p className="text-gray-700 mb-2">{course.description}</p>
                            <p className="text-gray-700 mb-2"><strong>Creator:</strong> {course.creator}</p>
                            <p className="text-gray-700 mb-2"><strong>Duration:</strong> {course.duration} weeks</p>
                            <p className="text-gray-700 mb-2"><strong>Intensity:</strong> {course.intensity}</p>
                            <p className="text-gray-700 mb-2"><strong>Rating:</strong> {course.rating} / 5</p>
                            <p className="text-gray-700 mb-4"><strong>Price:</strong> ${course.price}</p>
                            {!course.subscribed ? (
                                <button
                                    className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                                    onClick={() => handleSubscribe(course)}
                                >
                                    Subscribe & Pay
                                </button>
                            ) : (
                                <>
                                    <p className="text-green-500 font-bold">Already Subscribed</p>
                                    <button
                                        className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded mt-2"
                                        onClick={() => handleUnsubscribe(course.id)}
                                    >
                                        Unsubscribe
                                    </button>
                                </>
                            )}
                            {selectedCourse === course.id && preferenceId && (
                                <div className="mt-4">
                                    <MercadoPagoButton preferenceId={preferenceId} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SubscribeToACourse;