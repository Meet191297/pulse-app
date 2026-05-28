import { useState, useRef, useEffect } from "react";
import {
  Activity, Home, Utensils, TrendingUp, Brain, User, Bell, Sparkles,
  Camera, Search, Send, Plus, ChevronRight, FileText, BarChart2, Scale,
  Pill, Heart, Target, Ruler, Calendar, Flame, Droplet, AlertCircle,
  Check, LineChart, X
} from "lucide-react";

/* ── ICON MAP ── */
const IM = {
  activity:Activity, home:Home, apple:Utensils, 'chart-line':LineChart,
  brain:Brain, user:User, 'trending-up':TrendingUp, bell:Bell,
  sparkles:Sparkles, camera:Camera, search:Search, send:Send, plus:Plus,
  'chevron-right':ChevronRight, 'file-text':FileText, 'chart-bar':BarChart2,
  scale:Scale, pill:Pill, heart:Heart, target:Target, ruler:Ruler,
  calendar:Calendar, flame:Flame, droplet:Droplet, 'alert-circle':AlertCircle,
  check:Check, x:X
};
const Ti = ({n,s=18,c='currentColor',style={}}) => {
  const Ic = IM[n]; return Ic ? <Ic size={s} color={c} style={{flexShrink:0,...style}}/> : null;
};

/* ── TOKENS ── */
const V = {
  sage:'#4a7c6f', sL:'#6fa89a', sP:'#e8f3f0', sD:'#2d4f47',
  cream:'#faf8f4', warm:'#f5f0e8',
  coral:'#e8765a', cP:'#fdeee9',
  gold:'#c4923a', gL:'#e8b86d', gP:'#fdf4e3',
  navy:'#1a2744', n2:'#243560', nM:'#3a4f7a',
  tD:'#1c2526', tM:'#4a5568', tS:'#7a8a9a', tH:'#aab5c0',
  sf:'#ffffff', sf2:'#f8f9fb', sf3:'#f0f2f5',
  bd:'#e8ebef', bd2:'#d4d9e0',
  sh:'0 2px 12px rgba(26,39,68,0.08)',
  shM:'0 4px 20px rgba(26,39,68,0.12)'
};
const ff = "'DM Sans',system-ui,sans-serif";

/* ── RING ── */
const Ring = ({pct,size=64,stroke=6,color,value,sub,bg='rgba(255,255,255,0.2)',textColor='#fff'}) => {
  const r=(size-stroke*2)/2, cir=2*Math.PI*r;
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={cir} strokeDashoffset={cir*(1-Math.min(1,pct/100))} strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
        <span style={{fontSize:size>70?20:14,fontWeight:700,color:textColor,lineHeight:1}}>{value}</span>
        {sub&&<span style={{fontSize:7.5,color:`${textColor}99`,marginTop:1,textTransform:'uppercase',letterSpacing:0.4}}>{sub}</span>}
      </div>
    </div>
  );
};

/* ── SCORE CARD ── */
const ScoreCard = ({icon,label,value,sub,pct,color}) => (
  <div style={{background:V.sf,borderRadius:16,padding:14,border:`1px solid ${V.bd}`,boxShadow:V.sh}}>
    <div style={{fontSize:11,color:V.tS,marginBottom:6,fontWeight:500,display:'flex',alignItems:'center',gap:5}}>
      <span>{icon}</span> {label}
    </div>
    <div style={{fontSize:22,fontWeight:700,color,lineHeight:1}}>{value}</div>
    <div style={{fontSize:11,color:V.tH,marginTop:3}}>{sub}</div>
    <div style={{height:4,background:V.sf3,borderRadius:2,marginTop:8,overflow:'hidden'}}>
      <div style={{height:'100%',width:`${Math.min(100,Math.max(0,pct))}%`,background:color,borderRadius:2,transition:'width 0.6s ease'}}/>
    </div>
  </div>
);

/* ── MEAL CARD ── */
const MealCard = ({icon,title,time,macros,tip,onRemove}) => (
  <div style={{background:V.sf,borderRadius:16,margin:'0 16px 10px',border:`1px solid ${V.bd}`,boxShadow:V.sh,overflow:'hidden'}}>
    <div style={{padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:`1px solid ${V.bd}`}}>
      <div style={{fontSize:13,fontWeight:600,color:V.tD}}>{icon} {title}</div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <span style={{fontSize:11,color:V.tH}}>{time}</span>
        {onRemove&&<button onClick={onRemove} style={{background:'none',border:'none',color:V.tH,cursor:'pointer',fontSize:18,padding:0,lineHeight:1}}>×</button>}
      </div>
    </div>
    <div style={{padding:'12px 14px'}}>
      {macros&&(
        <div style={{display:'flex',gap:8,marginBottom:tip?10:0}}>
          {macros.map((m,i)=>(
            <div key={i} style={{flex:1,background:V.sf2,borderRadius:8,padding:8,textAlign:'center'}}>
              <div style={{fontSize:14,fontWeight:700,color:V.tD}}>{m.v}</div>
              <div style={{fontSize:10,color:V.tS}}>{m.l}</div>
            </div>
          ))}
        </div>
      )}
      {tip&&(
        <div style={{display:'flex',alignItems:'flex-start',gap:8,background:V.sP,borderRadius:10,padding:'10px 12px'}}>
          <Sparkles size={14} color={V.sage} style={{marginTop:1,flexShrink:0}}/>
          <div style={{fontSize:11,color:V.sD,lineHeight:1.5}}><strong>AI says:</strong> {tip}</div>
        </div>
      )}
    </div>
  </div>
);

