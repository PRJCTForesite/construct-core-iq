import { weightedProgress } from '@/content/workflow';
import { useContext,useState,type ReactNode } from 'react';
import { toast } from 'sonner';
import { PlatformContext as Context } from './platform-context';
import { INITIAL_RECORDS,makeRecord,type PlatformRecord } from '@/content/platform';
import { commitRecord } from '@/content/sample-data';
import { upsertRecord,deleteRecord } from '@/lib/foresite-api';
import { rolePermissions,type Role, INITIAL_USERS } from '@/content/permissions';
const SAMPLE_IDS:ReadonlySet<string>=new Set(INITIAL_RECORDS.map(r=>r.id));
const sync=(p:Promise<void>)=>p.catch(e=>toast.error(`Not synced to Foresite server: ${e instanceof Error?e.message:'connection failed'}`));
export function PlatformProvider({children}:{children:ReactNode}) {const [records,setRecords]=useState(INITIAL_RECORDS);const [role,setRoleState]=useState<Role>('Owner');const [permissions,setPermissions]=useState(rolePermissions('Owner'));const [editing,edit]=useState<PlatformRecord|null>(null);const [notifications,setNotifications]=useState(['Assigned task: waterproofing inspection','Defect DEF-0035 requires approval','Financial warning: Morrison invoice overdue','Project health changed: Oakwood House','Kitchen variation awaiting approval']);
 const notify=(n:string)=>setNotifications(old=>[n,...old]);
 const save=(r:PlatformRecord,keepOpen=false)=>{const {records:committed,clearedSamples}=commitRecord(records,r,SAMPLE_IDS);const next=r.kind==='Task'?committed.map(p=>p.kind==='Project'&&[r.project,records.find(x=>x.id===r.id)?.project].includes(p.title)?{...p,progress:weightedProgress(committed.filter(t=>t.kind==='Task'&&t.project===p.title))}:p):committed;setRecords(next);if(clearedSamples)toast.success(`Sample ${r.kind.toLowerCase()} records removed — only your data is kept now.`);if(!SAMPLE_IDS.has(r.id))void sync(upsertRecord(r));notify(`${r.kind} updated: ${r.title}`);if(!keepOpen)edit(null)};
 const remove=(id:string)=>{setRecords(old=>old.filter(x=>x.id!==id));if(!SAMPLE_IDS.has(id))void sync(deleteRecord(id))};
 const setRole=(r:Role)=>{setRoleState(r);setPermissions(rolePermissions(r))};
 return <Context.Provider value={{records,role,setRole,permissions,setPermissions,save,remove,create:kind=>edit(makeRecord(kind,'')),editing,edit,can:(m,a='View')=>permissions[m]?.includes(a)??['Calendar','Clients','Trades','Settings'].includes(m),notifications,notify,dismissNotifications:()=>setNotifications([]),isSample:(id:string)=>SAMPLE_IDS.has(id)}}>{children}</Context.Provider>;
}
export function usePlatform(){const value=useContext(Context);if(!value)throw new Error('PlatformProvider missing');return value;}
export function useDemoIdentity(){const {role}=usePlatform();return INITIAL_USERS.find(u=>u.role===role)??INITIAL_USERS[0];}
