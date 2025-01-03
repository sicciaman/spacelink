export interface TimeInterval {
  startTime: string;
  endTime: string;
}

export interface BlockedDate {
  date: Date;
  intervals: TimeInterval[];
  reason: string;
}

export interface TimeIntervalErrors {
  [key: number]: string | null;
}