import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

export const Notification = ({
  message,
  type,
  onClose,
  duration = 3000
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white ${getBackgroundColor()} 
        shadow-lg transition-all duration-300 ease-in-out z-50 flex items-center gap-2`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification; 