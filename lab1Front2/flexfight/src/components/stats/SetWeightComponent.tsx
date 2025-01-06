import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToggleSwitch from './ToggleSwitch';

interface WeightHistory {
    date: string;
    weight: number;
}

interface SetWeightProps {
    userId: string | null;
    userHeight: number | null;
}

const SetWeightComponent: React.FC<SetWeightProps> = ({ userId, userHeight }) => {
    const [weight, setWeight] = useState<number | string>('');
    const [objective, setObjective] = useState<number | string>('');
    const [weightHistory, setWeightHistory] = useState<WeightHistory[] | null>(null);
    const [objectiveReached, setObjectiveReached] = useState(false);
    const [currentWeight, setCurrentWeight] = useState<number | null>(null);
    const [currentWeightObjective, setCurrentWeightObjective] = useState<number | null>(null);
    const [isHigherObjective, setIsHigherObjective] = useState(false);
    const [isHigher, setIsHigher] = useState(true);
    const [imc, setImc] = useState<number | null>(null);

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
                setCurrentWeight(data);
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
                setCurrentWeightObjective(data.objective);
                setIsHigherObjective(data.isHigher)

            } else {
                setCurrentWeightObjective(null);
            }
        } catch (error) {
            console.error("Error fetching current weight objective:", error);
            setCurrentWeightObjective(null);
        }
    }, [userId]);

    const calculateIMC = (weight: number, height: number) => {
        if (height > 0) {
            return (weight / ((height / 100) ** 2)).toFixed(2);
        }
        return null;
    };

    useEffect(() => {
        if (currentWeight !== null && userHeight !== null) {
            setImc(Number(calculateIMC(currentWeight, userHeight)));
        }
    }, [currentWeight, userHeight]);

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
                if (currentWeightObjective !== null) {
                    const objectiveReached = isHigherObjective
                        ? Number(weight) >= currentWeightObjective
                        : Number(weight) <= currentWeightObjective;
                    if (objectiveReached) {
                        toast.success(`Congratulations! You have reached your weight objective of ${isHigherObjective ? 'higher than' : 'lower than'} ${currentWeightObjective} kg.`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setObjectiveReached(true);
                    } else {
                        toast.success(`Weight set successfully: ${weight} kg`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                } else {
                    toast.success(`Weight set successfully: ${weight} kg`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                fetchWeightHistory();
                fetchCurrentWeight();
                fetchCurrentWeightObjective();
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
                toast.success(`Weight objective set successfully: ${objective} kg ${isHigher ? 'higher than' : 'lower than'}`, {
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

    const renderIMCHistory = () => (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">IMC History</h3>
            {weightHistory && weightHistory.length > 0 ? (
                <Bar
                    data={{
                        labels: weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
                        datasets: [{
                            label: 'IMC Progress',
                            data: weightHistory.map(entry => calculateIMC(entry.weight, userHeight!)),
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
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
                <p className="text-center text-gray-500">No IMC history available</p>
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
            <ToggleSwitch isHigher={isHigher} setIsHigher={setIsHigher} />
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
                    <p className="text-center text-sm">Objective: {isHigherObjective ? 'Higher than' : 'Lower than'} {currentWeightObjective} kg </p>
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
                {imc !== null && (
                    <p className="text-center text-sm mb-4">Current IMC: {imc} kg/m^2</p>
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
            {renderIMCHistory()}
            {renderSetObjectiveSection()}
            <ToastContainer />
        </div>
    );
};

export default SetWeightComponent;