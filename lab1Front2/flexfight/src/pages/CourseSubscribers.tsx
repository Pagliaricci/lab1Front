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
    historyExerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
    date: Date;
    comment?: string;
}

                                                           const CourseSubscribers: React.FC = () => {
                                                               const [courses, setCourses] = useState<Course[]>([]);
                                                               const [subscribers, setSubscribers] = useState<{ [key: string]: Subscriber[] }>({});
                                                               const [userId, setUserId] = useState<string | null>(null);
                                                               const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
                                                               const [selectedExercise, setSelectedExercise] = useState<ExerciseProgressWithDetails | null>(null);
                                                               const [comment, setComment] = useState<string>('');
                                                               const navigate = useNavigate();

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
                                                                               // Automatically fetch subscribers for each course
                                                                               data.forEach((course: Course) => {
                                                                                   fetchSubscribers(course.id);
                                                                               });
                                                                           } else {
                                                                               console.error('Failed to fetch courses');
                                                                           }
                                                                       } catch (error) {
                                                                           console.error('Error fetching courses:', error);
                                                                       }
                                                                   };

                                                                   fetchUserId();
                                                                   if (userId) {
                                                                       fetchCourses();
                                                                   }
                                                               }, [userId]);

                                                               const fetchSubscribers = async (courseId: string) => {
                                                                   try {
                                                                       const response = await fetch(`http://localhost:8081/course/${courseId}/subscribers`, {
                                                                           method: 'GET',
                                                                           headers: { 'Content-Type': 'application/json' },
                                                                       });

                                                                       if (response.ok) {
                                                                           const responseText = await response.text();
                                                                           const data = JSON.parse(responseText);
                                                                           setSubscribers(prev => ({ ...prev, [courseId]: data }));
                                                                       } else {
                                                                           console.error('Failed to fetch subscribers');
                                                                       }
                                                                   } catch (error) {
                                                                       console.error('Error fetching subscribers:', error);
                                                                   }
                                                               };

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

                                                               const handleArrowBack = () => {
                                                                   navigate('/home');
                                                               };

                                                               const handleViewDetails = async (subscriber: Subscriber) => {
                                                                   try {
                                                                       const response = await fetch(`http://localhost:8081/course/subscribers/${subscriber.userId}/progress/${subscriber.progress.routineId}`, {
                                                                           method: 'GET',
                                                                           headers: { 'Content-Type': 'application/json' },
                                                                       });

                                                                       if (response.ok) {
                                                                           const data = await response.json();
                                                                           const exercisesWithDates = data.exercisesProgress.map((exercise: ExerciseProgressWithDetails) => ({
                                                                               ...exercise,
                                                                               date: new Date(exercise.date),
                                                                           }));

                                                                           setSelectedSubscriber({
                                                                               ...subscriber,
                                                                               realizedExercises: exercisesWithDates,
                                                                           });
                                                                       } else {
                                                                           console.error('Failed to fetch subscriber progress');
                                                                       }
                                                                   } catch (error) {
                                                                       console.error('Error fetching subscriber progress:', error);
                                                                   }
                                                               };

                                                               const handleCloseModal = () => {
                                                                   setSelectedSubscriber(null);
                                                                   setSelectedExercise(null);
                                                                   setComment('');
                                                               };

                                                               const handleSelectExercise = (exercise: ExerciseProgressWithDetails) => {
                                                                   setSelectedExercise(exercise);
                                                                   setComment(exercise.comment || '');
                                                               };

                                                               const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                                   setComment(e.target.value);
                                                               };
                                                               const handleSaveComment = async () => {
                                                                   if (selectedExercise && selectedSubscriber) {
                                                                       const updatedExercises = selectedSubscriber.realizedExercises.map(ex =>
                                                                           ex.historyExerciseId === selectedExercise.historyExerciseId ? { ...ex, comment } : ex
                                                                       );

                                                                       setSelectedSubscriber({
                                                                           ...selectedSubscriber,
                                                                           realizedExercises: updatedExercises,
                                                                       });

                                                                       console.log(comment);
                                                                       console.log(selectedExercise.historyExerciseId);

                                                                       try {
                                                                           const response = await fetch('http://localhost:8081/api/progress/comment', {
                                                                               method: 'POST',
                                                                               headers: { 'Content-Type': 'application/json' },
                                                                               credentials: 'include',
                                                                               body: JSON.stringify({
                                                                                   historyExerciseId: selectedExercise.historyExerciseId,
                                                                                   comment,
                                                                               }),
                                                                           });

                                                                           if (!response.ok) {
                                                                               console.error('Failed to save comment');
                                                                           }
                                                                       } catch (error) {
                                                                           console.error('Error saving comment:', error);
                                                                       }

                                                                       setSelectedExercise(null);
                                                                       setComment('');
                                                                   } else {
                                                                       console.error('Selected exercise or subscriber is not defined');
                                                                   }
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
                                                                               <h1 className="text-4xl font-bold text-orange-600 mb-2">Course Subscribers</h1>
                                                                               <p className="text-gray-600">Manage your course subscribers and track their progress</p>
                                                                           </div>

                                                                           {/* Main Content */}
                                                                           <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                                                                               {courses.length > 0 ? (
                                                                                   <div className="space-y-6">
                                                                                       {courses.map(course => (
                                                                                           <div key={course.id} className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-orange-200/30 shadow-sm">
                                                                                               <div className="space-y-4">
                                                                                                   <div className="flex justify-between items-center">
                                                                                                       <div>
                                                                                                           <h2 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h2>
                                                                                                           <p className="text-gray-600">{course.description}</p>
                                                                                                       </div>
                                                                                                       
                                                                                                       <button
                                                                                                           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                                                                                           onClick={() => toggleSubscribers(course.id)}
                                                                                                       >
                                                                                                           {subscribers[course.id] ? 'Hide Subscribers' : 'Show Subscribers'}
                                                                                                       </button>
                                                                                                   </div>

                                                                                                   {subscribers[course.id] && (
                                                                                                       <div className="mt-4 space-y-3">
                                                                                                           {subscribers[course.id].length > 0 ? (
                                                                                                               subscribers[course.id].map(subscriber => (
                                                                                                                   <div key={subscriber.id} className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50 flex justify-between items-center">
                                                                                                                       <div>
                                                                                                                           <p className="font-semibold text-gray-800">{subscriber.username}</p>
                                                                                                                           <p className="text-sm text-gray-600">Day {subscriber.progress.day} - {subscriber.progress.amountOfExercisesDone} exercises completed</p>
                                                                                                                       </div>
                                                                                                                       <button
                                                                                                                           className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                                                                                           onClick={() => handleViewDetails(subscriber)}
                                                                                                                       >
                                                                                                                           View Details
                                                                                                                       </button>
                                                                                                                   </div>
                                                                                                               ))
                                                                                                           ) : (
                                                                                                               <div className="text-center py-6">
                                                                                                                   <p className="text-gray-500">No subscribers yet for this course</p>
                                                                                                               </div>
                                                                                                           )}
                                                                                                       </div>
                                                                                                   )}
                                                                                               </div>
                                                                                           </div>
                                                                                       ))}
                                                                                   </div>
                                                                               ) : (
                                                                                   <div className="text-center py-8">
                                                                                       <div className="text-gray-400 mb-4">
                                                                                           <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                                           </svg>
                                                                                       </div>
                                                                                       <p className="text-gray-500 text-lg">No courses created yet</p>
                                                                                       <p className="text-gray-400 text-sm mt-2">Create a course to start managing subscribers</p>
                                                                                   </div>
                                                                               )}
                                                                           </div>
                                                                       </div>

                                                                       {/* Modal for Subscriber Details */}
                                                                       {selectedSubscriber && (
                                                                           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                                                               <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-100/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
                                                                                   <div className="p-6 border-b border-gray-200/50">
                                                                                       <h2 className="text-2xl font-bold text-orange-600 text-center">{selectedSubscriber.username}'s Progress</h2>
                                                                                   </div>
                                                                                   
                                                                                   <div className="p-6 overflow-y-auto max-h-[70vh]">
                                                                                       {/* Progress Summary */}
                                                                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                                                           <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-200/50">
                                                                                               <p className="text-sm font-medium text-blue-600">Days Trained</p>
                                                                                               <p className="text-2xl font-bold text-blue-800">{selectedSubscriber.progress.day}</p>
                                                                                           </div>
                                                                                           <div className="bg-orange-50/80 rounded-lg p-4 border border-orange-200/50">
                                                                                               <p className="text-sm font-medium text-orange-600">Exercises Completed</p>
                                                                                               <p className="text-2xl font-bold text-orange-800">{selectedSubscriber.progress.amountOfExercisesDone}</p>
                                                                                           </div>
                                                                                       </div>

                                                                                       {/* Exercises Table */}
                                                                                       <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200/50">
                                                                                           <h3 className="text-lg font-semibold text-gray-800 mb-4">Exercise History</h3>
                                                                                           <div className="overflow-x-auto">
                                                                                               <table className="min-w-full">
                                                                                                   <thead>
                                                                                                       <tr className="bg-orange-100/80 border border-orange-200/50">
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Exercise</th>
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Date</th>
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Sets</th>
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Reps</th>
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Weight</th>
                                                                                                           <th className="py-3 px-4 text-left font-semibold text-orange-800">Comment</th>
                                                                                                       </tr>
                                                                                                   </thead>
                                                                                                   <tbody>
                                                                                                       {selectedSubscriber.realizedExercises.map((exercise, index) => (
                                                                                                           <tr
                                                                                                               key={index}
                                                                                                               className={`border-b border-gray-200/50 cursor-pointer transition-colors duration-200 ${
                                                                                                                   selectedExercise?.exerciseName === exercise.exerciseName 
                                                                                                                       ? 'bg-blue-100/80' 
                                                                                                                       : 'hover:bg-orange-50/50'
                                                                                                               }`}
                                                                                                               onClick={() => handleSelectExercise(exercise)}
                                                                                                           >
                                                                                                               <td className="py-3 px-4 font-medium text-gray-800">{exercise.exerciseName}</td>
                                                                                                               <td className="py-3 px-4 text-gray-600">{exercise.date.toLocaleDateString()}</td>
                                                                                                               <td className="py-3 px-4 text-gray-600">{exercise.sets}</td>
                                                                                                               <td className="py-3 px-4 text-gray-600">{exercise.reps}</td>
                                                                                                               <td className="py-3 px-4 text-gray-600">{exercise.weight} kg</td>
                                                                                                               <td className="py-3 px-4 text-gray-600">{exercise.comment || 'No comment'}</td>
                                                                                                           </tr>
                                                                                                       ))}
                                                                                                   </tbody>
                                                                                               </table>
                                                                                           </div>
                                                                                       </div>

                                                                                       {/* Comment Section */}
                                                                                       {selectedExercise && (
                                                                                           <div className="mt-6 bg-blue-50/80 rounded-lg p-6 border border-blue-200/50">
                                                                                               <h3 className="text-lg font-semibold text-blue-800 mb-4">Add Comment to {selectedExercise.exerciseName}</h3>
                                                                                               <textarea
                                                                                                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                                                                                                   value={comment}
                                                                                                   onChange={handleCommentChange}
                                                                                                   rows={4}
                                                                                                   placeholder="Enter your feedback or comments here..."
                                                                                               />
                                                                                               <button
                                                                                                   className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                                                                   onClick={handleSaveComment}
                                                                                               >
                                                                                                   Save Comment
                                                                                               </button>
                                                                                           </div>
                                                                                       )}
                                                                                   </div>

                                                                                   {/* Modal Footer */}
                                                                                   <div className="p-6 border-t border-gray-200/50 text-center">
                                                                                       <button
                                                                                           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
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