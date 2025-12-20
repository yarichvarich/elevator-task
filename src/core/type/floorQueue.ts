export type Passenger = {
  id: string;
  from: number;
  to: number;
};

export type FloorQeueue = {
  id: number;
  queue: Passenger[];
};
