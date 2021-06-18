import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  // IntegrationValidationError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { WpEngineUser } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

// Providers often supply types with their API libraries.

// Those can be useful to a degree, but often they're just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (below). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.

/*
import { Opaque } from 'type-fest';
export type AcmeUser = Opaque<any, 'AcmeUser'>;
export type AcmeGroup = Opaque<any, 'AcmeGroup'>;
*/

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

  // private async paginatedRequest<T>(
  //   uri: string,
  //   pageIteratee: PageIteratee<T>,
  // ): Promise<void> {
  //   let currentPage = 0;
  //   let body: PaginatedResource<T>;

  //   do {
  //     const endpoint = this.withBaseUri(
  //       `${uri}?page=${currentPage}&size=${this.paginateEntitiesPerPage}`,
  //     );
  //     this.logger.debug(
  //       {
  //         endpoint,
  //       },
  //       'Calling API endpoint.',
  //     );
  //     const response = await this.request(endpoint, 'GET');
  //     body = await response.json();

  //     await pageIteratee(body.resources);

  //     currentPage++;
  //   } while (body.page?.totalPages && currentPage < body.page.totalPages);
  // }

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

  // /**
  //  * Iterates each user resource in the provider.
  //  *
  //  * @param iteratee receives each resource to produce entities/relationships
  //  */
  // public async iterateUsers(
  //   iteratee: ResourceIteratee<InsightVMUser>,
  // ): Promise<void> {
  //   await this.paginatedRequest<InsightVMUser>('users', async (users) => {
  //     for (const user of users) {
  //       await iteratee(user);
  //     }
  //   });
  // }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
