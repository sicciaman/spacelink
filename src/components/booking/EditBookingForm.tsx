import { useState } from 'react';
import { validateBookingUpdate } from '../../lib/utils/booking';
import type { Booking } from '../../lib/types';

interface Props {
  booking: Booking;
  onSubmit: (updates: Partial<Booking>) => void;
  onCancel: () => void;
}

export default function EditBookingForm({ booking, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState({
    product_link: booking.product_link || '',
    coupon: booking.coupon || '',
    start_price: booking.start_price || 0,
    discount_price: booking.discount_price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePriceChange = (field: 'start_price' | 'discount_price', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
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
            value={formData.start_price || ''}
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
            value={formData.discount_price || ''}
            onChange={(e) => handlePriceChange('discount_price', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!validateBookingUpdate(formData)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}