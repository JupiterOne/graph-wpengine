import { userSteps } from './user';
import { accountSteps } from './accounts';
import { siteSteps } from './sites';

const integrationSteps = [...userSteps, ...accountSteps, ...siteSteps];

export { integrationSteps };
