import {
  createDirectRelationship,
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

  await jobState.iterateEntities(Entities.INSTALL, async (install) => {
    await apiClient.iterateDomains(install.id as string, async (domain) => {
      const domainEntity = createDomainEntity(domain);

      await jobState.addEntity(domainEntity);

      if (install && domainEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: install,
            to: domainEntity,
          }),
        );
      }
    });
  });
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DOMAINS,
    name: 'Fetch Domains',
    entities: [Entities.DOMAIN],
    relationships: [Relationships.INSTALL_HAS_DOMAIN],
    dependsOn: [IntegrationSteps.INSTALLS],
    executionHandler: fetchDomains,
  },
];
