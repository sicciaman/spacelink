import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { cn } from '../../../lib/utils/styles';

interface Props {
  customerId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomerActions({ customerId, onEdit, onDelete }: Props) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onEdit}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                )}
              >
                <Edit2 className="mr-3 h-4 w-4" />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDelete}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm',
                  active ? 'bg-gray-100 text-red-700' : 'text-red-600'
                )}
              >
                <Trash2 className="mr-3 h-4 w-4" />
                Delete
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}