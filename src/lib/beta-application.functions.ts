import { createServerFn } from '@tanstack/react-start';
import { betaApplicationSchema, CONTACT_EMAIL } from '@/content/beta-registration';

export const submitBetaApplication = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => betaApplicationSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: 'https://foresiteos.com.au/contact' },
        body: JSON.stringify({
          _subject: `Foresite ${data.enquiry === 'beta' ? 'Beta Application' : data.enquiry === 'demo' ? 'Demo Request' : data.enquiry === 'advisory' ? 'Advisory Enquiry' : 'Software Pricing'} — ${data.company}`,
          _template: 'table', _replyto: data.email,
          name: data.name, company: data.company, email: data.email, phone: data.phone,
          'State / territory': data.state, Role: data.role, 'Internal staff': data.size,
          'Active projects': data.projects, Sectors: data.sectors.join(', '),
          'Current tools': data.tools, 'Pain points': data.painPoints.join(', '),
          'Heard about Foresite': data.source, Comments: data.comments,
          'Enquiry type': data.enquiry, 'Advisory service': data.service,
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        const body = await response.text();
        console.error('FormSubmit request failed', response.status, body.slice(0, 500));
        return { accepted: false, error: 'Your application could not be submitted. Please try again or contact us directly.' };
      }
      const result: unknown = await response.json();
      if (typeof result === 'object' && result !== null && 'message' in result && typeof result.message === 'string' && result.message.toLowerCase().includes('activation')) {
        return { accepted: false, error: 'Online applications are awaiting email activation. Please contact admin@foresite.com.au or call 0437 722 552. Your application has not been delivered.' };
      }
      if (typeof result !== 'object' || result === null || !('success' in result) || (result.success !== true && result.success !== 'true')) {
        return { accepted: false, error: 'The email service did not accept your application. Please try again or contact us directly.' };
      }
      return { accepted: true, error: '' };
    } catch {
      return { accepted: false, error: 'The email service is unavailable. Your details have not been confirmed as received. Please try again or contact us directly.' };
    }
  });