/* ── BIO CARD ── */
const BioCard = ({Icon,iconBg,iconColor,name,value,unit,tag,tagType}) => {
  const tc=tagType==='warn'?{bg:V.gP,c:'#7a4e0e'}:tagType==='danger'?{bg:V.cP,c:'#8b3a22'}:{bg:V.sP,c:V.sD};
  return (
    <div style={{background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,padding:14}}>
      <div style={{width:32,height:32,borderRadius:8,background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>
        {Icon&&<Icon size={16} color={iconColor}/>}
      </div>
      <div style={{fontSize:11,color:V.tS,fontWeight:500,marginBottom:4}}>{name}</div>
      <div style={{fontSize:18,fontWeight:700,color:V.tD}}>{value} <span style={{fontSize:10,color:V.tH,fontWeight:400}}>{unit}</span></div>
      {tag&&<span style={{display:'inline-block',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:500,marginTop:6,background:tc.bg,color:tc.c}}>{tag}</span>}
    </div>
  );
};

/* ── SETTINGS ROW ── */
const SRow = ({Icon,iconBg,iconColor,label,right,last,onClick}) => (
  <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderBottom:last?'none':`1px solid ${V.bd}`,cursor:'pointer'}}>
    <div style={{width:34,height:34,borderRadius:9,background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      {Icon&&<Icon size={17} color={iconColor}/>}
    </div>
    <div style={{flex:1,fontSize:14,color:V.tD,fontWeight:500}}>{label}</div>
    {right||<ChevronRight size={14} color={V.tH}/>}
  </div>
);

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function Pulse() {
  const [apiKey,setApiKey]   = useState('');
  const [ready,setReady]     = useState(false);
  const [tab,setTab]         = useState('home');
  const [loading,setLoading] = useState(false);
  const [profile,setProfile] = useState({name:'',age:'',weight:'',height:'',targetWeight:''});
  const [conditions,setConditions] = useState([]);
  const [condInput,setCondInput]   = useState('');
  const [reportAnalysis,setReportAnalysis] = useState('');
  const [aiHealth,setAiHealth]     = useState('');
  const [hlAnalyzing,setHlAnalyzing] = useState(false);
  const [foodLog,setFoodLog] = useState([]);
  const [scanResult,setScanResult] = useState(null);
  const [barcodeText,setBarcodeText] = useState('');
  const [scanMode,setScanMode] = useState('camera');
  const [scanOpen,setScanOpen] = useState(false);
  const [cameraOn,setCameraOn] = useState(false);
  const [medicines,setMedicines] = useState([]);
  const [medForm,setMedForm]   = useState({name:'',dose:'',time:'08:00',frequency:'Daily'});
  const [showMedForm,setShowMedForm] = useState(false);
  const [chatInput,setChatInput] = useState('');
  const [chatMsgs,setChatMsgs]   = useState([{role:'assistant',content:"Good morning! I'm Pulse AI 🌿\n\nI'm here to help with your health, nutrition, and medicines. What would you like to know today?"}]);

  const videoRef=useRef(), canvasRef=useRef(), streamRef=useRef();
  const reportRef=useRef(), chatEndRef=useRef(), scrollRef=useRef();

  const today      = new Date().toLocaleDateString('en-GB');
  const todayFoods = foodLog.filter(f=>f.date===today);
  const totalCals  = todayFoods.reduce((s,f)=>s+(f.calories||0),0);
  const totalProt  = todayFoods.reduce((s,f)=>s+(parseFloat(f.protein)||0),0);
  const totalCarbs = todayFoods.reduce((s,f)=>s+(parseFloat(f.carbs)||0),0);
  const totalFat   = todayFoods.reduce((s,f)=>s+(parseFloat(f.fat)||0),0);
  const bmi        = profile.weight&&profile.height?(parseFloat(profile.weight)/Math.pow(parseFloat(profile.height)/100,2)).toFixed(1):null;
  const bmiLabel   = bmi?(bmi<18.5?'Underweight':bmi<25?'Healthy':bmi<30?'Overweight':'Obese'):null;
  const score      = Math.min(98,Math.max(40,65+(todayFoods.length>0?15:0)+(medicines.length>0?8:0)-(conditions.length*4)+(bmi&&bmi>=18.5&&bmi<25?10:0)));
  const goalCals   = 2000;
  const goalProt   = Math.round((parseFloat(profile.weight)||70)*1.6);
  const hr         = new Date().getHours();
  const greet      = hr<12?'Good morning ☀️':hr<17?'Good afternoon':'Good evening 🌙';

  useEffect(()=>{
    const l=document.createElement('link');l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap';
    document.head.appendChild(l);
  },[]);
  useEffect(()=>{if(tab==='ai'&&scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[chatMsgs,tab]);
  useEffect(()=>{if(tab!=='nutrition')stopCamera();},[tab]);

  /* ── API ── */
  const ai = async(messages,sys='')=>{
    const h={'Content-Type':'application/json'};
    if(apiKey){h['x-api-key']=apiKey;h['anthropic-version']='2023-06-01';h['anthropic-dangerous-direct-browser-access']='true';}
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:h,
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,
        system:sys||`You are Pulse AI, a personal health companion for ${profile.name||'the user'}, ${profile.age||'?'}yo, ${profile.weight||'?'}kg, ${profile.height||'?'}cm. Conditions: ${conditions.join(',')||'none'}. Medicines: ${medicines.map(m=>m.name).join(',')||'none'}. Be warm, concise, medically thoughtful.`,
        messages})});
    const d=await r.json();
    if(d.error)throw new Error(d.error.message);
    return d.content[0].text;
  };

  const startCamera = async()=>{
    try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
      streamRef.current=s;setCameraOn(true);
      requestAnimationFrame(()=>{if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play();}});
    }catch{alert('Please allow camera access.');}
  };
  const stopCamera=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;setCameraOn(false);};

  const parse=text=>{
    const get=k=>{const m=text.match(new RegExp(`${k}[:\\s]+(.+)`,'i'));return m?.[1]?.trim()||'';};
    return{name:get('NAME'),brand:get('BRAND'),calories:parseInt(get('CALORIES'))||0,
      protein:parseFloat(get('PROTEIN'))||0,carbs:parseFloat(get('CARBS'))||0,fat:parseFloat(get('FAT'))||0,
      rating:parseInt(get('RATING'))||5,tip:get('TIP'),notes:get('NOTES')};
  };

  const capturePhoto=async()=>{
    const c=canvasRef.current,v=videoRef.current;if(!c||!v)return;
    c.width=v.videoWidth||640;c.height=v.videoHeight||480;
    c.getContext('2d').drawImage(v,0,0);
    const b64=c.toDataURL('image/jpeg',0.8).split(',')[1];
    stopCamera();setLoading(true);setScanOpen(false);
    try{const r=await ai([{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:'Identify this food. Respond exactly:\nNAME: ...\nCALORIES: ...\nPROTEIN: ...g\nCARBS: ...g\nFAT: ...g\nRATING: .../10\nTIP: ...\nNOTES: ...'}]}]);
      setScanResult(parse(r));
    }catch(e){setScanResult({error:e.message});}
    setLoading(false);
  };

  const lookupBarcode=async()=>{
    if(!barcodeText.trim())return;setLoading(true);setScanOpen(false);
    try{const r=await ai([{role:'user',content:`Find UK product: "${barcodeText}" (Tesco, Lidl, Sainsbury's, Nescafé, Asda etc.)\nRespond exactly:\nNAME: ...\nBRAND: ...\nCALORIES: ...\nPROTEIN: ...g\nCARBS: ...g\nFAT: ...g\nRATING: .../10\nTIP: ...\nNOTES: ...`}]);
      setScanResult(parse(r));
    }catch(e){setScanResult({error:e.message});}
    setLoading(false);
  };

  const addToLog=()=>{
    if(!scanResult||scanResult.error)return;
    setFoodLog(p=>[...p,{...scanResult,id:Date.now(),date:today,time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}]);
    setScanResult(null);setBarcodeText('');
  };

  const uploadReport=file=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=async e=>{
      const b64=e.target.result.split(',')[1],mt=file.type;
      setLoading(true);
      try{
        const content=mt.includes('pdf')
          ?[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b64}},{type:'text',text:'Analyse this health report. Extract: CONDITIONS DETECTED, ABNORMAL VALUES ⚠️, KEY FINDINGS, RECOMMENDATIONS, MEDICATIONS. Use clear sections.'}]
          :[{type:'image',source:{type:'base64',media_type:mt,data:b64}},{type:'text',text:'Analyse this health document. Extract: CONDITIONS DETECTED, ABNORMAL VALUES ⚠️, KEY FINDINGS, RECOMMENDATIONS, MEDICATIONS. Use clear sections.'}];
        const result=await ai([{role:'user',content}],'You are a medical AI. Analyse health reports carefully. Always advise consulting a qualified doctor.');
        setReportAnalysis(result);
        const cm={diabetes:'Diabetes',hypertension:'Hypertension',kidney:'CKD',cholesterol:'High Cholesterol',thyroid:'Thyroid',anaemia:'Anaemia',cardiac:'Heart Disease'};
        Object.entries(cm).forEach(([k,v])=>{if(result.toLowerCase().includes(k))setConditions(p=>[...new Set([...p,v])]);});
      }catch(e){setReportAnalysis('Error: '+e.message);}
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const addMed=async()=>{
    if(!medForm.name)return;setLoading(true);
    let aiInfo='';
    try{aiInfo=await ai([{role:'user',content:`Medicine: ${medForm.name} ${medForm.dose}. Patient: ${conditions.join(',')||'healthy'}.\n1. PURPOSE\n2. SIDE EFFECTS (top 3)\n3. FOOD INTERACTIONS\n4. BEST TIMING\nBe brief.`}]);}catch{}
    setMedicines(p=>[...p,{...medForm,id:Date.now(),aiInfo}]);
    setMedForm({name:'',dose:'',time:'08:00',frequency:'Daily'});
    setShowMedForm(false);setLoading(false);
  };

  const sendChat=async(msg)=>{
    const m=(msg||chatInput).trim();if(!m)return;
    setChatInput('');
    const msgs=[...chatMsgs,{role:'user',content:m}];
    setChatMsgs(msgs);setLoading(true);
    try{const r=await ai(msgs.slice(-10));setChatMsgs(p=>[...p,{role:'assistant',content:r}]);}
    catch(e){setChatMsgs(p=>[...p,{role:'assistant',content:'⚠️ '+e.message}]);}
    setLoading(false);
  };

  const inp={width:'100%',padding:'11px 16px',background:V.sf2,border:`1px solid ${V.bd}`,borderRadius:22,color:V.tD,fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:ff};
  const inp2={...inp,borderRadius:12,padding:'13px 16px',background:V.sf,border:`1.5px solid ${V.bd}`};

  /* ── SETUP ── */
  if(!ready) return (
    <div style={{background:V.sf3,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,fontFamily:ff,color:V.tD}}>
      <div style={{width:68,height:68,borderRadius:20,background:`linear-gradient(135deg,${V.navy},${V.sD})`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,boxShadow:V.shM}}>
        <Activity size={30} color="#fff"/>
      </div>
      <h1 style={{fontSize:26,fontWeight:600,margin:'0 0 4px',color:V.tD}}>Pulse</h1>
      <p style={{color:V.tS,margin:'0 0 28px',fontSize:14}}>Your AI Health Companion</p>
      <div style={{width:'100%',maxWidth:360,background:V.sf,borderRadius:20,padding:'24px 20px',boxShadow:V.shM}}>
        <p style={{margin:'0 0 18px',fontWeight:600,fontSize:15,color:V.tD}}>Set up your profile</p>
        {[{k:'name',l:'Your Name',p:'e.g. Meet',t:'text'},{k:'age',l:'Age',p:'25',t:'number'},{k:'weight',l:'Weight (kg)',p:'70',t:'number'},{k:'height',l:'Height (cm)',p:'175',t:'number'},{k:'targetWeight',l:'Target Weight (kg)',p:'65',t:'number'}].map(f=>(
          <div key={f.k} style={{marginBottom:14}}>
            <label style={{fontSize:11,color:V.tS,letterSpacing:0.5,textTransform:'uppercase',display:'block',marginBottom:6,fontWeight:600}}>{f.l}</label>
            <input type={f.t} value={profile[f.k]} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={inp2}/>
          </div>
        ))}
        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,color:V.tS,letterSpacing:0.5,textTransform:'uppercase',display:'block',marginBottom:6,fontWeight:600}}>Claude API Key <span style={{textTransform:'none',fontWeight:400,color:V.tH}}>(optional)</span></label>
          <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-... or leave blank" style={{...inp2,border:`1.5px solid ${V.sage}55`}}/>
          <p style={{fontSize:11,color:V.tH,margin:'5px 0 0'}}>Get yours free at console.anthropic.com</p>
        </div>
        <button onClick={()=>setReady(true)} style={{width:'100%',padding:14,background:`linear-gradient(135deg,${V.navy},${V.sD})`,border:'none',borderRadius:14,color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:ff}}>
          Start My Health Journey →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{background:V.cream,minHeight:'100vh',color:V.tD,fontFamily:ff,maxWidth:430,margin:'0 auto',position:'relative'}}>

      {/* ── SCAN OVERLAY ── */}
      {scanOpen&&(
        <div style={{position:'fixed',inset:0,background:'rgba(10,18,36,0.92)',zIndex:300,display:'flex',flexDirection:'column',maxWidth:430,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'52px 20px 14px'}}>
            <h3 style={{margin:0,color:'#fff',fontSize:17,fontWeight:600}}>Scan Food</h3>
            <button onClick={()=>{stopCamera();setScanOpen(false);setScanResult(null);}} style={{background:'rgba(255,255,255,0.12)',border:'none',borderRadius:20,padding:'7px 16px',color:'#fff',cursor:'pointer',fontSize:13,fontFamily:ff}}>✕ Close</button>
          </div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.08)',margin:'0 20px 16px',borderRadius:12,padding:3}}>
            {[{id:'camera',l:'📷 Camera'},{id:'search',l:'🔍 Search / Barcode'}].map(m=>(
              <button key={m.id} onClick={()=>{setScanMode(m.id);if(m.id==='camera')startCamera();else stopCamera();}} style={{flex:1,padding:'9px',borderRadius:10,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:scanMode===m.id?V.sf:'transparent',color:scanMode===m.id?V.tD:'rgba(255,255,255,0.65)',fontFamily:ff}}>
                {m.l}
              </button>
            ))}
          </div>
          <div style={{flex:1,padding:'0 20px 24px',display:'flex',flexDirection:'column',gap:12}}>
            {scanMode==='camera'?(
              <div style={{flex:1,background:'rgba(255,255,255,0.04)',borderRadius:20,overflow:'hidden',position:'relative',minHeight:280,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {cameraOn?(
                  <>
                    <video ref={videoRef} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} playsInline muted/>
                    <button onClick={capturePhoto} style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',width:68,height:68,borderRadius:'50%',background:'#fff',border:'none',cursor:'pointer',fontSize:26,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.4)'}}>📸</button>
                  </>
                ):(
                  <div style={{textAlign:'center',padding:32}}>
                    <Camera size={48} color="rgba(255,255,255,0.3)" style={{margin:'0 auto 14px'}}/>
                    <p style={{color:'rgba(255,255,255,0.6)',fontSize:15,fontWeight:500,margin:'0 0 20px'}}>Point at any food item</p>
                    <button onClick={startCamera} style={{padding:'12px 28px',background:V.sage,border:'none',borderRadius:24,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:ff}}>Open Camera</button>
                  </div>
                )}
              </div>
            ):(
              <div>
                <div style={{display:'flex',gap:8,marginBottom:14}}>
                  <input value={barcodeText} onChange={e=>setBarcodeText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&lookupBarcode()} placeholder="Product name or barcode number..." style={{...inp,flex:1,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff'}}/>
                  <button onClick={lookupBarcode} style={{width:44,height:44,borderRadius:'50%',background:V.sage,border:'none',cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Search size={18} color="#fff"/>
                  </button>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:10,fontWeight:500}}>Quick search:</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {['Tesco Whole Milk','Nescafé Gold','Lidl Greek Yogurt','Hovis Wholemeal','Oat Milk','Heinz Baked Beans','Walkers Crisps','Activia Yogurt'].map(s=>(
                    <button key={s} onClick={()=>setBarcodeText(s)} style={{padding:'6px 12px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:20,color:'rgba(255,255,255,0.75)',fontSize:12,cursor:'pointer',fontFamily:ff}}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {loading&&<div style={{textAlign:'center',color:'rgba(255,255,255,0.65)',padding:16,fontWeight:500}}>🔬 AI Analysing...</div>}
          </div>
          <canvas ref={canvasRef} style={{display:'none'}}/>
        </div>
      )}

      {/* ── SCAN RESULT ── */}
      {scanResult&&!scanOpen&&(
        <div style={{position:'fixed',bottom:82,left:'50%',transform:'translateX(-50%)',width:'calc(100% - 24px)',maxWidth:406,background:V.sf,borderRadius:20,padding:18,boxShadow:'0 8px 40px rgba(26,39,68,0.25)',zIndex:200,border:`1px solid ${V.bd}`}}>
          {scanResult.error?<p style={{color:V.coral,margin:0,fontWeight:500,fontSize:13}}>❌ {scanResult.error}</p>:(
            <>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div><h3 style={{margin:'0 0 2px',fontSize:17,fontWeight:700,color:V.tD}}>{scanResult.name}</h3>{scanResult.brand&&<p style={{margin:0,fontSize:12,color:V.tS}}>{scanResult.brand}</p>}</div>
                <div style={{textAlign:'right'}}><span style={{fontSize:28,fontWeight:700,color:V.gold,lineHeight:1}}>{scanResult.calories}</span><span style={{fontSize:11,color:V.tS,display:'block'}}>kcal</span></div>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:scanResult.tip?12:14}}>
                {[{v:`${Math.round(scanResult.protein)}g`,l:'Protein'},{v:`${Math.round(scanResult.carbs)}g`,l:'Carbs'},{v:`${Math.round(scanResult.fat)}g`,l:'Fat'}].map((m,i)=>(
                  <div key={i} style={{flex:1,background:V.sf2,borderRadius:8,padding:8,textAlign:'center'}}>
                    <div style={{fontSize:14,fontWeight:700,color:V.tD}}>{m.v}</div>
                    <div style={{fontSize:10,color:V.tS}}>{m.l}</div>
                  </div>
                ))}
              </div>
              {scanResult.tip&&<div style={{display:'flex',gap:8,background:V.sP,borderRadius:10,padding:'10px 12px',marginBottom:14,alignItems:'flex-start'}}>
                <Sparkles size={14} color={V.sage} style={{marginTop:1,flexShrink:0}}/><div style={{fontSize:11,color:V.sD,lineHeight:1.5}}>{scanResult.tip}</div>
              </div>}
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setScanResult(null)} style={{flex:1,padding:11,background:V.sf2,border:`1px solid ${V.bd}`,borderRadius:12,color:V.tS,cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:ff}}>Dismiss</button>
                <button onClick={addToLog} style={{flex:2,padding:11,background:V.sage,border:'none',borderRadius:12,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:ff}}>+ Add to Log</button>
              </div>
            </>
          )}
        </div>
      )}

      <div ref={scrollRef} style={{overflowY:'auto',height:'100vh',paddingBottom:80}}>

        {/* ════ HOME ════ */}
        {tab==='home'&&(
          <div>
            <div style={{background:`linear-gradient(160deg,${V.navy} 0%,${V.n2} 60%,${V.sD} 100%)`,padding:'52px 20px 24px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'rgba(74,124,111,0.2)',pointerEvents:'none'}}/>
              <div style={{position:'absolute',bottom:-20,left:'30%',width:100,height:100,borderRadius:'50%',background:'rgba(196,146,58,0.15)',pointerEvents:'none'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16,position:'relative'}}>
                <div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:3}}>{greet}</div>
                  <div style={{fontSize:22,fontWeight:600,color:'#fff',marginBottom:3}}>{profile.name||'Welcome'}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>
                    {conditions.length>0?conditions.slice(0,2).join(' · '):'AI Health Companion'}
                  </div>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative'}}>
                    <Bell size={20} color="#fff"/>
                    {medicines.length>0&&<div style={{position:'absolute',top:8,right:8,width:8,height:8,background:V.coral,borderRadius:'50%',border:`2px solid ${V.navy}`}}/>}
                  </div>
                  <div style={{width:42,height:42,borderRadius:'50%',background:V.sage,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff',border:'2px solid rgba(255,255,255,0.3)'}}>
                    {profile.name?profile.name[0].toUpperCase():'P'}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16,background:'rgba(255,255,255,0.1)',borderRadius:20,padding:'14px 16px',backdropFilter:'blur(10px)',position:'relative'}}>
                <Ring pct={score} size={64} stroke={6} color="#4fc373" value={score} sub="score"/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:'#fff'}}>Health Score</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:2}}>{score>=85?'Excellent — keep it up!':score>=70?'Good progress today':score>=55?'Room to improve':'Focus on healthy habits'}</div>
                  <div style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(74,168,154,0.3)',padding:'3px 8px',borderRadius:20,fontSize:11,color:'#9fe3d0',marginTop:6,fontWeight:500}}>
                    <TrendingUp size={11} color="#9fe3d0"/> Looking good today
                  </div>
                </div>
              </div>
            </div>

            {medicines.length>0&&(
              <div style={{margin:'14px 16px 0',background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,overflow:'hidden',boxShadow:V.sh}}>
                {medicines.slice(0,2).map((m,i)=>(
                  <div key={m.id} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',borderBottom:i<Math.min(1,medicines.length-1)?`1px solid ${V.bd}`:'none'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:i===0?V.sage:V.gold,flexShrink:0}}/>
                    <div style={{flex:1,fontSize:12,color:V.tM}}><strong style={{color:V.tD}}>{m.name}</strong> · {m.dose} due at {m.time}</div>
                    <span style={{fontSize:10,color:V.tH}}>{m.time}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{padding:'14px 16px 0'}}>
              <div style={{fontSize:15,fontWeight:600,color:V.tD,marginBottom:8}}>Health Overview</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <ScoreCard icon="🔥" label="Calories" value={totalCals} sub={`of ${goalCals} kcal goal`} pct={(totalCals/goalCals)*100} color={V.gold}/>
                <ScoreCard icon="💪" label="Protein" value={`${Math.round(totalProt)}g`} sub={`of ${goalProt}g goal`} pct={(totalProt/goalProt)*100} color={V.sage}/>
                <ScoreCard icon="📊" label="BMI" value={bmi||'—'} sub={bmiLabel||'Add height & weight'} pct={bmi?Math.min(100,(bmi/35)*100):0} color={bmiLabel==='Healthy'?V.sage:V.coral}/>
                <ScoreCard icon="💊" label="Medicines" value={medicines.length} sub={medicines.length>0?'tracked daily':'none added yet'} pct={Math.min(100,medicines.length*20)} color={V.nM}/>
              </div>
            </div>

            <div style={{padding:'14px 16px 0'}}>
              <div style={{fontSize:15,fontWeight:600,color:V.tD,marginBottom:8}}>Quick Actions</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {[
                  {Icon:Utensils,l:'Log Meal',a:()=>setTab('nutrition'),bg:V.sP,c:V.sage},
                  {Icon:Camera,l:'Scan',a:()=>{setTab('nutrition');setScanOpen(true);},bg:V.cP,c:V.coral},
                  {Icon:LineChart,l:'Health',a:()=>setTab('health'),bg:V.gP,c:V.gold},
                  {Icon:Brain,l:'Ask AI',a:()=>setTab('ai'),bg:'#eef0f8',c:V.nM}
                ].map((a,i)=>(
                  <button key={i} onClick={a.a} style={{background:V.sf,borderRadius:10,padding:'12px 4px',border:`1px solid ${V.bd}`,display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',fontFamily:ff,boxShadow:V.sh}}>
                    <div style={{width:36,height:36,borderRadius:10,background:a.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <a.Icon size={18} color={a.c}/>
                    </div>
                    <span style={{fontSize:10,color:V.tM,fontWeight:500,textAlign:'center'}}>{a.l}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{padding:'14px 16px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:15,fontWeight:600,color:V.tD}}>Today's Nutrition</span>
                <button onClick={()=>setTab('nutrition')} style={{fontSize:12,color:V.sage,fontWeight:500,background:'none',border:'none',cursor:'pointer',fontFamily:ff}}>Full log</button>
              </div>
            </div>

            {todayFoods.slice(0,3).map(f=>(
              <MealCard key={f.id} icon="🍽️" title={f.name} time={`${f.time} · ${f.calories} kcal`}
                macros={[{v:`${Math.round(f.protein)}g`,l:'Protein'},{v:`${Math.round(f.carbs)}g`,l:'Carbs'},{v:`${Math.round(f.fat)}g`,l:'Fat'}]}
                tip={f.tip}/>
            ))}

            <div style={{margin:'0 16px 14px',background:V.sf,borderRadius:16,border:`1.5px dashed ${V.bd2}`,padding:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer'}} onClick={()=>{setTab('nutrition');setScanOpen(true);}}>
              <Plus size={18} color={V.tS}/>
              <span style={{fontSize:13,fontWeight:500,color:V.tS}}>Log lunch or scan barcode</span>
            </div>

            {bmi&&(
              <div style={{background:V.sf,borderRadius:16,margin:'0 16px 14px',border:`1px solid ${V.bd}`,boxShadow:V.sh,overflow:'hidden'}}>
                <div style={{padding:'14px 14px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:V.tD}}>Body Mass Index</div>
                    <div style={{fontSize:22,fontWeight:700,color:bmiLabel==='Healthy'?V.sage:V.coral,margin:'2px 0'}}>{bmi} <span style={{fontSize:12,color:V.tS,fontWeight:400}}>kg/m²</span></div>
                    <span style={{display:'inline-flex',alignItems:'center',gap:4,background:bmiLabel==='Healthy'?V.sP:V.cP,borderRadius:20,padding:'3px 10px',fontSize:11,color:bmiLabel==='Healthy'?V.sD:V.coral,fontWeight:500}}>
                      {bmiLabel==='Healthy'?<Check size={11} color={V.sD}/>:<AlertCircle size={11} color={V.coral}/>} {bmiLabel}
                    </span>
                  </div>
                  {profile.targetWeight&&<div style={{textAlign:'right'}}><div style={{fontSize:11,color:V.tS,marginBottom:4}}>Target weight</div><div style={{fontSize:20,fontWeight:700,color:V.sage}}>{profile.targetWeight}kg</div><div style={{fontSize:10,color:V.tH}}>{(parseFloat(profile.weight||0)-parseFloat(profile.targetWeight)).toFixed(1)}kg to goal</div></div>}
                </div>
                <div style={{height:4,background:V.sf3,margin:'12px 14px 14px',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(100,(bmi/40)*100)}%`,background:bmiLabel==='Healthy'?V.sage:V.coral,borderRadius:2}}/>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ NUTRITION ════ */}
        {tab==='nutrition'&&(
          <div>
            <div style={{background:V.navy,padding:'52px 20px 18px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-30,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(74,124,111,0.25)',pointerEvents:'none'}}/>
              <div style={{fontSize:20,fontWeight:600,color:'#fff',marginBottom:2}}>Nutrition</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})} · Personal Plan</div>
            </div>
            <div style={{padding:'14px 16px 0'}}>
              <div style={{background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,padding:'20px 16px',marginBottom:14,display:'flex',alignItems:'center',gap:16,boxShadow:V.sh}}>
                <div style={{position:'relative',width:120,height:120,flexShrink:0}}>
                  <svg style={{transform:'rotate(-90deg)'}} viewBox="0 0 120 120" width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke={V.sf3} strokeWidth="10"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke={V.sage} strokeWidth="10" strokeDasharray="314" strokeDashoffset={314*(1-Math.min(1,totalCals/goalCals))} strokeLinecap="round"/>
                  </svg>
                  <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
                    <span style={{fontSize:28,fontWeight:700,color:V.tD,display:'block',lineHeight:1}}>{totalCals}</span>
                    <span style={{fontSize:11,color:V.tS}}>of {goalCals} kcal</span>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:V.tD,marginBottom:10}}>Daily Progress</div>
                  {[{l:'Protein',v:Math.round(totalProt),g:goalProt,u:'g',c:V.sage},{l:'Carbs',v:Math.round(totalCarbs),g:250,u:'g',c:'#3B82F6'},{l:'Fat',v:Math.round(totalFat),g:65,u:'g',c:V.coral}].map((m,i)=>(
                    <div key={i} style={{marginBottom:i<2?8:0}}>
                      <div style={{fontSize:12,color:V.tS,marginBottom:3,display:'flex',justifyContent:'space-between'}}>{m.l}<span style={{color:V.tD,fontWeight:600}}>{m.v}/{m.g}{m.u}</span></div>
                      <div style={{height:4,background:V.sf3,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,(m.v/m.g)*100)}%`,background:m.c,borderRadius:2}}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
                {[{l:'Carbs',v:Math.round(totalCarbs),g:250,c:'#3B82F6'},{l:'Protein',v:Math.round(totalProt),g:goalProt,c:V.coral},{l:'Fat',v:Math.round(totalFat),g:65,c:V.gold}].map((m,i)=>(
                  <div key={i} style={{background:V.sf,borderRadius:10,padding:12,border:`1px solid ${V.bd}`,textAlign:'center'}}>
                    <div style={{fontSize:10,fontWeight:600,color:m.c,marginBottom:4,textTransform:'uppercase',letterSpacing:0.5}}>{m.l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:m.c}}>{m.v}g</div>
                    <div style={{fontSize:10,color:V.tH}}>of {m.g}g</div>
                    <div style={{height:4,background:V.sf3,borderRadius:2,marginTop:6,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,(m.v/m.g)*100)}%`,background:m.c,borderRadius:2}}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 16px 8px'}}>
              <span style={{fontSize:15,fontWeight:600,color:V.tD}}>Meal Log</span>
              <button onClick={()=>setScanOpen(true)} style={{fontSize:12,color:V.sage,fontWeight:500,background:'none',border:'none',cursor:'pointer',fontFamily:ff}}>+ Add</button>
            </div>
            {todayFoods.map(f=>(
              <MealCard key={f.id} icon="🍽️" title={f.name} time={`${f.time} · ${f.calories} kcal`}
                macros={[{v:`${Math.round(f.protein)}g`,l:'Protein'},{v:`${Math.round(f.carbs)}g`,l:'Carbs'},{v:`${Math.round(f.fat)}g`,l:'Fat'}]}
                tip={f.tip} onRemove={()=>setFoodLog(p=>p.filter(x=>x.id!==f.id))}/>
            ))}
            <div style={{margin:'0 16px 14px',background:V.sf,borderRadius:16,border:`1.5px dashed ${V.bd2}`,padding:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer'}} onClick={()=>setScanOpen(true)}>
              <Camera size={18} color={V.sage}/><span style={{fontSize:13,fontWeight:500,color:V.sage}}>Take photo or search foods</span>
            </div>
            <div style={{margin:'0 16px 12px',background:`linear-gradient(135deg,${V.sP},${V.warm})`,borderRadius:16,padding:14,border:'1px solid rgba(74,124,111,0.2)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><Sparkles size={16} color={V.sage}/><div style={{fontSize:13,fontWeight:600,color:V.sD}}>AI Meal Suggestion</div></div>
              <div style={{fontSize:14,fontWeight:600,color:V.tD,marginBottom:4}}>Grilled chicken, brown rice & mixed salad</div>
              <div style={{fontSize:12,color:V.tM,lineHeight:1.5,marginBottom:10}}>Well-balanced meal with lean protein and complex carbohydrates. Good for energy and satiety.</div>
              <button onClick={()=>sendChat('Give me a detailed recipe for grilled chicken, brown rice and salad with nutrition info.')||setTab('ai')} style={{background:V.sage,color:'#fff',borderRadius:20,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',fontFamily:ff}}>Ask AI for details</button>
            </div>
          </div>
        )}

        {/* ════ HEALTH ════ */}
        {tab==='health'&&(
          <div>
            <div style={{background:`linear-gradient(135deg,${V.navy},${V.sD})`,padding:'52px 20px 18px'}}>
              <div style={{fontSize:20,fontWeight:600,color:'#fff',marginBottom:4}}>Health Centre</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Reports · Conditions · AI Analysis</div>
            </div>
            <div style={{padding:'14px 16px 0'}}>
              <div style={{background:V.sf,border:`2px dashed ${V.sage}66`,borderRadius:16,padding:24,marginBottom:14,textAlign:'center',cursor:'pointer',boxShadow:V.sh}} onClick={()=>reportRef.current?.click()}>
                <div style={{width:52,height:52,borderRadius:'50%',background:V.sP,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                  <FileText size={24} color={V.sage}/>
                </div>
                <p style={{margin:'0 0 4px',fontWeight:600,fontSize:15,color:V.tD}}>Upload Health Report</p>
                <p style={{margin:'0 0 12px',fontSize:12,color:V.tS}}>Blood tests, X-rays, prescriptions · AI analyses instantly</p>
                <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                  {['PDF','JPG','PNG'].map(t=><span key={t} style={{padding:'3px 10px',background:V.sP,color:V.sage,borderRadius:20,fontSize:11,fontWeight:600}}>{t}</span>)}
                </div>
                <input ref={reportRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{display:'none'}} onChange={e=>uploadReport(e.target.files[0])}/>
              </div>
              {loading&&!hlAnalyzing&&<div style={{background:V.sP,borderRadius:12,padding:14,textAlign:'center',marginBottom:14}}><p style={{color:V.sD,fontWeight:600,margin:0,fontSize:13}}>🔬 Analysing your report...</p></div>}
              {reportAnalysis&&(
                <div style={{background:V.sf,borderRadius:16,padding:18,marginBottom:14,boxShadow:V.sh,border:`1px solid ${V.bd}`}}>
                  <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
                    <div style={{width:36,height:36,borderRadius:10,background:V.sP,display:'flex',alignItems:'center',justifyContent:'center'}}><BarChart2 size={18} color={V.sage}/></div>
                    <span style={{fontWeight:600,fontSize:15,color:V.tD}}>Report Analysis</span>
                  </div>
                  <p style={{margin:0,fontSize:13,lineHeight:1.75,color:V.tM,whiteSpace:'pre-wrap'}}>{reportAnalysis}</p>
                </div>
              )}
              <div style={{background:V.sf,borderRadius:16,padding:18,marginBottom:14,boxShadow:V.sh,border:`1px solid ${V.bd}`}}>
                <p style={{margin:'0 0 14px',fontWeight:600,fontSize:15,color:V.tD}}>Health Conditions</p>
                <div style={{display:'flex',gap:8,marginBottom:12}}>
                  <input value={condInput} onChange={e=>setCondInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&condInput){setConditions(p=>[...new Set([...p,condInput])]);setCondInput('');}}} placeholder="Add a condition..." style={{...inp2,flex:1,padding:'11px 14px'}}/>
                  <button onClick={()=>{if(condInput){setConditions(p=>[...new Set([...p,condInput])]);setCondInput('');}}} style={{padding:'11px 16px',background:V.sP,border:'none',borderRadius:12,color:V.sage,cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:ff}}>Add</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:4}}>
                  {['Diabetes','Hypertension','CKD','High Cholesterol','Thyroid','Heart Disease','Obesity','Asthma'].map(c=>(
                    <button key={c} onClick={()=>setConditions(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])} style={{padding:'7px 14px',background:conditions.includes(c)?V.cP:V.sf2,border:`1.5px solid ${conditions.includes(c)?V.coral+'66':V.bd}`,borderRadius:20,color:conditions.includes(c)?V.coral:V.tS,fontSize:12,cursor:'pointer',fontWeight:conditions.includes(c)?600:400,fontFamily:ff}}>{c}</button>
                  ))}
                </div>
                {conditions.filter(c=>!['Diabetes','Hypertension','CKD','High Cholesterol','Thyroid','Heart Disease','Obesity','Asthma'].includes(c)).map((c,i)=>(
                  <span key={i} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',background:V.cP,color:V.coral,borderRadius:20,fontSize:12,fontWeight:600,margin:'6px 6px 0 0'}}>
                    {c}<button onClick={()=>setConditions(p=>p.filter(x=>x!==c))} style={{background:'none',border:'none',color:V.coral,cursor:'pointer',padding:0,fontSize:16,lineHeight:1}}>×</button>
                  </span>
                ))}
              </div>
              {bmi&&(
                <>
                  <p style={{fontSize:15,fontWeight:600,color:V.tD,marginBottom:10}}>Key Biomarkers</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                    <BioCard Icon={Scale} iconBg={V.sP} iconColor={V.sage} name="BMI" value={bmi} unit="kg/m²" tag={bmiLabel} tagType={bmiLabel==='Healthy'?'good':'warn'}/>
                    <BioCard Icon={Flame} iconBg={V.gP} iconColor={V.gold} name="Calories Today" value={totalCals} unit="kcal" tag={totalCals>goalCals?'Over limit':'On track'} tagType={totalCals>goalCals?'warn':'good'}/>
                    <BioCard Icon={Activity} iconBg={V.sP} iconColor={V.sL} name="Protein" value={`${Math.round(totalProt)}g`} unit="" tag={totalProt>=goalProt?'Goal met':'Under target'} tagType={totalProt>=goalProt?'good':'warn'}/>
                    <BioCard Icon={Pill} iconBg={V.cP} iconColor={V.coral} name="Medicines" value={medicines.length} unit="" tag={medicines.length>0?'Tracked':'None added'} tagType={medicines.length>0?'good':'warn'}/>
                    {conditions.length>0&&<BioCard Icon={Heart} iconBg={V.cP} iconColor={V.coral} name="Conditions" value={conditions.length} unit="active" tag="Monitored" tagType="warn"/>}
                    {profile.targetWeight&&<BioCard Icon={Target} iconBg={V.gP} iconColor={V.gold} name="Target Weight" value={profile.targetWeight} unit="kg" tag={`${(parseFloat(profile.weight||0)-parseFloat(profile.targetWeight)).toFixed(1)}kg to go`} tagType="good"/>}
                  </div>
                </>
              )}
              <div style={{background:`linear-gradient(135deg,${V.gP},${V.warm})`,borderRadius:16,padding:14,marginBottom:14,border:'1px solid rgba(196,146,58,0.25)'}}>
                <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                  <Sparkles size={16} color={V.gold} style={{marginTop:1}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:V.tD,marginBottom:4}}>AI Health Insight</div>
                    <div style={{fontSize:12,color:V.tM,lineHeight:1.55,marginBottom:10}}>Get a personalised AI health analysis covering medication interactions, diet recommendations, and risk factors.</div>
                    <button onClick={()=>{setHlAnalyzing(true);ai([{role:'user',content:`Full health analysis:\nPatient: ${profile.name}, ${profile.age}yo, ${profile.weight}kg, ${profile.height}cm\nConditions: ${conditions.join(',')||'none'}\nMedicines: ${medicines.map(m=>m.name+' '+m.dose).join(',')||'none'}\nToday diet: ${todayFoods.map(f=>f.name).join(',')||'nothing logged'}\n\n1. OVERALL ASSESSMENT\n2. MEDICATION INTERACTIONS\n3. DIET RECOMMENDATIONS\n4. KEY RISKS\n5. ACTION ITEMS THIS WEEK`}]).then(r=>{setAiHealth(r);setHlAnalyzing(false);}).catch(e=>{setAiHealth('Error: '+e.message);setHlAnalyzing(false);});}} disabled={hlAnalyzing} style={{background:hlAnalyzing?V.tH:V.gold,color:'#fff',borderRadius:20,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',fontFamily:ff}}>
                      {hlAnalyzing?'Analysing...':'Get Full Analysis'}
                    </button>
                  </div>
                </div>
              </div>
              {aiHealth&&(
                <div style={{background:V.sf,borderRadius:16,padding:18,border:`1px solid ${V.sage}22`,boxShadow:V.sh,marginBottom:14}}>
                  <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
                    <div style={{width:36,height:36,borderRadius:10,background:V.sP,display:'flex',alignItems:'center',justifyContent:'center'}}><Brain size={18} color={V.sage}/></div>
                    <span style={{fontWeight:600,fontSize:15,color:V.tD}}>AI Health Analysis</span>
                  </div>
                  <p style={{margin:0,fontSize:13,lineHeight:1.75,color:V.tM,whiteSpace:'pre-wrap'}}>{aiHealth}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ AI CHAT ════ */}
        {tab==='ai'&&(
          <div>
            <div style={{background:`linear-gradient(135deg,${V.sD},${V.n2})`,padding:'52px 20px 18px',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${V.sage},${V.sL})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'2px solid rgba(255,255,255,0.3)',flexShrink:0}}>🧠</div>
              <div>
                <div style={{fontSize:16,fontWeight:600,color:'#fff'}}>Pulse AI · Your Health Companion</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:1,display:'flex',alignItems:'center',gap:4}}>
                  <span style={{display:'inline-block',width:7,height:7,background:'#4fc373',borderRadius:'50%'}}/>Online · Powered by Claude
                </div>
              </div>
            </div>
            <div style={{padding:'14px',display:'flex',flexDirection:'column',gap:12,paddingBottom:170}}>
              {chatMsgs.map((m,i)=>(
                <div key={i}>
                  <div style={{maxWidth:'82%',padding:'12px 14px',fontSize:13,lineHeight:1.55,borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',background:m.role==='user'?V.sage:V.sf,color:m.role==='user'?'#fff':V.tD,border:m.role==='assistant'?`1px solid ${V.bd}`:'none',marginLeft:m.role==='user'?'auto':'0',whiteSpace:'pre-wrap',boxShadow:m.role==='assistant'?V.sh:'none'}}>{m.content}</div>
                  <div style={{fontSize:10,color:V.tH,marginTop:3,textAlign:m.role==='user'?'right':'left'}}>{m.role==='user'?'You':'Pulse AI'} · {new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
              ))}
              {loading&&tab==='ai'&&<div style={{maxWidth:'82%',padding:'12px 14px',fontSize:13,color:V.tS,background:V.sf,borderRadius:'18px 18px 18px 4px',border:`1px solid ${V.bd}`,boxShadow:V.sh}}>Thinking...</div>}
              <div ref={chatEndRef}/>
            </div>
            <div style={{position:'fixed',bottom:79,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:V.cream,borderTop:`1px solid ${V.bd}`}}>
              <div style={{display:'flex',gap:6,padding:'10px 14px',overflowX:'auto',scrollbarWidth:'none'}}>
                {['What foods should I avoid?','Analyse my medicines','Suggest a healthy dinner','How is my progress?'].map(q=>(
                  <button key={q} onClick={()=>sendChat(q)} style={{background:V.sf,border:`1px solid ${V.bd}`,borderRadius:20,padding:'7px 14px',fontSize:12,color:V.sD,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,fontFamily:ff,fontWeight:500,boxShadow:V.sh}}>{q}</button>
                ))}
              </div>
              <div style={{padding:'0 14px 16px',display:'flex',gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Ask Pulse anything…" style={inp}/>
                <button onClick={()=>sendChat()} style={{width:40,height:40,background:V.sage,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'none',flexShrink:0,boxShadow:V.shM}}>
                  <Send size={16} color="#fff"/>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ PROFILE ════ */}
        {tab==='profile'&&(
          <div>
            <div style={{background:`linear-gradient(160deg,${V.navy},${V.sD})`,padding:'52px 20px 24px',textAlign:'center'}}>
              <div style={{width:72,height:72,borderRadius:'50%',background:`linear-gradient(135deg,${V.sage},${V.sL})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,color:'#fff',margin:'0 auto 10px',border:'3px solid rgba(255,255,255,0.3)'}}>
                {profile.name?profile.name[0].toUpperCase():'P'}
              </div>
              <div style={{fontSize:20,fontWeight:600,color:'#fff'}}>{profile.name||'Your Name'}</div>
              {conditions.length>0&&<div style={{fontSize:12,color:'rgba(255,255,255,0.55)',marginTop:3}}>{conditions.join(' · ')}</div>}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(255,255,255,0.1)',marginTop:16,borderRadius:12,overflow:'hidden'}}>
                {[{v:foodLog.length,l:'Foods Logged'},{v:score,l:'Health Score'},{v:medicines.length,l:'Medicines'}].map((s,i)=>(
                  <div key={i} style={{background:'rgba(0,0,0,0.2)',padding:10,textAlign:'center'}}>
                    <div style={{fontSize:16,fontWeight:700,color:'#fff'}}>{s.v}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:'12px 16px 0'}}>
              <div style={{fontSize:11,fontWeight:600,color:V.tS,padding:'0 4px 6px',letterSpacing:0.5}}>HEALTH PROFILE</div>
              <div style={{background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,overflow:'hidden',marginBottom:12}}>
                <SRow Icon={User} iconBg={V.sP} iconColor={V.sage} label={profile.name||'Set your name'}/>
                <SRow Icon={Calendar} iconBg={V.cP} iconColor={V.coral} label={profile.age?`Age: ${profile.age} years`:'Set your age'}/>
                <SRow Icon={Scale} iconBg={V.gP} iconColor={V.gold} label={profile.weight?`${profile.weight}kg → ${profile.targetWeight||'?'}kg target`:'Set weight & target'}/>
                <SRow Icon={Ruler} iconBg="#eef0f8" iconColor={V.nM} label={profile.height?`${profile.height}cm · BMI ${bmi||'?'} (${bmiLabel||'—'})`:'Set your height'} last/>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:V.tS,padding:'0 4px 6px',letterSpacing:0.5}}>EDIT DETAILS</div>
              <div style={{background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,padding:16,marginBottom:12}}>
                {[{k:'name',l:'Name',t:'text',p:'Your name'},{k:'age',l:'Age',t:'number',p:'25'},{k:'weight',l:'Weight (kg)',t:'number',p:'70'},{k:'targetWeight',l:'Target (kg)',t:'number',p:'65'},{k:'height',l:'Height (cm)',t:'number',p:'175'}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:V.tS,display:'block',marginBottom:5,fontWeight:500}}>{f.l}</label>
                    <input type={f.t} value={profile[f.k]} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={inp2}/>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,fontWeight:600,color:V.tS,padding:'0 4px 6px',letterSpacing:0.5}}>MEDICATIONS</div>
              <div style={{background:V.sf,borderRadius:16,border:`1px solid ${V.bd}`,overflow:'hidden',marginBottom:12}}>
                {medicines.map(m=>(
                  <div key={m.id} style={{padding:'13px 14px',borderBottom:`1px solid ${V.bd}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:m.aiInfo?10:0}}>
                      <div style={{width:34,height:34,borderRadius:9,background:V.gP,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Pill size={17} color={V.gold}/></div>
                      <div style={{flex:1}}><div style={{fontSize:14,color:V.tD,fontWeight:600}}>{m.name}</div><div style={{fontSize:12,color:V.tS}}>{m.dose} · {m.frequency} · {m.time}</div></div>
                      <button onClick={()=>setMedicines(p=>p.filter(x=>x.id!==m.id))} style={{background:V.cP,border:'none',borderRadius:20,padding:'4px 12px',color:V.coral,cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:ff}}>Remove</button>
                    </div>
                    {m.aiInfo&&<div style={{background:V.sP,borderRadius:10,padding:'10px 12px',marginTop:8}}><p style={{margin:0,fontSize:12,lineHeight:1.6,color:V.sD,whiteSpace:'pre-wrap'}}>{m.aiInfo}</p></div>}
                  </div>
                ))}
                <button onClick={()=>setShowMedForm(v=>!v)} style={{width:'100%',padding:'13px 14px',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontFamily:ff,color:V.sage,borderBottom:showMedForm?`1px solid ${V.bd}`:'none'}}>
                  <div style={{width:34,height:34,borderRadius:9,background:V.sP,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Plus size={17} color={V.sage}/></div>
                  <span style={{fontSize:14,fontWeight:500}}>Add Medicine</span>
                </button>
                {showMedForm&&(
                  <div style={{padding:'0 14px 14px'}}>
                    {[{k:'name',l:'Medicine Name',p:'e.g. Metformin, Lisinopril...',t:'text'},{k:'dose',l:'Dose',p:'e.g. 500mg',t:'text'}].map(f=>(
                      <div key={f.k} style={{marginBottom:10}}>
                        <label style={{fontSize:11,color:V.tS,display:'block',marginBottom:5,fontWeight:500}}>{f.l}</label>
                        <input type={f.t} value={medForm[f.k]} onChange={e=>setMedForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={inp2}/>
                      </div>
                    ))}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                      <div><label style={{fontSize:11,color:V.tS,display:'block',marginBottom:5,fontWeight:500}}>Time</label><input type="time" value={medForm.time} onChange={e=>setMedForm(p=>({...p,time:e.target.value}))} style={inp2}/></div>
                      <div><label style={{fontSize:11,color:V.tS,display:'block',marginBottom:5,fontWeight:500}}>Frequency</label><select value={medForm.frequency} onChange={e=>setMedForm(p=>({...p,frequency:e.target.value}))} style={{...inp2,background:V.sf}}>{['Daily','Twice daily','3× daily','Weekly','As needed'].map(f=><option key={f}>{f}</option>)}</select></div>
                    </div>
                    <button onClick={addMed} disabled={loading} style={{width:'100%',padding:12,background:V.sage,border:'none',borderRadius:12,color:'#fff',cursor:'pointer',fontSize:14,fontWeight:600,opacity:loading?0.7:1,fontFamily:ff}}>{loading?'Adding...':'+ Add & Get AI Info'}</button>
                  </div>
                )}
              </div>
              <div style={{fontSize:11,fontWeight:600,color:V.tS,padding:'0 4px 6px',letterSpacing:0.5}}>SETTINGS</div>
              <div style={{background:`linear-gradient(135deg,${V.navy},${V.sD})`,borderRadius:16,padding:16,marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div><div style={{fontSize:14,fontWeight:600,color:'#fff'}}>Claude API Key</div><div style={{fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:2}}>For unlimited AI coaching</div></div>
                  <div style={{background:apiKey?V.gL:'rgba(255,255,255,0.15)',color:apiKey?V.navy:'rgba(255,255,255,0.6)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600}}>{apiKey?'Connected':'Built-in'}</div>
                </div>
                <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-... (optional)" style={{...inp,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',marginBottom:6}}/>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>console.anthropic.com — free to start</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:'rgba(250,248,244,0.97)',backdropFilter:'blur(20px)',borderTop:`1px solid ${V.bd}`,padding:'10px 0 20px',display:'flex',justifyContent:'space-around',zIndex:100}}>
        {[{id:'home',Icon:Home,l:'Home'},{id:'nutrition',Icon:Utensils,l:'Nutrition'},{id:'health',Icon:LineChart,l:'Health'},{id:'ai',Icon:Brain,l:'Vita AI'},{id:'profile',Icon:User,l:'Profile'}].map(nav=>(
          <button key={nav.id} onClick={()=>setTab(nav.id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',padding:'4px 12px',borderRadius:12,background:'none',border:'none',fontFamily:ff}}>
            <nav.Icon size={22} color={tab===nav.id?V.sage:V.tH}/>
            <span style={{fontSize:10,color:tab===nav.id?V.sage:V.tH,fontWeight:tab===nav.id?600:400}}>{nav.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

