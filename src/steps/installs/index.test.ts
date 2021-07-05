import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { integrationConfig } from '../../../test/config';
import { setupWPEngineRecording } from '../../../test/recording';
import { fetchInstalls } from '.';
import { fetchSites } from '../sites';
import { fetchAccounts } from '../accounts';
import { Relationships } from '../constants';

describe('#fetchInstalls', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupWPEngineRecording({
      directory: __dirname,
      name: 'fetchInstalls',
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
    await fetchInstalls(context);

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

    const installs = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Application'),
    );
    expect(installs.length).toBeGreaterThan(0);
    expect(installs).toMatchGraphObjectSchema({
      _class: ['Application'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'wp_engine_install' },
          name: { type: 'string' },
          phpVersion: { type: 'string' },
          status: { type: 'boolean' },
          cname: { type: 'string' },
          stableIps: { type: 'array', items: { type: 'string' } },
          environment: { type: 'string' },
          primaryDomain: { type: 'string' },
          isMultisite: { type: 'boolean' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_INSTALL._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'wp_engine_account_has_install',
          },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.SITE_HAS_INSTALL._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'wp_engine_site_has_install',
          },
        },
      },
    });
  });
});
