import React, { useState } from 'react';

interface RateRoutineCardProps {
    routineId: string;
    onSubmitRating: (routineId: string, rating: number) => void;
}

const RateRoutineCard: React.FC<RateRoutineCardProps> = ({ routineId, onSubmitRating }) => {
    const [rating, setRating] = useState<number>(0);

    const handleRating = (rate: number) => {
        setRating(rate);
    };

    const handleSubmit = () => {
        onSubmitRating(routineId, rating);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Rate this Routine</h2>
            <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => handleRating(star)}
                    >
                        ★
                    </button>
                ))}
            </div>
            <button
                className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                onClick={handleSubmit}
                disabled={rating === 0}
            >
                Submit Rating
            </button>
        </div>
    );
};

export default RateRoutineCard;