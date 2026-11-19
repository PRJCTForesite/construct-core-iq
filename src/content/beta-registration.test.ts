import { describe, expect, it } from 'vitest';
import { betaApplicationSchema, CONTACT_EMAIL } from './beta-registration';

const valid = { name: 'Test Builder', company: 'Example Construction', email: 'test@example.test', phone: '0437722552', state: 'VIC' };
describe('Beta application qualification', () => {
  it('directs enquiries to the corrected Microsoft 365 recipient', () => {
    expect(CONTACT_EMAIL).toBe('admin@foresiteos.com.au');
  });
  it.each(['name', 'company', 'email', 'phone', 'state'])('requires %s', field => {
    expect(betaApplicationSchema.safeParse({ ...valid, [field]: '' }).success).toBe(false);
  });
  it('allows optional qualification details to be omitted', () => {
    expect(betaApplicationSchema.safeParse(valid).success).toBe(true);
  });
  it('accepts all eight Australian states and territories and rejects unknown states', () => {
    for (const state of ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']) expect(betaApplicationSchema.safeParse({ ...valid, state }).success).toBe(true);
    expect(betaApplicationSchema.safeParse({ ...valid, state: 'CA' }).success).toBe(false);
  });
  it('accepts three pain points but rejects four', () => {
    const painPoints = ['Subcontractor delays and coordination', 'Cashflow and financial visibility', 'Client communication and approvals'];
    expect(betaApplicationSchema.safeParse({ ...valid, painPoints }).success).toBe(true);
    expect(betaApplicationSchema.safeParse({ ...valid, painPoints: [...painPoints, 'Defect management and warranty'] }).success).toBe(false);
  });
});