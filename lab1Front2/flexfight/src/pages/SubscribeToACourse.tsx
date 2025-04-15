import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import MercadoPagoButton from '../components/mercadoPago/ MercadoPagoButton';
import { initMercadoPago } from '@mercadopago/sdk-react';



const PUBLIC_KEY = "APP_USR-3e188254-32d7-4d42-8a0a-9172aa804a90";


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
            const response = await fetch(`http://localhost:8081/api/pagos/preferencia?courseId=${course.id}&precio=${course.price}&userId=${userId}`, {
                method: "POST",
                credentials: 'include',
              });
              const data = await response.json();
              window.location.href = data.init_point;
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
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Subscribe to a Course</h1>
                    <p className="text-gray-600">Find and subscribe to fitness courses</p>
                </div>

                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                    {/* Search Section */}
                    <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Search Courses</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Search for courses..."
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                            >
                                Search
                            </button>
                            <button
                                onClick={sortCoursesByRating}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                            >
                                Sort by Rating
                            </button>
                        </div>
                    </div>

                    {/* Courses List */}
                    {courses.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-gray-500 text-lg">No courses available.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {courses.map(course => (
                                <div key={course.id} className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-orange-200/30 shadow-sm">
                                    <div className="space-y-4">
                                        {/* Course Header */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.name}</h2>
                                            <p className="text-gray-600">{course.description}</p>
                                        </div>

                                        {/* Course Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-blue-50/80 rounded-lg p-3 border border-blue-200/50">
                                                <p className="text-sm font-medium text-blue-600">Creator</p>
                                                <p className="text-blue-800 font-semibold">{course.creator}</p>
                                            </div>
                                            <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/50">
                                                <p className="text-sm font-medium text-orange-600">Duration</p>
                                                <p className="text-orange-800 font-semibold">{course.duration} weeks</p>
                                            </div>
                                            <div className="bg-green-50/80 rounded-lg p-3 border border-green-200/50">
                                                <p className="text-sm font-medium text-green-600">Intensity</p>
                                                <p className="text-green-800 font-semibold">{course.intensity}</p>
                                            </div>
                                            <div className="bg-purple-50/80 rounded-lg p-3 border border-purple-200/50">
                                                <p className="text-sm font-medium text-purple-600">Rating</p>
                                                <p className="text-purple-800 font-semibold">{course.rating} / 5</p>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                            <div className="bg-gray-50/80 rounded-lg px-4 py-2 border border-gray-200/50">
                                                <p className="text-sm font-medium text-gray-600">Price</p>
                                                <p className="text-2xl font-bold text-gray-800">${course.price}</p>
                                            </div>

                                            <div className="flex gap-3">
                                                {!course.subscribed ? (
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                        onClick={() => handleSubscribe(course)}
                                                    >
                                                        Subscribe & Pay
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-green-50/80 border border-green-200/50 px-4 py-2 rounded-lg">
                                                            <p className="text-green-700 font-semibold">Already Subscribed</p>
                                                        </div>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                            onClick={() => handleUnsubscribe(course.id)}
                                                        >
                                                            Unsubscribe
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* MercadoPago Button */}
                                        {selectedCourse === course.id && preferenceId && (
                                            <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200/30">
                                                <MercadoPagoButton preferenceId={preferenceId} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscribeToACourse;