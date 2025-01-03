import { useChannelSettings } from '../../hooks/useChannelSettings';
import { useCreator } from '../../hooks/useCreator';
import type { Channel } from '../../lib/types';
import AvailabilitySettings from '../admin/settings/AvailabilitySettings';

interface Props {
  channel: Channel;
}

export default function ChannelAvailabilitySettings({ channel }: Props) {
  const { creator } = useCreator();
  const { settings, updateSettings, isLoading } = useChannelSettings(channel.id, creator?.id || '');

  if (!creator || isLoading) return null;

  return (
    <div>
      <AvailabilitySettings
        initialSettings={settings?.settings}
        onSave={async (newSettings) => {
          await updateSettings.mutateAsync(newSettings);
        }}
      />
    </div>
  );
}