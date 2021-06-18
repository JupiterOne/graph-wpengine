import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchAccounts } from '.';
import { integrationConfig } from '../../../test/config';
import { setupWPEngineRecording } from '../../../test/recording';
import { fetchUser } from '../user';

describe('#fetchAccounts', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupWPEngineRecording({
      directory: __dirname,
      name: 'fetchAccounts',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    // we also need to call fetchUser first so that relationship can be
    // built and so that we can test it
    await fetchUser(context);
    await fetchAccounts(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    console.log('context.jobsate', context.jobState.collectedEntities);

    const accounts = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Account'),
    );
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'wp_engine_account' },
          // We want to make sure we include every field from converter.ts
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    });

    const users = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('User'),
    );
    expect(users.length).toEqual(1);
    expect(users).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'wp_engine_user' },
          // We want to make sure we include every field from converter.ts
          name: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
        },
      },
    });
  });
});
