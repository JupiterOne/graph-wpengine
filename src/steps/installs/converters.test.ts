import { getMockInstall } from '../../../test/mocks';
import { createInstallEntity } from './converters';

describe('#createInstallEntity', () => {
  test('should convert to entity', () => {
    expect(createInstallEntity(getMockInstall())).toMatchSnapshot();
  });
});
