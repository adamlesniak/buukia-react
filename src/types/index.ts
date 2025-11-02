export type Assistant = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  availability: {
    regular: Array<{
      dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
      startTime: string; // "HH:MM" format
      endTime: string; // "HH:MM" format
    }>;
    exceptions: Array<{
      date: string; // "YYYY-MM-DD" format
      startTime: string; // "HH:MM" format
      endTime: string; // "HH:MM" format
    }>;
    holidays: Array<string>; // Array of dates in "YYYY-MM-DD" format
  };
  business: string;
  type: string;
};

export type Service = {
  id: string;
  description: string;
  business: string;
  categoy: string;
  duration: number;
  name: string;
  price: number;
};
