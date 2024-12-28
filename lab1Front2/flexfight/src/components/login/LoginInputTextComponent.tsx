// InputTextComponent.tsx
import  { forwardRef } from 'react';

interface InputTextComponentProps {
    label: string;
    type: string;
    name: string;
}

const InputTextComponent = forwardRef<HTMLInputElement, InputTextComponentProps>(({ label, type, name }, ref) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                {label}
            </label>
            <input
                ref={ref}
                type={type}
                name={name}
                id={name}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    );
});

export default InputTextComponent;