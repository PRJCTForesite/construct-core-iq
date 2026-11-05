import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PORTAL_TEMPLATES, DEFAULT_STAGES, weightedCompletion, sharedClientDocuments, clientFinancialSummary, portalCan, suggestionDecision, healthStatus, type Suggestion } from './client-portal';
import { makeRecord } from './platform';

describe('Client Portal V1 rules', () => {
  test('provides four required templates', () => { assert.deepEqual(PORTAL_TEMPLATES.map(t => t.name), ['Residential Lite', 'Residential Full Build', 'Commercial Client', 'Enterprise Client']); });
  test('prioritises approvals, updates, progress and health', () => { assert.deepEqual(PORTAL_TEMPLATES[1]?.widgets.slice(0, 4).map(w => w.id), ['approvals', 'updates', 'progress', 'health']); });
  test('uses weighted project stages rather than a simple average', () => { assert.equal(weightedCompletion(DEFAULT_STAGES), 72); assert.equal(weightedCompletion([{ name: 'Tender', weight: 1, completion: 100 }, { name: 'Construction', weight: 3, completion: 0 }]), 25); });
  test('only explicitly shared documents for the selected project are visible', () => {
    const docs = [makeRecord('Document', 'Shared', { shareWithClient: true, project: 'Smith Residence' }), makeRecord('Document', 'Hidden', { project: 'Smith Residence' }), makeRecord('Document', 'Private', { shareWithClient: false, project: 'Smith Residence' }), makeRecord('Document', 'Other project', { shareWithClient: true, project: 'Other' })];
    assert.deepEqual(sharedClientDocuments(docs, 'Smith Residence').map(d => d.title), ['Shared']);
  });
  test('financial projection excludes all internal financial fields', () => {
    const internal = { contractValue: 100, approvedVariations: 10, pendingVariations: 5, amountPaid: 60, amountOutstanding: 50, builderCosts: 40, margins: 10, supplierPricing: 4, tradePricing: 6, internalBudgets: 20, internalNotes: 'private' };
    assert.deepEqual(clientFinancialSummary(internal), { contractValue: 100, approvedVariations: 10, pendingVariations: 5, amountPaid: 60, amountOutstanding: 50 });
  });
  for (const action of ['View', 'Comment', 'Approve', 'Reject', 'Submit defect'] as const) test(`clients may ${action}`, () => assert.equal(portalCan('Client', action), true));
  for (const action of ['Configure', 'Review suggestion', 'Edit project', 'Modify programme', 'Modify financials', 'Internal notes'] as const) test(`clients cannot ${action}`, () => assert.equal(portalCan('Client', action), false));
  test('only owners and administrators configure templates', () => { assert.equal(portalCan('Owner', 'Configure'), true); assert.equal(portalCan('Administrator', 'Configure'), true); assert.equal(portalCan('Project Manager', 'Configure'), false); });
  test('suggestions become official only after acceptance', () => {
    const s: Suggestion = { id: 'suggestion', title: 'Sealant', area: 'Bathroom', description: 'Gap', files: [], status: 'Suggested Defect' };
    assert.equal(s.recordId, undefined); assert.equal(suggestionDecision(s, 'Rejected', 'should-not-attach').recordId, undefined); assert.equal(suggestionDecision(s, 'Accepted', 'official-1').recordId, 'official-1');
  });
  test('health displays healthy, attention required or critical', () => { assert.equal(healthStatus(90), 'Healthy'); assert.equal(healthStatus(70), 'Attention Required'); assert.equal(healthStatus(40), 'Critical'); });
});