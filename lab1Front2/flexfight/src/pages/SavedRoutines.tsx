// lab1Front2/flexfight/src/pages/SavedRoutines.tsx
import { useEffect, useState } from 'react';
import RoutineCardComponent from '../components/savedRoutines/RoutineCardComponent';
import ShareModal from '../components/savedRoutines/ShareModal';
import SubscriptionHistoryModal from '../components/savedRoutines/SubscriptionHistoryModal';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SubscriberHistoryWithName {
    id: string;
    username: string;
    routineId: string;
    subscriptionDate: string;
}

const SavedRoutines: React.FC = () => {
    const [routines, setRoutines] = useState<any[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [userID, setUserID] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [qrRoutine, setQrRoutine] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
    const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriberHistoryWithName[]>([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserAndRoutines();
    }, []);

    const handleArrowBack = () => {
        navigate('/home');
    };

    const fetchUserAndRoutines = async () => {
        try {
            const userResponse = await fetch('http://localhost:8081/users/me', {
                method: 'GET',
                credentials: 'include',
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user information');
            }

            const userData = await userResponse.json();
            setUserID(userData.userID);
            setUserRole(userData.role);

            const routinesResponse = await fetch(`http://localhost:8081/api/routines/get?userID=${userData.userID}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!routinesResponse.ok) {
                throw new Error('Failed to fetch routines');
            }

            const routinesData = await routinesResponse.json();
            setRoutines(routinesData);
        } catch (error) {
            console.error('Error fetching user or routines:', error);
        }
    };

    const handleDeactivateRoutine = (routineId: string) => {
        fetch(`http://localhost:8081/api/routines/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ routineId, userId: userID }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error deactivating routine');
                }
                return response.text();
            })
            .then(() => {
                setRoutines((prevRoutines) =>
                    prevRoutines.map((routine) =>
                        routine.id === routineId ? { ...routine, isActive: false } : routine
                    )
                );
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleActivateRoutine = (routineId: string) => {
        fetch('http://localhost:8081/api/routines/activateRoutine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ routineId, userId: userID }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error activating routine');
                }
                return response.text();
            })
            .then(() => {
                setRoutines((prev) =>
                    prev.map((routine) =>
                        routine.id === routineId ? { ...routine, isActive: true } : { ...routine, isActive: false }
                    )
                );
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleDeleteRoutine = async (routineId: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/routines/deactivate/${routineId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                toast.error(`Error deleting routine: ${errorText}`);
                return;
            }

            toast.success('Routine deleted successfully');
            setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
        } catch (error) {
            console.error('Error deleting routine:', error);
            toast.error('An error occurred while deleting the routine.');
        }
    };

    const handleShareRoutine = (routineId: string) => {
        setSelectedRoutine(routineId);
        setIsShareModalOpen(true);
    };

    const handleGenerateLink = (routineId: string) => {
        const link = `${window.location.origin}/${routineId}`;
        navigator.clipboard
            .writeText(link)
            .then(() => {
                toast.success('Link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy link: ', err);
                toast.error('Failed to copy link.');
            });
        setIsShareModalOpen(false);
    };

    const handleGenerateQR = (routineId: string) => {
        const link = `${window.location.origin}/${routineId}`;
        setQrRoutine(link);
    };

    const handleShowHistory = async (routineId: string) => {
        try {
            const response = await fetch(`http://localhost:8081/course/${routineId}/historySubscriptions`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subscription history');
            }

            const data = await response.json();
            console.log(data)
            setSubscriptionHistory(data);
            setIsHistoryModalOpen(true);
        } catch (error) {
            console.error('Error fetching subscription history:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl"></div>
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
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-orange-600 mb-2">Saved Routines</h1>
                        <p className="text-gray-600">Manage your workout routines</p>
                    </div>

                    {/* Routines Container */}
                    <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                        {routines.length > 0 ? (
                            <div className="grid gap-6">
                                {routines.map((routine) => (
                                    <RoutineCardComponent
                                        key={routine.id}
                                        name={routine.name}
                                        duration={routine.duration}
                                        intensity={routine.intensity}
                                        isActive={routine.isActive}
                                        onActivate={() => handleActivateRoutine(routine.id)}
                                        onDeactivate={() => handleDeactivateRoutine(routine.id)}
                                        onDelete={() => handleDeleteRoutine(routine.id)}
                                        onShare={userRole === 'Trainer' ? () => handleShareRoutine(routine.id) : undefined}
                                        onShowHistory={userRole === 'Trainer' ? () => handleShowHistory(routine.id) : undefined}
                                        userRole={userRole}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💪</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No routines found</h3>
                                <p className="text-gray-500 mb-6">Create your first routine to get started!</p>
                                <button
                                    onClick={() => navigate('/create-routine')}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                                >
                                    Create Routine
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isShareModalOpen && selectedRoutine && (
                <ShareModal
                    onClose={() => {
                        setIsShareModalOpen(false);
                        setQrRoutine(null);
                    }}
                    onGenerateLink={handleGenerateLink}
                    onGenerateQR={handleGenerateQR}
                    routineId={selectedRoutine}
                    qrRoutine={qrRoutine}
                />
            )}

            <SubscriptionHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                subscriptionHistory={subscriptionHistory}
            />
        </div>
    );
};

export default SavedRoutines;