import { useEffect, useState } from 'react';
import RoutineCardComponent from '../components/savedRoutines/RoutineCardComponent';
import ShareModal from '../components/savedRoutines/ShareModal';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

const SavedRoutines: React.FC = () => {
    const [routines, setRoutines] = useState<any[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [userID, setUserID] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [qrRoutine, setQrRoutine] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
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
                alert(`Error deleting routine: ${errorText}`);
                return;
            }

            alert('Routine deleted successfully');
            setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
        } catch (error) {
            console.error('Error deleting routine:', error);
            alert('An error occurred while deleting the routine.');
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
                setShareMessage('Link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy link: ', err);
                setShareMessage('Failed to copy link.');
            });
        setIsShareModalOpen(false);
    };

    const handleGenerateQR = (routineId: string) => {
        const link = `${window.location.origin}/${routineId}`;
        setQrRoutine(link);
    };

    return (
        <div className="min-h-screen bg-gray-700">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
                <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h1 className="text-4xl font-bold mt-8 mb-8">Saved Routines</h1>
                    {shareMessage && <div className="text-green-500 mb-4">{shareMessage}</div>}

                    {routines.length > 0 ? (
                        routines.map((routine) => (
                            <div key={routine.id}>
                                <RoutineCardComponent
                                    name={routine.name}
                                    duration={routine.duration}
                                    intensity={routine.intensity}
                                    isActive={routine.isActive}
                                    onActivate={() => handleActivateRoutine(routine.id)}
                                    onDeactivate={() => handleDeactivateRoutine(routine.id)}
                                    onDelete={() => handleDeleteRoutine(routine.id)}
                                    onShare={userRole === 'Trainer' ? () => handleShareRoutine(routine.id) : undefined}
                                    userRole={userRole}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No saved routines found.</p>
                    )}
                </div>
            </div>

            {isShareModalOpen && selectedRoutine && (
                <ShareModal
                    onClose={() => {
                        setIsShareModalOpen(false);
                        setQrRoutine(null); // Reset QR when modal closes
                    }}
                    onGenerateLink={handleGenerateLink}
                    onGenerateQR={handleGenerateQR}
                    routineId={selectedRoutine}
                    qrRoutine={qrRoutine} // Pass QR code value
                />
            )}
        </div>
    );
};
export default SavedRoutines;
