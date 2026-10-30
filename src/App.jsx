import { useEffect, useState } from 'react';
import { Activity, BarChart3, Bell, BookOpen, Boxes, BriefcaseBusiness, ChevronDown, ChevronRight, CircleHelp, CreditCard, FileText, Factory, LayoutDashboard, LogOut, Menu, Package, Plus, Search, Settings, ShieldCheck, ShoppingBag, Sparkles, Truck, Users, Wallet, X } from 'lucide-react';
import { supabase } from './lib/supabase';

const groups = [
  ['OVERVIEW', [['overview','Executive overview',LayoutDashboard],['reports','Reports & insights',BarChart3]]],
  ['OPERATIONS', [['sales','Sales & orders',ShoppingBag],['inventory','Inventory',Boxes],['production','Production',Factory],['customers','Customers',Users],['suppliers','Suppliers & purchasing',Truck]]],
  ['FINANCE', [['accounting','Accounting',BookOpen],['expenses','Expenses',Wallet],['banking','Cash & banking',CreditCard],['forecasting','Budgets & forecasts',Activity]]],
  ['PEOPLE & GROWTH', [['marketing','Marketing',BarChart3],['people','People & payroll',Users],['documents','Documents & compliance',FileText]]]
];
const descriptions = {
  overview:'A clear picture of how your business is performing.', reports:'Turn your business records into useful decisions.',
  sales:'Track orders, payments, fulfilment and returns.', inventory:'Know what you have, where it is and what needs attention.',
  production:'Plan batches, monitor yields and understand product costs.', customers:'Keep customer information and relationships organized.',
  suppliers:'Manage suppliers, purchase orders and incoming stock.', accounting:'A reliable financial record built on double-entry bookkeeping.',
  expenses:'Record, review and control business spending.', banking:'Follow cash movement and reconcile bank activity.',
  forecasting:'Plan ahead using actuals, assumptions and scenarios.', marketing:'Connect advertising spend with leads, orders and revenue.',
  people:'Organize staff, attendance, leave and payroll records.', documents:'Keep important records and deadlines in one place.'
};
const cash = n => new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(Number(n||0));

function Auth() {
  const [mode,setMode]=useState('signin'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
  async function submit(e){
    e.preventDefault();setBusy(true);setError('');setMessage('');
    try{
      if(mode==='signup'){
        const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim()},emailRedirectTo:'https://dubemascend-png.github.io/ecuisine-business-management-system/email-confirmed.html'}});
        if(error)throw error;
        setMessage(data.session?'Account created. Loading your workspace…':'Account created. Check your email to confirm, then sign in.');
      }else if(mode==='reset'){
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+window.location.pathname});
        if(error)throw error;setMessage('If this email is registered, a password reset link will be sent.');
      }else{
        const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;
      }
    }catch(e){setError(e.message||'Something went wrong. Please try again.')}finally{setBusy(false)}
  }
  return <main className="auth-shell"><section className="auth-story">
    <div className="brand-lockup"><span className="brand-mark"><Sparkles size={20}/></span>eCuisine <span className="brand-light">BMS</span></div>
    <div className="story-copy"><span className="eyebrow">YOUR BUSINESS. IN FOCUS.</span><h1>Build with clarity.<br/><em>Grow with confidence.</em></h1><p>One thoughtful workspace for your operations, finances, people and next big move.</p>
      <div className="story-points"><div><ShieldCheck/><span><b>One trusted source</b><small>Your business records, connected.</small></span></div><div><BarChart3/><span><b>Decisions with context</b><small>See what is happening and why.</small></span></div><div><BriefcaseBusiness/><span><b>Built to scale</b><small>Designed for the business ahead.</small></span></div></div>
    </div><div className="story-footer">eCuisine Foods · Business management, made clearer.</div>
  </section><section className="auth-panel"><div className="auth-card">
    <div className="mobile-brand"><span className="brand-mark"><Sparkles/></span> eCuisine BMS</div>
    <span className="eyebrow">{mode==='signup'?'GET STARTED':mode==='reset'?'ACCOUNT RECOVERY':'WELCOME BACK'}</span>
    <h2>{mode==='signup'?'Create your account':mode==='reset'?'Reset your password':'Sign in to your workspace'}</h2>
    <p className="muted">{mode==='signup'?'Set up your secure access to eCuisine BMS.':mode==='reset'?'We’ll send you a secure password reset link.':'Your business is ready when you are.'}</p>
    <form onSubmit={submit} className="auth-form">
      {mode==='signup'&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required/></label>}
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required/></label>
      {mode!=='reset'&&<label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required/></label>}
      {mode==='signin'&&<button type="button" className="text-button align-right" onClick={()=>{setMode('reset');setError('');setMessage('')}}>Forgot password?</button>}
      {error&&<div className="notice error">{error}</div>}{message&&<div className="notice success">{message}</div>}
      <button className="primary-button full" disabled={busy}>{busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Send reset link':'Sign in'} <ChevronRight size={17}/></button>
    </form>
    <div className="auth-switch">{mode==='reset'?<button className="text-button" onClick={()=>setMode('signin')}>Back to sign in</button>:<>{mode==='signup'?'Already have an account?':'New to eCuisine BMS?'} <button className="text-button" onClick={()=>{setMode(mode==='signup'?'signin':'signup');setError('');setMessage('')}}>{mode==='signup'?'Sign in':'Create an account'}</button></>}</div>
    <div className="secure-note"><ShieldCheck size={14}/> Secure access protected by Supabase authentication</div>
  </div></section></main>;
}

