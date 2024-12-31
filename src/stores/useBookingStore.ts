import { create } from 'zustand';

interface BookingStore {
  selectedChannel: string | null;
  selectedPackage: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedPackage: (packageId: string | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedChannel: null,
  selectedPackage: null,
  selectedDate: null,
  selectedTime: null,
  setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),
  setSelectedPackage: (packageId) => set({ selectedPackage: packageId }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  reset: () => set({ 
    selectedChannel: null, 
    selectedPackage: null, 
    selectedDate: null, 
    selectedTime: null 
  }),
}));