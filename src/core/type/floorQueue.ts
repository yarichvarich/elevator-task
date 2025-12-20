export type Passenger = {
  id: string;
  from: number;
  to: number;
};

export type FloorQeueue = {
  id: number;
  isReady: boolean;
  queue: Passenger[];
};
