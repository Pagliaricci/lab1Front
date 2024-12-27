import { forwardRef, useImperativeHandle, useState } from 'react';
import SwitchButton from './SwitchButton';

interface SignUpSwitchProps {
    options: string[];
    selectedOption: string;
    onClick: (option: string) => void;
    label?: string;
}

const SwitchComponent = forwardRef<{}, SignUpSwitchProps>(({ options, selectedOption, onClick, label }, ref) => {
    const [currentOption, setCurrentOption] = useState(selectedOption);

    useImperativeHandle(ref, () => ({
        toString() {
            return currentOption;
        }
    }));

    const handleOptionClick = (option: string) => {
        setCurrentOption(option);
        onClick(option);
    };

    return (
        <div className="flex items-center py-1">
            {label && <span className="mr-4 w-20 text-sm">{label}</span>}
            <div className="flex space-x-2">
                {options.map(option => (
                    <SwitchButton
                        key={option}
                        text={option}
                        type="button"
                        variant={currentOption === option ? 'tertiary' : 'primary'}
                        onClick={() => handleOptionClick(option)}
                    />
                ))}
            </div>
        </div>
    );
});

export default SwitchComponent;