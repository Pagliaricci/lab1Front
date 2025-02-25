// lab1Front2/flexfight/src/components/savedRoutines/SubscriptionHistoryModal.tsx
import React from 'react';

interface SubscriberHistoryWithName {
    id: string;
    username: string;
    routineId: string;
    subscriptionDate: string;
}

interface SubscriptionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionHistory: SubscriberHistoryWithName[];
}

const SubscriptionHistoryModal: React.FC<SubscriptionHistoryModalProps> = ({ isOpen, onClose, subscriptionHistory }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
                <h2 className="text-3xl font-bold mb-4">Subscription History</h2>
                <button className="absolute top-4 right-4 text-red-600 hover:text-red-800" onClick={onClose}>
                    Close
                </button>
                {subscriptionHistory.length > 0 ? (
                    subscriptionHistory.map((subscriber) => (
                        <div key={subscriber.id} className="mb-4 p-4 border-b border-gray-300">
                            <p className="text-lg font-bold">{subscriber.username}</p>
                            <p>Subscription Date : {subscriber.subscriptionDate}</p>
                        </div>
                    ))
                ) : (
                    <p>No subscription history found.</p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionHistoryModal;