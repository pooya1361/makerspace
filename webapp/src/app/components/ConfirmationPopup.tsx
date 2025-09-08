import { useEffect, useRef } from 'react';

interface ConfirmationPopupProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
}

export function ConfirmationPopup({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    destructive = true
}: ConfirmationPopupProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    // Focus management and keyboard handling
    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus the dialog or first focusable element
            setTimeout(() => {
                if (confirmButtonRef.current) {
                    confirmButtonRef.current.focus();
                }
            }, 100);

            // Handle escape key
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onCancel();
                }
            };

            // Trap focus within dialog
            const handleTab = (event: KeyboardEvent) => {
                if (event.key === 'Tab' && dialogRef.current) {
                    const focusableElements = dialogRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (event.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleEscape);
            document.addEventListener('keydown', handleTab);

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('keydown', handleTab);
            };
        } else {
            // Return focus to previous element when dialog closes
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }
    }, [isOpen, onCancel]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // If the popup is not open, return null to render nothing
    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (event: React.MouseEvent) => {
        // Close dialog if clicking on overlay (not the dialog content)
        if (event.target === event.currentTarget) {
            onCancel();
        }
    };

    return (
        // Overlay for the popup, covering the entire screen
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleOverlayClick}
            aria-hidden="true"
        >
            {/* Popup container */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-auto transform transition-all duration-300 motion-reduce:transition-none ease-out scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Message section */}
                <div className="text-center mb-6">
                    <h2
                        id="dialog-title"
                        className="text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed"
                    >
                        Confirm Action
                    </h2>
                    <p
                        id="dialog-description"
                        className="text-gray-700 mt-2"
                    >
                        {message}
                    </p>
                </div>

                {/* Buttons section */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* Cancel button */}
                    <button
                        onClick={onCancel}
                        className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 motion-reduce:transition-none ease-in-out"
                        type="button"
                    >
                        {cancelText}
                    </button>

                    {/* Confirm button */}
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        className={`flex-1 px-5 py-2.5 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 motion-reduce:transition-none ease-in-out ${destructive
                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}