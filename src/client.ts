import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  PaginatedResource,
  PageIteratee,
  WpEngineUser,
  WpEngineAccount,
  WpEngineSite,
  WpEngineInstall,
  WpEngineDomain,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 10;

  private withBaseUri(path: string): string {
    return `https://api.wpengineapi.com/v1/${path}`;
  }

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    const response = await fetch(uri, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${this.config.wpEngineUsername}:${this.config.wpEnginePassword}`,
        ).toString('base64')}`,
      },
    });
    if (!response.ok) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  private async paginatedRequest<T>(
    uri: string,
    pageIteratee: PageIteratee<T>,
  ): Promise<void> {
    let body: PaginatedResource<T>;
    let endpoint = this.withBaseUri(
      `${uri}?limit=${this.paginateEntitiesPerPage}&offset=0`,
    );

    do {
      const response = await this.request(endpoint, 'GET');
      body = await response.json();

      await pageIteratee(body.results);

      endpoint = body.next;
    } while (body.next);
  }

  public async verifyAuthentication(): Promise<void> {
    const sitesApiRoute = this.withBaseUri('sites');
    try {
      await this.request(sitesApiRoute, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: sitesApiRoute,
        status: err.code,
        statusText: err.message,
      });
    }
  }

  public async getUser(): Promise<WpEngineUser> {
    const response = await this.request(this.withBaseUri('user'));
    return response.json();
  }

  /**
   * Iterates each account resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateAccounts(
    iteratee: ResourceIteratee<WpEngineAccount>,
  ): Promise<void> {
    await this.paginatedRequest<WpEngineAccount>(
      'accounts',
      async (accounts) => {
        for (const account of accounts) {
          await iteratee(account);
        }
      },
    );
  }

  /**
   * Iterates each site resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateSites(
    iteratee: ResourceIteratee<WpEngineSite>,
  ): Promise<void> {
    await this.paginatedRequest<WpEngineSite>('sites', async (sites) => {
      for (const site of sites) {
        await iteratee(site);
      }
    });
  }

  /**
   * Iterates each install resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateInstalls(
    iteratee: ResourceIteratee<WpEngineInstall>,
  ): Promise<void> {
    await this.paginatedRequest<WpEngineInstall>(
      'installs',
      async (installs) => {
        for (const install of installs) {
          await iteratee(install);
        }
      },
    );
  }

  /**
   * Iterates each domain resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDomains(
    install_id: string,
    iteratee: ResourceIteratee<WpEngineDomain>,
  ): Promise<void> {
    await this.paginatedRequest<WpEngineDomain>(
      `/installs/${install_id}/domains`,
      async (domains) => {
        for (const domain of domains) {
          await iteratee(domain);
        }
      },
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
