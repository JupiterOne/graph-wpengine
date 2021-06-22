import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Entities, Relationships, IntegrationSteps } from '../constants';
import { getAccountKey } from '../accounts/converters';
import { createSiteEntity } from './converters';

export async function fetchSites({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateSites(async (site) => {
    const siteEntity = createSiteEntity(site);

    await jobState.addEntity(siteEntity);

    const accountEntity = await jobState.findEntity(
      getAccountKey(site.account.id),
    );

    if (siteEntity && accountEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: siteEntity,
        }),
      );
    }
  });
}

export const siteSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SITES,
    name: 'Fetch Sites',
    entities: [Entities.SITE],
    relationships: [Relationships.ACCOUNT_HAS_SITE],
    dependsOn: [IntegrationSteps.ACCOUNTS],
    executionHandler: fetchSites,
  },
];
