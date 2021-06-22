import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchSites } from '.';
import { integrationConfig } from '../../../test/config';
import { setupWPEngineRecording } from '../../../test/recording';
import { fetchAccounts } from '../accounts';

describe('#fetchSites', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupWPEngineRecording({
      directory: __dirname,
      name: 'fetchSites',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccounts(context);
    await fetchSites(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const sites = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Host'),
    );
    expect(sites.length).toBeGreaterThan(0);
    expect(sites).toMatchGraphObjectSchema({
      _class: ['Host'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'wp_engine_site' },
          name: { type: 'string' },
        },
      },
    });

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
          name: { type: 'string' },
        },
      },
    });
  });
});
