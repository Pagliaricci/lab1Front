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

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 1: return "Poor";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Very Good";
            case 5: return "Excellent";
            default: return "Select a rating";
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-orange-100 max-w-md w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Rate this Routine</h2>
                <p className="text-gray-600">How was your workout experience?</p>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`text-5xl mx-1 transition-all duration-200 transform hover:scale-110 ${
                            star <= rating 
                                ? 'text-orange-500 hover:text-orange-600' 
                                : 'text-gray-300 hover:text-orange-300'
                        }`}
                        onClick={() => handleRating(star)}
                    >
                        ★
                    </button>
                ))}
            </div>

            {/* Rating Text */}
            <div className="text-center mb-8">
                <p className={`text-lg font-semibold ${rating > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {getRatingText(rating)}
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    className={`py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                        rating === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                    }`}
                    onClick={handleSubmit}
                    disabled={rating === 0}
                >
                    Submit Rating
                </button>
            </div>
        </div>
    );
};

export default RateRoutineCard;