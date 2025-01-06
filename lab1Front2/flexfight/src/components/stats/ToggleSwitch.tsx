import React from 'react';

interface ToggleSwitchProps {
    isHigher: boolean;
    setIsHigher: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isHigher, setIsHigher }) => {
    return (
        <div className="mb-2 flex items-center">
            <label className={`block text-sm mr-2 ${!isHigher ? 'text-blue-500 font-bold' : ''}`}>Higher</label>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                    type="checkbox"
                    checked={isHigher}
                    onChange={() => setIsHigher(!isHigher)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    style={{ transform: isHigher ? 'translateX(100%)' : 'translateX(0)' }}
                />
                <span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"></span>
            </div>
            <label className={`block text-sm ${isHigher ? 'text-blue-500 font-bold' : ''}`}>Lower</label>
        </div>
    );
};

export default ToggleSwitch;