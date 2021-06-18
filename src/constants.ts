import { RelationshipClass } from '@jupiterone/integration-sdk-core';

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

export const relationships = {
  USER_HAS_ACCOUNT: {
    _type: 'wp_engine_user_has_account',
    _class: RelationshipClass.HAS,
    sourceType: entities.USER._type,
    targetType: entities.ACCOUNT._type,
  },
};
