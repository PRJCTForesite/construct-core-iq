export type PricingTier = {
  id: 'starter' | 'professional' | 'enterprise'; name: string; audience: string; description: string;
  price: number; unit: string; futurePrice?: number; includedUsers?: number; additionalUserPrice?: number;
  unlimitedExternalUsers: true; features: string[]; featured?: boolean; onboarding: string;
};
export const PRICING_TIERS: PricingTier[] = [
  { id: 'starter', name: 'Starter', price: 50, futurePrice: 100, unit: 'per user / month', unlimitedExternalUsers: true,
    audience: 'Trades, small contractors, small builders and emerging businesses', description: 'The essentials to organise work and keep everyone connected.',
    features: ['Projects', 'Tasks', 'Defects', 'Documents', 'Communications', 'Client Portal', 'Trade Portal', 'Basic Project Health', 'Mobile Access', 'Unlimited External Users'], onboarding: 'Self-service setup · included' },
  { id: 'professional', name: 'Professional', price: 100, futurePrice: 200, unit: 'per user / month', unlimitedExternalUsers: true, featured: true,
    audience: 'Growing builders, commercial builders and project managers', description: 'Delivery, financial visibility and intelligence for growing teams.',
    features: ['Everything in Starter', 'Advanced Reporting', 'Project Health Centre', 'Financial Management', 'Trade Directory', 'Preferred Trades', 'Advanced Permissions', 'Construction Intelligence'], onboarding: 'Optional onboarding · up to $5,000, depending on project requirements' },
  { id: 'enterprise', name: 'Enterprise', price: 10000, unit: 'per year', includedUsers: 20, additionalUserPrice: 50, unlimitedExternalUsers: true,
    audience: 'Large organisations and multi-project portfolios', description: 'Portfolio oversight and support for construction at scale.',
    features: ['Everything in Professional', '20 Users', 'Unlimited Projects', 'Unlimited Active Jobs', 'Portfolio Reporting', 'Enterprise Permissions', 'Capacity Analytics', 'AI Trade Recommendations', 'Priority Support', 'Dedicated Onboarding', 'Custom Integrations'], onboarding: 'Dedicated implementation · starting from $5,000+' },
];
export const PRICING_COMPARISON = [
  { feature: 'Projects', starter: 'Included', professional: 'Included', enterprise: 'Unlimited' },
  { feature: 'Tasks', starter: 'Included', professional: 'Included', enterprise: 'Included' },
  { feature: 'Defects', starter: 'Included', professional: 'Included', enterprise: 'Included' },
  { feature: 'Documents & Communications', starter: 'Included', professional: 'Included', enterprise: 'Included' },
  { feature: 'Client Portal', starter: 'Unlimited clients', professional: 'Unlimited clients', enterprise: 'Unlimited clients' },
  { feature: 'Trade Portal', starter: 'Unlimited trades', professional: 'Unlimited trades', enterprise: 'Unlimited trades' },
  { feature: 'Project Health', starter: 'Basic', professional: 'Project Health Centre', enterprise: 'Project Health Centre' },
  { feature: 'Reporting', starter: '—', professional: 'Advanced', enterprise: 'Advanced + portfolio' },
  { feature: 'Financial Management', starter: '—', professional: 'Included', enterprise: 'Included' },
  { feature: 'Trade Directory & Preferred Trades', starter: '—', professional: 'Included', enterprise: 'Included' },
  { feature: 'Construction Intelligence', starter: '—', professional: 'Included', enterprise: 'Includes AI trade recommendations' },
  { feature: 'Permissions', starter: '—', professional: 'Advanced', enterprise: 'Enterprise' },
  { feature: 'Portfolio Management', starter: '—', professional: '—', enterprise: 'Portfolio reporting + capacity analytics' },
  { feature: 'Integrations', starter: '—', professional: '—', enterprise: 'Custom integrations' },
  { feature: 'Priority Support', starter: '—', professional: '—', enterprise: 'Included' },
  { feature: 'Mobile Access', starter: 'Included', professional: 'Included', enterprise: 'Included' },
];
export type AdvisoryService = { name: string; min: number; max: number; plus?: boolean; unit?: string; features: string[]; requested?: boolean };
export const ASSURANCE_SERVICES: AdvisoryService[] = [
  { name: 'Project Review', min: 750, max: 1500, features: ['Project Status Review', 'Budget Visibility Review', 'Defects & Outstanding Work', 'Action Register', 'Written Findings Report'] },
  { name: 'Delivery Review', min: 1500, max: 3500, requested: true, features: ['Programme Review', 'Trade Coordination', 'Procurement Review', 'Delivery Bottlenecks', 'Recovery Plan'] },
  { name: 'Project Risk Assessment', min: 1000, max: 2500, requested: true, features: ['Risk Register', 'Schedule Exposure', 'Cost Exposure', 'Mitigation Actions'] },
  { name: 'Project Health Review', min: 1250, max: 3000, requested: true, features: ['Programme Health', 'Financial Health', 'Defect Health', 'Communication Health', 'Overall Project Health Score'] },
];
export const DELAY_SERVICES: AdvisoryService[] = [
  { name: 'Construction Programme Review', min: 750, max: 2000, requested: true, features: [] },
  { name: 'Delay Analysis', min: 1500, max: 5000, plus: true, features: [] },
  { name: 'EOT Assessment', min: 1250, max: 3500, requested: true, features: [] },
  { name: 'Notice Management', min: 350, max: 900, unit: 'per month / project', requested: true, features: [] },
];
export const SERVICE_PACKAGES: AdvisoryService[] = [
  { name: 'Project Assurance Monthly', min: 1500, max: 1500, unit: 'per month', features: ['Monthly Review', 'Project Health Review', 'Advisory Support'] },
  { name: 'Delivery Oversight', min: 2500, max: 2500, unit: 'per month', features: ['Delivery Review', 'Risk Tracking', 'Management Meetings'] },
  { name: 'Delay Watch', min: 750, max: 750, unit: 'per month', features: ['Notice Register', 'Deadline Monitoring', 'Monthly Review'] },
  { name: 'Project Recovery', min: 3500, max: 7500, features: [] },
  { name: 'Claims Preparation', min: 2500, max: 6000, features: [] },
];
export const MOST_REQUESTED = [...ASSURANCE_SERVICES, ...DELAY_SERVICES].filter(service => service.requested);
export const money = (value: number) => `$${value.toLocaleString('en-US')}`;
export const servicePrice = (service: AdvisoryService) => `${money(service.min)}${service.max === service.min ? '' : ` – ${money(service.max)}`}${service.plus ? '+' : ''}`;
export const PRICING_FAQ = [
  { question: 'Do clients and trades cost extra?', answer: 'No. All plans include unlimited clients, trades and external users. Only internal users are paid.' },
  { question: 'How is Enterprise priced?', answer: 'Enterprise is $10,000 per year including 20 internal users, unlimited projects and unlimited active jobs. Additional internal users are $50 per user per month.' },
  { question: 'Are advisory services included in my subscription?', answer: 'No. Advisory services and service packages are optional and separately priced. Software subscriptions remain separate; package scope is agreed during consultation.' },
  { question: 'What are the future target prices?', answer: 'Starter’s future target is $100 per user per month and Professional’s is $200 per user per month. These are not current charges; no change date is specified.' },
  { question: 'Is implementation included?', answer: 'Starter includes self-service setup. Professional offers optional onboarding up to $5,000 depending on requirements. Enterprise dedicated implementation starts at $5,000+.' },
];
