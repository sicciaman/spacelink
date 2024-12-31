import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircle, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils/styles';

interface Props {
  signOut: () => void;
}

export default function UserNav({ signOut }: Props) {
  const location = useLocation();

  return (
    <div className="flex items-center space-x-6">
      <Link
        to="/help"
        className={cn(
          "flex items-center text-sm font-medium",
          location.pathname === '/help'
            ? "text-blue-600 hover:text-blue-700"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        Help
      </Link>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <UserCircle className="w-4 h-4 mr-1" />
          Account
        </Menu.Button>

        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                )}
              >
                <UserCircle className="mr-3 h-4 w-4" />
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={signOut}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm',
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                )}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}