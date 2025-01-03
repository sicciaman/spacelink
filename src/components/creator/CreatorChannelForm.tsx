import { useState } from 'react';
import { useCreatorChannels } from '../../hooks/useCreatorChannels';
import type { Channel } from '../../lib/types';

interface Props {
  channel?: Channel;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatorChannelForm({ channel, onClose, onSuccess }: Props) {
  const { createChannel, updateChannel } = useCreatorChannels();
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    description: channel?.description || '',
    telegram_url: channel?.telegram_url || '',
    type: channel?.type || 'main',
    logo_url: channel?.logo_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (channel) {
        await updateChannel.mutateAsync({
          channelId: channel.id,
          updates: formData
        });
      } else {
        await createChannel.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving channel:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Channel Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="telegram_url" className="block text-sm font-medium text-gray-700">
          Telegram URL *
        </label>
        <input
          type="url"
          id="telegram_url"
          required
          value={formData.telegram_url}
          onChange={(e) => setFormData(prev => ({ ...prev, telegram_url: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Channel Type *
        </label>
        <select
          id="type"
          required
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="main">Main</option>
          <option value="specialized">Specialized</option>
        </select>
      </div>

      <div>
        <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          id="logo_url"
          value={formData.logo_url}
          onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {channel ? 'Save Changes' : 'Create Channel'}
        </button>
      </div>
    </form>
  );
}