import { useEffect } from 'react';

type ToastProps = {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const colors =
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 text-white rounded-xl shadow-lg ${colors}`} style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
      {message}
    </div>
  );
}
