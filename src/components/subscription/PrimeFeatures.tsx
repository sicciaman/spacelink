import { Check } from 'lucide-react';

const features = [
  'Access to cost-saving bundles',
  'Choose strategic posting times',
  'Book posts up to 30 days in advance',
  'Priority during high-demand periods',
  'Priority support for scheduling',
  'Exclusive analytics and insights'
];

export default function PrimeFeatures() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        SpaceLink Prime Benefits
      </h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}