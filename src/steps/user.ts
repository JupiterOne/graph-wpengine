import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../config';
import { createAPIClient } from '../client';
import { entities, steps } from '../constants';

export const USER_ENTITY_KEY = 'entity:user';

export async function fetchUserDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const user = await apiClient.getUser();

  const userEntity = await jobState.addEntity(
    createIntegrationEntity({
      entityData: {
        source: user,
        assign: {
          _key: user.id,
          _type: entities.USER._type,
          _class: entities.USER._class,
          name: `${user.first_name} ${user.last_name}`,
          username: user.email,
          email: user.email,
        },
      },
    }),
  );

  await jobState.setData(USER_ENTITY_KEY, userEntity);
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_USER,
    name: 'Fetch User Details',
    entities: [entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUserDetails,
  },
];
