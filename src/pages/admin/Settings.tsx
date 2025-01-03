import { useState } from 'react';
import AvailabilitySettings from '../../components/admin/settings/AvailabilitySettings';

type SettingsTab = 'availability';

export default function Settings() {
  const [activeTab] = useState<SettingsTab>('availability');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage global settings for all channels
        </p>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          {/* <AvailabilitySettings/> */}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}