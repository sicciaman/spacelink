import { useCreatorChannels } from '../../../hooks/useCreatorChannels';
import { motion } from 'framer-motion';
import ChannelSettingsCard from './ChannelSettingsCard';

export default function Network() {
  const { channels, isLoading } = useCreatorChannels();

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Channel Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage availability and settings for your channels
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {channels?.map((channel) => (
            <ChannelSettingsCard key={channel.id} channel={channel} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}