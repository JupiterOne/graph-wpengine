import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { USER_ENTITY_KEY, Entities, IntegrationSteps } from '../constants';
import { createUserEntity } from './converters';

// Renamed fetchUserDetails -> fetchUser (we're fetching user resource, slight "correction")
export async function fetchUser({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const user = await apiClient.getUser();

  // We have a separate converters file where we have methods for converting resource -> entities
  const userEntity = createUserEntity(user);
  await jobState.addEntity(userEntity);
  await jobState.setData(USER_ENTITY_KEY, userEntity);
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.USER,
    name: 'Fetch User',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUser,
  },
];
