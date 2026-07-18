"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Command,
  FileText,
  FolderKanban,
  Gauge,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";

type View = "Today" | "Projects" | "Decisions" | "Memory" | "Approvals" | "Settings";

type Project = {
  name: string;
  objective: string;
  state: "Active" | "Waiting" | "Stalled";
  health: number;
  next: string;
  blocker?: string;
};

type Decision = {
  question: string;
  project: string;
  recommendation: string;
  urgency: "Today" | "This week" | "Later";
  confidence: number;
  status: "Open" | "Approved" | "Deferred" | "Rejected";
};

type Approval = {
  title: string;
  type: string;
  rationale: string;
  risk: "Low" | "Medium" | "High";
  status: "Pending" | "Approved" | "Rejected";
};

const initialProjects: Project[] = [
  { name: "The Hendricks Company", objective: "Operate the full creator-ownership ecosystem.", state: "Active", health: 76, next: "Define the next 30-day operating sprint." },
  { name: "Agora Capital", objective: "Build communal capital infrastructure for builders and creators.", state: "Active", health: 63, next: "Resolve the MVP structure and membership offer.", blocker: "Legal and product sequencing are not yet locked." },
  { name: "The Renaissance Project", objective: "Create a place-based operating system for human development.", state: "Waiting", health: 58, next: "Convert the place vision into a site and program brief." },
  { name: "Marcus Hendricks Ministries", objective: "Build the nonprofit and faith-based arm of the ecosystem.", state: "Waiting", health: 45, next: "Clarify initial programs and legal relationship to THC." },
  { name: "The Marcus Hendricks Show", objective: "Turn Marcus's thinking and conversations into a durable media property.", state: "Stalled", health: 35, next: "Choose the first repeatable format and publishing rhythm.", blocker: "No operating cadence." },
  { name: "ACE", objective: "Reduce what Marcus has to remember, coordinate, and carry alone.", state: "Active", health: 82, next: "Connect real calendar, email, files, and decisions." },
];

const initialDecisions: Decision[] = [
  { question: "What should ACE automate first after the command center?", project: "ACE", recommendation: "Daily briefing plus Gmail and calendar triage.", urgency: "Today", confidence: 92, status: "Open" },
  { question: "Should Agora launch as a membership product before capital formation?", project: "Agora Capital", recommendation: "Yes. Validate participation and operations before regulated capital activity.", urgency: "This week", confidence: 84, status: "Open" },
  { question: "What is the first public media format?", project: "The Marcus Hendricks Show", recommendation: "A weekly autobiographical strategy conversation anchored in current work.", urgency: "This week", confidence: 73, status: "Open" },
];

const initialApprovals: Approval[] = [
  { title: "Protect Thursday afternoon for focused work", type: "Calendar change", rationale: "The week currently has no uninterrupted strategic block.", risk: "Low", status: "Pending" },
  { title: "Draft follow-up to ecosystem event contacts", type: "Email draft", rationale: "Several relationships have no defined next step.", risk: "Low", status: "Pending" },
  { title: "Create Agora legal-structure decision memo", type: "Document", rationale: "The unresolved structure is blocking product and capital decisions.", risk: "Medium", status: "Pending" },
];

const memories = [
  { type: "Principle", text: "The model is the marketing.", source: "Marcus", confidence: "High" },
  { type: "Principle", text: "Launch projects as products.", source: "Marcus", confidence: "High" },
  { type: "Identity", text: "My name's on it so my name owns it; my name owns it so my name's on it.", source: "Marcus", confidence: "High" },
  { type: "Operating rule", text: "Organic documentation over a performative content calendar.", source: "THC strategy", confidence: "High" },
  { type: "Vision", text: "Build systems that let communities fund, build, and grow together.", source: "Agora Capital", confidence: "High" },
];

