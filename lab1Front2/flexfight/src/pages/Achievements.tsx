import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";

interface ObjRecord {
    id: string;
    userId: string;
    date: string;
    objectiveName: string;
    objectiveValue: number;
    currentValue: number;
}

const Achievements = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [achievements, setAchievements] = useState<ObjRecord[]>([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch("http://localhost:8081/users/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.userID);
                    fetchAchievements(userData.userID);
                } else {
                    console.error("Failed to fetch user ID");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        const fetchAchievements = async (userId: string) => {
            try {
                const response = await fetch(`http://localhost:8081/api/rm/getAll-objective-record?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAchievements(data);
                } else {
                    console.error("Failed to fetch achievements:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching achievements:", error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-800">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={() => navigate("/home")} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Achievements</h1>
                <p className="text-xl mb-8">Stay consistent, and success will follow!</p>
                {achievements.length > 0 ? (
                    <div className="w-full max-w-2xl bg-white bg-opacity-65 p-8 rounded-lg shadow-md">
                        {achievements.map((achievement) => (
                            <div key={achievement.id} className="mb-4 p-4 border-b border-gray-300">
                                <p className="text-lg font-bold">{achievement.objectiveName}</p>
                                <p>Date: {achievement.date}</p>
                                <p>Objective Value: {achievement.objectiveValue}</p>
                                <p>Current Value: {achievement.currentValue}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No achievements found.</p>
                )}
            </div>
        </div>
    );
};

export default Achievements;