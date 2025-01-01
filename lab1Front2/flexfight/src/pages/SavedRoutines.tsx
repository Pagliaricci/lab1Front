import { useEffect, useState } from 'react';
import RoutineCardComponent from '../components/savedRoutines/RoutineCardComponent';

const SavedRoutines: React.FC = () => {
    const [routines, setRoutines] = useState<any[]>([]);
    const [selectedRoutine] = useState<string | null>(null);

    useEffect(() => {
        fetchUserAndRoutines();
    }, []);

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
            const userID = userData.userID;

            const routinesResponse = await fetch(`http://localhost:8081/api/routines/get?userID=${userID}`, {
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

    function handleDeactivateRoutine(routineId:string) {
        fetch(`/deactivate/${routineId}`, {
            method: 'POST', // método POST para la desactivación
            headers: {
                'Content-Type': 'application/json', // tipo de contenido
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al desactivar la rutina');
                }
                return response.json();
            })
            .then(data => {
                console.log('Rutina desactivada con éxito', data);
                // Manejo de la respuesta exitosa
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejo de errores
            });
    }

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

    return (
        <div className="min-h-screen bg-gray-700">
            <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
                <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h1 className="text-4xl font-bold mt-8 mb-8">Saved Routines</h1>
                    {routines.length > 0 ? (
                        routines.map((routine) => (
                            <div key={routine.id}>
                                <RoutineCardComponent
                                    name={routine.name}
                                    duration={routine.duration}
                                    intensity={routine.intensity}
                                    isActive={routine.isActive}
                                    onActivate={() => {}}
                                    onDeactivate={() => handleDeactivateRoutine(routine.id)} // Handle deactivation
                                    onDelete={() => handleDeleteRoutine(routine.id)} // Handle deletion
                                />
                                {selectedRoutine === routine.id && (
                                    <div className="mt-4 bg-gray-200 rounded-lg p-4">
                                        <h2 className="text-xl font-semibold mb-2">Exercises</h2>
                                        {/* Render exercises */}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No saved routines found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedRoutines;
