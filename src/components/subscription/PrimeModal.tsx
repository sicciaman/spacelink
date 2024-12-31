import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Star, Check } from 'lucide-react';
import PaymentSection from './PaymentSection';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    name: 'Bundle Access',
    prime: 'Access to all bundle packages with up to 30% savings',
    standard: 'Single post packages only'
  },
  {
    name: 'Time Slots',
    prime: 'Choose strategic posting times',
    standard: 'First available slot of the day'
  },
  {
    name: 'Advance Booking',
    prime: 'Book up to 30 days in advance',
    standard: 'Book up to 2 days in advance'
  },
  {
    name: 'Priority Access',
    prime: 'Priority during high-demand periods',
    standard: 'Standard queue'
  },
  {
    name: 'Support',
    prime: 'Priority support response',
    standard: 'Standard support'
  }
];

export default function PrimeModal({ isOpen, onClose }: Props) {
  const [showPayment, setShowPayment] = useState(false);

  const handleSuccess = () => {
    onClose();
    setShowPayment(false);
  };

  const handleCancel = () => {
    setShowPayment(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {showPayment ? (
                  <div className="max-w-md mx-auto">
                    <PaymentSection onSuccess={handleSuccess} onCancel={handleCancel} />
                  </div>
                ) : (
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 flex items-center mb-8">
                      <Star className="h-8 w-8 text-yellow-400 mr-2" />
                      SpaceLink Prime vs Standard
                    </Dialog.Title>

                    <div className="grid grid-cols-3 gap-8">
                      {/* Features Table */}
                      <div className="col-span-2">
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Feature</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-600">With Prime</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Without Prime</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {features.map((feature) => (
                                <tr key={feature.name}>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.name}</td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center text-sm text-blue-600">
                                      <Check className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                      {feature.prime}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">{feature.standard}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pricing Card */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="mb-8">
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-gray-900">€48</span>
                            <span className="text-gray-500 ml-2">/month</span>
                          </div>
                          <p className="mt-4 text-sm text-gray-600">
                            Subscribe to SpaceLink Prime and unlock all premium features instantly.
                          </p>
                        </div>

                        <button
                          onClick={() => setShowPayment(true)}
                          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Subscribe Now
                        </button>

                        <p className="mt-4 text-xs text-gray-500 text-center">
                          Cancel anytime. No long-term commitment required.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}