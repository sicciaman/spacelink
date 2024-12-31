import { User } from 'lucide-react';
import { useCustomerProfile } from '../../hooks/useCustomerProfile';

export default function ProfileDetails() {
  const { profile } = useCustomerProfile();

  if (!profile) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 rounded-full p-2">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="ml-3 text-lg font-medium text-gray-900">Profile Information</h2>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">First Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.first_name || '-'}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Last Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.last_name || '-'}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Company</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.company || '-'}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Telegram Username</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile.telegram_username || '-'}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">Member Since</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(profile.created_at).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          To update your profile information, please contact support.
        </p>
      </div>
    </div>
  );
}