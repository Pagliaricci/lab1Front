import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface WeightHistory {
    date: string;
    weight: number;
}

interface SetWeightProps {
    userId: string | null;
}

const SetWeightComponent: React.FC<SetWeightProps> = ({ userId }) => {
    const [weight, setWeight] = useState<number | string>('');
    const [objective, setObjective] = useState<number | string>('');
    const [weightHistory, setWeightHistory] = useState<WeightHistory[] | null>(null);
    const [objectiveReached, setObjectiveReached] = useState(false);
    const [currentWeight, setCurrentWeight] = useState<number | null>(null);
    const [currentWeightObjective, setCurrentWeightObjective] = useState<number | null>(null);
    const [isHigher, setIsHigher] = useState(true);

    const fetchWeightHistory = useCallback(async () => {
        if (!userId) {
            console.error("Invalid parameter: userId is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/get-weight-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                setWeightHistory(data);
            } else {
                setWeightHistory(null);
            }
        } catch (error) {
            console.error("Error fetching weight history:", error);
            setWeightHistory(null);
        }
    }, [userId]);

    const fetchCurrentWeight = useCallback(async () => {
        if (!userId) {
            console.error("Invalid parameter: userId is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/get-current-weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentWeight(data.weight);
            } else {
                setCurrentWeight(null);
            }
        } catch (error) {
            console.error("Error fetching current weight:", error);
            setCurrentWeight(null);
        }
    }, [userId]);

    const fetchCurrentWeightObjective = useCallback(async () => {
        if (!userId) {
            console.error("Invalid parameter: userId is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/get-weight-objective', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentWeightObjective(data);
            } else {
                setCurrentWeightObjective(null);
            }
        } catch (error) {
            console.error("Error fetching current weight objective:", error);
            setCurrentWeightObjective(null);
        }
    }, [userId]);

    const handleSetWeightClick = async () => {
        if (!userId || !weight) {
            console.error("Invalid parameters: userId or weight is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/set-weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, weight }),
            });

            if (response.ok) {
                toast.success(`Weight set successfully: ${weight} kg`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchWeightHistory();
                fetchCurrentWeight();
                fetchCurrentWeightObjective();
                if (objective && Number(weight) >= Number(objective)) {
                    toast.success(`Congratulations! You have reached your weight objective of ${objective} kg.`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setObjectiveReached(true);
                }
                setWeight('');
            } else {
                const errorText = await response.text();
                console.error("Failed to set weight:", errorText);
            }
        } catch (error) {
            console.error("Error setting weight:", error);
        }
    };

    const handleSetObjectiveClick = async () => {
        if (!userId || !objective) {
            console.error("Invalid parameters: userId or objective is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/set-weight-objective', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, objective, isHigher }),
            });

            if (response.ok) {
                toast.success(`Weight objective set successfully: ${objective} kg`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setObjectiveReached(false);
                setObjective('');
                fetchCurrentWeightObjective();
            } else {
                const errorText = await response.text();
                console.error("Failed to set weight objective:", errorText);
            }
        } catch (error) {
            console.error("Error setting weight objective:", error);
        }
    };

    useEffect(() => {
        fetchWeightHistory();
        fetchCurrentWeight();
        fetchCurrentWeightObjective();
    }, [fetchWeightHistory, fetchCurrentWeight, fetchCurrentWeightObjective]);

    const renderWeightHistory = () => (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Weight History</h3>
            {weightHistory && weightHistory.length > 0 ? (
                <Bar
                    data={{
                        labels: weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
                        datasets: [{
                            label: 'Weight Progress',
                            data: weightHistory.map(entry => entry.weight),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }],
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
                <p className="text-center text-gray-500">No weight history available</p>
            )}
        </div>
    );

    const renderSetObjectiveSection = () => (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Set Weight Objective</h3>
            <div className="mb-2">
                <label className="block text-sm">Objective</label>
                <input
                    type="number"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Enter Weight Objective"
                />
            </div>
            <div className="mb-2 flex items-center">
                <label className="block text-sm mr-2">Higher</label>
                <input
                    type="checkbox"
                    checked={isHigher}
                    onChange={() => setIsHigher(!isHigher)}
                    className="mr-2"
                />
                <label className="block text-sm">Lower</label>
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
            {currentWeightObjective !== null && (
                <div className={`mt-4 p-4 border rounded-lg ${objectiveReached ? 'bg-green-100' : 'bg-gray-100'} shadow-inner`}>
                    <h4 className="text-lg font-semibold text-center">Current Objective</h4>
                    <p className="text-center text-sm">Objective: {currentWeightObjective} kg</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4">
            <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center">Set Weight</h3>
                {currentWeight !== null && (
                    <p className="text-center text-sm mb-4">Current Weight: {currentWeight} kg</p>
                )}
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
                            !weight ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSetWeightClick}
                        disabled={!weight}
                    >
                        Set Weight
                    </button>
                </div>
            </div>
            {renderWeightHistory()}
            {renderSetObjectiveSection()}
            <ToastContainer />
        </div>
    );
};

export default SetWeightComponent;