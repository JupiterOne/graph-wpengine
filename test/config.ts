import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_ENGINE_USERNAME = 'dummy-acme-client-id';
const DEFAULT_WP_ENGINE_PASSWORD = 'dummy-acme-client-secret';

export const integrationConfig: IntegrationConfig = {
  wpEngineUsername: process.env.WP_ENGINE_USERNAME || DEFAULT_ENGINE_USERNAME,
  wpEnginePassword:
    process.env.WP_ENGINE_PASSWORD || DEFAULT_WP_ENGINE_PASSWORD,
};
