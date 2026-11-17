import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRICING_TIERS, ASSURANCE_SERVICES, DELAY_SERVICES, SERVICE_PACKAGES, MOST_REQUESTED } from './pricing';

test('Starter costs $50 per internal user monthly, future target $100', () => {
  const tier = PRICING_TIERS.find(t => t.id === 'starter');
  assert.equal(tier?.price, 50); assert.equal(tier?.futurePrice, 100); assert.equal(tier?.unit, 'per user / month');
});
test('Professional costs $100 per internal user monthly, future target $200', () => {
  const tier = PRICING_TIERS.find(t => t.id === 'professional');
  assert.equal(tier?.price, 100); assert.equal(tier?.futurePrice, 200); assert.equal(tier?.unit, 'per user / month');
});
test('Enterprise is $10,000 annually for 20 users; additional users $50 monthly', () => {
  const tier = PRICING_TIERS.find(t => t.id === 'enterprise');
  assert.equal(tier?.price, 10000); assert.equal(tier?.unit, 'per year'); assert.equal(tier?.includedUsers, 20); assert.equal(tier?.additionalUserPrice, 50);
});
for (const id of ['starter', 'professional', 'enterprise']) test(`${id} includes unlimited external users`, () => assert.equal(PRICING_TIERS.find(t => t.id === id)?.unlimitedExternalUsers, true));
const expected = [
  ['Project Review', 750, 1500], ['Delivery Review', 1500, 3500], ['Project Risk Assessment', 1000, 2500], ['Project Health Review', 1250, 3000],
  ['Construction Programme Review', 750, 2000], ['Delay Analysis', 1500, 5000], ['EOT Assessment', 1250, 3500], ['Notice Management', 350, 900],
  ['Project Assurance Monthly', 1500, 1500], ['Delivery Oversight', 2500, 2500], ['Delay Watch', 750, 750], ['Project Recovery', 3500, 7500], ['Claims Preparation', 2500, 6000],
] as const;
for (const [name, min, max] of expected) test(`${name} retains the supplied fee range`, () => {
  const service = [...ASSURANCE_SERVICES, ...DELAY_SERVICES, ...SERVICE_PACKAGES].find(s => s.name === name);
  assert.equal(service?.min, min); assert.equal(service?.max, max);
});
test('Notice Management fees recur per month per project', () => assert.equal(DELAY_SERVICES.find(s => s.name === 'Notice Management')?.unit, 'per month / project'));
test('Delay Analysis upper fee is $5,000+', () => assert.equal(DELAY_SERVICES.find(s => s.name === 'Delay Analysis')?.plus, true));
test('Three ongoing advisory packages recur monthly', () => assert.deepEqual(SERVICE_PACKAGES.filter(s => s.unit === 'per month').map(s => s.name), ['Project Assurance Monthly', 'Delivery Oversight', 'Delay Watch']));
test('The six requested launch offerings are highlighted', () => assert.deepEqual(MOST_REQUESTED.map(s => s.name).sort(), ['Project Health Review', 'Delivery Review', 'Project Risk Assessment', 'Construction Programme Review', 'EOT Assessment', 'Notice Management'].sort()));
