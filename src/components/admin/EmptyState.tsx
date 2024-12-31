import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-50">
        <Icon className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
        {description}
      </p>
    </div>
  );
}