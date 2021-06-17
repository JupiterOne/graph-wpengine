import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../config';

export const USER_ENTITY_KEY = 'entity:user';

export async function fetchUserDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const userEntity = await jobState.addEntity(
    createIntegrationEntity({
      entityData: {
        source: {
          id: 'acme-unique-account-id',
          name: 'Example Co. Acme Account',
        },
        assign: {
          _key: 'acme-unique-account-id',
          _type: 'acme_account',
          _class: 'Account',
          mfaEnabled: true,
          // This is a custom property that is not a part of the data model class
          // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
          manager: 'Manager Name',
        },
      },
    }),
  );

  await jobState.setData(USER_ENTITY_KEY, userEntity);
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'acme_account',
        _class: 'Account',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUserDetails,
  },
];