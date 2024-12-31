import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CreateCustomerData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  telegram_username?: string;
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      // Step 1: Create user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Step 2: Create customer profile
      const { error: profileError } = await supabase
        .from('customers')
        .insert({
          user_id: authData.user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          company: data.company,
          telegram_username: data.telegram_username
        });

      if (profileError) throw profileError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error: any) => {
      console.error('Create customer error:', error);
      toast.error(error.message || 'Failed to create customer');
    }
  });
}