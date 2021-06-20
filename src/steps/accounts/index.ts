import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import {
  Entities,
  Relationships,
  IntegrationSteps,
  USER_ENTITY_KEY,
} from '../constants';
import { createAccountEntity } from './converters';

export async function fetchAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const userEntity = (await jobState.getData(USER_ENTITY_KEY)) as Entity;

  await apiClient.iterateAccounts(async (account) => {
    const accountEntity = createAccountEntity(account);

    await jobState.addEntity(accountEntity);

    if (userEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: userEntity,
          to: accountEntity,
        }),
      );
    }
  });
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNTS,
    name: 'Fetch Accounts',
    entities: [Entities.ACCOUNT],
    relationships: [Relationships.USER_HAS_ACCOUNT],
    dependsOn: [IntegrationSteps.USER],
    executionHandler: fetchAccounts,
  },
];
