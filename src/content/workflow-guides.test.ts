import { expect, it } from 'vitest';
import { guideForPath } from './workflow-guides';
it('uses project and administration guides for nested views', () => {
  expect(guideForPath('/app/projects/example')?.key).toBe('/app/projects');
  expect(guideForPath('/app/administration/permissions')?.key).toBe('/app/administration');
  expect(guideForPath('/contact')).toBeNull();
});