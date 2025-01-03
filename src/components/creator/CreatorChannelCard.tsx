import { useState } from 'react';
import { Edit2, Settings } from 'lucide-react';
import type { Channel } from '../../lib/types';
import CreatorChannelForm from './CreatorChannelForm';
import ChannelSettingsModal from './ChannelSettingsModal';

interface Props {
  channel: Channel;
}

export default function CreatorChannelCard({ channel }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {isEditing ? (
        <CreatorChannelForm
          channel={channel}
          onClose={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-4">
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
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Telegram URL:</span>{' '}
              <a
                href={channel.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500"
              >
                {channel.telegram_url}
              </a>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>{' '}
              <span className="capitalize">{channel.type}</span>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <ChannelSettingsModal
          channel={channel}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}