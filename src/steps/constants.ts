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
  INSTALLS = 'fetch-installs',
  DOMAINS = 'fetch-domains',
}

export const Entities: Record<
  'USER' | 'ACCOUNT' | 'SITE' | 'INSTALL' | 'DOMAIN',
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
  INSTALL: {
    resourceName: 'Install',
    _type: 'wp_engine_install',
    _class: 'Application',
  },
  DOMAIN: {
    resourceName: 'Domain',
    _type: 'wp_engine_domain',
    _class: 'Domain',
  },
};

export const Relationships: Record<
  | 'USER_HAS_ACCOUNT'
  | 'ACCOUNT_HAS_SITE'
  | 'SITE_HAS_INSTALL'
  | 'ACCOUNT_HAS_INSTALL'
  | 'INSTALL_HAS_DOMAIN',
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
  ACCOUNT_HAS_INSTALL: {
    _type: 'wp_engine_account_has_install',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.INSTALL._type,
  },
  SITE_HAS_INSTALL: {
    _type: 'wp_engine_site_has_install',
    _class: RelationshipClass.HAS,
    sourceType: Entities.SITE._type,
    targetType: Entities.INSTALL._type,
  },
  INSTALL_HAS_DOMAIN: {
    _type: 'wp_engine_install_has_domain',
    _class: RelationshipClass.HAS,
    sourceType: Entities.INSTALL._type,
    targetType: Entities.DOMAIN._type,
  },
};
