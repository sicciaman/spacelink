import { useState } from 'react';

export interface ProductInfo {
  productLink: string;
  coupon: string;
  startPrice: number;
  discountPrice: number;
}

interface Props {
  onSubmit: (info: ProductInfo) => void;
}

export default function ProductInfoForm({ onSubmit }: Props) {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    productLink: '',
    coupon: '',
    startPrice: 0,
    discountPrice: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(productInfo);
  };

  const handlePriceChange = (field: 'startPrice' | 'discountPrice', value: string) => {
    const numValue = parseFloat(value) || 0;
    setProductInfo(prev => ({ ...prev, [field]: numValue }));
  };

  const isValid = () => {
    return (
      productInfo.productLink.trim() !== '' &&
      productInfo.startPrice > 0 &&
      productInfo.discountPrice > 0 &&
      productInfo.discountPrice < productInfo.startPrice
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productLink" className="block text-sm font-medium text-gray-700">
          Product Link *
        </label>
        <input
          type="url"
          id="productLink"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={productInfo.productLink}
          onChange={(e) => setProductInfo(prev => ({ ...prev, productLink: e.target.value }))}
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
          value={productInfo.coupon}
          onChange={(e) => setProductInfo(prev => ({ ...prev, coupon: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startPrice" className="block text-sm font-medium text-gray-700">
            Original Price (€) *
          </label>
          <input
            type="number"
            id="startPrice"
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={productInfo.startPrice || ''}
            onChange={(e) => handlePriceChange('startPrice', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
            Discounted Price (€) *
          </label>
          <input
            type="number"
            id="discountPrice"
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={productInfo.discountPrice || ''}
            onChange={(e) => handlePriceChange('discountPrice', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid()}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        Confirm Booking
      </button>
    </form>
  );
}