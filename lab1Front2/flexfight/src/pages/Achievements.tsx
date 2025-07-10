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
                    onClick={() => navigate("/home")}
                    className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-orange-200/30"
                >
                    <TiArrowBackOutline className="text-xl text-orange-600" />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Achievements</h1>
                    <p className="text-gray-600">Stay consistent, and success will follow!</p>
                </div>

                {/* Content */}
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                    {achievements.length > 0 ? (
                        <div className="space-y-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-orange-200/30 shadow-sm">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800">{achievement.objectiveName}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50/80 rounded-lg p-3 border border-blue-200/50">
                                                <p className="text-sm font-medium text-blue-600">Date</p>
                                                <p className="text-blue-800 font-semibold">{new Date(achievement.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/50">
                                                <p className="text-sm font-medium text-orange-600">Objective Value</p>
                                                <p className="text-orange-800 font-semibold">{achievement.objectiveValue}</p>
                                            </div>
                                            <div className="bg-green-50/80 rounded-lg p-3 border border-green-200/50">
                                                <p className="text-sm font-medium text-green-600">Current Value</p>
                                                <p className="text-green-800 font-semibold">{achievement.currentValue}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500 text-lg">No achievements found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Achievements;