import { useContext,useState,type ReactNode } from 'react';
import { PlatformContext as Context } from './platform-context';
import { INITIAL_RECORDS,makeRecord,type PlatformRecord,type RecordKind } from '@/content/platform';
import { rolePermissions,type Role, INITIAL_USERS } from '@/content/permissions';
export function PlatformProvider({children}:{children:ReactNode}) {const [records,setRecords]=useState(INITIAL_RECORDS);const [role,setRoleState]=useState<Role>('Owner');const [permissions,setPermissions]=useState(rolePermissions('Owner'));const [editing,edit]=useState<PlatformRecord|null>(null);const [notifications,setNotifications]=useState(['Assigned task: waterproofing inspection','Defect DEF-0035 requires approval','Financial warning: Morrison invoice overdue','Project health changed: Oakwood House','Kitchen variation awaiting approval']);
 const notify=(n:string)=>setNotifications(old=>[n,...old]);const save=(r:PlatformRecord)=>{setRecords(old=>old.some(x=>x.id===r.id)?old.map(x=>x.id===r.id?r:x):[r,...old]);notify(`${r.kind} updated: ${r.title}`);edit(null)};
 const setRole=(r:Role)=>{setRoleState(r);setPermissions(rolePermissions(r))};
 return <Context.Provider value={{records,role,setRole,permissions,setPermissions,save,remove:id=>setRecords(old=>old.filter(x=>x.id!==id)),create:kind=>edit(makeRecord(kind,'')),editing,edit,can:(m,a='View')=>permissions[m]?.includes(a)??['Calendar','Clients','Trades','Settings'].includes(m),notifications,notify,dismissNotifications:()=>setNotifications([])}}>{children}</Context.Provider>;
}
export function usePlatform(){const value=useContext(Context);if(!value)throw new Error('PlatformProvider missing');return value;}
export function useDemoIdentity(){const {role}=usePlatform();return INITIAL_USERS.find(u=>u.role===role)??INITIAL_USERS[0];}
