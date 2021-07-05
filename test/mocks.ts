import {
  WpEngineAccount,
  WpEngineDomain,
  WpEngineInstall,
  WpEngineSite,
  WpEngineUser,
} from '../src/types';

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
        is_multisite: false,
      },
    ],
    ...partial,
  };
}

export function getMockInstall(
  partial?: Partial<WpEngineInstall>,
): WpEngineInstall {
  return {
    id: 'some-id-here',
    name: 'Doe',
    account: {
      id: 'some-id-here',
    },
    php_version: 'sample-php-version',
    status: 'sample-status',
    site: {
      id: 'some-id-here',
    },
    cname: 'sample.hostname.com',
    stable_ips: ['sample-ip-1', 'sample-ip-2'],
    environment: 'sample-environment',
    primary_domain: 'sample.primary-domain.com',
    is_multisite: false,
    ...partial,
  };
}

export function getMockDomain(
  partial?: Partial<WpEngineDomain>,
): WpEngineDomain {
  return {
    name: 'www.name.io',
    duplicate: false,
    id: 'some-id-here',
    primary: false,
    redirect_to: {
      id: 'some-id-here',
      name: 'hostname.com',
    },
    ...partial,
  };
}