function App(){
  const [session,setSession]=useState(null),[ready,setReady]=useState(false),[workspace,setWorkspace]=useState(null),[profile,setProfile]=useState(null),[counts,setCounts]=useState({orders:0,expenses:0,products:0}),[loading,setLoading]=useState(false),[problem,setProblem]=useState(''),[active,setActive]=useState('overview'),[mobile,setMobile]=useState(false),[dark,setDark]=useState(false);
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
  useEffect(()=>{
    if(!session?.user){setWorkspace(null);setProfile(null);return}
    let alive=true;
    async function load(){
      setLoading(true);setProblem('');
      const u=session.user;
      const [p,m]=await Promise.all([supabase.from('profiles').select('full_name,phone').eq('id',u.id).maybeSingle(),supabase.from('business_members').select('business_id,role_id,membership_status').eq('user_id',u.id).eq('membership_status','active')]);
      if(!alive)return;
      setProfile(p.data||{full_name:u.user_metadata?.full_name||u.email?.split('@')[0]});
      if(m.error){setProblem(m.error.message);setLoading(false);return}
      if(!m.data?.length){setWorkspace(null);setLoading(false);return}
      const member=m.data[0];
      const [b,r]=await Promise.all([supabase.from('businesses').select('id,name,slug,currency_code,timezone').eq('id',member.business_id).maybeSingle(),supabase.from('roles').select('role_name').eq('id',member.role_id).maybeSingle()]);
      if(!alive)return;
      if(b.error||!b.data){setProblem(b.error?.message||'Workspace could not be loaded.');setLoading(false);return}
      setWorkspace({...b.data,role:r.data?.role_name||'Team member'});
      const id=b.data.id;
      const [o,e,pr]=await Promise.all([supabase.from('sales_orders').select('*',{count:'exact',head:true}).eq('business_id',id),supabase.from('expenses').select('amount').eq('business_id',id).limit(500),supabase.from('products').select('*',{count:'exact',head:true}).eq('business_id',id).eq('is_active',true)]);
      if(alive)setCounts({orders:o.count||0,expenses:(e.data||[]).reduce((s,x)=>s+Number(x.amount||0),0),products:pr.count||0});
      setLoading(false);
    }
    load();return()=>{alive=false};
  },[session]);
  if(!ready)return <div className="boot-screen"><span className="brand-mark"><Sparkles/></span>Preparing your workspace…</div>;
  if(!session)return <Auth/>;
  const userName=profile?.full_name||'there',initials=userName.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(),title=groups.flatMap(g=>g[1]).find(x=>x[0]===active)?.[1]||'Executive overview';
  async function logout(){await supabase.auth.signOut()}
  return <div className={dark?'app-shell dark':'app-shell'}>
    <aside className={mobile?'sidebar open':'sidebar'}>
      <div className="sidebar-brand"><span className="brand-mark"><Sparkles size={19}/></span><span>eCuisine <small>BMS</small></span><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">e</div><div className="workspace-label"><b>{workspace?.name||'eCuisine Foods'}</b><small>{workspace?.role||'Business workspace'}</small></div><ChevronDown size={15}/></div>
      <nav className="side-nav">{groups.map(g=><div className="nav-group" key={g[0]}><div className="nav-heading">{g[0]}</div>{g[1].map(([id,label,Icon])=><button key={id} className={active===id?'nav-link active':'nav-link'} onClick={()=>{setActive(id);setMobile(false)}}><Icon size={17}/><span>{label}</span></button>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="nav-link"><CircleHelp size={17}/><span>Help & support</span></button><button className="nav-link"><Settings size={17}/><span>Workspace settings</span></button><div className="sidebar-user"><div className="user-avatar">{initials}</div><div className="user-meta"><b>{userName}</b><small>{session.user.email}</small></div><button title="Sign out" onClick={logout} className="icon-button"><LogOut size={17}/></button></div></div>
    </aside>
    {mobile&&<button className="scrim" onClick={()=>setMobile(false)} aria-label="Close menu"/>}
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="breadcrumbs">Workspace <ChevronRight size={14}/><b>{title}</b></div><div className="top-actions"><div className="search-box"><Search size={16}/><input placeholder="Search your workspace"/></div><button className="icon-button"><Bell size={18}/></button><button className="theme-toggle" onClick={()=>setDark(!dark)}>{dark?'☀️':'◐'}</button><div className="user-avatar top-avatar">{initials}</div></div></header>
      <div className="page-content">{loading?<div className="loading-card">Loading your business workspace…</div>:!workspace?<section className="access-card panel"><div className="access-icon"><ShieldCheck size={25}/></div><span className="eyebrow">WORKSPACE ACCESS</span><h1>Your account is ready.</h1><p>{problem?'We could not load your workspace membership.':'This account does not yet have an active business workspace assigned to it.'}</p>{problem&&<div className="notice error">{problem}</div>}<p className="muted">Ask the business owner to add this email address as a team member. Once access is granted, sign out and sign in again.</p><button className="secondary-button" onClick={logout}><LogOut size={16}/> Sign out</button></section>:
      <>
        <div className="page-heading"><div><div className="eyebrow">{active==='overview'?'BUSINESS AT A GLANCE':'ECUISINE FOODS · WORKSPACE'}</div><h1>{active==='overview'?'Welcome back, '+userName.split(' ')[0]+'.':title}</h1><p>{active==='overview'?'Here’s what’s happening across your business today.':descriptions[active]}</p></div><div className="heading-actions"><button className="secondary-button">Today <ChevronDown size={14}/></button><button className="primary-button"><Plus size={17}/> Quick action</button></div></div>
        {active==='overview'?<>
          <section className="welcome-banner"><div className="welcome-copy"><span className="banner-kicker"><Sparkles size={14}/> YOUR BUSINESS, CONNECTED</span><h2>Good businesses run on<br/>good information.</h2><p>Your workspace is ready. Start recording activity to turn these views into meaningful business insight.</p><button className="banner-button" onClick={()=>setActive('sales')}>Explore sales & orders <ChevronRight size={16}/></button></div><div className="banner-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-card"><div className="art-card-top"><i/><i/><i/></div><div className="art-chart"><i/><i/><i/><i/><i/><i/><i/></div><div className="art-card-line"/></div><div className="art-float"><Activity size={19}/><span><b>Business pulse</b><small>Systems connected</small></span><ShieldCheck size={17}/></div></div></section>
          <div className="section-title"><div><h2>Business snapshot</h2><p>Your key activity, in one place.</p></div><span className="live-tag"><i/> LIVE DATA</span></div>
          <div className="metric-grid"><Metric icon={ShoppingBag} label="Sales orders" value={counts.orders.toLocaleString()} note="Recorded orders" tone="violet"/><Metric icon={Wallet} label="Expenses recorded" value={cash(counts.expenses)} note="Across recorded entries" tone="peach"/><Metric icon={Package} label="Active products" value={counts.products.toLocaleString()} note="Available product records" tone="mint"/><Metric icon={Users} label="Your access" value={workspace.role} note="Current workspace role" tone="blue" compact/></div>
          <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h3>Get your workspace moving</h3><p>A few useful places to start.</p></div><ClipboardIcon/></div><Setup title="Record your first sale" detail="Capture an order and its payment status." number="01" click={()=>setActive('sales')}/><Setup title="Review your inventory" detail="Set stock levels for finished goods and ingredients." number="02" click={()=>setActive('inventory')}/><Setup title="Set up your finances" detail="Review accounts, cash and opening balances." number="03" click={()=>setActive('accounting')}/></section><section className="panel"><div className="panel-heading"><div><h3>Workspace health</h3><p>System and data overview.</p></div><ShieldCheck className="health-icon"/></div><Health title="Database connection" detail="Connected securely"/><Health title="Business workspace" detail={workspace.name}/><Health title="Access role" detail={workspace.role}/><div className="health-foot"><ShieldCheck size={15}/> Business data is protected by row-level security.</div></section></div>
        </>:<section className="module-placeholder panel"><div className="placeholder-icon"><Sparkles size={24}/></div><span className="eyebrow">MODULE FOUNDATION</span><h2>{title}</h2><p>{descriptions[active]}</p><div className="placeholder-note"><ShieldCheck size={16}/> Secure workspace connection is active. Data-entry screens and workflows for this module are the next build stage.</div><button className="secondary-button" onClick={()=>setActive('overview')}>Back to overview</button></section>}
        <footer className="page-footer"><span>© {new Date().getFullYear()} eCuisine Foods · Business Management System</span><span>Built for clarity. Designed for growth.</span></footer>
      </>}</div>
    </main>
  </div>;
}
function Metric({icon:Icon,label,value,note,tone,compact}){return <div className="metric-card"><div className="metric-top"><span className={'metric-icon '+tone}><Icon size={18}/></span><span className="metric-trend">↗</span></div><div className={compact?'metric-value role-value':'metric-value'}>{value}</div><div className="metric-label">{label}</div><div className="metric-note">{note}</div></div>}
function Setup({number,title,detail,click}){return <button className="setup-item" onClick={click}><span className="setup-number">{number}</span><span className="setup-text"><b>{title}</b><small>{detail}</small></span><ChevronRight size={17}/></button>}
function Health({title,detail}){return <div className="health-row"><span className="health-dot"/><span><b>{title}</b><small>{detail}</small></span><span className="status-pill">Ready</span></div>}
function ClipboardIcon(){return <span className="panel-icon"><FileText size={18}/></span>}
export default App;
