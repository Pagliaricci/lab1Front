import React, { forwardRef } from 'react';

interface SignUpInputComponentProps {
    label: string;
    name: string;
}

const SignUpInputComponent = forwardRef<HTMLInputElement, SignUpInputComponentProps>(({ label, name }, ref) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name={name}
                    ref={ref}
                    onKeyPress={handleKeyPress}
                    pattern="\d*"
                />
            </label>
        </div>
    );
});

export default SignUpInputComponent;