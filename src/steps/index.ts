import { userSteps } from './user';
import { accountSteps } from './accounts';

const integrationSteps = [...userSteps, ...accountSteps];

export { integrationSteps };
