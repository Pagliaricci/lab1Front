import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
    onClose: () => void;
    onGenerateLink: (routineId: string) => void;
    onGenerateQR: (routineId: string) => void;
    routineId: string;
    qrRoutine: string | null; // Accept QR code value
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, onGenerateLink, onGenerateQR, routineId, qrRoutine }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 text-center">
                <h2 className="text-xl font-bold mb-4">Share Routine</h2>
                <div className="flex flex-col space-y-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 max-w-xs mx-auto w-full"
                        onClick={() => onGenerateLink(routineId)}
                    >
                        Copy Link
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 max-w-xs mx-auto w-full"
                        onClick={() => onGenerateQR(routineId)}
                    >
                        Generate QR
                    </button>

                    {/* Display QR Code */}
                    {qrRoutine && (
                        <div className="flex flex-col items-center mt-4">
                            <p className="text-green-600">Scan this QR Code:</p>
                            <QRCodeSVG value={qrRoutine} />
                        </div>
                    )}

                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 max-w-xs mx-auto w-full"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
