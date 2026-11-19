import { z } from 'zod';

export const CONTACT_EMAIL = 'admin@foresiteos.com.au';
export const CONTACT_PHONE = '0437 722 552';
export const CONTACT_PHONE_LINK = 'tel:+61437722552';
export const STATES = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;
export const ROLES = ['Business Owner', 'Project Manager', 'Site Manager', 'Estimator', 'Office Manager', 'Other'] as const;
export const SIZES = ['Just me', '2–5', '6–15', '16–50', '50+'] as const;
export const PROJECT_COUNTS = ['1–3', '4–10', '11–25', '25+'] as const;
export const SECTORS = ['Residential construction', 'Commercial construction', 'Civil', 'Electrical', 'Plumbing', 'Roofing', 'Solar', 'Other trade'] as const;
export const PAIN_POINTS = ['Subcontractor delays and coordination', 'Cashflow and financial visibility', 'Client communication and approvals', 'Defect management and warranty', 'Document control', 'Admin and paperwork overload', 'Project reporting and health visibility'] as const;
export const SOURCES = ['Word of mouth', 'Social media', 'Google search', 'Referred by someone', 'Other'] as const;
export const betaApplicationSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required').max(100),
  company: z.string().trim().min(1, 'Company name is required').max(120),
  email: z.string().trim().email('Enter a valid email address').max(255),
  phone: z.string().trim().min(1, 'Phone number is required').max(30).regex(/^\+?[\d\s()-]{8,30}$/, 'Enter a valid phone number').refine(v => v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15, 'Enter a valid phone number'),
  state: z.enum(STATES, { errorMap: () => ({ message: 'Select your state / territory' }) }),
  role: z.enum(ROLES).or(z.literal('')).default(''),
  size: z.enum(SIZES).or(z.literal('')).default(''),
  projects: z.enum(PROJECT_COUNTS).or(z.literal('')).default(''),
  sectors: z.array(z.enum(SECTORS)).max(SECTORS.length).default([]),
  tools: z.string().trim().max(500).default(''),
  painPoints: z.array(z.enum(PAIN_POINTS)).max(3, 'Select up to three pain points').default([]),
  source: z.enum(SOURCES).or(z.literal('')).default(''),
  comments: z.string().trim().max(2000).default(''),
  enquiry: z.enum(['sales', 'demo', 'advisory', 'beta']).default('beta'),
  service: z.string().trim().max(120).default(''),
});
export type BetaApplication = z.infer<typeof betaApplicationSchema>;

export function applicationFromForm(form: FormData, enquiry: BetaApplication['enquiry'] = 'beta', service = '') {
  return betaApplicationSchema.safeParse({
    ...Object.fromEntries(['name', 'company', 'email', 'phone', 'state', 'role', 'size', 'projects', 'tools', 'source', 'comments'].map(key => [key, form.get(key) ?? ''])),
    sectors: form.getAll('sectors'), painPoints: form.getAll('painPoints'), enquiry, service,
  });
}