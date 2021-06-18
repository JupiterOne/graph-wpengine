import {
  // createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../config';
import { createAPIClient } from '../client';
import { entities, steps } from '../constants';

export async function fetchAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateAccounts((account) => {
    console.log(account);
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
