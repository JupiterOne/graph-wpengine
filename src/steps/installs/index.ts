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
import { getSiteKey } from '../sites/converters';
import { createInstallEntity } from './converters';

export async function fetchInstalls({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateInstalls(async (install) => {
    const installEntity = createInstallEntity(install);

    await jobState.addEntity(installEntity);

    const accountEntity = await jobState.findEntity(
      getAccountKey(install.account.id),
    );

    const siteEntity = await jobState.findEntity(getSiteKey(install.site.id));

    if (installEntity && accountEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: installEntity,
        }),
      );
    }

    if (installEntity && siteEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: siteEntity,
          to: installEntity,
        }),
      );
    }
  });
}

export const installSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.INSTALLS,
    name: 'Fetch Installs',
    entities: [Entities.INSTALL],
    relationships: [
      Relationships.ACCOUNT_HAS_INSTALL,
      Relationships.SITE_HAS_INSTALL,
    ],
    dependsOn: [IntegrationSteps.ACCOUNTS, IntegrationSteps.SITES],
    executionHandler: fetchInstalls,
  },
];
