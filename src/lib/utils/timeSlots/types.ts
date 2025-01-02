export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface WeekSchedule {
  [day: string]: DaySchedule;
}

export interface TimeSlotError {
  message: string;
  type: 'overlap' | 'duration' | 'order';
}