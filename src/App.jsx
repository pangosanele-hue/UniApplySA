import { useState, useRef } from "react";

const UNI_COURSES = {
  uct:  ["medicine","law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","barch"],
  wits: ["medicine","law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","barch"],
  up:   ["medicine","law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","barch","bnursing","bed"],
  su:   ["medicine","law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","barch"],
  ukzn: ["medicine","law","engineering_civil","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","bnursing","bed"],
  uj:   ["law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bsc_it","bed","bnursing"],
  nwu:  ["law","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bpharm","bnursing","bed","bsc_it"],
  ufs:  ["medicine","law","bsc_cs","bcom_acc","bcom_fin","bsoc_sci","ba_hums","bsc_bio","bnursing","bed"],
  ru:   ["law","bsc_cs","bcom_acc","bsoc_sci","ba_hums","bsc_bio","bed"],
  nmu:  ["law","engineering_civil","engineering_elec","bsc_cs","bcom_acc","bsoc_sci","ba_hums","bsc_bio","bnursing","bed","bsc_it"],
};

const SA_UNIVERSITIES = [
  {id:"uct", name:"University of Cape Town",         shortName:"UCT",  location:"Cape Town",     minAPS:36,logo:"🎓",fee:"Free"},
  {id:"wits",name:"University of the Witwatersrand", shortName:"Wits", location:"Johannesburg",  minAPS:35,logo:"🏛️",fee:"Free"},
  {id:"up",  name:"University of Pretoria",          shortName:"UP",   location:"Pretoria",      minAPS:30,logo:"🦅",fee:"R300"},
  {id:"su",  name:"Stellenbosch University",         shortName:"SU",   location:"Stellenbosch",  minAPS:30,logo:"🍇",fee:"Free*"},
  {id:"ukzn",name:"University of KwaZulu-Natal",     shortName:"UKZN", location:"Durban",        minAPS:28,logo:"🌊",fee:"CAO"},
  {id:"uj",  name:"University of Johannesburg",      shortName:"UJ",   location:"Johannesburg",  minAPS:25,logo:"🌆",fee:"Free"},
  {id:"nwu", name:"North-West University",           shortName:"NWU",  location:"Potchefstroom", minAPS:24,logo:"🌾",fee:"Free"},
  {id:"ufs", name:"University of the Free State",    shortName:"UFS",  location:"Bloemfontein",  minAPS:24,logo:"🌻",fee:"Free"},
  {id:"ru",  name:"Rhodes University",               shortName:"RU",   location:"Makhanda",      minAPS:28,logo:"📚",fee:"R200"},
  {id:"nmu", name:"Nelson Mandela University",       shortName:"NMU",  location:"Gqeberha",      minAPS:24,logo:"✊",fee:"Free"},
];

const COURSES = [
  {id:"medicine",          name:"Medicine (MBChB)",                   field:"Health Sciences",   minAPS:40,subjects:["Mathematics","Life Sciences","Physical Sciences"]},
  {id:"bpharm",            name:"BPharm (Pharmacy)",                  field:"Health Sciences",   minAPS:35,subjects:["Mathematics","Life Sciences","Physical Sciences"]},
  {id:"bnursing",          name:"BNursing",                           field:"Health Sciences",   minAPS:26,subjects:["Life Sciences"]},
  {id:"law",               name:"LLB Law",                            field:"Law",               minAPS:33,subjects:["English"]},
  {id:"engineering_civil", name:"Civil Engineering (BEng)",           field:"Engineering",       minAPS:35,subjects:["Mathematics","Physical Sciences"]},
  {id:"engineering_elec",  name:"Electrical Engineering (BEng)",      field:"Engineering",       minAPS:35,subjects:["Mathematics","Physical Sciences"]},
  {id:"barch",             name:"Architecture (BArch)",               field:"Built Environment", minAPS:33,subjects:["Mathematics","Physical Sciences"]},
  {id:"bsc_cs",            name:"BSc Computer Science",               field:"Science & IT",      minAPS:30,subjects:["Mathematics"]},
  {id:"bsc_it",            name:"BSc Information Technology",         field:"Science & IT",      minAPS:27,subjects:["Mathematics"]},
  {id:"bsc_bio",           name:"BSc Biological Sciences",            field:"Science & IT",      minAPS:28,subjects:["Life Sciences","Mathematics"]},
  {id:"bcom_acc",          name:"BCom Accounting",                    field:"Commerce",          minAPS:28,subjects:["Mathematics"]},
  {id:"bcom_fin",          name:"BCom Finance",                       field:"Commerce",          minAPS:28,subjects:["Mathematics"]},
  {id:"bsoc_sci",          name:"BSocSci (Psychology / Social Work)", field:"Humanities",        minAPS:25,subjects:["English"]},
  {id:"ba_hums",           name:"BA Humanities",                      field:"Humanities",        minAPS:22,subjects:["English"]},
  {id:"bed",               name:"BEd Education",                      field:"Education",         minAPS:22,subjects:["English"]},
];

const SUBJECTS = [
  "English Home Language","English First Additional Language","Afrikaans Home Language",
  "Afrikaans First Additional Language","IsiZulu","IsiXhosa","Sesotho","Setswana",
  "Mathematics","Mathematical Literacy","Technical Mathematics","Physical Sciences",
  "Life Sciences","Agricultural Sciences","Accounting","Business Studies","Economics",
  "History","Geography","Life Orientation","Information Technology",
  "Computer Applications Technology","Visual Arts","Music","Dramatic Arts","Consumer Studies",
];

const GRADE_LEVELS = [
  {label:"80–100%",value:7},{label:"70–79%",value:6},{label:"60–69%",value:5},
  {label:"50–59%",value:4},{label:"40–49%",value:3},{label:"30–39%",value:2},{label:"0–29%",value:1},
];

const PROVINCES    = ["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"];
const RELATIONSHIPS= ["Mother","Father","Legal Guardian","Grandmother","Grandfather","Other"];
const INCOME_BRACKETS=["R0–R50 000","R50 001–R150 000","R150 001–R350 000","R350 001–R600 000","Above R600 000","Prefer not to say"];

