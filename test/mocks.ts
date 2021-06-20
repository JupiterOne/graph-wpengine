import { WpEngineAccount, WpEngineSite, WpEngineUser } from '../src/types';

export function getMockAccount(
  partial?: Partial<WpEngineAccount>,
): WpEngineAccount {
  return {
    id: 'some-id-here',
    name: 'exampleName',
    ...partial,
  };
}

export function getMockUser(partial?: Partial<WpEngineUser>): WpEngineUser {
  return {
    email: 'john@example.com',
    first_name: 'John',
    id: 'some-id-here',
    last_name: 'Doe',
    ...partial,
  };
}

export function getMockSite(partial?: Partial<WpEngineSite>): WpEngineSite {
  return {
    id: 'some-id-here',
    name: 'Doe',
    account: {
      id: 'some-id-here',
    },
    installs: [
      {
        id: 'some-id-here',
        name: 'exampleName',
        environment: 'sampleEnvironment',
        cname: 'sample.hostname.com',
        php_version: '1.0',
        is_multistate: false,
      },
    ],
    ...partial,
  };
}
