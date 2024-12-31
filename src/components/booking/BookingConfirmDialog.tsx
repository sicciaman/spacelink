import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import type { ProductInfo } from './ProductInfoForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: Date;
  time: string;
  productInfo: ProductInfo;
}

export default function BookingConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  date, 
  time,
  productInfo 
}: Props) {
  const cancelButtonRef = useRef(null);

  const discount = ((productInfo.startPrice - productInfo.discountPrice) / productInfo.startPrice * 100).toFixed(0);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-10" 
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Confirm Booking
                    </Dialog.Title>
                    <div className="mt-4 text-left">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date and Time</p>
                          <p className="text-base text-gray-900">
                            {format(date, 'PPPP')} at {time}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Product Details</p>
                          <div className="mt-1 text-sm">
                            <p className="text-gray-900 truncate">{productInfo.productLink}</p>
                            <p className="text-gray-900 mt-1">Coupon: <span className="font-medium">{productInfo.coupon}</span></p>
                            <div className="mt-1 flex items-baseline">
                              <span className="text-gray-500 line-through">€{productInfo.startPrice.toFixed(2)}</span>
                              <span className="ml-2 text-green-600 font-medium">€{productInfo.discountPrice.toFixed(2)}</span>
                              <span className="ml-2 text-green-600">(-{discount}%)</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500">
                          You can cancel this booking up to 24 hours before the scheduled time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2"
                    onClick={onConfirm}
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}