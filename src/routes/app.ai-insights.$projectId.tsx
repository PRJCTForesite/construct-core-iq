import { createFileRoute } from '@tanstack/react-router';
import { AssistantModule } from '@/components/platform/AssistantModule';
export const Route=createFileRoute('/app/ai-insights/$projectId')({head:({params})=>({meta:[{title:`${params.projectId} assistant — Foresite`},{name:'description',content:'Project-specific assistant conversation and risks.'},{property:'og:title',content:`${params.projectId} assistant — Foresite`},{property:'og:description',content:'Project-specific assistant conversation and risks.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:ProjectAssistant});
function ProjectAssistant(){const {projectId}=Route.useParams();return <AssistantModule key={projectId} projectId={projectId}/>}
