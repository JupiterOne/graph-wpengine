import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { WpEngineUser } from '../../types';

export function getAccountKey(id: string): string {
  return `wp_engine_user:${id}`;
}

export function createUserEntity(data: WpEngineUser) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: getAccountKey(data.id),
        name: `${data.first_name} ${data.last_name}`,
        username: data.email,
        email: data.email,
      },
    },
  });
}
