import React from 'react';

interface DateOfBirthComponentProps {
    label: string;
    name: string;
    dayRef: React.RefObject<HTMLInputElement>;
    monthRef: React.RefObject<HTMLInputElement>;
    yearRef: React.RefObject<HTMLInputElement>;
}

const DateOfBirthComponent: React.FC<DateOfBirthComponentProps> = ({ label, name, dayRef, monthRef, yearRef }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const invalidKeys = ['e', 'E', '+', '-', '.'];
        if (invalidKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <div className="flex space-x-2">
                    <input
                        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name={`${name}-day`}
                        placeholder="DD"
                        maxLength={2}
                        ref={dayRef}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name={`${name}-month`}
                        placeholder="MM"
                        maxLength={2}
                        ref={monthRef}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name={`${name}-year`}
                        placeholder="YYYY"
                        maxLength={4}
                        ref={yearRef}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </label>
        </div>
    );
};

export default DateOfBirthComponent;
