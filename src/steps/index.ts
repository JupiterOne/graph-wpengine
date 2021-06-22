import { userSteps } from './user';
import { accountSteps } from './accounts';
import { siteSteps } from './sites';
import { installSteps } from './installs';

const integrationSteps = [
  ...userSteps,
  ...accountSteps,
  ...siteSteps,
  ...installSteps,
];

export { integrationSteps };
