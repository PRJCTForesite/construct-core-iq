import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountIssue, DEMO_FORM, onboardingSteps, passwordIssue, verificationIssue, EMAIL_PREVIEW_CODE, SMS_PREVIEW_CODE, TRIAL_DAYS, RESEND_SECONDS } from './onboarding';
import { onboardingDemoRecords, onboardingDemoUsers } from './onboarding-demo';
import { createMockRecordService } from '@/lib/services/mockRecordService';
import { makeRecord } from './platform';
test('new paid subscribers need no referral or organisation code', () => assert.equal(accountIssue({ ...DEMO_FORM, code: '' }, 'subscriber'), null));
for (const kind of ['client-invite', 'trade-invite'] as const) {
 test(`${kind} requires an invitation code`, () => assert.notEqual(accountIssue({ ...DEMO_FORM, code: '' }, kind), null));
 test(`${kind} skips plan selection, payment, mobile and organisation creation`, () => assert.deepEqual(onboardingSteps(kind), ['Create Password', 'Verify Email', 'Welcome']));
}
test('subscribers complete all seven steps', () => assert.equal(onboardingSteps('subscriber').length, 7));
test('password minimum is twelve characters', () => assert.notEqual(passwordIssue('Abc123!xyz', 'Abc123!xyz'), null));
for (const [name, value] of [['uppercase','foresitedemo2026!'],['lowercase','FORESITEDEMO2026!'],['number','ForesiteDemoOnly!'],['special character','ForesiteDemo2026']] as const) test(`password requires ${name}`, () => assert.notEqual(passwordIssue(value, value), null));
test('confirmation must match password', () => assert.notEqual(passwordIssue(DEMO_FORM.password, 'DifferentPassword!'), null));
test('email preview uses exactly the six-digit 842631 code', () => { assert.equal(verificationIssue('842631', EMAIL_PREVIEW_CODE), null); assert.notEqual(verificationIssue('84263', EMAIL_PREVIEW_CODE), null); assert.notEqual(verificationIssue('123456', EMAIL_PREVIEW_CODE), null); });
test('mobile preview uses exactly the six-digit 347289 code', () => { assert.equal(verificationIssue('347289', SMS_PREVIEW_CODE), null); assert.notEqual(verificationIssue('842631', SMS_PREVIEW_CODE), null); });
test('trial lasts 30 days', () => assert.equal(TRIAL_DAYS, 30));
test('code resend waits 30 seconds', () => assert.equal(RESEND_SECONDS, 30));
test('demo organisation has 5 users, 3 projects, 15 tasks, 8 documents and 4 defects', () => { const records = onboardingDemoRecords(); assert.equal(onboardingDemoUsers().length, 5); for (const [kind,count] of [['Project',3],['Task',15],['Document',8],['Defect',4]]) assert.equal(records.filter(r => r.kind === kind).length, count); });
test('Webber Parade sample has 62% progress and three open defects', () => { const records = onboardingDemoRecords(); const project = records.find(r=>r.title === '8 Webber Parade, Keilor'); assert.equal(project?.progress,62); assert.equal(records.filter(r=>r.kind==='Defect'&&r.project===project?.title&&r.status==='Reported').length,3); assert.ok(records.some(r=>r.kind==='Client'&&r.title==='John Smith')); assert.ok(records.some(r=>r.kind==='Trade'&&r.title==='ABC Electrical')); });
test('onboarding samples never export; first real project removes only sample projects', () => { const service=createMockRecordService(onboardingDemoRecords()); assert.equal(service.getRealRecords().length,0); service.saveRecord(makeRecord('Project','Real project')); assert.equal(service.getRealRecords().length,1); assert.equal(service.getRecords().filter(r=>r.kind==='Project').length,1); assert.equal(service.getRecords().filter(r=>r.kind==='Task').length,15); });
