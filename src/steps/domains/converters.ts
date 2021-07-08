import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { WpEngineDomain } from '../../types';

export function getDomainKey(id: string): string {
  return `wp_engine_domain:${id}`;
}

export function createDomainEntity(data: WpEngineDomain) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DOMAIN._class,
        _type: Entities.DOMAIN._type,
        _key: getDomainKey(data.id),
        domainName: data.name,
        duplicate: data.duplicate,
        primary: data.primary,
        redirectTo: data.redirect_to.name,
      },
    },
  });
}
