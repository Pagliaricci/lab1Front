import React, { useState } from 'react';
import { FullProgressExercise } from '../../pages/ActiveRoutine';

interface Exercise {
    name: string;
    description: string;
    sets: string;
    reps: string;
    day: number;
}



interface ExerciseSliderProps {
    duration: number;
    exercisesByDay: Record<number, Exercise[] | FullProgressExercise[]>;
    onDayChange: (day: number) => void;
}

const ExerciseSlider: React.FC<ExerciseSliderProps> = ({ duration, onDayChange }) => {
    const totalDays = duration * 7;
    const [tooltip, setTooltip] = useState({ visible: false, value: 1, left: 0 });

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const day = parseInt(event.target.value, 10);
        onDayChange(day);
        const slider = event.target;
        const rect = slider.getBoundingClientRect();
        const left = ((day - 1) / (totalDays - 1)) * rect.width;
        setTooltip({ visible: true, value: day, left });
    };

    return (
        <div className="relative mb-8">
            <input
                type="range"
                min="1"
                max={totalDays}
                defaultValue="1"
                onChange={handleSliderChange}
                className="w-full h-4 bg-blue-500 rounded-lg appearance-none cursor-pointer"
                onMouseEnter={() => setTooltip((prev) => ({ ...prev, visible: true }))}
                onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
            />
            <style >{`
                input[type='range']::-webkit-slider-thumb {
                    width: 24px;
                    height: 24px;
                    background: #4a90e2;
                    border-radius: 50%;
                    cursor: pointer;
                    -webkit-appearance: none;
                    appearance: none;
                }
                input[type='range']::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: #4a90e2;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>
            {tooltip.visible && (
                <div
                    className="absolute top-0 left-0 transform -translate-y-8"
                    style={{ left: `${tooltip.left}px` }}
                >
                    <div className="bg-gray-700 text-white text-xs rounded py-1 px-2">
                        Day {tooltip.value}
                    </div>
                    <div className="w-2 h-2 bg-gray-700 transform rotate-45 -mt-1 mx-auto"></div>
                </div>
            )}
            <div className="flex justify-between mt-2">
                {Array.from({ length: totalDays }, (_, i) => (
                    <span key={i} className="text-sm text-gray-700">
                        {i + 1}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ExerciseSlider;