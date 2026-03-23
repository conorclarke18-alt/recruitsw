"use client";
import { useState, useMemo } from "react";
import { useData, Candidate, Vacancy, VisaType, RTWStatus as RTWStatusType, CompStatus } from "./DataStore";
import CreateVacancyForm from "./CreateVacancyForm";
import AddCandidateForm from "./AddCandidateForm";
import {
  Shield, BarChart3, Users, Briefcase, FileCheck, Clock, AlertTriangle,
  ChevronRight, Search, Filter, Plus, Upload, Send, Eye, CheckCircle2,
  XCircle, AlertCircle, Building2, Globe, Phone, Mail, Star, TrendingUp,
  Calendar, MapPin, Banknote, FileText, UserCheck, Download, RefreshCw,
  Plane, Flag, CircleDot
} from "lucide-react";

function VisaBadge({ visa }: { visa: string }) {
  switch (visa) {
    case "british_citizen":
      return <span className="badge badge-green">British Citizen</span>;
    case "settled_status":
      return <span className="badge badge-green">Settled Status</span>;
    case "skilled_worker":
      return <span className="badge badge-amber">Skilled Worker Visa</span>;
    case "graduate_visa":
      return <span className="badge badge-amber">Graduate Visa</span>;
    case "spouse_visa":
      return <span className="badge badge-green">Spouse Visa</span>;
    case "health_care_visa":
      return <span className="badge badge-amber">Health & Care Visa</span>;
    case "pre_settled":
      return <span className="badge badge-green">Pre-Settled Status</span>;
    default:
      return <span className="badge badge-gray">Unknown</span>;
  }
}

function RTWStatusBadge({ rtw, visa }: { rtw: string; visa: string }) {
  if (rtw === "verified" && (visa === "british_citizen" || visa === "settled_status" || visa === "spouse_visa"))
    return <span className="badge badge-green"><CheckCircle2 size={12} /> RTW Verified</span>;
  if (rtw === "requires_sponsorship")
    return <span className="badge badge-amber"><AlertTriangle size={12} /> Needs Sponsorship</span>;
  if (rtw === "time_limited")
    return <span className="badge badge-amber"><Clock size={12} /> Time-Limited</span>;
  if (rtw === "verified")
    return <span className="badge badge-green"><CheckCircle2 size={12} /> RTW Verified</span>;
  if (rtw === "expired")
    return <span className="badge badge-red"><XCircle size={12} /> Expired</span>;
  return <span className="badge badge-gray"><Clock size={12} /> Pending</span>;
}

const vacancyStatuses: Vacancy["status"][] = ["draft", "live", "interviewing", "offer", "filled", "closed"];
const candidateStatuses: Candidate["status"][] = ["new", "screening", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "live": case "active": case "hired": case "done": return "badge-green";
    case "interviewing": case "screening": case "shortlisted": return "badge-blue";
    case "offer": case "offered": return "badge-purple";
    case "filled": return "badge-green";
    case "closed": case "rejected": case "withdrawn": return "badge-gray";
    case "new": return "badge-blue";
    case "draft": return "badge-gray";
    default: return "badge-gray";
  }
}

