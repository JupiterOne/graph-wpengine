export type PageIteratee<T> = (page: T[]) => Promise<void>;

export type PaginatedResource<T> = {
  previous: string;
  next: string;
  count: number;
  results: T[];
};

export type WpEngineUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type WpEngineAccount = {
  id: string;
  name: string;
};
