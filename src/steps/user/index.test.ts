import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchUser } from '.';
import { integrationConfig } from '../../../test/config';
import { setupWPEngineRecording } from '../../../test/recording';

describe('#fetchUser', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupWPEngineRecording({
      directory: __dirname,
      name: 'fetchUser',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    // fetchUser doesn't depend on anything, so we can just call that
    await fetchUser(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    // Let's call it users still because it's an array (I know there's only one entity inside :)
    const users = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('User'),
    );
    expect(users.length).toBeGreaterThan(0);
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
