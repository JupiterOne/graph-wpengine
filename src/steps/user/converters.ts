import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { WpEngineUser } from '../../types';

export function createUserEntity(data: WpEngineUser) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        // We always want to have "descriptive" keys
        // Also, if later, you need to find users (jobState.findEntity())
        // you'll need to find them by their keys, so you should
        // export and turn this into function similar to getAccountKey
        _key: `wp_engine_user:${data.id}`,
        name: `${data.first_name} ${data.last_name}`,
        username: data.email,
        email: data.email,
      },
    },
  });
}
