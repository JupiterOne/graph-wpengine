import { userSteps } from './user';
import { accountSteps } from './accounts';
import { siteSteps } from './sites';
import { installSteps } from './installs';
import { domainSteps } from './domains';

const integrationSteps = [
  ...userSteps,
  ...accountSteps,
  ...siteSteps,
  ...installSteps,
  ...domainSteps,
];

export { integrationSteps };