function calcAPS(rows){
  const filled=rows.filter(r=>r.subject&&r.level);
  const sorted=[...filled].sort((a,b)=>b.level-a.level);
  const top6=sorted.filter(r=>r.subject!=="Life Orientation").slice(0,6);
  return top6.reduce((s,r)=>s+Number(r.level),0);
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#080c17;--s1:#101623;--s2:#141d2e;--s3:#1a2540;
  --ac:#00d4aa;--bl:#3b82f6;--wa:#f59e0b;--er:#ef4444;
  --tx:#dde6f5;--dm:#6b7fa3;--bd:#1b2d4a;
  --gd:linear-gradient(135deg,#00d4aa,#3b82f6);
  --safe-top:env(safe-area-inset-top,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
}
html,body,#root{height:100%;background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;overflow:hidden}

/* MOBILE SHELL */
.shell{display:flex;flex-direction:column;height:100vh;height:100dvh}
.topbar{
  background:var(--s1);border-bottom:1px solid var(--bd);
  padding:calc(12px + var(--safe-top)) 18px 12px;
  display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
}
.topbar-title{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700}
.content{flex:1;overflow-y:auto;padding:16px;padding-bottom:calc(80px + var(--safe-bottom))}
.content::-webkit-scrollbar{display:none}

/* BOTTOM NAV */
.bottomnav{
  position:fixed;bottom:0;left:0;right:0;
  background:var(--s1);border-top:1px solid var(--bd);
  display:flex;padding-bottom:var(--safe-bottom);z-index:100;
}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;padding:10px 4px 8px;cursor:pointer;transition:all .18s;gap:3px;border:none;background:transparent}
.bni-icon{font-size:1.3rem;line-height:1}
.bni-label{font-size:.6rem;font-family:'Syne',sans-serif;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--dm);transition:color .18s}
.bni.on .bni-label{color:var(--ac)}
.bni.on .bni-icon{filter:drop-shadow(0 0 8px #00d4aa88)}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:18px;margin-bottom:13px}
.card2{background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:14px}
.card3{background:var(--s3);border:1px solid var(--bd);border-radius:10px;padding:12px}

/* STEPPER - horizontal scroll on mobile */
.stepper{display:flex;gap:3px;margin-bottom:16px;background:var(--s1);border-radius:10px;padding:3px;overflow-x:auto;flex-shrink:0;-webkit-overflow-scrolling:touch}
.stepper::-webkit-scrollbar{display:none}
.sb{flex-shrink:0;padding:7px 10px;text-align:center;font-size:.62rem;font-family:'Syne',sans-serif;border-radius:8px;cursor:pointer;border:none;background:transparent;color:var(--dm);font-weight:700;white-space:nowrap;letter-spacing:.2px;transition:all .18s}
.sb.on{background:var(--gd);color:#000}.sb.done{color:var(--ac)}

/* FORM */
.fg{margin-bottom:12px}
.fl{display:block;font-size:.67rem;color:var(--dm);font-weight:600;margin-bottom:5px;text-transform:uppercase;letter-spacing:.9px}
.fi{width:100%;background:var(--s2);border:1px solid var(--bd);border-radius:9px;padding:11px 13px;color:var(--tx);font-size:1rem;font-family:'DM Sans',sans-serif;outline:none;transition:border .18s;-webkit-appearance:none;appearance:none}
.fi:focus{border-color:var(--ac)}
select.fi{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7fa3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:36px}
select.fi option{background:#141d2e}

/* BUTTONS */
.btn{padding:13px 22px;border-radius:10px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;font-size:.84rem;transition:all .18s;white-space:nowrap;-webkit-appearance:none;touch-action:manipulation}
.btn-p{background:var(--gd);color:#000}.btn-p:disabled{opacity:.3;cursor:not-allowed}
.btn-o{background:transparent;border:1.5px solid var(--bd);color:var(--dm)}
.btn-sm{padding:9px 14px;font-size:.75rem}
.btn-full{width:100%}

/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.span2{grid-column:span 2}

/* SECTION LABEL */
.grp{font-family:'Syne',sans-serif;font-weight:700;font-size:.76rem;color:var(--ac);text-transform:uppercase;letter-spacing:1px;margin:16px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bd)}

/* NAV ACTIONS */
.nav-act{display:flex;justify-content:space-between;margin-top:18px;gap:10px}
.nav-act .btn{flex:1}
.div{height:1px;background:var(--bd);margin:15px 0}

/* TAGS */
.tag{display:inline-block;padding:8px 14px;border-radius:20px;border:1.5px solid var(--bd);font-size:.78rem;cursor:pointer;color:var(--dm);transition:all .18s;margin:3px;font-family:'DM Sans',sans-serif;touch-action:manipulation}
.tag.a{border-color:var(--ac);background:rgba(0,212,170,.1);color:var(--ac)}
.tag.b{border-color:var(--bl);background:rgba(59,130,246,.1);color:var(--bl)}

/* BANNERS */
.banner{border-radius:10px;padding:10px 13px;font-size:.74rem;margin-bottom:14px;display:flex;gap:8px;line-height:1.55}
.bw{background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.24);color:var(--wa)}
.bg{background:rgba(0,212,170,.07);border:1px solid rgba(0,212,170,.2);color:var(--ac)}
.bb{background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);color:var(--bl)}

/* STAT CARDS */
.scard{background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:16px;text-align:center}
.snum{font-family:'Syne',sans-serif;font-size:1.9rem;font-weight:800;background:var(--gd);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.slabel{font-size:.66rem;color:var(--dm);margin-top:3px;text-transform:uppercase;letter-spacing:.9px}

/* UNI CARDS */
.ucard{background:var(--s2);border:1.5px solid var(--bd);border-radius:12px;padding:13px;cursor:pointer;transition:all .18s;position:relative;touch-action:manipulation}
.ucard.sel{border-color:var(--ac);background:rgba(0,212,170,.07)}.ucard.lk{opacity:.35;pointer-events:none}
.uchk{position:absolute;top:8px;right:8px;background:var(--ac);color:#000;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800}

/* COURSE CARDS */
.ccard{background:var(--s2);border:1.5px solid var(--bd);border-radius:12px;padding:13px;cursor:pointer;transition:all .18s;touch-action:manipulation}
.ccard.sel{border-color:var(--bl);background:rgba(59,130,246,.07)}
.cf{display:inline-block;background:rgba(59,130,246,.12);color:var(--bl);font-size:.6rem;padding:2px 8px;border-radius:12px;margin-bottom:5px;font-weight:700;letter-spacing:.5px}

/* STATUS PILLS */
.sp{display:inline-block;padding:3px 11px;border-radius:20px;font-size:.68rem;font-weight:700;letter-spacing:.5px}
.s-Submitted{background:rgba(245,158,11,.12);color:var(--wa)}.s-Under-Review{background:rgba(59,130,246,.12);color:var(--bl)}
.s-Accepted{background:rgba(0,212,170,.12);color:var(--ac)}.s-Rejected{background:rgba(239,68,68,.12);color:var(--er)}

/* APP ROWS */
.arow{background:var(--s2);border:1px solid var(--bd);border-radius:12px;padding:14px 16px;margin-bottom:10px}
.tl{margin-top:10px;padding-left:10px;border-left:2px solid var(--bd)}
.ti{font-size:.7rem;color:var(--dm);padding:3px 0 3px 12px;position:relative}
.ti::before{content:'';position:absolute;left:-5px;top:7px;width:8px;height:8px;border-radius:50%;background:var(--ac)}

/* INFO ROWS */
.irow{display:flex;gap:10px;padding:5px 0;font-size:.81rem;border-bottom:1px solid rgba(27,45,74,.5);flex-wrap:wrap}
.ik{color:var(--dm);min-width:130px;font-size:.74rem}.iv{color:var(--tx);font-weight:500;font-size:.8rem}

/* FILE UPLOAD */
.upload{border:2px dashed var(--bd);border-radius:12px;padding:22px 16px;text-align:center;cursor:pointer;transition:all .2s;touch-action:manipulation}
.upload.done{border-color:var(--ac);background:rgba(0,212,170,.05)}

/* VERIFY CHECKS */
.vck{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:var(--s2);border:1px solid var(--bd);border-radius:10px;margin-bottom:8px;cursor:pointer;touch-action:manipulation}
.vck.on{border-color:var(--ac)}
.vbox{width:22px;height:22px;min-width:22px;border-radius:6px;border:2px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:.75rem;margin-top:1px;transition:all .18s}
.vbox.on{background:var(--ac);border-color:var(--ac);color:#000}

/* TYPE CARDS */
.tc{background:var(--s2);border:2px solid var(--bd);border-radius:16px;padding:20px;cursor:pointer;transition:all .2s;text-align:center;touch-action:manipulation}
.tc.sel{border-color:var(--ac);background:rgba(0,212,170,.07)}

/* APS BAR */
.aps-bar{background:var(--s3);border-radius:20px;height:7px;margin-top:5px;overflow:hidden}
.aps-fill{height:100%;border-radius:20px;background:var(--gd);transition:width .5s}

/* SCROLL */
.scroll{max-height:45vh;overflow-y:auto;-webkit-overflow-scrolling:touch}
.scroll::-webkit-scrollbar{display:none}

/* NOTIF */
.notif{position:fixed;top:calc(16px + var(--safe-top));right:16px;left:16px;z-index:999;background:var(--s1);border:1px solid var(--ac);border-radius:12px;padding:12px 16px;font-size:.83rem;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:sIn .3s ease;text-align:center}
@keyframes sIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}

.empty{text-align:center;padding:36px 18px;color:var(--dm)}
.grad-text{background:var(--gd);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
`;

export default function App(){
  const [page,setPage]=useState("dashboard");
  const [step,setStep]=useState(0);
  const [appType,setAppType]=useState("");
  const [notif,setNotif]=useState(null);
  const [apps,setApps]=useState([]);

  const [info,setInfo]=useState({
    firstName:"",lastName:"",idNumber:"",dob:"",gender:"",nationality:"South African",
    race:"",disability:"No",email:"",phone:"",address:"",postalCode:"",province:"",
    school:"",schoolProvince:"",schoolType:"",grade:"",matricYear:"",
    p1Name:"",p1Surname:"",p1ID:"",p1Rel:"Mother",p1Phone:"",p1Email:"",p1Job:"",p1Income:"",
    p2Name:"",p2Surname:"",p2ID:"",p2Rel:"Father",p2Phone:"",p2Email:"",p2Job:"",p2Income:"",
    emName:"",emPhone:"",emRel:"",
  });

  const [rows,setRows]=useState([
    {id:1,subject:"",level:""},{id:2,subject:"",level:""},{id:3,subject:"",level:""},
    {id:4,subject:"",level:""},{id:5,subject:"",level:""},{id:6,subject:"",level:""},
    {id:7,subject:"Life Orientation",level:""},
  ]);
  const [file,setFile]=useState(null);
  const fileRef=useRef();

  const [prefs,setPrefs]=useState({fields:[],locs:[]});
  const [course,setCourse]=useState("");
  const [unis,setUnis]=useState([]);
  const [checks,setChecks]=useState({p:false,a:false,g:false,acc:false});

  const aps=calcAPS(rows);
  const courseObj=COURSES.find(c=>c.id===course);

  function notify(msg){setNotif(msg);setTimeout(()=>setNotif(null),3500);}
  function upd(k,v){setInfo(p=>({...p,[k]:v}));}
  function next(){setStep(s=>s+1);window.scrollTo&&window.scrollTo(0,0);}
  function back(){setStep(s=>s-1);window.scrollTo&&window.scrollTo(0,0);}

  const STEPS=["Type","Personal","Guardian","Results","Prefs","Course","Unis","Verify","Done"];

  function submitApps(){
    const newApps=unis.map(uid=>{
      const u=SA_UNIVERSITIES.find(x=>x.id===uid);
      return {id:`${Date.now()}-${uid}`,university:u.name,shortName:u.shortName,logo:u.logo,
        course:courseObj?.name,status:"Submitted",cond:appType==="pre",
        date:new Date().toLocaleDateString("en-ZA"),
        updates:[{date:new Date().toLocaleDateString("en-ZA"),msg:"Application submitted and received."}]};
    });
    setApps(p=>[...p,...newApps]);
    next();
    notify(`🎉 ${newApps.length} application${newApps.length>1?"s":""} submitted!`);
    setTimeout(()=>{
      setApps(p=>p.map((a,i)=>i===p.length-newApps.length
        ?{...a,status:"Under Review",updates:[...a.updates,{date:new Date().toLocaleDateString("en-ZA"),msg:"Admissions team is reviewing your application."}]}
        :a));
      notify("📬 One application is now Under Review!");
    },7000);
  }

  function SType(){
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1.05rem",marginBottom:5}}>Who is applying?</div>
      <div style={{color:"var(--dm)",fontSize:".8rem",marginBottom:16}}>Select your application route.</div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
        <div className={`tc ${appType==="matric"?"sel":""}`} onClick={()=>setAppType("matric")}>
          <div style={{fontSize:"2.2rem",marginBottom:8}}>🎓</div>
          <div style={{fontFamily:"Syne",fontWeight:700,marginBottom:5}}>Matriculant</div>
          <div style={{fontSize:".76rem",color:"var(--dm)",lineHeight:1.5}}>I have completed or am completing Grade 12 with NSC results.</div>
        </div>
        <div className={`tc ${appType==="pre"?"sel":""}`} onClick={()=>setAppType("pre")}>
          <div style={{fontSize:"2.2rem",marginBottom:8}}>📖</div>
          <div style={{fontFamily:"Syne",fontWeight:700,marginBottom:5}}>Pre-Matriculant</div>
          <div style={{fontSize:".76rem",color:"var(--dm)",lineHeight:1.5}}>I am in Grade 10 or 11. Admission will be <strong>conditional</strong> on final matric results.</div>
        </div>
      </div>
      {appType==="pre"&&<div className="banner bw">⚠️ <span><strong>Conditional Application:</strong> Universities issue a conditional offer. Final admission requires achieving the APS in your NSC.</span></div>}
      <button className="btn btn-p btn-full" disabled={!appType} onClick={next}>Next: Personal Info →</button>
    </div>);
  }

  function SPersonal(){
    const miss=!info.firstName||!info.lastName||!info.idNumber||!info.email||!info.phone;
    return(<div>
      <div className="banner bg">🔒 Encrypted. In beta, stored in memory only.</div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:14}}>Personal Information</div>
      <div className="grp">Identity</div>
      <div className="fg"><label className="fl">First Name *</label><input className="fi" value={info.firstName} onChange={e=>upd("firstName",e.target.value)} placeholder="e.g. Nomvula"/></div>
      <div className="fg"><label className="fl">Surname *</label><input className="fi" value={info.lastName} onChange={e=>upd("lastName",e.target.value)} placeholder="e.g. Dlamini"/></div>
      <div className="fg"><label className="fl">SA ID Number *</label><input className="fi" inputMode="numeric" value={info.idNumber} onChange={e=>upd("idNumber",e.target.value)} placeholder="13-digit ID" maxLength={13}/></div>
      <div className="fg"><label className="fl">Date of Birth</label><input className="fi" type="date" value={info.dob} onChange={e=>upd("dob",e.target.value)}/></div>
      <div className="g2">
        <div className="fg"><label className="fl">Gender</label>
          <select className="fi" value={info.gender} onChange={e=>upd("gender",e.target.value)}>
            <option value="">Select</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
          </select></div>
        <div className="fg"><label className="fl">Nationality</label>
          <select className="fi" value={info.nationality} onChange={e=>upd("nationality",e.target.value)}>
            <option>South African</option><option>Permanent Resident</option><option>International</option>
          </select></div>
      </div>
      <div className="g2">
        <div className="fg"><label className="fl">Race</label>
          <select className="fi" value={info.race} onChange={e=>upd("race",e.target.value)}>
            <option value="">Select</option><option>African</option><option>Coloured</option><option>Indian/Asian</option><option>White</option><option>Prefer not to say</option>
          </select></div>
        <div className="fg"><label className="fl">Disability</label>
          <select className="fi" value={info.disability} onChange={e=>upd("disability",e.target.value)}>
            <option>No</option><option>Yes – Physical</option><option>Yes – Visual</option><option>Yes – Hearing</option><option>Yes – Learning</option><option>Yes – Other</option>
          </select></div>
      </div>
      <div className="grp">Contact</div>
      <div className="fg"><label className="fl">Email *</label><input className="fi" type="email" inputMode="email" value={info.email} onChange={e=>upd("email",e.target.value)} placeholder="your@email.com"/></div>
      <div className="fg"><label className="fl">Phone *</label><input className="fi" type="tel" inputMode="tel" value={info.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+27 __ ___ ____"/></div>
      <div className="fg"><label className="fl">Home Address</label><input className="fi" value={info.address} onChange={e=>upd("address",e.target.value)} placeholder="Street, Suburb, City"/></div>
      <div className="g2">
        <div className="fg"><label className="fl">Postal Code</label><input className="fi" inputMode="numeric" value={info.postalCode} onChange={e=>upd("postalCode",e.target.value)} placeholder="e.g. 2001"/></div>
        <div className="fg"><label className="fl">Province</label>
          <select className="fi" value={info.province} onChange={e=>upd("province",e.target.value)}>
            <option value="">Select</option>{PROVINCES.map(p=><option key={p}>{p}</option>)}
          </select></div>
      </div>
      <div className="grp">School</div>
      <div className="fg"><label className="fl">School Name</label><input className="fi" value={info.school} onChange={e=>upd("school",e.target.value)} placeholder="e.g. Parktown High"/></div>
      <div className="g2">
        <div className="fg"><label className="fl">School Province</label>
          <select className="fi" value={info.schoolProvince} onChange={e=>upd("schoolProvince",e.target.value)}>
            <option value="">Select</option>{PROVINCES.map(p=><option key={p}>{p}</option>)}
          </select></div>
        <div className="fg"><label className="fl">School Type</label>
          <select className="fi" value={info.schoolType} onChange={e=>upd("schoolType",e.target.value)}>
            <option value="">Select</option><option>Public Q1–2</option><option>Public Q3</option><option>Public Q4–5</option><option>Private</option>
          </select></div>
      </div>
      {appType==="pre"
        ?<div className="g2">
            <div className="fg"><label className="fl">Current Grade</label>
              <select className="fi" value={info.grade} onChange={e=>upd("grade",e.target.value)}>
                <option value="">Select</option><option>Grade 10</option><option>Grade 11</option>
              </select></div>
            <div className="fg"><label className="fl">Expected Matric</label>
              <select className="fi" value={info.matricYear} onChange={e=>upd("matricYear",e.target.value)}>
                <option value="">Year</option><option>2026</option><option>2027</option><option>2028</option>
              </select></div>
          </div>
        :<div className="fg"><label className="fl">Matric Year</label>
            <select className="fi" value={info.matricYear} onChange={e=>upd("matricYear",e.target.value)}>
              <option value="">Select</option><option>2025</option><option>2024</option><option>2023</option><option>2022 or earlier</option>
            </select></div>
      }
      <div className="nav-act">
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" disabled={miss} onClick={next}>Next →</button>
      </div>
    </div>);
  }

  function SGuardian(){
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:4}}>Guardian Information</div>
      <div style={{color:"var(--dm)",fontSize:".77rem",marginBottom:14}}>Required for applications and NSFAS.</div>
      <div className="grp">Guardian 1 (Primary)</div>
      <div className="fg"><label className="fl">First Name</label><input className="fi" value={info.p1Name} onChange={e=>upd("p1Name",e.target.value)} placeholder="First name"/></div>
      <div className="fg"><label className="fl">Surname</label><input className="fi" value={info.p1Surname} onChange={e=>upd("p1Surname",e.target.value)} placeholder="Surname"/></div>
      <div className="g2">
        <div className="fg"><label className="fl">ID Number</label><input className="fi" inputMode="numeric" value={info.p1ID} onChange={e=>upd("p1ID",e.target.value)} placeholder="13-digit" maxLength={13}/></div>
        <div className="fg"><label className="fl">Relationship</label>
          <select className="fi" value={info.p1Rel} onChange={e=>upd("p1Rel",e.target.value)}>
            {RELATIONSHIPS.map(r=><option key={r}>{r}</option>)}
          </select></div>
      </div>
      <div className="g2">
        <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" value={info.p1Phone} onChange={e=>upd("p1Phone",e.target.value)} placeholder="+27..."/></div>
        <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={info.p1Email} onChange={e=>upd("p1Email",e.target.value)} placeholder="email"/></div>
      </div>
      <div className="fg"><label className="fl">Occupation</label><input className="fi" value={info.p1Job} onChange={e=>upd("p1Job",e.target.value)} placeholder="e.g. Teacher"/></div>
      <div className="fg"><label className="fl">Annual Household Income</label>
        <select className="fi" value={info.p1Income} onChange={e=>upd("p1Income",e.target.value)}>
          <option value="">Select</option>{INCOME_BRACKETS.map(i=><option key={i}>{i}</option>)}
        </select></div>
      <div className="grp">Guardian 2 (Optional)</div>
      <div className="fg"><label className="fl">First Name</label><input className="fi" value={info.p2Name} onChange={e=>upd("p2Name",e.target.value)} placeholder="Optional"/></div>
      <div className="fg"><label className="fl">Surname</label><input className="fi" value={info.p2Surname} onChange={e=>upd("p2Surname",e.target.value)} placeholder="Surname"/></div>
      <div className="g2">
        <div className="fg"><label className="fl">ID Number</label><input className="fi" inputMode="numeric" value={info.p2ID} onChange={e=>upd("p2ID",e.target.value)} placeholder="13-digit" maxLength={13}/></div>
        <div className="fg"><label className="fl">Relationship</label>
          <select className="fi" value={info.p2Rel} onChange={e=>upd("p2Rel",e.target.value)}>
            {RELATIONSHIPS.map(r=><option key={r}>{r}</option>)}
          </select></div>
      </div>
      <div className="g2">
        <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" value={info.p2Phone} onChange={e=>upd("p2Phone",e.target.value)} placeholder="+27..."/></div>
        <div className="fg"><label className="fl">Income</label>
          <select className="fi" value={info.p2Income} onChange={e=>upd("p2Income",e.target.value)}>
            <option value="">Select</option>{INCOME_BRACKETS.map(i=><option key={i}>{i}</option>)}
          </select></div>
      </div>
      <div className="grp">Emergency Contact</div>
      <div className="fg"><label className="fl">Full Name</label><input className="fi" value={info.emName} onChange={e=>upd("emName",e.target.value)} placeholder="Emergency contact name"/></div>
      <div className="g2">
        <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" value={info.emPhone} onChange={e=>upd("emPhone",e.target.value)} placeholder="+27..."/></div>
        <div className="fg"><label className="fl">Relationship</label><input className="fi" value={info.emRel} onChange={e=>upd("emRel",e.target.value)} placeholder="e.g. Aunt"/></div>
      </div>
      <div className="nav-act">
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" onClick={next}>Next →</button>
      </div>
    </div>);
  }

  function SResults(){
    function updRow(id,k,v){setRows(rs=>rs.map(r=>r.id===id?{...r,[k]:v}:r));}
    function addRow(){setRows(rs=>[...rs,{id:Date.now(),subject:"",level:""}]);}
    const pct=Math.min(100,(aps/42)*100);
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:4}}>{appType==="pre"?"Grade 11 Results":"Matric Results"}</div>
      <div style={{color:"var(--dm)",fontSize:".77rem",marginBottom:14}}>Top 6 subjects (excl. LO) are used for APS.</div>
      {rows.map(r=>(
        <div key={r.id} className="g2" style={{marginBottom:8}}>
          <select className="fi" value={r.subject} onChange={e=>updRow(r.id,"subject",e.target.value)} disabled={r.subject==="Life Orientation"}>
            <option value="">Subject</option>
            {SUBJECTS.filter(s=>s===r.subject||!rows.find(x=>x.id!==r.id&&x.subject===s)).map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="fi" value={r.level} onChange={e=>updRow(r.id,"level",Number(e.target.value))}>
            <option value="">Level</option>
            {GRADE_LEVELS.map(g=><option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
      ))}
      <button className="btn btn-o btn-sm" style={{marginBottom:16}} onClick={addRow}>+ Add Subject</button>
      <div className="div"/>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontSize:".67rem",color:"var(--dm)",textTransform:"uppercase",letterSpacing:".9px"}}>Your APS</div>
          <div className="grad-text" style={{fontFamily:"Syne",fontSize:"2rem",fontWeight:800,lineHeight:1}}>{aps}</div>
          <div className="aps-bar" style={{width:120}}><div className="aps-fill" style={{width:`${pct}%`}}/></div>
          <div style={{fontSize:".66rem",color:"var(--dm)",marginTop:3}}>{SA_UNIVERSITIES.filter(u=>aps>=u.minAPS).length} unis eligible</div>
        </div>
        {appType==="pre"&&<div className="banner bb" style={{flex:1,margin:0,fontSize:".72rem"}}>📋 Grade 11 results generate a <strong>conditional offer</strong>.</div>}
      </div>
      <div className="grp">Attach Results Document</div>
      <div className={`upload ${file?"done":""}`} onClick={()=>fileRef.current.click()}>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
          onChange={e=>{if(e.target.files[0]){setFile(e.target.files[0]);notify("📎 "+e.target.files[0].name);}}}/>
        {file
          ?<><div style={{fontSize:"1.7rem",marginBottom:5}}>✅</div>
             <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".84rem",color:"var(--ac)"}}>{file.name}</div>
             <div style={{fontSize:".68rem",color:"var(--dm)",marginTop:3}}>{(file.size/1024).toFixed(0)} KB · Tap to replace</div></>
          ?<><div style={{fontSize:"1.7rem",marginBottom:6}}>📎</div>
             <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".84rem",marginBottom:3}}>Tap to attach your report</div>
             <div style={{fontSize:".68rem",color:"var(--dm)"}}>PDF, JPG or PNG · Max 10MB</div></>
          :<><div style={{fontSize:"1.7rem",marginBottom:6}}>📎</div>
             <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".84rem",marginBottom:3}}>Tap to attach your report</div>
             <div style={{fontSize:".68rem",color:"var(--dm)"}}>PDF, JPG or PNG · Max 10MB</div></>
        }
      </div>
      {!file&&<div style={{fontSize:".69rem",color:"var(--wa)",marginTop:6}}>⚠️ Required before final submission.</div>}
      <div className="nav-act" style={{marginTop:16}}>
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" disabled={aps===0&&appType!=="pre"} onClick={next}>Next →</button>
      </div>
    </div>);
  }

  function SPrefs(){
    const fields=[...new Set(COURSES.map(c=>c.field))];
    const locs=["Cape Town","Johannesburg","Pretoria","Durban","Stellenbosch","Bloemfontein","Any"];
    const tog=(arr,val,key)=>setPrefs(p=>({...p,[key]:p[key].includes(val)?p[key].filter(x=>x!==val):[...p[key],val]}));
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:14}}>Your Preferences</div>
      <div className="fg"><label className="fl" style={{marginBottom:8}}>Fields of Study</label>
        <div>{fields.map(f=><span key={f} className={`tag ${prefs.fields.includes(f)?"a":""}`} onClick={()=>tog(prefs.fields,f,"fields")}>{f}</span>)}</div></div>
      <div className="fg" style={{marginTop:10}}><label className="fl" style={{marginBottom:8}}>Preferred Location</label>
        <div>{locs.map(l=><span key={l} className={`tag ${prefs.locs.includes(l)?"b":""}`} onClick={()=>tog(prefs.locs,l,"locs")}>{l}</span>)}</div></div>
      <div className="nav-act">
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" onClick={next}>Next →</button>
      </div>
    </div>);
  }

  function SCourse(){
    const filtered=COURSES.filter(c=>{
      const apsOk=appType==="pre"||aps>=c.minAPS;
      const fOk=prefs.fields.length===0||prefs.fields.includes(c.field);
      return apsOk&&fOk;
    });
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:4}}>Choose Your Course</div>
      <div style={{color:"var(--dm)",fontSize:".77rem",marginBottom:14}}>{filtered.length} course{filtered.length!==1?"s":""} match your profile.</div>
      <div className="scroll">
        {filtered.map(c=>(
          <div key={c.id} className={`ccard ${course===c.id?"sel":""}`} style={{marginBottom:9}} onClick={()=>setCourse(c.id)}>
            <div className="cf">{c.field}</div>
            <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".86rem"}}>{c.name}</div>
            <div style={{fontSize:".67rem",color:"var(--dm)",marginTop:3}}>Min APS {c.minAPS} · {c.subjects.join(", ")}</div>
          </div>
        ))}
        {filtered.length===0&&<div className="empty">No courses match. Adjust preferences.</div>}
      </div>
      <div className="nav-act" style={{marginTop:16}}>
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" disabled={!course} onClick={()=>{setUnis([]);next();}}>Next →</button>
      </div>
    </div>);
  }

  function SUnis(){
    const toggle=id=>setUnis(u=>u.includes(id)?u.filter(x=>x!==id):[...u,id]);
    const available=SA_UNIVERSITIES.filter(u=>{
      const hasCourse=(UNI_COURSES[u.id]||[]).includes(course);
      const apsOk=appType==="pre"||aps>=u.minAPS;
      const locOk=prefs.locs.length===0||prefs.locs.includes("Any")||prefs.locs.includes(u.location);
      return hasCourse&&apsOk&&locOk;
    });
    const locked=SA_UNIVERSITIES.filter(u=>{
      const hasCourse=(UNI_COURSES[u.id]||[]).includes(course);
      return hasCourse&&appType!=="pre"&&aps<u.minAPS;
    });
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:4}}>Select Universities</div>
      <div style={{color:"var(--dm)",fontSize:".77rem",marginBottom:14}}>Offering <strong style={{color:"var(--ac)"}}>{courseObj?.name}</strong></div>
      {available.length===0&&<div className="banner bw">⚠️ No matches. Try "Any" location in preferences.</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {available.map(u=>{
          const sel=unis.includes(u.id);
          return(<div key={u.id} className={`ucard ${sel?"sel":""}`} onClick={()=>toggle(u.id)}>
            {sel&&<div className="uchk">✓</div>}
            <div style={{fontSize:"1.7rem",marginBottom:5}}>{u.logo}</div>
            <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".82rem",marginBottom:2}}>{u.shortName}</div>
            <div style={{fontSize:".7rem",color:"var(--dm)"}}>📍 {u.location}</div>
            <div style={{fontSize:".65rem",color:"var(--ac)",marginTop:5}}>APS {u.minAPS} ✓</div>
            <div style={{fontSize:".62rem",color:"var(--dm)",marginTop:2}}>Fee: {u.fee}</div>
          </div>);
        })}
        {locked.map(u=>(<div key={u.id} className="ucard lk">
          <div style={{fontSize:"1.7rem",marginBottom:5}}>{u.logo}</div>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".82rem",marginBottom:2}}>{u.shortName}</div>
          <div style={{fontSize:".68rem",color:"var(--er)",marginTop:5}}>Needs APS {u.minAPS}</div>
        </div>))}
      </div>
      {unis.length>0&&<div className="card3" style={{marginBottom:14}}>
        <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".76rem",marginBottom:8}}>Selected ({unis.length})</div>
        {unis.map(id=>{const u=SA_UNIVERSITIES.find(x=>x.id===id);return(
          <div key={id} style={{display:"flex",justifyContent:"space-between",fontSize:".76rem",padding:"4px 0",borderBottom:"1px solid var(--bd)"}}>
            <span>{u?.logo} {u?.shortName}</span><span style={{color:"var(--dm)"}}>{u?.fee}</span>
          </div>);})}
      </div>}
      <div className="nav-act">
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" disabled={unis.length===0} onClick={next}>Next →</button>
      </div>
    </div>);
  }

  function SVerify(){
    const allOk=checks.p&&checks.a&&checks.g&&checks.acc;
    const tog=k=>setChecks(v=>({...v,[k]:!v[k]}));
    return(<div>
      <div className="banner bb">🔍 <span>Review everything carefully before submitting.</span></div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".9rem"}}>👤 Personal</div>
          <button className="btn btn-o btn-sm" onClick={()=>setStep(1)}>Edit</button>
        </div>
        {[["Name",`${info.firstName} ${info.lastName}`||"—"],["ID",info.idNumber||"—"],["Email",info.email||"—"],["Phone",info.phone||"—"],["Type",appType==="pre"?"Pre-Matriculant":"Matriculant"]].map(([k,v])=>(
          <div className="irow" key={k}><span className="ik">{k}</span><span className="iv">{v}</span></div>))}
      </div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".9rem"}}>👨‍👩‍👧 Guardian</div>
          <button className="btn btn-o btn-sm" onClick={()=>setStep(2)}>Edit</button>
        </div>
        {[["Guardian 1",`${info.p1Name} ${info.p1Surname}`||"—"],["G1 ID",info.p1ID||"—"],["G1 Income",info.p1Income||"—"]].map(([k,v])=>(
          <div className="irow" key={k}><span className="ik">{k}</span><span className="iv">{v}</span></div>))}
      </div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".9rem"}}>📊 Results</div>
          <button className="btn btn-o btn-sm" onClick={()=>setStep(3)}>Edit</button>
        </div>
        <div style={{marginBottom:8}}><span className="grad-text" style={{fontFamily:"Syne",fontSize:"1.5rem",fontWeight:800}}>{aps}</span><span style={{color:"var(--dm)",fontSize:".74rem",marginLeft:6}}>APS</span></div>
        <div className="irow"><span className="ik">Document</span><span className="iv" style={{color:file?"var(--ac)":"var(--wa)"}}>{file?`✅ ${file.name}`:"⚠️ Not attached"}</span></div>
      </div>
      <div className="card">
        <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".9rem",marginBottom:10}}>🎯 Application Plan</div>
        <div className="irow"><span className="ik">Course</span><span className="iv">{courseObj?.name||"—"}</span></div>
        <div className="irow"><span className="ik">Universities</span><span className="iv">{unis.map(id=>SA_UNIVERSITIES.find(u=>u.id===id)?.shortName).join(", ")||"—"}</span></div>
      </div>
      <div style={{fontFamily:"Syne",fontWeight:700,marginBottom:10}}>✅ Confirm</div>
      {[
        {k:"p",label:"My personal information is correct."},
        {k:"a",label:"My academic results match my official report."},
        {k:"g",label:"My guardian information is correct."},
        {k:"acc",label:"All information is truthful. False info may lead to disqualification."},
      ].map(({k,label})=>(
        <div key={k} className={`vck ${checks[k]?"on":""}`} onClick={()=>tog(k)}>
          <div className={`vbox ${checks[k]?"on":""}`}>{checks[k]&&"✓"}</div>
          <span style={{fontSize:".8rem"}}>{label}</span>
        </div>
      ))}
      <div className="nav-act" style={{marginTop:18}}>
        <button className="btn btn-o" onClick={back}>← Back</button>
        <button className="btn btn-p" disabled={!allOk} onClick={submitApps}>🚀 Submit {unis.length} App{unis.length!==1?"s":""}</button>
      </div>
    </div>);
  }

  function SDone(){
    return(<div className="card" style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:"3.5rem",marginBottom:14}}>🎉</div>
      <div style={{fontFamily:"Syne",fontSize:"1.3rem",fontWeight:800,marginBottom:8}}>Submitted!</div>
      <div style={{color:"var(--dm)",fontSize:".85rem",marginBottom:10}}>{unis.length} application{unis.length>1?"s":""} for <strong>{courseObj?.name}</strong></div>
      {appType==="pre"&&<div className="banner bw" style={{textAlign:"left",marginBottom:16}}>📋 Offers are conditional on your final NSC results.</div>}
      <div style={{color:"var(--dm)",fontSize:".78rem",marginBottom:20}}>Check Tracking for status updates.</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn btn-o" onClick={()=>setStep(6)}>Apply More</button>
        <button className="btn btn-p" onClick={()=>setPage("tracking")}>View Tracker →</button>
      </div>
    </div>);
  }

  function Dashboard(){
    return(<div>
      <div className="banner bw" style={{fontSize:".72rem"}}>⚠️ <strong>Beta v0.2:</strong> Application submission is simulated. Real university APIs needed for production.</div>
      <div className="g2" style={{marginBottom:14}}>
        <div className="scard"><div className="snum">{aps||"—"}</div><div className="slabel">APS Score</div></div>
        <div className="scard"><div className="snum">{apps.length}</div><div className="slabel">Applications</div></div>
      </div>
      {info.firstName
        ?<div className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".95rem"}}>👤 {info.firstName} {info.lastName}</div>
              <div style={{color:"var(--dm)",fontSize:".75rem",marginTop:2}}>{appType==="pre"?"Pre-Matriculant":"Matriculant"}</div>
            </div>
            <button className="btn btn-p btn-sm" onClick={()=>setPage("apply")}>Continue →</button>
          </div>
        :<div className="card" style={{textAlign:"center",padding:"30px 18px"}}>
            <div style={{fontSize:"2.5rem",marginBottom:10}}>🎓</div>
            <div style={{fontFamily:"Syne",fontSize:"1.1rem",fontWeight:700,marginBottom:8}}>UniApply SA</div>
            <div style={{color:"var(--dm)",fontSize:".82rem",marginBottom:16}}>Apply to SA universities in one place.</div>
            <button className="btn btn-p btn-full" onClick={()=>setPage("apply")}>Get Started →</button>
          </div>
      }
      {apps.length>0&&<div className="card">
        <div style={{fontFamily:"Syne",fontWeight:700,marginBottom:12}}>📋 Applications</div>
        {apps.slice(-3).map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9,paddingBottom:9,borderBottom:"1px solid var(--bd)"}}>
            <div style={{fontSize:"1.5rem"}}>{a.logo}</div>
            <div style={{flex:1}}><div style={{fontFamily:"Syne",fontWeight:700,fontSize:".88rem"}}>{a.shortName}</div><div style={{fontSize:".72rem",color:"var(--dm)"}}>{a.course}</div></div>
            <span className={`sp s-${a.status.replace(" ","-")}`}>{a.status}</span>
          </div>
        ))}
      </div>}
    </div>);
  }

  function Tracking(){
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:4}}>Application Tracker</div>
      <div style={{color:"var(--dm)",fontSize:".77rem",marginBottom:14}}>Live status updates</div>
      {apps.length===0
        ?<div className="empty"><div style={{fontSize:"2.5rem",marginBottom:10}}>📭</div><div>No applications yet.</div>
            <button className="btn btn-p" style={{marginTop:14}} onClick={()=>setPage("apply")}>Start Applying →</button></div>
        :apps.map(a=>(
          <div key={a.id} className="arow">
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <div style={{fontSize:"1.6rem"}}>{a.logo}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Syne",fontWeight:700,fontSize:".9rem"}}>{a.university}</div>
                <div style={{fontSize:".74rem",color:"var(--dm)",marginTop:1}}>{a.course}</div>
                <div style={{fontSize:".66rem",color:"var(--dm)",marginTop:1}}>{a.date}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <span className={`sp s-${a.status.replace(" ","-")}`}>{a.status}</span>
                {a.cond&&<span style={{fontSize:".6rem",background:"rgba(245,158,11,.12)",color:"var(--wa)",padding:"2px 8px",borderRadius:12,fontWeight:700}}>CONDITIONAL</span>}
              </div>
            </div>
            <div className="tl">{a.updates.map((u,i)=><div key={i} className="ti"><strong>{u.date}</strong> — {u.msg}</div>)}</div>
          </div>
        ))
      }
    </div>);
  }

  function ProfilePage(){
    return(<div>
      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:"1rem",marginBottom:14}}>My Profile</div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"Syne",fontWeight:700}}>Personal & Academic</div>
          <button className="btn btn-o btn-sm" onClick={()=>{setPage("apply");setStep(1);}}>Edit</button>
        </div>
        {[["Name",`${info.firstName} ${info.lastName}`||"—"],["Email",info.email||"—"],["Phone",info.phone||"—"],["Province",info.province||"—"],["School",info.school||"—"],["Type",appType==="pre"?"Pre-Matriculant":"Matriculant"],["APS",aps||"—"],["Results",file?.name||"Not uploaded"]].map(([k,v])=>(
          <div className="irow" key={k}><span className="ik">{k}</span><span className="iv">{v}</span></div>))}
      </div>
      <div className="card">
        <div style={{fontFamily:"Syne",fontWeight:700,marginBottom:10}}>🔒 Security</div>
        {[["Encryption","AES-256 (prod)"],["Storage","In-memory (beta)"],["Transmission","HTTPS-only (prod)"],["ID Verify","Home Affairs API (prod)"]].map(([k,v])=>(
          <div className="irow" key={k}><span className="ik">{k}</span><span className="iv" style={{color:"var(--ac)",fontSize:".76rem"}}>{v}</span></div>))}
      </div>
    </div>);
  }

  const NAV=[{id:"dashboard",icon:"🏠",label:"Home"},{id:"apply",icon:"📝",label:"Apply"},{id:"tracking",icon:"📡",label:"Track"},{id:"profile",icon:"👤",label:"Profile"}];
  const TITLES={dashboard:"UniApply SA",apply:"Apply",tracking:"Tracker",profile:"Profile"};

  return(<>
    <style>{CSS}</style>
    {notif&&<div className="notif">{notif}</div>}
    <div className="shell">
      <div className="topbar">
        <div style={{fontFamily:"Syne",fontWeight:800,fontSize:".98rem",background:"var(--gd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{TITLES[page]}</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {aps>0&&<span style={{background:"var(--gd)",color:"#000",padding:"3px 11px",borderRadius:20,fontWeight:700,fontSize:".75rem"}}>APS {aps}</span>}
          {appType&&<span style={{fontSize:".7rem",color:"var(--dm)",background:"var(--s2)",padding:"3px 10px",borderRadius:20}}>{appType==="pre"?"Pre-Matric":"Matric"}</span>}
        </div>
      </div>

      <div className="content">
        {page==="dashboard"&&<Dashboard/>}
        {page==="tracking"&&<Tracking/>}
        {page==="profile"&&<ProfilePage/>}
        {page==="apply"&&(<>
          <div className="stepper">
            {STEPS.map((s,i)=>(
              <button key={i} className={`sb ${step===i?"on":step>i?"done":""}`} onClick={()=>step>i&&setStep(i)}>
                {step>i?"✓ ":""}{s}
              </button>
            ))}
          </div>
          {step===0&&<SType/>}{step===1&&<SPersonal/>}{step===2&&<SGuardian/>}
          {step===3&&<SResults/>}{step===4&&<SPrefs/>}{step===5&&<SCourse/>}
          {step===6&&<SUnis/>}{step===7&&<SVerify/>}{step===8&&<SDone/>}
        </>)}
      </div>

      <nav className="bottomnav">
        {NAV.map(n=>(
          <button key={n.id} className={`bni ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
            <span className="bni-icon">{n.icon}</span>
            <span className="bni-label">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  </>);
}
