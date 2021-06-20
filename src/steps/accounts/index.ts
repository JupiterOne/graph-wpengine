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

    // Your previous code was good but we want to try and decouple processes
    // that are happening in the steps as much as we can.

    // For example, if for whatever reasons fetchUser step failed and/or
    // userEntity variable is undefined/null here, this entire process would fail
    // because addRelationship and addEntity are "tied" together, and if
    // addRelationship fails, addEntity will fail as well (Promise.all behaviour)
    // await Promise.all([
    //   jobState.addEntity(accountEntity),
    //   jobState.addRelationship(
    //     createDirectRelationship({
    //       _class: RelationshipClass.HAS,
    //       from: userEntity,
    //       to: accountEntity,
    //     }),
    //   ),
    // ]);

    // More decoupled pattern below:
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
