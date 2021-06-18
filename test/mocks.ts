import { WpEngineAccount, WpEngineUser } from '../src/types';

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
