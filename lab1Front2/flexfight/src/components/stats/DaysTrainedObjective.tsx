import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface DaysTrainedObjectiveProps {
    userId: string | null;
    trainingDaysByMonth: { [key: string]: number };
    daysTrainedThisMonth: number;
}

const DaysTrainedObjective: React.FC<DaysTrainedObjectiveProps> = ({ userId, trainingDaysByMonth, daysTrainedThisMonth }) => {
    const [objective, setObjective] = useState<number | string>('');
    const [currentObjective, setCurrentObjective] = useState<number | string>('');
    const [currentMonth] = useState<string>(new Date().toLocaleDateString('default', { year: 'numeric', month: 'long' }));
    const [objectiveReached, setObjectiveReached] = useState(false);
    const [isShowned, setIsShowned] = useState(false);

    useEffect(() => {
        const fetchObjective = async () => {
            if (!userId) {
                console.error("UserId is missing.");
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api/rm/get-days-trained-objective', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentObjective(data);
                    console.log("Current objective:", data);
                    console.log("Days trained this month:", daysTrainedThisMonth);
                    if (daysTrainedThisMonth >= Number(data)) {
                        setObjectiveReached(true);
                        if (!isShowned) {
                            toast.success(`Congratulations! You have reached your training objective of ${data} days for ${currentMonth}.`);
                            setIsShowned(true);
                        }
                        console.log("Objective reached:", objectiveReached);
                    }
                } else {
                    const errorText = await response.text();
                    console.error("Failed to fetch training days objective:", errorText);
                }
            } catch (error) {
                console.error("Error fetching training days objective:", error);
            }
        };

        fetchObjective();
    }, [userId, daysTrainedThisMonth]);

    const handleSetObjectiveClick = async () => {
        if (!objective || !userId) {
            console.error("Objective or userId is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/rm/set-days-trained-objective', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, objective }),
            });

            if (response.ok) {
                setCurrentObjective(objective); // Update current objective
            } else {
                const errorText = await response.text();
                console.error("Failed to set training days objective:", errorText);
            }
        } catch (error) {
            console.error("Error setting training days objective:", error);
        }
    };

    return (
        <div className="mt-4 p-6 border rounded-lg bg-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Set Training Days Objective</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Objective</label>
                <input
                    type="number"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full p-2 border rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Days Objective"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!objective ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSetObjectiveClick}
                    disabled={!objective}
                >
                    Set Objective
                </button>
            </div>
            {currentObjective && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100 shadow-inner">
                    <h4 className="text-lg font-semibold text-center text-gray-800">Current Objective</h4>
                    <p className="text-center text-sm text-gray-700">Your current training objective is {currentObjective} {currentObjective === 1 ? 'day' : 'days'}.</p>
                </div>
            )}
            {objectiveReached && (
                <div className="mt-4 p-4 border rounded-lg bg-green-100 shadow-inner">
                    <h4 className="text-lg font-semibold text-center text-green-800">Objective Reached</h4>
                    <p className="text-center text-sm text-green-700">You have reached your training objective of {currentObjective} days for {currentMonth}.</p>
                </div>
            )}
        </div>
    );
};

export default DaysTrainedObjective;