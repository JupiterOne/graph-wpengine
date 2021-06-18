import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { WpEngineAccount } from '../../types';

export function getAccountKey(id: string): string {
  return `wp_engine_account:${id}`;
}

export function createAccountEntity(data: WpEngineAccount) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountKey(data.id),
        id: data.id,
        name: data.name,
      },
    },
  });
}
