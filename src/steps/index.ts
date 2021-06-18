import { userSteps } from './user';
import { accountSteps } from './account';

const integrationSteps = [...userSteps, ...accountSteps];

export { integrationSteps };
