import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Booking } from '../../../lib/types';
import toast from 'react-hot-toast';

interface Props {
  booking: Booking;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditBookingForm({ booking, onCancel, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_link: booking.product_link,
    coupon: booking.coupon || '',
    start_price: booking.start_price,
    discount_price: booking.discount_price,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const { error } = await supabase.rpc('admin_update_booking', {
        p_booking_id: booking.id,
        p_product_link: formData.product_link,
        p_coupon: formData.coupon || null,
        p_start_price: formData.start_price,
        p_discount_price: formData.discount_price
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-calendar-bookings'] });
      
      toast.success('Booking updated successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error(error.message || 'Failed to update booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (field: 'start_price' | 'discount_price', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const isValid = () => {
    return (
      formData.product_link.trim() !== '' &&
      formData.start_price > 0 &&
      formData.discount_price > 0 &&
      formData.discount_price < formData.start_price
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="product_link" className="block text-sm font-medium text-gray-700">
          Product Link *
        </label>
        <input
          type="url"
          id="product_link"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.product_link}
          onChange={(e) => setFormData(prev => ({ ...prev, product_link: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">
          Coupon Code
        </label>
        <input
          type="text"
          id="coupon"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.coupon}
          onChange={(e) => setFormData(prev => ({ ...prev, coupon: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_price" className="block text-sm font-medium text-gray-700">
            Original Price (€) *
          </label>
          <input
            type="number"
            id="start_price"
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.start_price}
            onChange={(e) => handlePriceChange('start_price', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700">
            Discounted Price (€) *
          </label>
          <input
            type="number"
            id="discount_price"
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.discount_price}
            onChange={(e) => handlePriceChange('discount_price', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !isValid()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}