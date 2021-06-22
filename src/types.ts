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
  installs: {
    id: string;
    name: string;
    environment: string;
    cname: string;
    php_version: string;
    is_multistate: boolean;
  }[];
};

export type WpEngineInstall = {
  id: string;
  name: string;
  account: {
    id: string;
  };
  php_version: string;
  status: string;
  site: {
    id: string;
  };
  cname: string;
  stable_ips: string[];
  environment: string;
  primary_domain: string;
  is_multistate: boolean;
};

export type WpEngineDomain = {
  id: string;
  name: string;
  duplicate: boolean;
  primary: boolean;
  redirect_to: {
    id: string;
    name: string;
  };
};
