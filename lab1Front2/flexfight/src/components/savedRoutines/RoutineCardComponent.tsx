import { FaTimes } from 'react-icons/fa';

interface RoutineCardProps {
    name: string;
    duration: number;
    intensity: string;
    onClick?: () => void;
    isActive: boolean;
    onActivate?: () => void;
    onDelete?: () => void;
    onDeactivate?: () => void;
    onShare?: () => void;
    onShowHistory?: () => void;
    userRole: string;
}

const RoutineCardComponent: React.FC<RoutineCardProps> = ({
    name,
    duration,
    intensity,
    onClick,
    isActive,
    onActivate,
    onDelete,
    onDeactivate,
    onShare,
    onShowHistory,
    userRole,
}) => {
    return (
        <div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-orange-100 relative group"
            onClick={onClick}
        >
            {/* Delete Button */}
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                }}
                title="Delete routine"
            >
                <FaTimes size={18} />
            </button>

            {/* Status Badge */}
            {isActive && (
                <div className="absolute top-4 left-4">
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                    </span>
                </div>
            )}

            {/* Content */}
            <div className={`${isActive ? 'mt-8' : ''}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}</h2>
                
                {/* Info and Actions Row */}
                <div className="flex justify-between items-center">
                    {/* Info Pills */}
                    <div className="flex space-x-3">
                        <div className="bg-orange-200 px-4 py-2 rounded-full border border-orange-300">
                            <span className="text-sm text-gray-800 font-semibold">
                                Duration: {duration} {duration === 1 ? 'week' : 'weeks'}
                            </span>
                        </div>
                        <div className="bg-blue-200 px-4 py-2 rounded-full border border-blue-300">
                            <span className="text-sm text-gray-800 font-semibold">
                                Intensity: {intensity}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {userRole === 'User' && (
                            <button
                                className={`py-2 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg' 
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isActive) {
                                        onDeactivate?.();
                                    } else {
                                        onActivate?.();
                                    }
                                }}
                            >
                                {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        )}

                        {userRole === 'Trainer' && (
                            <>
                                {onShare && (
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShare?.();
                                        }}
                                    >
                                        Share
                                    </button>
                                )}
                                {onShowHistory && (
                                    <button
                                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShowHistory?.();
                                        }}
                                    >
                                        Show History
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutineCardComponent;