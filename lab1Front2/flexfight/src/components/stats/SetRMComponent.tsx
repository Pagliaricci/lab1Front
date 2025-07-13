import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Exercise {
    id: string;
    name: string;
    category: string;
    description: string;
    currentRM?: number;
    objective?: number;
}

interface SetRMProps {
    onSetRM: (exerciseId: string, reps: number, weight: number) => void;
    userId: string | null;
}

const categories = ["Chest", "Shoulders", "Back", "Biceps", "Triceps", "Legs"];

const SetRMComponent: React.FC<SetRMProps> = ({ onSetRM, userId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [reps, setReps] = useState<number | string>('');
    const [weight, setWeight] = useState<number | string>('');
    const [objective, setObjective] = useState<number | string>('');
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [rmHistory, setRmHistory] = useState<{ date: string, rm: number }[] | null>(null);
    const [objectiveReached, setObjectiveReached] = useState(false);

    // Toast styles
    const toastErrorStyle = {
        background: '#FEE2E2', // rojo pastel
        color: '#991B1B', // rojo apagado
        borderRadius: '0.75rem',
        border: '1px solid #FCA5A5',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        textAlign: 'center',
    };
    const toastSuccessStyle = {
        background: '#DCFCE7', // verde pastel
        color: '#166534', // verde apagado
        borderRadius: '0.75rem',
        border: '1px solid #86EFAC',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        textAlign: 'center',
    };

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:8081/api/exercises');
            if (searchQuery) url.searchParams.append('search', searchQuery);
            if (selectedCategory) url.searchParams.append('category', selectedCategory);

            const response = await fetch(url.toString());
            const data = await response.json();
            setExercises(data);
            setNoResults(data.length === 0);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory]);

    const fetchRMHistory = useCallback(async (exerciseId: string) => {
        if (!userId || !exerciseId) {
            console.error("Invalid parameters: userId or exerciseId is missing.");
            return;
        }
        console.log("Fetching RM history with:", { exerciseId, userId });

        try {
            const response = await fetch('http://localhost:8081/api/rm/get-rm-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exerciseId, userId }),
            });

            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched RM history:", data);
                setRmHistory(data);
            } else if (response.status === 404) {
                console.error("No RM history found for this exercise.");
                setRmHistory(null);
            } else {
                const errorText = await response.text();
                console.error("Failed to fetch RM history:", errorText);
                setRmHistory(null);
            }
        } catch (error) {
            console.error("Error fetching RM history:", error);
            setRmHistory(null);
        }
    }, [userId]);

    const fetchCurrentRM = useCallback(async (exerciseId: string) => {
        if (!userId || !exerciseId) {
            console.error("Invalid parameters: userId or exerciseId is missing.");
            return;
        }
        console.log("Fetching current RM with:", { exerciseId, userId });

        try {
            const response = await fetch('http://localhost:8081/api/rm/get-rm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exerciseId, userId }),
            });

            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched RM data:", data);
                setSelectedExercise((prev) => {
                    if (prev && prev.id === exerciseId) {
                        console.log("Updating selectedExercise with currentRM and objective:", data.currentRM, data.objective);
                        return { ...prev, currentRM: data?.rm, objective: data?.objective };
                    }
                    return prev;
                });
            } else if (response.status === 404) {
                console.error("No RM record found for this exercise.");
            } else {
                const errorText = await response.text();
                console.error("Failed to fetch RM:", errorText);
            }
        } catch (error) {
            console.error("Error fetching current RM:", error);
        }
    }, [userId]);

    const setObjectiveRecord = async (objectiveName: string, objectiveValue: number, currentValue: number) => {
        if (!userId) {
            console.error("Invalid parameter: userId is missing.");
            return;
        }

        try {
            console.log("Setting objective record", userId, objectiveName, objectiveValue, currentValue);
            const response = await fetch('http://localhost:8081/api/rm/set-objective-record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    date: new Date().toISOString(), // Convert date to ISO string
                    objectiveName,
                    objectiveValue: objectiveValue.toString(),
                    currentValue: currentValue.toString(),
                }),
            });


            if (response.ok) {
                console.log("Objective record set successfully");
            } else {
                const errorText = await response.text();
                console.error("Failed to set objective record:", errorText);
            }
        } catch (error) {
            console.error("Error setting objective record:", error);
        }
    };

    const setRMObjective = useCallback(async (exerciseId: string, objective: number) => {
        if (!userId || !exerciseId) {
            console.error("Invalid parameters: userId or exerciseId is missing.");
            return;
        }
        console.log("Setting RM objective with:", { exerciseId, objective, userId });

        try {
            const response = await fetch('http://localhost:8081/api/rm/set-rm-objective', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, exerciseId, objective }),
            });

            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Set RM objective data:", data);
                setSelectedExercise((prev) => {
                    if (prev && prev.id === exerciseId) {
                        return { ...prev, objective: data?.objective };
                    }
                    return prev;
                });
                setObjectiveReached(false);
            } else {
                const errorText = await response.text();
                console.error("Failed to set RM objective:", errorText);
            }
        } catch (error) {
            console.error("Error setting RM objective:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    useEffect(() => {
        if (selectedExercise && selectedExercise.currentRM === undefined) {
            fetchCurrentRM(selectedExercise.id);
            fetchRMHistory(selectedExercise.id);
        }
    }, [selectedExercise, fetchCurrentRM, fetchRMHistory]);


    const handleSetRMClick = async () => {
        if (selectedExercise && reps && weight) {
            const newRM = Number(weight);
            onSetRM(selectedExercise.id, Number(reps), newRM);
            if (selectedExercise.objective && selectedExercise.objective !== 0.0 && newRM >= selectedExercise.objective) {
                toast.success(`Congratulations! You have reached your objective of ${selectedExercise.objective} kg.`, {
                    style: toastSuccessStyle,
                    position: 'top-center',
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
                console.log("AAAAAAAAAAA")
                await setObjectiveRecord(`${selectedExercise.name} RM Objective`, newRM, Number(selectedExercise.objective));
                setObjectiveReached(true);

            }
            setSelectedExercise(null);
            setReps('');
            setWeight('');
        }
    };

    const handleSetObjectiveClick = () => {
        if (selectedExercise && objective) {
            setRMObjective(selectedExercise.id, Number(objective));
            setObjective('');
        }
    };

    const renderSearchSection = () => (
        <div className="w-full p-4">
            <h2 className="text-lg font-bold mb-4">Set RM</h2>
            {!selectedExercise && (
                <div>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search exercises"
                            className="w-full p-2 border rounded-lg pl-10"
                        />
                        <span className="absolute left-3 top-2 text-gray-500">🔍</span>
                    </div>

                    <div className="mb-4">
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {loading && <div>Loading exercises...</div>}

            {!selectedExercise && exercises.length > 0 && !noResults && (
                <div className="overflow-y-auto max-h-[200px]">
                    <ul className="space-y-2">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                                onClick={() => setSelectedExercise(exercise)}
                            >
                                {exercise.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {noResults && !loading && !selectedExercise && (
                <div className="text-center text-gray-500">No exercises found</div>
            )}

            {selectedExercise && (
                <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">{selectedExercise.name}</h3>
                    <p className="text-center text-sm mb-4">{selectedExercise.description}</p>
                    {selectedExercise.currentRM !== undefined && (
                        <p className="text-center text-sm mb-4">Current RM: {selectedExercise.currentRM}</p>
                    )}
                    {selectedExercise.objective !== undefined && selectedExercise.objective !== 0.0 && (
                        <p className="text-center text-sm mb-4">Objective: {selectedExercise.objective}</p>
                    )}

                    <div className="mb-2">
                        <label className="block text-sm">Reps</label>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="Enter Reps"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Weight</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="Enter Weight"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                                !reps || !weight ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handleSetRMClick}
                            disabled={!reps || !weight}
                        >
                            Set RM
                        </button>
                        <button
                            onClick={() => setSelectedExercise(null)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderRMHistory = () => (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg w-full">
            <h3 className="text-xl font-bold mb-4 text-center">RM History</h3>
            {rmHistory && rmHistory.length > 0 && selectedExercise?.currentRM !== 0.0 ? (
                <Bar
                    data={{
                        labels: rmHistory.map((entry) => new Date(entry.date).toLocaleDateString()),
                        datasets: [
                            {
                                label: '1RM Progress',
                                data: rmHistory.map((entry) => entry.rm),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            ) : (
                <p className="text-center text-gray-500">No RM history for this exercise</p>
            )}
        </div>
    );

    const renderSetObjectiveSection = () => (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Set RM Objective</h3>
            <div className="mb-2">
                <label className="block text-sm">Objective</label>
                <input
                    type="number"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Enter RM Objective"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        !objective ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSetObjectiveClick}
                    disabled={!objective}
                >
                    Set Objective
                </button>
            </div>
            {selectedExercise?.objective !== undefined && selectedExercise.objective !== 0.0 && (
                <div className={`mt-4 p-4 border rounded-lg ${objectiveReached ? 'bg-green-100' : 'bg-gray-100'} shadow-inner`}>
                    <h4 className="text-lg font-semibold text-center">Current Objective</h4>
                    <p className="text-center text-sm">Objective: {selectedExercise.objective}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className={`flex flex-col w-full transition-all duration-300 ${selectedExercise ? 'max-w-full' : 'max-w-2xl'} mx-auto p-4 space-x-4`}>
            {renderSearchSection()}
            {selectedExercise && (
                <div className="flex flex-col space-y-4">
                    {renderSetObjectiveSection()}
                    {renderRMHistory()}
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default SetRMComponent;

