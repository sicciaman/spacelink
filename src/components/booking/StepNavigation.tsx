import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  canGoBack?: boolean;
  onBack?: () => void;
}

export default function StepNavigation({ 
  title, 
  canGoBack = false, 
  onBack 
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      {canGoBack && onBack ? (
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      ) : (
        <div />
      )}
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <div />
    </div>
  );
}