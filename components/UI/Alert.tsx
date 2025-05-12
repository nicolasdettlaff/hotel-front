import React from "react";

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
  className?: string;
  onClose?: () => void;
}

export default function Alert({
  type,
  message,
  className = "",
  onClose,
}: AlertProps) {
  const alertStyles = {
    success: "bg-green-50 text-green-800 border-green-300",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-300",
    error: "bg-red-50 text-red-800 border-red-300",
    info: "bg-blue-50 text-blue-800 border-blue-300",
  };

  return (
    <div className={`border-l-4 p-4 rounded ${alertStyles[type]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Cerrar</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
