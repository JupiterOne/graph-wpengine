import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../config';
import { createAPIClient } from '../client';
import { entities, relationships, steps, USER_ENTITY_KEY } from '../constants';

export function getAccountKey(id: string): string {
  return `wp_engine_account:${id}`;
}

export async function fetchAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const userEntity = (await jobState.getData(USER_ENTITY_KEY)) as Entity;

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

    await Promise.all([
      jobState.addEntity(accountEntity),
      jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: userEntity,
          to: accountEntity,
        }),
      ),
    ]);
  });
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_ACCOUNT,
    name: 'Fetch Account Details',
    entities: [entities.ACCOUNT],
    relationships: [relationships.USER_HAS_ACCOUNT],
    dependsOn: [steps.FETCH_USER],
    executionHandler: fetchAccounts,
  },
];
