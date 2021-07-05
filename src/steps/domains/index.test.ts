import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchDomains } from '.';
import { integrationConfig } from '../../../test/config';
import { setupWPEngineRecording } from '../../../test/recording';
import { Relationships } from '../constants';
import { fetchInstalls } from '../installs';

describe('#fetchDomains', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupWPEngineRecording({
      directory: __dirname,
      name: 'fetchDomains',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchInstalls(context);
    await fetchDomains(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const domains = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Domain'),
    );
    expect(domains.length).toBeGreaterThan(0);
    expect(domains).toMatchGraphObjectSchema({
      _class: ['Domain'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'wp_engine_domain' },
          domainName: { type: 'string' },
          duplicate: { type: 'boolean' },
          primary: { type: 'boolean' },
          redirectTo: { type: 'string' },
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
        (e) => e._type === Relationships.INSTALL_HAS_DOMAIN._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'wp_engine_install_has_domain',
          },
        },
      },
    });
  });
});
