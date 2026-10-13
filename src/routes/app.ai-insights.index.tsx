import { createFileRoute } from '@tanstack/react-router';
import { AssistantModule } from '@/components/platform/AssistantModule';
export const Route=createFileRoute('/app/ai-insights/')({head:()=>({meta:[{title:'Project insights — Foresite'},{name:'description',content:'Project risks and assistant conversations.'},{property:'og:title',content:'Project insights — Foresite'},{property:'og:description',content:'Project risks and assistant conversations.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:AssistantModule});
