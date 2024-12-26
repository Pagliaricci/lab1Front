import  { forwardRef, useImperativeHandle, useState } from 'react';
import SwitchButton from './SwitchButton';

interface SignUpSwitchProps {
    option1: string;
    option2: string;
    selectedOption: string;
    onclick: (option: string) => void; // Agregamos esta propiedad
    label?: string;
}

const SwitchComponent = forwardRef<{}, SignUpSwitchProps>(({ option1, option2, selectedOption, onclick, label }, ref) => {
    const [currentOption, setCurrentOption] = useState(selectedOption);

    useImperativeHandle(ref, () => ({
        toString() {
            return currentOption;
        }
    }));

    const handleOptionClick = (option: string) => {
        setCurrentOption(option);
        onclick(option); // Notificar al padre sobre el cambio
    };

    return (
        <div className="flex items-center py-1">
            {label && <span className="mr-4 w-20">{label}</span>}
            <div className="flex space-x-2">
                <SwitchButton
                    text={option1}
                    type="button"
                    variant={currentOption === option1 ? 'tertiary' : 'primary'}
                    onClick={() => handleOptionClick(option1)}
                />
                <SwitchButton
                    text={option2}
                    type="button"
                    variant={currentOption === option2 ? 'tertiary' : 'primary'}
                    onClick={() => handleOptionClick(option2)}
                />
            </div>
        </div>
    );
});

export default SwitchComponent;
