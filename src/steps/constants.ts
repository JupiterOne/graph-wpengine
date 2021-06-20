import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const USER_ENTITY_KEY = 'entity:user';

export enum IntegrationSteps {
  // steps names should just be resources names (plural)
  // FETCH_GROUPS ==> GROUPS

  // If there's only ever going to be a single user, we can use singular name here
  USER = 'fetch-user',
  // Since there can be multiple accounts, we'll use plural
  ACCOUNTS = 'fetch-accounts',
}

export const Entities: Record<'USER' | 'ACCOUNT', StepEntityMetadata> = {
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

export const Relationships: Record<
  'USER_HAS_ACCOUNT',
  StepRelationshipMetadata
> = {
  USER_HAS_ACCOUNT: {
    _type: 'wp_engine_user_has_account',
    _class: RelationshipClass.HAS,
    sourceType: Entities.USER._type,
    targetType: Entities.ACCOUNT._type,
  },
};
