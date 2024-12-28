import React, { useState } from 'react';

const CRDurationButtonComponent: React.FC = () => {
    const [duration, setDuration] = useState(1);
    const maxDuration = 4;
    const minDuration = 1;

    const incrementDuration = () => {
        if (duration < maxDuration) {
            setDuration(duration + 1);
        }
    };

    const decrementDuration = () => {
        if (duration > minDuration) {
            setDuration(duration - 1);
        }
    };

    return (
        <div className="flex items-center mb-4">
            <button
                type="button"
                className={`py-2 px-4 rounded-l font-bold ${
                    duration <= minDuration
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                }`}
                onClick={decrementDuration}
                disabled={duration <= minDuration}
            >
                -
            </button>
            <span className="px-4 py-2 bg-white border-t border-b border-gray-300 text-gray-800">
                {duration} weeks
            </span>
            <button
                type="button"
                className={`py-2 px-4 rounded-r font-bold ${
                    duration >= maxDuration
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                }`}
                onClick={incrementDuration}
                disabled={duration >= maxDuration}
            >
                +
            </button>
        </div>
    );
};

export default CRDurationButtonComponent;
