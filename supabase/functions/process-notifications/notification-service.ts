import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { config } from './config.ts';
import { NotificationData, EnrichedData } from './types.ts';

export class NotificationService {
  private supabase;

  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
  }

  async getPendingNotifications(): Promise<NotificationData[]> {
    const { data, error } = await this.supabase
      .from('admin_notifications')
      .select('*')
      .is('sent_at', null)
      .is('error', null)
      .order('created_at')
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async enrichNotificationData(notification: NotificationData): Promise<EnrichedData> {
    const data = notification.data;

    const { data: userData } = await this.supabase
      .from('user_profiles')
      .select('email')
      .eq('user_id', data.user_id)
      .single();

    let channelName = null;
    if (data.channel_id) {
      const { data: channelData } = await this.supabase
        .from('channels')
        .select('name')
        .eq('id', data.channel_id)
        .single();
      channelName = channelData?.name;
    }

    let packageName = null;
    if (data.package_id) {
      const { data: packageData } = await this.supabase
        .from('packages')
        .select('name')
        .eq('id', data.package_id)
        .single();
      packageName = packageData?.name;
    }

    return {
      ...data,
      user_email: userData?.email,
      channel_name: channelName,
      package_name: packageName,
    };
  }

  async markNotificationProcessed(id: string, errors: string[] = []): Promise<void> {
    const update = errors.length > 0
      ? { error: errors.join('; ') }
      : { sent_at: new Date().toISOString() };

    const { error } = await this.supabase
      .from('admin_notifications')
      .update(update)
      .eq('id', id);

    if (error) throw error;
  }
}