import { useState } from 'react';
import { useCreatorChannels } from '../../hooks/useCreatorChannels';
import CreatorChannelCard from './CreatorChannelCard';
import { Plus } from 'lucide-react';
import CreatorChannelForm from './CreatorChannelForm';

export default function CreatorChannelList() {
  const { channels, isLoading } = useCreatorChannels();
  const [showNewForm, setShowNewForm] = useState(false);

  if (isLoading) return <div>Loading channels...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Your Channels</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </button>
      </div>

      {showNewForm && (
        <CreatorChannelForm
          onClose={() => setShowNewForm(false)}
          onSuccess={() => setShowNewForm(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {channels?.map((channel) => (
          <CreatorChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}