export const USER_ENTITY_KEY = 'entity:user';

export const steps = {
  FETCH_USER: 'fetch-user',
  FETCH_ACCOUNT: 'fetch-account',
};

export const entities = {
  USER: {
    resourceName: 'User',
    _type: 'wp_engine_user',
    _class: 'User',
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'wp_engine_account',
    _class: 'Account',
  },
};
