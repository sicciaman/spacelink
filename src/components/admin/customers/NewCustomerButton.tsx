import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function NewCustomerButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Customer
    </button>
  );
}