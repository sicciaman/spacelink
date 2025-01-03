import { useState } from 'react';
import { Settings } from 'lucide-react';
import type { Channel } from '../../../lib/types';
import ChannelSettingsModal from '../../creator/ChannelSettingsModal';

interface Props {
  channel: Channel;
}

export default function ChannelSettingsCard({ channel }: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          {channel.logo_url ? (
            <img
              src={channel.logo_url}
              alt={channel.name}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {channel.name[0]}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{channel.name}</h3>
            <p className="text-sm text-gray-500">{channel.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Settings
        </button>
      </div>

      {showSettings && (
        <ChannelSettingsModal
          channel={channel}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}