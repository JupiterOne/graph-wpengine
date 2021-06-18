import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../config';
import { createAPIClient } from '../client';
import { entities, steps } from '../constants';

export function getAccountKey(id: string): string {
  return `wp_engine_account:${id}`;
}

export async function fetchAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateAccounts(async (account) => {
    const accountEntity = createIntegrationEntity({
      entityData: {
        source: account,
        assign: {
          _key: getAccountKey(account.id),
          _type: entities.ACCOUNT._type,
          _class: entities.ACCOUNT._class,
          id: account.id,
          name: account.name,
        },
      },
    });

    await Promise.all([jobState.addEntity(accountEntity)]);
  });
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_ACCOUNT,
    name: 'Fetch Account Details',
    entities: [entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccounts,
  },
];
