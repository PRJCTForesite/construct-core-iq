import { BETA_PREVIEW_KEY } from '@/content/onboarding';
import { useContext,useEffect,useState,type ReactNode } from 'react';
import { toast } from 'sonner';
import { PlatformContext as Context } from './platform-context';
import { makeRecord,type PlatformRecord } from '@/content/platform';
import { createMockRecordService } from '@/lib/services/mockRecordService';
import { canUseModule } from '@/lib/services/permissionsService';
import { rolePermissions,type Role, INITIAL_USERS } from '@/content/permissions';
export function PlatformProvider({children}:{children:ReactNode}) {const [service,setService]=useState(createMockRecordService);const [records,setRecords]=useState(()=>service.getRecords());const [role,setRoleState]=useState<Role>('Owner');const [permissions,setPermissions]=useState(rolePermissions('Owner'));const [editing,edit]=useState<PlatformRecord|null>(null);const [notifications,setNotifications]=useState(['Assigned task: waterproofing inspection','Defect DEF-0035 requires approval','Financial warning: Morrison invoice overdue','Project health changed: Oakwood House','Kitchen variation awaiting approval']);
 useEffect(()=>{const preview=window.sessionStorage.getItem(BETA_PREVIEW_KEY);if(preview==='administrator'){setRoleState('Administrator');setPermissions(rolePermissions('Administrator'))}else if(preview==='client'||preview==='trade'){const r=preview==='client'?'Client':'Trade';setRoleState(r);setPermissions(rolePermissions(r))}},[]);
 const loadSamples=(seed:PlatformRecord[])=>{if(records.some(r=>!service.isSample(r.id)))return;const next=createMockRecordService(seed);setService(next);setRecords(next.getRecords())};
 const notify=(n:string)=>setNotifications(old=>[n,...old]);
 const save=(r:PlatformRecord,keepOpen=false)=>{const {records:next,clearedSamples}=service.saveRecord(r);setRecords(next);if(clearedSamples)toast.success(`Sample ${r.kind.toLowerCase()} records removed — only your data is kept now.`);notify(`${r.kind} updated: ${r.title}`);if(!keepOpen)edit(null)};
 const remove=(id:string)=>setRecords(service.deleteRecord(id));
 const setRole=(r:Role)=>{setRoleState(r);setPermissions(rolePermissions(r))};
 return <Context.Provider value={{records,loadSamples,role,setRole,permissions,setPermissions,save,remove,create:kind=>edit(makeRecord(kind,'')),editing,edit,can:(m,a='View')=>canUseModule(permissions,m,a),notifications,notify,dismissNotifications:()=>setNotifications([]),isSample:service.isSample}}>{children}</Context.Provider>;
}
export function usePlatform(){const value=useContext(Context);if(!value)throw new Error('PlatformProvider missing');return value;}
export function useDemoIdentity(){const {role}=usePlatform();return INITIAL_USERS.find(u=>u.role===role)??INITIAL_USERS[0];}
