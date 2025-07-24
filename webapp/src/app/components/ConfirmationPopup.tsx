interface ConfirmationPopupProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
export function ConfirmationPopup({ isOpen, message, onConfirm, onCancel }: ConfirmationPopupProps) {
    // If the popup is not open, return null to render nothing
    if (!isOpen) {
        return null;
    }

    return (
        // Overlay for the popup, covering the entire screen
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            {/* Popup container */}
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100">
                {/* Message section */}
                <div className="text-center mb-6">
                    <p className="text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Buttons section */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* Cancel button */}
                    <button
                        onClick={onCancel}
                        className="flex-1 px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    >
                        Cancel
                    </button>
                    {/* Confirm button */}
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}