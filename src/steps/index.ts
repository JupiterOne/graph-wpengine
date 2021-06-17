import { userSteps } from './user';
import { accessSteps } from './access';

const integrationSteps = [...userSteps, ...accessSteps];

export { integrationSteps };
