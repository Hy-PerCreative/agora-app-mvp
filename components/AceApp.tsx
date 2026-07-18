"use client";

import type { ElementType, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Archive,
  Brain,
  CalendarDays,
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
  X,
} from "lucide-react";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  seedActivities,
  seedApprovals,
  seedConnections,
  seedDecisions,
  seedMemories,
  seedProjects,
} from "../lib/seed";
import type {
  ApprovalStatus,
  ConnectionRecord,
  DecisionStatus,
  MemoryRecord,
  ProjectState,
  View,
} from "../lib/types";

const navigation: { label: View; icon: ElementType }[] = [
  { label: "Today", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Decisions", icon: Brain },
  { label: "Memory", icon: Archive },
  { label: "Approvals", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

const projectFilters: ("All" | ProjectState)[] = ["All", "Active", "Waiting", "Stalled", "Someday"];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: ElementType }) {
  return (
    <div className="metric">
      <div className="metric-icon"><Icon size={18} /></div>
      <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "blue" | "green" | "red" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default function AceApp() {
  const [view, setView] = useState<View>("Today");
  const [menuOpen, setMenuOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("ACE is ready. Ask for a plan, brief, decision, or action.");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<"All" | ProjectState>("All");
  const [modal, setModal] = useState<"project" | "memory" | "connection" | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionRecord | null>(null);
  const [todayLabel, setTodayLabel] = useState("Today");

  const [projects, setProjects] = usePersistentState("ace.projects", seedProjects);
  const [decisions, setDecisions] = usePersistentState("ace.decisions", seedDecisions);
  const [approvals, setApprovals] = usePersistentState("ace.approvals", seedApprovals);
  const [memories, setMemories] = usePersistentState("ace.memories", seedMemories);
  const [activities, setActivities] = usePersistentState("ace.activities", seedActivities);
  const [connections, setConnections] = usePersistentState("ace.connections", seedConnections);

  const [projectDraft, setProjectDraft] = useState({ name: "", objective: "", nextAction: "" });
  const [memoryDraft, setMemoryDraft] = useState({ type: "Idea" as MemoryRecord["type"], text: "", source: "Marcus" });

  useEffect(() => {
    setTodayLabel(new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago",
    }).format(new Date()));
  }, []);

  const visibleProjects = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return projects.filter((project) => {
      const matchesFilter = projectFilter === "All" || project.state === projectFilter;
      const matchesSearch = !normalized || `${project.name} ${project.objective} ${project.nextAction}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesSearch;
    });
  }, [projectFilter, projects, search]);

  const visibleMemories = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    if (!normalized) return memories;
    return memories.filter((memory) => `${memory.type} ${memory.text} ${memory.source} ${memory.connectedEntities.join(" ")}`.toLowerCase().includes(normalized));
  }, [memories, search]);

  function recordActivity(action: string, detail: string) {
    setActivities((items) => [{ id: createId("activity"), action, detail, createdAt: new Date().toISOString() }, ...items].slice(0, 50));
  }

  function changeView(nextView: View) {
    setView(nextView);
    setSearch("");
    setMenuOpen(false);
  }

  function runCommand(event?: FormEvent) {
    event?.preventDefault();
    const text = command.trim();
    if (!text) return;
    const lowered = text.toLowerCase();
    let answer: string;

    if (lowered.includes("priority") || lowered.includes("today")) {
      answer = "Your highest-leverage move is to finish ACE's operating foundation, then resolve Agora's structure. Protect one uninterrupted block before adding new commitments.";
    } else if (lowered.includes("neglect") || lowered.includes("stalled")) {
      answer = "The Marcus Hendricks Show is the clearest neglected asset. It has strategic value but no operating cadence. Choose one repeatable weekly format.";
    } else if (lowered.includes("calendar") || lowered.includes("schedule")) {
      answer = "Preserve Thursday afternoon for deep work, limit the day to three meetings, and add buffers around consequential conversations.";
    } else if (lowered.includes("agora")) {
      answer = "Agora is blocked less by vision than sequencing. Decide the membership product, legal constraints, and one local pilot before expanding the capital thesis.";
    } else {
      answer = `I captured “${text}.” Convert it into one owner, one deadline, and one next physical action before it becomes another open loop.`;
    }

    setResponse(answer);
    recordActivity("ACE command completed", text);
    setCommand("");
  }

  function updateDecision(id: string, status: DecisionStatus) {
    setDecisions((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    recordActivity("Decision updated", `${id} → ${status}`);
  }

  function updateApproval(id: string, status: ApprovalStatus) {
    setApprovals((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    recordActivity("Approval updated", `${id} → ${status}`);
  }

  function addProject(event: FormEvent) {
    event.preventDefault();
    if (!projectDraft.name.trim() || !projectDraft.objective.trim() || !projectDraft.nextAction.trim()) return;
    const project = {
      id: createId("project"),
      name: projectDraft.name.trim(),
      objective: projectDraft.objective.trim(),
      state: "Active" as const,
      health: 65,
      nextAction: projectDraft.nextAction.trim(),
      owner: "Marcus",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setProjects((items) => [project, ...items]);
    recordActivity("Project created", project.name);
    setProjectDraft({ name: "", objective: "", nextAction: "" });
    setModal(null);
  }

  function addMemory(event: FormEvent) {
    event.preventDefault();
    if (!memoryDraft.text.trim()) return;
    const memory: MemoryRecord = {
      id: createId("memory"),
      type: memoryDraft.type,
      text: memoryDraft.text.trim(),
      source: memoryDraft.source.trim() || "Marcus",
      confidence: "High",
      connectedEntities: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setMemories((items) => [memory, ...items]);
    recordActivity("Memory added", memory.text);
    setMemoryDraft({ type: "Idea", text: "", source: "Marcus" });
    setModal(null);
  }

  function planConnection() {
    if (!selectedConnection) return;
    setConnections((items) => items.map((item) => item.id === selectedConnection.id ? { ...item, status: "Setup planned" } : item));
    recordActivity("Integration setup planned", selectedConnection.name);
    setModal(null);
    setSelectedConnection(null);
  }

  function resetDemo() {
    setProjects(seedProjects);
    setDecisions(seedDecisions);
    setApprovals(seedApprovals);
    setMemories(seedMemories);
    setActivities(seedActivities);
    setConnections(seedConnections);
    setResponse("ACE demo data was reset.");
  }

  const openDecisions = decisions.filter((decision) => decision.status === "Open");
  const pendingApprovals = approvals.filter((approval) => approval.status === "Pending");

  return (
    <main className="shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A</div>
          <div><strong>ACE</strong><span>Executive operating system</span></div>
          <button type="button" className="close-menu" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X /></button>
        </div>
        <nav>
          {navigation.map(({ label, icon: Icon }) => (
            <button type="button" key={label} className={view === label ? "active" : ""} onClick={() => changeView(label)}>
              <Icon size={19} /><span>{label}</span>{label === "Approvals" && <em>{pendingApprovals.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot"><span className="status-dot" />Demo intelligence<div>External systems are not connected</div></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button type="button" className="menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
          <div><span className="eyebrow">ACE / {view}</span><h1>{view === "Today" ? "Good morning, Marcus." : view}</h1></div>
          <div className="profile" aria-label="Marcus Hendricks profile">MH</div>
        </header>

        {view === "Today" && (
          <>
            <form className="command-card" onSubmit={runCommand}>
              <div className="command-label"><Sparkles size={17} /> Ask ACE <Badge tone="blue">Demo intelligence</Badge></div>
              <div className="command-row">
                <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Plan, prepare, organize, or act…" />
                <button type="submit"><Command size={18} /> Run</button>
              </div>
              <p>{response}</p>
            </form>

            <div className="metrics">
              <Metric label="Deep-work capacity" value="3.5 hours" detail="Best window: 1:00–4:30" icon={Gauge} />
              <Metric label="Open decisions" value={String(openDecisions.length)} detail="One due today" icon={Brain} />
              <Metric label="Pending approvals" value={String(pendingApprovals.length)} detail="External actions remain gated" icon={ShieldCheck} />
            </div>

            <section className="grid two-one">
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">ACE brief</span><h2>What matters now</h2></div><Badge tone="blue">{todayLabel}</Badge></div>
                <p className="brief">You are not short on vision. The constraint is operating capacity. Reduce open loops: establish ACE, resolve the next Agora decision, and preserve unstructured thinking time.</p>
                <div className="priority-list">
                  {[
                    ["1", "Establish ACE as the control layer", "A functioning operating system reduces the coordination burden across every other venture.", "Finish repository rehabilitation and define the first live integration."],
                    ["2", "Resolve Agora's next form", "Product, legal, and membership decisions are currently entangled.", "Write a one-page sequencing decision."],
                    ["3", "Do not fill all available capacity", "Your ability to notice and synthesize is an operating asset, not unused time.", "Keep one block unassigned."],
                  ].map(([number, title, reason, next]) => (
                    <div className="priority" key={number}><strong>{number}</strong><div><h3>{title}</h3><p>{reason}</p><small>Next: {next}</small></div></div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">Schedule</span><h2>Today</h2></div><CalendarDays size={20} /></div>
                <div className="timeline">
                  <div><time>9:00</time><span><b>Weekly orientation</b><small>Review projects and choose constraints</small></span></div>
                  <div><time>11:00</time><span><b>Open work block</b><small>ACE build and operating design</small></span></div>
                  <div><time>1:00</time><span><b>Protected deep work</b><small>Recommended: no meetings</small></span></div>
                  <div><time>5:30</time><span><b>Recovery / movement</b><small>Preserve energy before evening</small></span></div>
                </div>
              </div>
            </section>

            <section className="grid half">
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">Needs your judgment</span><h2>Decision queue</h2></div><button type="button" className="text-button" onClick={() => changeView("Decisions")}>View all <ChevronRight size={16} /></button></div>
                {openDecisions.slice(0, 2).map((decision) => (
                  <div className="queue-item" key={decision.id}><div><Badge tone={decision.urgency === "Today" ? "red" : "neutral"}>{decision.urgency}</Badge><h3>{decision.question}</h3><p>{decision.recommendation}</p></div><span className="confidence">{decision.confidence}%</span></div>
                ))}
              </div>
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">Recent activity</span><h2>What ACE changed</h2></div><Activity size={20} /></div>
                <div className="activity-feed">
                  {activities.slice(0, 4).map((activity) => <div key={activity.id}><b>{activity.action}</b><span>{activity.detail}</span></div>)}
                </div>
              </div>
            </section>
          </>
        )}

        {view === "Projects" && (
          <section>
            <div className="section-tools">
              <div className="search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" /></div>
              <button type="button" className="primary" onClick={() => setModal("project")}>+ New project</button>
            </div>
            <div className="filter-row">{projectFilters.map((filter) => <button type="button" key={filter} className={projectFilter === filter ? "active" : ""} onClick={() => setProjectFilter(filter)}>{filter}</button>)}</div>
            <div className="project-grid">
              {visibleProjects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-top"><Badge tone={project.state === "Active" ? "green" : project.state === "Stalled" ? "red" : "neutral"}>{project.state}</Badge><span>{project.health}% health</span></div>
                  <h2>{project.name}</h2><p>{project.objective}</p><div className="progress"><i style={{ width: `${project.health}%` }} /></div>
                  <small>Next action</small><strong className="next-action">{project.nextAction}</strong><small className="owner-line">Owner: {project.owner}</small>
                  {project.blocker && <div className="blocker"><b>Blocker</b>{project.blocker}</div>}
                </article>
              ))}
            </div>
            {visibleProjects.length === 0 && <div className="empty-state">No projects match the current filters.</div>}
          </section>
        )}

        {view === "Decisions" && (
          <section className="stack">
            {decisions.map((decision) => (
              <article className="decision-card" key={decision.id}>
                <div className="decision-main"><div className="decision-meta"><Badge tone={decision.urgency === "Today" ? "red" : "neutral"}>{decision.urgency}</Badge><span>{decision.project}</span><span>{decision.confidence}% confidence</span><span>{decision.reversibility} to reverse</span></div><h2>{decision.question}</h2><p><b>ACE recommends:</b> {decision.recommendation}</p><small>Deadline: {decision.deadline}</small></div>
                <div className="decision-actions"><Badge tone={decision.status === "Approved" ? "green" : decision.status === "Rejected" ? "red" : "blue"}>{decision.status}</Badge><div><button type="button" onClick={() => updateDecision(decision.id, "Approved")}>Approve</button><button type="button" onClick={() => updateDecision(decision.id, "Deferred")}>Defer</button><button type="button" onClick={() => updateDecision(decision.id, "Rejected")}>Reject</button></div></div>
              </article>
            ))}
          </section>
        )}

        {view === "Memory" && (
          <section>
            <div className="section-tools"><div className="search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search principles, projects, commitments, and ideas" /></div><button type="button" className="primary" onClick={() => setModal("memory")}>+ Add memory</button></div>
            <div className="memory-grid">{visibleMemories.map((memory) => <article className="memory-card" key={memory.id}><div><Badge tone="blue">{memory.type}</Badge><Badge>{memory.confidence} confidence</Badge></div><blockquote>“{memory.text}”</blockquote><small>Source: {memory.source}</small><small>Connected: {memory.connectedEntities.join(", ") || "None yet"}</small></article>)}</div>
          </section>
        )}

        {view === "Approvals" && (
          <section className="stack">
            <div className="authority"><ShieldCheck /><div><span className="eyebrow">Current authority level</span><h2>Prepare and ask once</h2><p>ACE may observe, recommend, and prepare actions. External actions still require approval.</p></div></div>
            {approvals.map((approval) => (
              <article className="approval-card" key={approval.id}>
                <div className="approval-icon">{approval.type === "Email draft" ? <MessageSquareText /> : approval.type === "Calendar change" ? <CalendarDays /> : <FileText />}</div>
                <div className="approval-copy"><div><Badge>{approval.type}</Badge><Badge tone={approval.risk === "Low" ? "green" : "red"}>{approval.risk} risk</Badge></div><h2>{approval.title}</h2><p>{approval.rationale}</p><small>Systems: {approval.systems.join(", ")}</small></div>
                <div className="approval-actions"><Badge tone={approval.status === "Approved" ? "green" : approval.status === "Rejected" ? "red" : "blue"}>{approval.status}</Badge><button type="button" onClick={() => updateApproval(approval.id, "Approved")}>Approve</button><button type="button" onClick={() => updateApproval(approval.id, "Rejected")}>Reject</button></div>
              </article>
            ))}
          </section>
        )}

        {view === "Settings" && (
          <section className="settings-grid">
            <div className="panel"><span className="eyebrow">Profile</span><h2>Marcus Hendricks</h2><p>Founder, CEO, and principal operator.</p><div className="setting-row"><span>Daily briefing</span><b>8:00 AM</b></div><div className="setting-row"><span>Primary timezone</span><b>America/Chicago</b></div></div>
            <div className="panel"><span className="eyebrow">Connections</span><h2>Systems ACE can operate</h2>{connections.map((connection) => <div className="connection" key={connection.id}><span>{connection.name}<small>{connection.status}</small></span><button type="button" onClick={() => { setSelectedConnection(connection); setModal("connection"); }}>Setup</button></div>)}</div>
            <div className="panel wide"><span className="eyebrow">Authority policy</span><h2>Delegation boundaries</h2><div className="policy-grid">{[["Observe", "Read and summarize"], ["Recommend", "Suggest a next action"], ["Prepare", "Draft and configure"], ["Ask once", "Execute after approval"], ["Delegated", "Execute inside a defined policy"], ["Prohibited", "Never execute"]].map(([name, description]) => <div key={name}><b>{name}</b><span>{description}</span></div>)}</div></div>
            <div className="panel wide danger-zone"><span className="eyebrow">Demo controls</span><h2>Reset local ACE data</h2><p>This clears changes stored in this browser and restores the seeded MVP.</p><button type="button" className="danger" onClick={resetDemo}>Reset demo data</button></div>
          </section>
        )}
      </section>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
          <div className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close dialog" onClick={() => setModal(null)}><X /></button>
            {modal === "project" && <form onSubmit={addProject}><span className="eyebrow">Projects</span><h2>Create a project</h2><label>Name<input value={projectDraft.name} onChange={(event) => setProjectDraft((draft) => ({ ...draft, name: event.target.value }))} required /></label><label>Objective<textarea value={projectDraft.objective} onChange={(event) => setProjectDraft((draft) => ({ ...draft, objective: event.target.value }))} required /></label><label>Next action<input value={projectDraft.nextAction} onChange={(event) => setProjectDraft((draft) => ({ ...draft, nextAction: event.target.value }))} required /></label><button type="submit" className="primary">Create project</button></form>}
            {modal === "memory" && <form onSubmit={addMemory}><span className="eyebrow">Memory</span><h2>Add structured memory</h2><label>Type<select value={memoryDraft.type} onChange={(event) => setMemoryDraft((draft) => ({ ...draft, type: event.target.value as MemoryRecord["type"] }))}>{["Principle", "Identity", "Operating rule", "Vision", "Commitment", "Idea"].map((type) => <option key={type}>{type}</option>)}</select></label><label>Memory<textarea value={memoryDraft.text} onChange={(event) => setMemoryDraft((draft) => ({ ...draft, text: event.target.value }))} required /></label><label>Source<input value={memoryDraft.source} onChange={(event) => setMemoryDraft((draft) => ({ ...draft, source: event.target.value }))} /></label><button type="submit" className="primary">Add memory</button></form>}
            {modal === "connection" && selectedConnection && <div><span className="eyebrow">Integration setup</span><h2>{selectedConnection.name}</h2><p>{selectedConnection.description}</p><div className="notice"><ShieldCheck size={18} /><span>This button records the integration plan only. It does not create a live connection or request credentials.</span></div><button type="button" className="primary" onClick={planConnection}>Mark setup as planned</button></div>}
          </div>
        </div>
      )}
    </main>
  );
}
