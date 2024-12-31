import { useChannels } from '../../hooks/useChannels';
import type { Channel } from '../../lib/types';

interface Props {
  selectedChannel: string | null;
  onSelect: (channelId: string) => void;
}

export default function ChannelSelector({ selectedChannel, onSelect }: Props) {
  const { data: channels, isLoading } = useChannels();

  if (isLoading) return <div>Loading channels...</div>;

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Channel</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {channels?.map((channel: Channel) => (
          <button
            key={channel.id}
            onClick={() => onSelect(channel.id)}
            className={`relative rounded-lg border p-4 flex flex-col
              ${selectedChannel === channel.id ? 
                'border-blue-500 ring-2 ring-blue-200' : 
                'border-gray-300 hover:border-gray-400'}`}
          >
            <h3 className="text-sm font-medium text-gray-900">{channel.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}