export default function PSPView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCreateVacancy, setShowCreateVacancy] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Command Centre", icon: <BarChart3 size={16} /> },
    { id: "vacancies", label: "Vacancies", icon: <Briefcase size={16} /> },
    { id: "candidates", label: "Candidates", icon: <Users size={16} /> },
    { id: "compliance", label: "Compliance Hub", icon: <FileCheck size={16} /> },
    { id: "retention", label: "Retention", icon: <TrendingUp size={16} /> },
    { id: "settings", label: "Settings", icon: <Shield size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <CreateVacancyForm open={showCreateVacancy} onClose={() => setShowCreateVacancy(false)} />
      <AddCandidateForm open={showAddCandidate} onClose={() => setShowAddCandidate(false)} />

      {/* Top Nav */}
      <header style={{ background: "var(--psp-green-dark)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Shield size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>RecruitSW</span>
          <span style={{ color: "var(--psp-gold)", fontSize: 12, fontWeight: 600, background: "rgba(212,168,67,0.2)", padding: "2px 8px", borderRadius: 4 }}>PSP ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <HeaderStats />
          <div style={{ width: 32, height: 32, background: "var(--psp-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "var(--psp-green-dark)" }}>CC</div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tab-nav" style={{ background: "white" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => { setActiveTab(tab.id); setSelectedCandidate(null); }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{tab.icon} {tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {activeTab === "dashboard" && <DashboardTab onCreateVacancy={() => setShowCreateVacancy(true)} onAddCandidate={() => setShowAddCandidate(true)} />}
        {activeTab === "vacancies" && <VacanciesTab onCreateVacancy={() => setShowCreateVacancy(true)} />}
        {activeTab === "candidates" && (
          selectedCandidate
            ? <CandidateDetail candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />
            : <CandidatesTab onSelectCandidate={setSelectedCandidate} onAddCandidate={() => setShowAddCandidate(true)} />
        )}
        {activeTab === "compliance" && <ComplianceTab />}
        {activeTab === "retention" && <RetentionTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function HeaderStats() {
  const { vacancies, candidates } = useData();
  const activeVacancies = vacancies.filter(v => v.status === "live" || v.status === "interviewing" || v.status === "offer").length;
  const uniqueCouncils = new Set(vacancies.map(v => v.council)).size;
  return (
    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{uniqueCouncils} councils &middot; {activeVacancies} active vacancies</span>
  );
}

function DashboardTab({ onCreateVacancy, onAddCandidate }: { onCreateVacancy: () => void; onAddCandidate: () => void }) {
  const { vacancies, candidates, showToast } = useData();

  const activeVacancies = vacancies.filter(v => v.status === "live" || v.status === "interviewing" || v.status === "offer").length;
  const candidatesInPipeline = candidates.filter(c => c.status !== "hired" && c.status !== "rejected" && c.status !== "withdrawn").length;
  const awaitingInterview = candidates.filter(c => c.status === "shortlisted" || c.status === "interviewing").length;
  const offersThisMonth = candidates.filter(c => c.status === "offered" || c.status === "hired").length;
  const avgDaysOpen = vacancies.length > 0 ? Math.round(vacancies.reduce((sum, v) => sum + v.daysOpen, 0) / vacancies.length) : 0;

  const noSponsorCount = candidates.filter(c => c.visa === "british_citizen" || c.visa === "settled_status" || c.visa === "spouse_visa" || c.visa === "pre_settled").length;
  const requiresSponsorCount = candidates.filter(c => c.rtw === "requires_sponsorship").length;
  const expiringCount = candidates.filter(c => {
    if (!c.visaExpiry) return false;
    const exp = new Date(c.visaExpiry);
    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    return exp < sixMonths;
  }).length;
  const pendingRtwCount = candidates.filter(c => c.rtw === "pending").length;

  // Council overview computed from real data
  const councilMap = useMemo(() => {
    const map = new Map<string, { vacancies: number; candidates: number; compChecks: number; compTotal: number }>();
    for (const v of vacancies) {
      const c = v.council;
      if (!map.has(c)) map.set(c, { vacancies: 0, candidates: 0, compChecks: 0, compTotal: 0 });
      map.get(c)!.vacancies++;
    }
    for (const cand of candidates) {
      if (cand.assignedVacancy) {
        const vac = vacancies.find(v => v.id === cand.assignedVacancy);
        if (vac) {
          const council = vac.council;
          if (!map.has(council)) map.set(council, { vacancies: 0, candidates: 0, compChecks: 0, compTotal: 0 });
          const entry = map.get(council)!;
          entry.candidates++;
          const checks = [cand.sweStatus === "active", cand.dbs === "done", cand.ref1 === "done", cand.ref2 === "done", cand.rtw === "verified", cand.quals === "done"];
          entry.compTotal += checks.length;
          entry.compChecks += checks.filter(Boolean).length;
        }
      }
    }
    return map;
  }, [vacancies, candidates]);

  const councilOverview = useMemo(() => {
    const councils = Array.from(councilMap.entries()).map(([name, data]) => ({
      name,
      vacancies: data.vacancies,
      candidates: data.candidates,
      compliance: data.compTotal > 0 ? Math.round((data.compChecks / data.compTotal) * 100) : 100,
      status: "active" as const,
    }));
    return councils.sort((a, b) => b.vacancies - a.vacancies);
  }, [councilMap]);

  // Urgent actions from real data
  const urgentActions = useMemo(() => {
    const actions: { text: string; type: "visa" | "compliance"; council: string }[] = [];
    for (const c of candidates) {
      if (c.rtw === "requires_sponsorship") {
        const vac = c.assignedVacancy ? vacancies.find(v => v.id === c.assignedVacancy) : null;
        const council = vac ? vac.council : "Unassigned";
        if (c.visa === "skilled_worker") {
          actions.push({ text: `${c.name} — Skilled Worker Visa requires council sponsorship confirmation before start date`, type: "visa", council });
        } else if (c.visa === "health_care_visa") {
          actions.push({ text: `${c.name} — Health & Care Visa candidate — verify council holds sponsor licence`, type: "visa", council });
        }
      }
      if (c.rtw === "time_limited") {
        const vac = c.assignedVacancy ? vacancies.find(v => v.id === c.assignedVacancy) : null;
        const council = vac ? vac.council : "Unassigned";
        actions.push({ text: `${c.name} — Graduate Visa expires ${c.visaExpiry || "soon"} — flag to council re: sponsorship for extension`, type: "visa", council });
      }
      if (c.dbs === "pending") {
        actions.push({ text: `${c.name} — DBS application pending — follow up`, type: "compliance", council: "Multiple" });
      }
      if (c.ref2 === "warning" || c.ref2 === "pending") {
        actions.push({ text: `${c.name} — Reference 2 outstanding — manual follow-up needed`, type: "compliance", council: "Multiple" });
      }
    }
    return actions.slice(0, 6);
  }, [candidates, vacancies]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Command Centre</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={onAddCandidate}><Plus size={16} /> Add Candidate</button>
          <button className="btn btn-primary" onClick={onCreateVacancy}><Plus size={16} /> Create Vacancy</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--psp-green)" }}>{activeVacancies}</span><span className="stat-label">Active Vacancies</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-blue)" }}>{candidatesInPipeline}</span><span className="stat-label">Candidates in Pipeline</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-amber)" }}>{awaitingInterview}</span><span className="stat-label">Awaiting Interview</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>{offersThisMonth}</span><span className="stat-label">Offers Made This Month</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "#7c3aed" }}>{avgDaysOpen}</span><span className="stat-label">Days Avg Time-to-Hire</span></div>
      </div>

      {/* Visa Sponsorship Summary */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Plane size={20} color="var(--status-amber)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visa & Sponsorship Summary</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-green)" }}>{noSponsorCount}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>No Sponsorship Needed</div>
          </div>
          <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-amber)" }}>{requiresSponsorCount}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Require Sponsorship</div>
          </div>
          <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-red)" }}>{expiringCount}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Visa Expiring &lt;6 Months</div>
          </div>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-blue)" }}>{pendingRtwCount}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Awaiting RTW Verification</div>
          </div>
        </div>
      </div>

      {/* Urgent Actions */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-red)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={18} color="var(--status-red)" /> Urgent Actions
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {urgentActions.length === 0 && (
            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "var(--status-green)" }}>No urgent actions at this time.</div>
          )}
          {urgentActions.map((action, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: action.type === "visa" ? "#fffbeb" : "#fef2f2", borderRadius: 8 }}>
              {action.type === "visa" ? <Plane size={16} color="var(--status-amber)" /> : <AlertCircle size={16} color="var(--status-red)" />}
              <span style={{ flex: 1, fontSize: 13 }}>{action.text}</span>
              <span className="badge badge-gray">{action.council}</span>
              <button className="btn btn-outline btn-sm" onClick={() => showToast(`Action noted: ${action.text.split(" — ")[0]}`, "info")}>Action</button>
            </div>
          ))}
        </div>
      </div>

      {/* Council Overview */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Council Overview</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Council</th>
                <th>Active Vacancies</th>
                <th>Candidates</th>
                <th>Compliance Rate</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {councilOverview.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}><Building2 size={14} style={{ display: "inline", marginRight: 6 }} />{c.name}</td>
                  <td>{c.vacancies}</td>
                  <td>{c.candidates}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-fill" style={{ width: `${c.compliance}%`, background: c.compliance >= 90 ? "var(--status-green)" : c.compliance >= 70 ? "var(--status-amber)" : "var(--status-red)" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{c.compliance}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${c.status === "active" ? "badge-green" : "badge-blue"}`}>{c.status}</span></td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => showToast(`Viewing ${c.name} details`, "info")}>View <ChevronRight size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VacanciesTab({ onCreateVacancy }: { onCreateVacancy: () => void }) {
  const { vacancies, updateVacancy, showToast } = useData();
  const [expandedVacancy, setExpandedVacancy] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = filterStatus === "all" ? vacancies : vacancies.filter(v => v.status === filterStatus);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>All Vacancies</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "white" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {vacancyStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button className="btn btn-primary" onClick={onCreateVacancy}><Plus size={16} /> Create Vacancy</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Council</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Shortlisted</th>
              <th>Days Open</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <>
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, color: "var(--psp-green)" }}>{v.id}</td>
                  <td>{v.council}</td>
                  <td style={{ fontWeight: 500 }}>{v.role}</td>
                  <td style={{ fontSize: 13 }}>{v.salary}</td>
                  <td>
                    <select
                      className={`badge ${statusBadgeClass(v.status)}`}
                      value={v.status}
                      onChange={(e) => updateVacancy(v.id, { status: e.target.value as Vacancy["status"] })}
                      style={{ cursor: "pointer", border: "none", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}
                    >
                      {vacancyStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{v.applicants}</td>
                  <td>{v.shortlisted}</td>
                  <td>
                    <span style={{ color: v.daysOpen > 25 ? "var(--status-red)" : v.daysOpen > 14 ? "var(--status-amber)" : "var(--status-green)", fontWeight: 600 }}>
                      {v.daysOpen}d
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setExpandedVacancy(expandedVacancy === v.id ? null : v.id)}>
                      {expandedVacancy === v.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expandedVacancy === v.id && (
                  <tr key={`${v.id}-detail`}>
                    <td colSpan={9} style={{ background: "#f8fafc", padding: 20 }}>
                      <VacancyDetail vacancy={v} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VacancyDetail({ vacancy: v }: { vacancy: Vacancy }) {
  const { candidates, updateVacancy, deleteVacancy, showToast } = useData();
  const assignedCandidates = candidates.filter(c => c.assignedVacancy === v.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{v.role}</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{v.council} &middot; {v.team} &middot; {v.grade}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => deleteVacancy(v.id)}>Delete</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Hiring Manager</p>
          <p style={{ fontWeight: 600 }}>{v.manager}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Salary</p>
          <p style={{ fontWeight: 600 }}>{v.salary}</p>
        </div>
      </div>
      {v.description && (
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Description</p>
          <p style={{ fontSize: 13 }}>{v.description}</p>
        </div>
      )}
      {v.essential && (
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Essential Criteria</p>
          <p style={{ fontSize: 13 }}>{v.essential}</p>
        </div>
      )}
      {v.desirable && (
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Desirable Criteria</p>
          <p style={{ fontSize: 13 }}>{v.desirable}</p>
        </div>
      )}
      {assignedCandidates.length > 0 && (
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Assigned Candidates ({assignedCandidates.length})</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {assignedCandidates.map(c => (
              <span key={c.id} className="badge badge-blue" style={{ padding: "4px 10px" }}>
                {c.name} &middot; {c.match}% match
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidatesTab({ onSelectCandidate, onAddCandidate }: { onSelectCandidate: (c: Candidate) => void; onAddCandidate: () => void }) {
  const { candidates, showToast } = useData();
  const [visaFilter, setVisaFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    let result = candidates;
    if (visaFilter === "needs_sponsorship") result = result.filter(c => c.rtw === "requires_sponsorship");
    else if (visaFilter === "time_limited") result = result.filter(c => c.rtw === "time_limited");
    else if (visaFilter === "clear") result = result.filter(c => c.visa === "british_citizen" || c.visa === "settled_status");
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term) || c.swe.toLowerCase().includes(term) || c.location.toLowerCase().includes(term));
    }
    return result;
  }, [candidates, visaFilter, searchTerm]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>All Candidates</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={() => showToast("CV upload coming soon", "info")}><Upload size={16} /> Upload CV</button>
          <button className="btn btn-primary" onClick={onAddCandidate}><Plus size={16} /> Add Candidate</button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search candidates by name, role, SWE, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }}
          />
        </div>
      </div>

      {/* Visa Filter Bar */}
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Plane size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: 13, fontWeight: 600, marginRight: 8 }}>Right to Work:</span>
          {[
            { id: "all", label: "All Candidates", count: candidates.length },
            { id: "needs_sponsorship", label: "Needs Sponsorship", count: candidates.filter(c => c.rtw === "requires_sponsorship").length },
            { id: "time_limited", label: "Time-Limited Visa", count: candidates.filter(c => c.rtw === "time_limited").length },
            { id: "clear", label: "No Sponsorship Needed", count: candidates.filter(c => c.visa === "british_citizen" || c.visa === "settled_status").length },
          ].map(f => (
            <button key={f.id} onClick={() => setVisaFilter(f.id)} className="btn btn-sm" style={{ background: visaFilter === f.id ? "var(--psp-green)" : "#f1f5f9", color: visaFilter === f.id ? "white" : "var(--text-primary)" }}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Target Role</th>
              <th>PQE</th>
              <th>SWE Status</th>
              <th>Visa / Right to Work</th>
              <th>Match</th>
              <th>Status</th>
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => onSelectCandidate(c)}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--psp-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{c.location} &middot; {c.available}</div>
                    </div>
                  </div>
                </td>
                <td>{c.role}</td>
                <td>{c.pqe}</td>
                <td><span className={`badge ${c.sweStatus === "active" ? "badge-green" : "badge-amber"}`}>{c.sweStatus}</span></td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <VisaBadge visa={c.visa} />
                    <RTWStatusBadge rtw={c.rtw} visa={c.visa} />
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: c.match >= 90 ? "var(--status-green)" : c.match >= 80 ? "var(--status-blue)" : "var(--status-amber)" }}>
                    {c.match}%
                  </span>
                </td>
                <td><span className={`badge ${statusBadgeClass(c.status)}`}>{c.status}</span></td>
                <td><span className="badge badge-gray">{c.source}</span></td>
                <td><Eye size={16} color="var(--text-secondary)" /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--text-secondary)" }}>No candidates match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidateDetail({ candidate: initialCandidate, onBack }: { candidate: Candidate; onBack: () => void }) {
  const { candidates, vacancies, updateCandidate, deleteCandidate, assignCandidate, showToast } = useData();
  // Always get the latest version of this candidate from state
  const c = candidates.find(cand => cand.id === initialCandidate.id) || initialCandidate;
  const assignedVacancy = c.assignedVacancy ? vacancies.find(v => v.id === c.assignedVacancy) : null;

  const handleStatusChange = (newStatus: Candidate["status"]) => {
    updateCandidate(c.id, { status: newStatus });
  };

  const handleAssign = (vacancyId: string) => {
    assignCandidate(c.id, vacancyId);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button className="btn btn-outline" onClick={onBack} style={{ alignSelf: "flex-start" }}>← Back to Candidates</button>

      {/* Header */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--psp-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
            {c.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>{c.name}</h2>
            <p style={{ color: "var(--text-secondary)" }}>{c.role} &middot; {c.pqe} PQE &middot; {c.location}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span className="badge badge-green">SWE: {c.swe}</span>
              <VisaBadge visa={c.visa} />
              {c.crossCouncil && <span className="badge badge-purple"><Flag size={12} /> Applied at another council</span>}
              <span className={`badge ${statusBadgeClass(c.status)}`}>Status: {c.status}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={() => showToast(`Calling ${c.name} at ${c.phone}...`, "info")}><Phone size={16} /> Call</button>
          <button className="btn btn-outline" onClick={() => showToast(`Opening email to ${c.email}...`, "info")}><Mail size={16} /> Email</button>
          <button className="btn btn-primary" onClick={() => showToast(`Submitting ${c.name} to council...`, "success")}><Send size={16} /> Submit to Council</button>
        </div>
      </div>

      {/* Status & Assignment */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pipeline Status & Assignment</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Current Status</p>
            <select
              value={c.status}
              onChange={(e) => handleStatusChange(e.target.value as Candidate["status"])}
              style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, width: "100%" }}
            >
              {candidateStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Assigned Vacancy</p>
            {assignedVacancy ? (
              <div>
                <span className="badge badge-blue" style={{ padding: "4px 10px" }}>{assignedVacancy.id} — {assignedVacancy.role}</span>
              </div>
            ) : (
              <select
                value=""
                onChange={(e) => { if (e.target.value) handleAssign(e.target.value); }}
                style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, width: "100%" }}
              >
                <option value="">Assign to vacancy...</option>
                {vacancies.filter(v => v.status === "live" || v.status === "interviewing").map(v => (
                  <option key={v.id} value={v.id}>{v.id} — {v.role} ({v.council})</option>
                ))}
              </select>
            )}
          </div>
        </div>
        {c.notes && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Notes</p>
            <p style={{ fontSize: 13, padding: 12, background: "#f8fafc", borderRadius: 8 }}>{c.notes}</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn btn-outline btn-sm" style={{ color: "var(--status-red)" }} onClick={() => { deleteCandidate(c.id); onBack(); }}>Remove Candidate</button>
        </div>
      </div>

      {/* Visa & Right to Work Detail */}
      <div className={`visa-tracker ${c.rtw === "requires_sponsorship" ? "needs-sponsor" : c.rtw === "verified" ? "has-rtw" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Plane size={20} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visa & Right to Work</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Immigration Status</p>
            <p style={{ fontWeight: 600 }}>{c.visaDetails}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Right to Work Status</p>
            <RTWStatusBadge rtw={c.rtw} visa={c.visa} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Sponsorship Required</p>
            <p style={{ fontWeight: 600 }}>
              {c.rtw === "requires_sponsorship" ? (
                <span style={{ color: "var(--status-amber)" }}>Yes — Council must hold a valid sponsor licence</span>
              ) : c.rtw === "time_limited" ? (
                <span style={{ color: "var(--status-amber)" }}>Not now, but will need sponsorship for extension</span>
              ) : (
                <span style={{ color: "var(--status-green)" }}>No</span>
              )}
            </p>
          </div>
          {c.visaExpiry && (
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Visa Expiry Date</p>
              <p style={{ fontWeight: 600 }}>{c.visaExpiry}</p>
            </div>
          )}
        </div>

        {(c.rtw === "requires_sponsorship" || c.rtw === "time_limited") && (
          <div style={{ marginTop: 16, padding: 12, background: "rgba(217,119,6,0.1)", borderRadius: 8, border: "1px solid rgba(217,119,6,0.3)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>Action Required</p>
            <ul style={{ fontSize: 12, color: "#92400e", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {c.rtw === "requires_sponsorship" && (
                <>
                  <li>Confirm council holds a valid <strong>Sponsor Licence</strong> with UKVI</li>
                  <li>Social Worker is on the <strong>Shortage Occupation List</strong> — eligible for Health & Care Worker visa</li>
                  <li>Council must issue a <strong>Certificate of Sponsorship (CoS)</strong> before start date</li>
                  <li>Minimum salary threshold: £20,960 or going rate, whichever is higher</li>
                  <li>Right to Work check must be completed via <strong>Employer Checking Service</strong> if no share code available</li>
                </>
              )}
              {c.rtw === "time_limited" && (
                <>
                  <li>Current visa allows employment — no immediate action needed</li>
                  <li>Set calendar reminder for <strong>6 months before expiry</strong> to discuss sponsorship</li>
                  <li>Council will need a <strong>Sponsor Licence</strong> if they wish to retain candidate after visa expires</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Compliance Grid */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Compliance Checklist</h3>
        <div className="compliance-grid">
          {[
            { label: "SWE Registration", field: "sweStatus" as const, status: c.sweStatus === "active" ? "done" : "warning", detail: c.swe },
            { label: "Enhanced DBS", field: "dbs" as const, status: c.dbs === "done" ? "done" : c.dbs === "warning" ? "warning" : "pending", detail: c.dbs === "done" ? "Clear" : c.dbs === "warning" ? "Issue" : "In progress" },
            { label: "Reference 1", field: "ref1" as const, status: c.ref1 === "done" ? "done" : c.ref1 === "warning" ? "warning" : "pending", detail: c.ref1 === "done" ? "Received" : c.ref1 === "warning" ? "Chasing" : "Pending" },
            { label: "Reference 2", field: "ref2" as const, status: c.ref2 === "done" ? "done" : c.ref2 === "warning" ? "warning" : "pending", detail: c.ref2 === "done" ? "Received" : c.ref2 === "warning" ? "Chasing" : "Pending" },
            { label: "Right to Work", field: "rtw" as const, status: c.rtw === "verified" ? "done" : "warning", detail: c.rtw === "verified" ? "Verified" : "Action needed" },
            { label: "Qualifications", field: "quals" as const, status: c.quals === "done" ? "done" : c.quals === "warning" ? "warning" : "pending", detail: c.quals === "done" ? "Verified" : c.quals === "warning" ? "Issue" : "Pending" },
          ].map((item, i) => (
            <div
              key={i}
              className="compliance-item"
              style={{ borderColor: item.status === "done" ? "#86efac" : item.status === "warning" ? "#fcd34d" : "#e2e8f0", cursor: "pointer" }}
              onClick={() => {
                if (item.field === "sweStatus") return;
                const currentVal = c[item.field];
                const compCycle: Record<string, CompStatus> = { pending: "done", done: "warning", warning: "pending", na: "pending" };
                const rtwCycle: Record<string, RTWStatusType> = { pending: "verified", verified: "requires_sponsorship", requires_sponsorship: "time_limited", time_limited: "expired", expired: "pending" };
                if (item.field === "rtw") {
                  updateCandidate(c.id, { rtw: rtwCycle[currentVal as string] || "pending" });
                } else {
                  updateCandidate(c.id, { [item.field]: compCycle[currentVal as string] || "pending" });
                }
              }}
            >
              {item.status === "done" ? <CheckCircle2 size={18} color="var(--status-green)" /> : item.status === "warning" ? <AlertTriangle size={18} color="var(--status-amber)" /> : <Clock size={18} color="var(--text-secondary)" />}
              <div>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>Click a compliance item to cycle its status.</p>
      </div>

      {/* GDPR Notice */}
      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Data Protection</strong> — Candidate data processed under Article 6(1)(e) public task (council recruitment) and 6(1)(b) pre-contractual steps.
          {c.crossCouncil && " Cross-council flag shown with candidate's explicit consent under Article 6(1)(a). Candidate can withdraw consent at any time."}
          {" "}Retention: 6 months post-decision for unsuccessful applications. DSAR requests via candidate portal.
        </div>
      </div>
    </div>
  );
}

function ComplianceTab() {
  const { candidates, vacancies, updateCandidate, showToast } = useData();

  // Find candidates who need visa/sponsorship tracking
  const visaCandidates = useMemo(() => {
    return candidates.filter(c =>
      c.visa === "skilled_worker" || c.visa === "health_care_visa" || c.visa === "graduate_visa" || c.visa === "spouse_visa"
    ).map(c => {
      const vac = c.assignedVacancy ? vacancies.find(v => v.id === c.assignedVacancy) : null;
      const council = vac ? vac.council : "Unassigned";
      const visaLabel = c.visa === "skilled_worker" ? "Skilled Worker" : c.visa === "health_care_visa" ? "Health & Care Worker" : c.visa === "graduate_visa" ? "Graduate" : c.visa === "spouse_visa" ? "Spouse" : c.visa;
      const sponsorship = c.rtw === "requires_sponsorship" ? "Required" : c.rtw === "time_limited" ? "Future" : "No";
      const licence = c.rtw === "requires_sponsorship" ? "Checking" : "N/A";
      const action = c.rtw === "requires_sponsorship" ? "Request CoS" : c.rtw === "time_limited" ? "Set reminder" : "None";
      return { id: c.id, name: c.name, visa: c.visa, visaLabel, expiry: c.visaExpiry, sponsorship, council, licence, action };
    });
  }, [candidates, vacancies]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Compliance Hub</h2>

      {/* Visa Sponsorship Tracker */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Plane size={20} color="var(--status-amber)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visa & Sponsorship Tracker</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Visa Type</th>
                <th>Expiry</th>
                <th>Sponsorship</th>
                <th>Council</th>
                <th>Council Has Sponsor Licence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visaCandidates.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td><VisaBadge visa={r.visa} /></td>
                  <td style={{ fontWeight: 600, color: r.expiry && new Date(r.expiry) < new Date("2027-06-01") ? "var(--status-amber)" : "inherit" }}>
                    {r.expiry || "N/A"}
                  </td>
                  <td>
                    <span className={`badge ${r.sponsorship === "Required" ? "badge-amber" : r.sponsorship === "Future" ? "badge-blue" : "badge-green"}`}>
                      {r.sponsorship}
                    </span>
                  </td>
                  <td>{r.council}</td>
                  <td>
                    <span className={`badge ${r.licence === "Yes" ? "badge-green" : r.licence === "Checking" ? "badge-amber" : "badge-gray"}`}>
                      {r.licence}
                    </span>
                  </td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => showToast(`${r.action} for ${r.name}`, "info")}>{r.action}</button></td>
                </tr>
              ))}
              {visaCandidates.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--text-secondary)" }}>No candidates requiring visa tracking.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>All Candidates — Compliance Status</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>SWE</th>
                <th>DBS</th>
                <th>Ref 1</th>
                <th>Ref 2</th>
                <th>Right to Work</th>
                <th>Quals</th>
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const checks = [c.sweStatus === "active", c.dbs === "done", c.ref1 === "done", c.ref2 === "done", c.rtw === "verified", c.quals === "done"];
                const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.sweStatus === "active" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <AlertTriangle size={16} color="var(--status-amber)" />}</td>
                    <td>{c.dbs === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>{c.ref1 === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>{c.ref2 === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : c.ref2 === "warning" ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>
                      {c.rtw === "verified" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <AlertTriangle size={16} color="var(--status-amber)" />}
                      {c.rtw === "requires_sponsorship" && <span style={{ fontSize: 10, color: "var(--status-amber)", display: "block" }}>Sponsor</span>}
                    </td>
                    <td>{c.quals === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--status-green)" : pct >= 66 ? "var(--status-amber)" : "var(--status-red)" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RetentionTab() {
  const { showToast } = useData();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Retention Tracking</h2>
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Active Placements — Milestone Tracker</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Council</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>Next Check-in</th>
                <th>Milestone 1</th>
                <th>Milestone 2</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Emily Rose", council: "Manchester CC", role: "Senior SW", start: "01/01/2026", nextCheckin: "Day 90 — 01/04/2026", m1: "3 months — £2,000", m1Status: "pending", m2: "12 months — £3,000", m2Status: "future", status: "on-track" },
                { name: "Tom Richards", council: "Salford CC", role: "Team Manager", start: "15/11/2025", nextCheckin: "6 months — 15/05/2026", m1: "3 months — £2,500", m1Status: "paid", m2: "12 months — £4,000", m2Status: "pending", status: "on-track" },
                { name: "Lisa Park", council: "Stockport MBC", role: "Social Worker", start: "03/02/2026", nextCheckin: "Day 30 — 05/03/2026", m1: "6 months — £1,500", m1Status: "future", m2: "12 months — £2,500", m2Status: "future", status: "monitoring" },
              ].map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.council}</td>
                  <td>{p.role}</td>
                  <td>{p.start}</td>
                  <td style={{ fontWeight: 500 }}>{p.nextCheckin}</td>
                  <td>
                    <span
                      className={`badge ${p.m1Status === "paid" ? "badge-green" : p.m1Status === "pending" ? "badge-amber" : "badge-gray"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => showToast(`Milestone 1 for ${p.name}: ${p.m1} (${p.m1Status})`, "info")}
                    >
                      {p.m1} — {p.m1Status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${p.m2Status === "paid" ? "badge-green" : p.m2Status === "pending" ? "badge-amber" : "badge-gray"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => showToast(`Milestone 2 for ${p.name}: ${p.m2} (${p.m2Status})`, "info")}
                    >
                      {p.m2} — {p.m2Status}
                    </span>
                  </td>
                  <td><span className={`badge ${p.status === "on-track" ? "badge-green" : "badge-amber"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { showToast } = useData();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Platform Settings</h2>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Council Management</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Council</th><th>Tier</th><th>SSO</th><th>Monthly Fee</th><th>Contract End</th><th></th></tr></thead>
            <tbody>
              {[
                { name: "Manchester City Council", tier: "Tier 3 — Managed", sso: "Azure AD", fee: "£2,495", end: "31/03/2027" },
                { name: "Salford City Council", tier: "Tier 2 — Professional", sso: "Azure AD", fee: "£995", end: "31/03/2027" },
                { name: "Stockport MBC", tier: "Tier 2 — Professional", sso: "Email + MFA", fee: "£995", end: "30/09/2026" },
                { name: "Trafford Council", tier: "Tier 1 — Starter (Pilot)", sso: "Email + MFA", fee: "Free pilot", end: "30/06/2026" },
              ].map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span className="badge badge-blue">{c.tier}</span></td>
                  <td>{c.sso}</td>
                  <td style={{ fontWeight: 600 }}>{c.fee}</td>
                  <td>{c.end}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => showToast(`Managing ${c.name}...`, "info")}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Authentication & Security</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><strong>Azure AD SSO</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Councils with Microsoft 365 can use existing credentials</span></div>
            <span className="badge badge-green">Enabled</span>
          </div>
          <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><strong>Emergency Access</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Temporary email + MFA login when SSO is unavailable. 24hr, fully audited.</span></div>
            <button className="btn btn-outline btn-sm" onClick={() => showToast("Emergency access configuration coming soon", "info")}>Configure</button>
          </div>
          <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><strong>Data Retention Policy</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>6 months post-decision. 12-month re-consent for talent pool.</span></div>
            <button className="btn btn-outline btn-sm" onClick={() => showToast("Data retention policy review opened", "info")}>Review</button>
          </div>
        </div>
      </div>

      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>GDPR Configuration</strong> — PSP operates as an independent data controller for cross-council matching under Article 6(1)(a) consent.
          Each council is a separate controller for their recruitment data under Article 6(1)(e) public task.
          Data Processing Agreements in place with all active councils. DPIA completed and reviewed annually.
        </div>
      </div>
    </div>
  );
}
