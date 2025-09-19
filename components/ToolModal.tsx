import React, { useEffect } from 'react';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, title, isLoading, error, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="flex justify-between items-center p-4 border-b border-stone-200">
          <h3 id="tool-modal-title" className="text-lg font-bold font-cinzel text-stone-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 h-64">
                <svg className="animate-spin h-8 w-8 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-stone-600 font-semibold">LUNNO is working its magic...</p>
                <p className="text-sm text-stone-500">This might take a moment.</p>
            </div>
          )}
          {error && (
            <div className="text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">
                <strong className="font-bold">Oh no!</strong>
                <p>{error}</p>
            </div>
           )}
          {!isLoading && !error && children}
        </main>
      </div>
    </div>
  );
};

export default ToolModal;
