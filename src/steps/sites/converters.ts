import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { WpEngineSite } from '../../types';

export function getSiteKey(id: string): string {
  return `wp_engine_site:${id}`;
}

export function createSiteEntity(data: WpEngineSite) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.SITE._class,
        _type: Entities.SITE._type,
        _key: getSiteKey(data.id),
        name: data.name,
      },
    },
  });
}