const nav: { label: View; icon: React.ElementType }[] = [
  { label: "Today", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Decisions", icon: Brain },
  { label: "Memory", icon: Archive },
  { label: "Approvals", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: React.ElementType }) {
  return <div className="metric"><div className="metric-icon"><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("Today");
  const [menuOpen, setMenuOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("ACE is ready. Ask for a plan, brief, decision, or action.");
  const [projects] = useState(initialProjects);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.objective.toLowerCase().includes(query.toLowerCase())), [projects, query]);

  function runCommand() {
    const text = command.trim();
    if (!text) return;
    const lowered = text.toLowerCase();
    if (lowered.includes("priority") || lowered.includes("today")) setResponse("Your highest-leverage move is to finish ACE's operating foundation, then resolve Agora's structure. Protect one uninterrupted block before adding new commitments.");
    else if (lowered.includes("neglect") || lowered.includes("stalled")) setResponse("The Marcus Hendricks Show is the clearest neglected asset. It has strategic value but no operating cadence. The next action is choosing one repeatable weekly format.");
    else if (lowered.includes("calendar") || lowered.includes("schedule")) setResponse("I would preserve Thursday afternoon for deep work, limit the day to three meetings, and add 30-minute buffers around consequential conversations.");
    else if (lowered.includes("agora")) setResponse("Agora is blocked less by vision than sequencing. Decide the initial membership product, legal constraints, and one local pilot before expanding the capital thesis.");
    else setResponse(`I captured: “${text}.” My recommendation is to convert it into one owner, one deadline, and one next physical action before it becomes another open loop.`);
    setCommand("");
  }

  function updateDecision(index: number, status: Decision["status"]) {
    setDecisions((items) => items.map((item, i) => i === index ? { ...item, status } : item));
  }

  function updateApproval(index: number, status: Approval["status"]) {
    setApprovals((items) => items.map((item, i) => i === index ? { ...item, status } : item));
  }

  return (
    <main className="shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">A</div><div><strong>ACE</strong><span>Executive operating system</span></div><button className="close-menu" onClick={() => setMenuOpen(false)}><X /></button></div>
        <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={view === label ? "active" : ""} onClick={() => { setView(label); setMenuOpen(false); }}><Icon size={19} /><span>{label}</span>{label === "Approvals" && <em>{approvals.filter(a => a.status === "Pending").length}</em>}</button>)}</nav>
        <div className="sidebar-foot"><span className="status-dot" />Demo intelligence<div>Connections not yet active</div></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu /></button><div><span className="eyebrow">ACE / {view}</span><h1>{view === "Today" ? "Good morning, Marcus." : view}</h1></div><button className="profile">MH</button></header>

        {view === "Today" && <>
          <section className="command-card"><div className="command-label"><Sparkles size={17} /> Ask ACE</div><div className="command-row"><input value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} placeholder="Plan, prepare, organize, or act…" /><button onClick={runCommand}><Command size={18} /> Run</button></div><p>{response}</p></section>

          <div className="metrics"><Metric label="Deep-work capacity" value="3.5 hours" detail="Best window: 1:00–4:30" icon={Gauge} /><Metric label="Open decisions" value={String(decisions.filter(d => d.status === "Open").length)} detail="One due today" icon={Brain} /><Metric label="Pending approvals" value={String(approvals.filter(a => a.status === "Pending").length)} detail="Two are low risk" icon={ShieldCheck} /></div>

          <section className="grid two-one"><div className="panel"><div className="panel-head"><div><span className="eyebrow">ACE brief</span><h2>What matters now</h2></div><Badge tone="blue">Saturday, July 18</Badge></div><p className="brief">You are not short on vision. The constraint is operating capacity. Today should reduce open loops rather than create new ones: establish ACE, resolve the next Agora decision, and protect enough unstructured time to think.</p><div className="priority-list">
            {[ ["1", "Establish ACE as the control layer", "A working operating system reduces the coordination burden across every other venture.", "Review the MVP and define the first real integrations."], ["2", "Resolve Agora's next form", "Product, legal, and membership decisions are currently entangled.", "Write a one-page sequencing decision."], ["3", "Do not fill all available capacity", "Your ability to notice and synthesize is an operating asset, not unused time.", "Keep one block unassigned."] ].map(([n,t,w,a]) => <div className="priority" key={n}><strong>{n}</strong><div><h3>{t}</h3><p>{w}</p><small>Next: {a}</small></div></div>)}
          </div></div>
          <div className="panel"><div className="panel-head"><div><span className="eyebrow">Schedule</span><h2>Today</h2></div><CalendarDays size={20} /></div><div className="timeline"><div><time>9:00</time><span><b>Weekly orientation</b><small>Review projects and choose constraints</small></span></div><div><time>11:00</time><span><b>Open work block</b><small>ACE build and operating design</small></span></div><div><time>1:00</time><span><b>Protected deep work</b><small>Recommended: no meetings</small></span></div><div><time>5:30</time><span><b>Recovery / movement</b><small>Preserve energy before evening</small></span></div></div></div></section>

          <section className="grid half"><div className="panel"><div className="panel-head"><div><span className="eyebrow">Needs your judgment</span><h2>Decision queue</h2></div><button className="text-button" onClick={() => setView("Decisions")}>View all <ChevronRight size={16}/></button></div>{decisions.filter(d => d.status === "Open").slice(0,2).map((d) => <div className="queue-item" key={d.question}><div><Badge tone={d.urgency === "Today" ? "red" : "neutral"}>{d.urgency}</Badge><h3>{d.question}</h3><p>{d.recommendation}</p></div><span className="confidence">{d.confidence}%</span></div>)}</div><div className="panel"><div className="panel-head"><div><span className="eyebrow">Watchlist</span><h2>Drift and risk</h2></div><Activity size={20}/></div><div className="watch"><div><Clock3/><span><b>The Marcus Hendricks Show</b><small>No meaningful operating progress recorded.</small></span></div><div><Inbox/><span><b>Relationship follow-ups</b><small>Several ecosystem conversations have no documented next step.</small></span></div><div><CircleDollarSign/><span><b>Financial visibility</b><small>Accounts are not connected; ACE cannot yet monitor runway or obligations.</small></span></div></div></div></section>
        </>}

        {view === "Projects" && <section><div className="section-tools"><div className="search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" /></div><button className="primary">+ New project</button></div><div className="project-grid">{filteredProjects.map((project) => <article className="project-card" key={project.name}><div className="project-top"><Badge tone={project.state === "Active" ? "green" : project.state === "Stalled" ? "red" : "neutral"}>{project.state}</Badge><span>{project.health}% health</span></div><h2>{project.name}</h2><p>{project.objective}</p><div className="progress"><i style={{width: `${project.health}%`}} /></div><small>Next action</small><strong className="next-action">{project.next}</strong>{project.blocker && <div className="blocker"><b>Blocker</b>{project.blocker}</div>}</article>)}</div></section>}

        {view === "Decisions" && <section className="stack">{decisions.map((decision, index) => <article className="decision-card" key={decision.question}><div className="decision-main"><div className="decision-meta"><Badge tone={decision.urgency === "Today" ? "red" : "neutral"}>{decision.urgency}</Badge><span>{decision.project}</span><span>{decision.confidence}% confidence</span></div><h2>{decision.question}</h2><p><b>ACE recommends:</b> {decision.recommendation}</p></div><div className="decision-actions"><Badge tone={decision.status === "Approved" ? "green" : decision.status === "Rejected" ? "red" : "blue"}>{decision.status}</Badge><div><button onClick={() => updateDecision(index, "Approved")}>Approve</button><button onClick={() => updateDecision(index, "Deferred")}>Defer</button><button onClick={() => updateDecision(index, "Rejected")}>Reject</button></div></div></article>)}</section>}

        {view === "Memory" && <section><div className="section-tools"><div className="search"><Search size={18}/><input placeholder="Search principles, people, projects, commitments…" /></div><button className="primary">+ Add memory</button></div><div className="memory-grid">{memories.map((memory) => <article className="memory-card" key={memory.text}><div><Badge tone="blue">{memory.type}</Badge><Badge>{memory.confidence} confidence</Badge></div><blockquote>“{memory.text}”</blockquote><small>Source: {memory.source}</small></article>)}</div></section>}

        {view === "Approvals" && <section className="stack"><div className="authority"><ShieldCheck/><div><span className="eyebrow">Current authority level</span><h2>Prepare and ask once</h2><p>ACE may observe, recommend, and prepare actions. External actions still require your approval.</p></div></div>{approvals.map((approval, index) => <article className="approval-card" key={approval.title}><div className="approval-icon">{approval.type === "Email draft" ? <MessageSquareText/> : approval.type === "Calendar change" ? <CalendarDays/> : <FileText/>}</div><div className="approval-copy"><div><Badge>{approval.type}</Badge><Badge tone={approval.risk === "Low" ? "green" : "red"}>{approval.risk} risk</Badge></div><h2>{approval.title}</h2><p>{approval.rationale}</p></div><div className="approval-actions"><Badge tone={approval.status === "Approved" ? "green" : approval.status === "Rejected" ? "red" : "blue"}>{approval.status}</Badge><button onClick={() => updateApproval(index, "Approved")}>Approve</button><button onClick={() => updateApproval(index, "Rejected")}>Reject</button></div></article>)}</section>}

        {view === "Settings" && <section className="settings-grid"><div className="panel"><span className="eyebrow">Profile</span><h2>Marcus Hendricks</h2><p>Founder, CEO, and principal operator.</p><div className="setting-row"><span>Daily briefing</span><b>8:00 AM</b></div><div className="setting-row"><span>Primary timezone</span><b>America/Chicago</b></div></div><div className="panel"><span className="eyebrow">Connections</span><h2>Systems ACE can operate</h2>{["Google Calendar", "Gmail", "Google Drive", "Contacts", "Finance", "E-signature"].map((item) => <div className="connection" key={item}><span>{item}<small>Not connected</small></span><button>Connect</button></div>)}</div><div className="panel wide"><span className="eyebrow">Authority policy</span><h2>Delegation boundaries</h2><div className="policy-grid">{[["Observe", "Read and summarize"],["Recommend", "Suggest a next action"],["Prepare", "Draft and configure"],["Ask once", "Execute after approval"],["Delegated", "Execute inside a defined policy"],["Prohibited", "Never execute"]].map(([a,b]) => <div key={a}><b>{a}</b><span>{b}</span></div>)}</div></div></section>}
      </section>
    </main>
  );
}
