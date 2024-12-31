import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  delay?: number;
}

export default function LoadingScreen({ delay = 300 }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center z-50">
      <div className="text-center bg-white/50 rounded-lg p-4 shadow-lg">
        <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}