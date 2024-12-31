export const TIME_SLOTS = {
  weekday: ['9:30', '11:00', '12:30', '14:00', '15:30', '17:00'],
  sunday: ['14:00', '15:30', '17:00']
};

export const isSunday = (date: Date) => date.getDay() === 0;