import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const USER_ENTITY_KEY = 'entity:user';

export enum IntegrationSteps {
  USER = 'fetch-user',
  ACCOUNTS = 'fetch-accounts',
  SITES = 'fetch-sites',
}

export const Entities: Record<
  'USER' | 'ACCOUNT' | 'SITE',
  StepEntityMetadata
> = {
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
  SITE: {
    resourceName: 'Site',
    _type: 'wp_engine_site',
    _class: 'Host',
  },
};

export const Relationships: Record<
  'USER_HAS_ACCOUNT' | 'ACCOUNT_HAS_SITE',
  StepRelationshipMetadata
> = {
  USER_HAS_ACCOUNT: {
    _type: 'wp_engine_user_has_account',
    _class: RelationshipClass.HAS,
    sourceType: Entities.USER._type,
    targetType: Entities.ACCOUNT._type,
  },
  ACCOUNT_HAS_SITE: {
    _type: 'wp_engine_account_has_site',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.SITE._type,
  },
};
