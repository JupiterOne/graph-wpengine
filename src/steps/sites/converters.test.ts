import { getMockSite } from '../../../test/mocks';
import { createSiteEntity } from './converters';

describe('#createSiteEntity', () => {
  test('should convert to entity', () => {
    expect(createSiteEntity(getMockSite())).toMatchSnapshot();
  });
});
