export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};