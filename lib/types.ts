export type View = "Today" | "Projects" | "Decisions" | "Memory" | "Approvals" | "Settings";

export type ProjectState = "Active" | "Waiting" | "Stalled" | "Someday";
export type DecisionStatus = "Open" | "Approved" | "Deferred" | "Rejected";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type RiskLevel = "Low" | "Medium" | "High";
export type ConnectionStatus = "Not connected" | "Setup planned";

export interface Project {
  id: string;
  name: string;
  objective: string;
  state: ProjectState;
  health: number;
  nextAction: string;
  owner: string;
  blocker?: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  question: string;
  project: string;
  recommendation: string;
  urgency: "Today" | "This week" | "Later";
  confidence: number;
  reversibility: "Easy" | "Moderate" | "Hard";
  deadline: string;
  status: DecisionStatus;
}

export interface Approval {
  id: string;
  title: string;
  type: "Email draft" | "Calendar change" | "Document" | "Payment" | "Project update";
  rationale: string;
  risk: RiskLevel;
  systems: string[];
  status: ApprovalStatus;
}

export interface MemoryRecord {
  id: string;
  type: "Principle" | "Identity" | "Operating rule" | "Vision" | "Commitment" | "Idea";
  text: string;
  source: string;
  confidence: "High" | "Medium" | "Low";
  connectedEntities: string[];
  createdAt: string;
}

export interface ActivityRecord {
  id: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface ConnectionRecord {
  id: string;
  name: string;
  description: string;
  status: ConnectionStatus;
}
