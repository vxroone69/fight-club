import { useState, useEffect } from "react";
import SphereSetup from "./components/SphereSetup";
import TodayView from "./components/TodayView";
import CalendarView from "./components/CalendarView";
import LeaderboardView from "./components/LeaderboardView";
import NotesView from "./components/NotesView";
import { store } from "./utils/store";
import { MEMBERS_LIST, defaultMember } from "./constants/spheres";

export default function App() {
  const [members, setMembers] = useState(() =>
    MEMBERS_LIST.map((name) => store.get(`fc2_${name}`) || defaultMember(name))
  );
  const [activeMember, setActiveMember] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    members.forEach((m) => store.set(`fc2_${m.name}`, m));
  }, [members]);

  function updateMember(updated) {
    setMembers((prev) => prev.map((m) => (m.name === updated.name ? updated : m)));
    setEditingMember(null);
  }

  const member = activeMember ? members.find((m) => m.name === activeMember) : null;
  const incompleteMembers = members.filter((m) => !m.setupDone);
  
  if (incompleteMembers.length > 0 && editingMember) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:#000;font-family:'DM Mono',monospace;}
          select{-webkit-appearance:none;appearance:none;}
        `}</style>
        <SphereSetup member={editingMember} onSave={updateMember} />
      </>
    );
  }

  if (!activeMember) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:#000;color:#fff;font-family:'DM Mono',monospace;}
        `}</style>
        <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
          <div style={{maxWidth:"800px",textAlign:"center",marginBottom:60}}>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:56,fontStyle:"italic",fontWeight:400,margin:"0 0 16px 0",letterSpacing:"-0.02em"}}>Fight Club<span style={{color:"#8B5CF6"}}>.</span></h1>
            <div style={{background:"#080808",border:"1px solid #1a1a1a",borderRadius:16,padding:"32px 24px",marginBottom:40}}>
              <p style={{fontFamily:"Georgia,serif",fontSize:18,fontStyle:"italic",fontWeight:400,color:"#ccc",lineHeight:1.8,margin:0}}>
                The first rule is: You must decide what you're fighting for. The second rule is: You commit daily. The third rule is: You never give up on yourself.
              </p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#444",marginTop:16,letterSpacing:"0.1em"}}>Choose your character.</p>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:24,maxWidth:"900px",width:"100%"}}>
            {MEMBERS_LIST.map(name=>{
              const m=members.find(x=>x.name===name);
              return (
                <div key={name} style={{background:"linear-gradient(135deg,#0d0a14 0%,#1a0f2e 100%)",border:"1px solid #1a1a1a",borderRadius:16,padding:"32px 24px",cursor:"pointer",transition:"all 0.3s",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#8B5CF6";e.currentTarget.style.transform="translateY(-4px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1a1a1a";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(139,92,246,0) 0%,rgba(139,92,246,0.1) 100%)",pointerEvents:"none"}}/>
                  <div style={{position:"relative",zIndex:1}}>
                    <h2 style={{fontFamily:"Georgia,serif",fontSize:32,fontStyle:"italic",fontWeight:400,margin:"0 0 12px 0",color:"#fff"}}>{m.displayName}</h2>
                    <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#444",margin:"0 0 20px 0",letterSpacing:"0.08em"}}>
                      {m.setupDone?`${m.spheres.length} SPHERES DEFINED`:"READY TO SETUP"}
                    </p>
                    <button onClick={()=>setActiveMember(name)} style={{width:"100%",background:"linear-gradient(135deg,#6D28D9 0%,#8B5CF6 50%,#A78BFA 100%)",border:"none",borderRadius:8,color:"#000",padding:"12px 24px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.2s"}}>
                      ENTER
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;color:#fff;font-family:'DM Mono',monospace;overflow-x:hidden;}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        textarea,input,select{outline:none;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn 0.25s ease;}
      `}</style>

      <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",flexDirection:"column"}}>
        
        {/* Top Header */}
        <div style={{background:"linear-gradient(180deg,#080808 0%,#000 100%)",borderBottom:"1px solid #1a1a1a",padding:"24px 32px",position:"sticky",top:0,zIndex:100}}>
          <div style={{maxWidth:"1600px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20}}>
            <div>
              <button onClick={()=>setActiveMember(null)} style={{background:"none",border:"none",color:"#666",fontSize:14,cursor:"pointer",fontFamily:"'DM Mono',monospace",marginBottom:8,transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color="#8B5CF6"} onMouseLeave={e=>e.currentTarget.style.color="#666"}>
                BACK TO HOME
              </button>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontStyle:"italic",fontWeight:400,margin:0,letterSpacing:"-0.01em"}}>{member.displayName}<span style={{color:"#8B5CF6"}}>.</span></h1>
            </div>

            {/* Member Selector */}
            <div style={{display:"flex",gap:8}}>
              {MEMBERS_LIST.map(name=>{
                const isActive=activeMember===name;
                return (
                  <button key={name} onClick={()=>setActiveMember(name)}
                    style={{background:isActive?"#8B5CF6":"#111",border:"none",color:isActive?"#000":"#666",padding:"10px 16px",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500,letterSpacing:"0.08em",cursor:"pointer",transition:"all 0.2s",textTransform:"uppercase"}}>
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{display:"flex",gap:4,marginTop:20}}>
            {[
              {id:"today",label:"TODAY PROGRESS"},
              {id:"calendar",label:"CALENDAR VIEW"},
              {id:"board",label:"LEADERBOARD"},
              {id:"notes",label:"NOTES"},
            ].map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                style={{background:activeTab===tab.id?"#8B5CF6":"#111",border:"none",color:activeTab===tab.id?"#000":"#666",padding:"11px 20px",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.2s"}}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{flex:1,padding:"32px",overflow:"auto"}}>
          {!member.setupDone?(
            <div style={{maxWidth:"600px",margin:"0 auto",textAlign:"center",paddingTop:"60px"}}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontStyle:"italic",margin:"0 0 16px 0"}}>{member.displayName}</h2>
              <p style={{color:"#444",fontSize:12,marginBottom:24}}>Needs setup</p>
              <button onClick={()=>setEditingMember(member)}
                style={{background:"linear-gradient(135deg,#6D28D9,#8B5CF6)",border:"none",color:"#fff",padding:"12px 24px",borderRadius:8,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500}}>
                CONFIGURE SPHERES
              </button>
            </div>
          ):(
            <div className="fade" key={`${activeMember}-${activeTab}`}>
              {activeTab==="today"&&(
                <div style={{maxWidth:"600px",margin:"0 auto"}}>
                  <TodayView member={member} onUpdate={updateMember}/>
                  <button onClick={()=>setEditingMember(member)} title="Edit spheres"
                    style={{marginTop:20,background:"#111",border:"1px solid #1a1a1a",borderRadius:8,color:"#666",fontSize:13,padding:"10px 16px",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all 0.2s"}}>
                    EDIT SPHERES
                  </button>
                </div>
              )}
              {activeTab==="calendar"&&(
                <div style={{maxWidth:"600px",margin:"0 auto"}}>
                  <CalendarView member={member}/>
                </div>
              )}
              {activeTab==="board"&&(
                <LeaderboardView allMembers={members}/>
              )}
              {activeTab==="notes"&&(
                <div style={{maxWidth:"600px",margin:"0 auto"}}>
                  <NotesView member={member} onUpdate={updateMember}/>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
