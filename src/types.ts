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

export type WpEngineSite = {
  id: string;
  name: string;
  account: {
    id: string;
  };
  // will probably convert this to 'WpEngineInstall' type once ingested
  installs: {
    id: string;
    name: string;
    environment: string;
    cname: string;
    php_version: string;
    is_multistate: boolean;
  }[];
};
