import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Entities, Relationships, IntegrationSteps } from '../constants';
import { createDomainEntity } from './converters';
import { getInstallKey } from '../installs/converters';

export async function fetchDomains({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(Entities.INSTALL, (install) => {
    void apiClient.iterateDomains(install.id as string, async (domain) => {
      const domainEntity = createDomainEntity(domain);

      console.log('install', install);
      console.log('domainEntity', domainEntity);

      await jobState.addEntity(domainEntity);

      // const installEntity = await jobState.findEntity(
      //   getInstallKey(install.id as string),
      // );

      // console.log('installEntity', installEntity);
    });
  });
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DOMAINS,
    name: 'Fetch Domains',
    entities: [Entities.DOMAIN],
    relationships: [],
    dependsOn: [IntegrationSteps.INSTALLS],
    executionHandler: fetchDomains,
  },
];
