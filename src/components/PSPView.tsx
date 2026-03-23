"use client";
import { useState } from "react";
import {
  Shield, BarChart3, Users, Briefcase, FileCheck, Clock, AlertTriangle,
  ChevronRight, Search, Filter, Plus, Upload, Send, Eye, CheckCircle2,
  XCircle, AlertCircle, Building2, Globe, Phone, Mail, Star, TrendingUp,
  Calendar, MapPin, Banknote, FileText, UserCheck, Download, RefreshCw,
  Plane, Flag, CircleDot
} from "lucide-react";

// Demo data
const councils = [
  { name: "Manchester City Council", vacancies: 12, candidates: 34, compliance: 78, status: "active" },
  { name: "Salford City Council", vacancies: 8, candidates: 21, compliance: 85, status: "active" },
  { name: "Stockport MBC", vacancies: 5, candidates: 14, compliance: 92, status: "active" },
  { name: "Trafford Council", vacancies: 3, candidates: 8, compliance: 100, status: "pilot" },
];

const vacancies = [
  { id: "V-2024-001", council: "Manchester CC", role: "Senior Social Worker — Children's", grade: "Grade 10", salary: "£42,708 - £46,731", status: "live", applicants: 8, shortlisted: 3, daysOpen: 12 },
  { id: "V-2024-002", council: "Manchester CC", role: "Team Manager — Safeguarding", grade: "Grade 12", salary: "£52,805 - £56,024", status: "live", applicants: 4, shortlisted: 1, daysOpen: 21 },
  { id: "V-2024-003", council: "Salford CC", role: "ASYE Social Worker", grade: "Grade 8", salary: "£33,945 - £37,336", status: "live", applicants: 14, shortlisted: 5, daysOpen: 7 },
  { id: "V-2024-004", council: "Stockport MBC", role: "Practice Manager — Adults", grade: "Grade 11", salary: "£47,754 - £51,802", status: "interviewing", applicants: 6, shortlisted: 3, daysOpen: 28 },
  { id: "V-2024-005", council: "Manchester CC", role: "Social Worker — MASH", grade: "Grade 9", salary: "£37,336 - £40,476", status: "offer", applicants: 11, shortlisted: 4, daysOpen: 35 },
  { id: "V-2024-006", council: "Trafford", role: "Senior Practitioner — LAC", grade: "Grade 10", salary: "£42,708 - £46,731", status: "draft", applicants: 0, shortlisted: 0, daysOpen: 0 },
];

const candidates = [
  { name: "Sarah Mitchell", role: "Senior Social Worker", pqe: "6 years", swe: "SW98234", sweStatus: "active", match: 94, source: "PSP Network", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", dbs: "clear", ref1: "received", ref2: "pending", rtw: "verified", quals: "verified", location: "Manchester", available: "2 weeks", phone: "07912 345678", email: "s.mitchell@email.com", crossCouncil: false },
  { name: "David Williams", role: "Team Manager", pqe: "11 years", swe: "SW67891", sweStatus: "active", match: 89, source: "Direct", visa: "settled_status", visaDetails: "EU Settled Status — Indefinite leave to remain", dbs: "clear", ref1: "received", ref2: "received", rtw: "verified", quals: "verified", location: "Salford", available: "1 month", phone: "07845 678901", email: "d.williams@email.com", crossCouncil: true },
  { name: "Amara Osei", role: "Social Worker", pqe: "3 years", swe: "SW45123", sweStatus: "active", match: 87, source: "Agency", visa: "skilled_worker", visaDetails: "Skilled Worker Visa — Expires 15/08/2027 — Requires sponsorship", dbs: "pending", ref1: "received", ref2: "chasing", rtw: "requires_sponsorship", quals: "verified", location: "Bolton", available: "Immediate", phone: "07723 456789", email: "a.osei@email.com", crossCouncil: false },
  { name: "Michael Chen", role: "ASYE Social Worker", pqe: "NQ", swe: "SW78456", sweStatus: "active", match: 82, source: "PSP Network", visa: "graduate_visa", visaDetails: "Graduate Visa — Expires 01/03/2027 — Will need sponsorship for extension", dbs: "clear", ref1: "pending", ref2: "pending", rtw: "time_limited", quals: "pending", location: "Stockport", available: "Immediate", phone: "07634 567890", email: "m.chen@email.com", crossCouncil: false },
  { name: "Priya Sharma", role: "Senior Social Worker", pqe: "8 years", swe: "SW34567", sweStatus: "active", match: 91, source: "WhatsApp", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", dbs: "clear", ref1: "received", ref2: "received", rtw: "verified", quals: "verified", location: "Bury", available: "3 weeks", phone: "07567 890123", email: "p.sharma@email.com", crossCouncil: true },
  { name: "Fatima Al-Hassan", role: "Social Worker", pqe: "4 years", swe: "SW89012", sweStatus: "conditions", match: 78, source: "Direct", visa: "spouse_visa", visaDetails: "Spouse Visa — Expires 22/11/2026 — Eligible to work, no sponsorship needed", dbs: "clear", ref1: "received", ref2: "chasing", rtw: "verified", quals: "verified", location: "Oldham", available: "1 month", phone: "07456 789012", email: "f.alhassan@email.com", crossCouncil: false },
  { name: "James Adeyemi", role: "Practice Manager", pqe: "9 years", swe: "SW56789", sweStatus: "active", match: 85, source: "PSP Network", visa: "health_care_visa", visaDetails: "Health & Care Worker Visa — Expires 30/06/2028 — Council must hold sponsor licence", dbs: "pending", ref1: "pending", ref2: "pending", rtw: "requires_sponsorship", quals: "verified", location: "Rochdale", available: "6 weeks", phone: "07345 678901", email: "j.adeyemi@email.com", crossCouncil: false },
];

function VisaBadge({ visa }: { visa: string }) {
  switch (visa) {
    case "british_citizen":
      return <span className="badge badge-green">🇬🇧 British Citizen</span>;
    case "settled_status":
      return <span className="badge badge-green">🇪🇺 Settled Status</span>;
    case "skilled_worker":
      return <span className="badge badge-amber">⚠️ Skilled Worker Visa</span>;
    case "graduate_visa":
      return <span className="badge badge-amber">🎓 Graduate Visa</span>;
    case "spouse_visa":
      return <span className="badge badge-green">💍 Spouse Visa</span>;
    case "health_care_visa":
      return <span className="badge badge-amber">🏥 Health & Care Visa</span>;
    default:
      return <span className="badge badge-gray">Unknown</span>;
  }
}

function RTWStatus({ rtw, visa }: { rtw: string; visa: string }) {
  if (rtw === "verified" && (visa === "british_citizen" || visa === "settled_status" || visa === "spouse_visa"))
    return <span className="badge badge-green"><CheckCircle2 size={12} /> RTW Verified</span>;
  if (rtw === "requires_sponsorship")
    return <span className="badge badge-amber"><AlertTriangle size={12} /> Needs Sponsorship</span>;
  if (rtw === "time_limited")
    return <span className="badge badge-amber"><Clock size={12} /> Time-Limited</span>;
  if (rtw === "verified")
    return <span className="badge badge-green"><CheckCircle2 size={12} /> RTW Verified</span>;
  return <span className="badge badge-gray"><Clock size={12} /> Pending</span>;
}

export default function PSPView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(null);
  const [showVisaModal, setShowVisaModal] = useState(false);

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
      {/* Top Nav */}
      <header style={{ background: "var(--psp-green-dark)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Shield size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>RecruitSW</span>
          <span style={{ color: "var(--psp-gold)", fontSize: 12, fontWeight: 600, background: "rgba(212,168,67,0.2)", padding: "2px 8px", borderRadius: 4 }}>PSP ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>4 councils &middot; 28 active vacancies</span>
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
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "vacancies" && <VacanciesTab />}
        {activeTab === "candidates" && (
          selectedCandidate
            ? <CandidateDetail candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />
            : <CandidatesTab onSelectCandidate={setSelectedCandidate} />
        )}
        {activeTab === "compliance" && <ComplianceTab />}
        {activeTab === "retention" && <RetentionTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function DashboardTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Command Centre</h2>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--psp-green)" }}>28</span><span className="stat-label">Active Vacancies</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-blue)" }}>77</span><span className="stat-label">Candidates in Pipeline</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-amber)" }}>6</span><span className="stat-label">Awaiting Interview</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>14</span><span className="stat-label">Offers Made This Month</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "#7c3aed" }}>23</span><span className="stat-label">Days Avg Time-to-Hire</span></div>
      </div>

      {/* Visa Sponsorship Summary */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Plane size={20} color="var(--status-amber)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visa & Sponsorship Summary</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-green)" }}>52</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>No Sponsorship Needed</div>
          </div>
          <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-amber)" }}>18</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Require Sponsorship</div>
          </div>
          <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-red)" }}>3</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Visa Expiring &lt;6 Months</div>
          </div>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--status-blue)" }}>4</div>
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
          {[
            { text: "Amara Osei — Skilled Worker Visa requires council sponsorship confirmation before start date", type: "visa", council: "Manchester CC" },
            { text: "Michael Chen — Graduate Visa expires Mar 2027 — flag to council re: sponsorship for extension", type: "visa", council: "Stockport MBC" },
            { text: "2 DBS applications pending > 14 days — escalate to DBS helpline", type: "compliance", council: "Manchester CC" },
            { text: "James Adeyemi — Health & Care Visa candidate — verify council holds sponsor licence", type: "visa", council: "Salford CC" },
            { text: "Reference 2 outstanding for 3 candidates — auto-chase sent, manual follow-up needed", type: "compliance", council: "Multiple" },
          ].map((action, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: action.type === "visa" ? "#fffbeb" : "#fef2f2", borderRadius: 8 }}>
              {action.type === "visa" ? <Plane size={16} color="var(--status-amber)" /> : <AlertCircle size={16} color="var(--status-red)" />}
              <span style={{ flex: 1, fontSize: 13 }}>{action.text}</span>
              <span className="badge badge-gray">{action.council}</span>
              <button className="btn btn-outline btn-sm">Action</button>
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
              {councils.map((c, i) => (
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
                  <td><button className="btn btn-outline btn-sm">View <ChevronRight size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VacanciesTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>All Vacancies</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline"><Filter size={16} /> Filter</button>
          <button className="btn btn-primary"><Plus size={16} /> Create Vacancy</button>
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
            {vacancies.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600, color: "var(--psp-green)" }}>{v.id}</td>
                <td>{v.council}</td>
                <td style={{ fontWeight: 500 }}>{v.role}</td>
                <td style={{ fontSize: 13 }}>{v.salary}</td>
                <td>
                  <span className={`badge ${v.status === "live" ? "badge-green" : v.status === "interviewing" ? "badge-blue" : v.status === "offer" ? "badge-purple" : "badge-gray"}`}>
                    {v.status}
                  </span>
                </td>
                <td>{v.applicants}</td>
                <td>{v.shortlisted}</td>
                <td>
                  <span style={{ color: v.daysOpen > 25 ? "var(--status-red)" : v.daysOpen > 14 ? "var(--status-amber)" : "var(--status-green)", fontWeight: 600 }}>
                    {v.daysOpen}d
                  </span>
                </td>
                <td><button className="btn btn-outline btn-sm">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidatesTab({ onSelectCandidate }: { onSelectCandidate: (c: typeof candidates[0]) => void }) {
  const [visaFilter, setVisaFilter] = useState("all");

  const filtered = visaFilter === "all" ? candidates
    : visaFilter === "needs_sponsorship" ? candidates.filter(c => c.rtw === "requires_sponsorship")
    : visaFilter === "time_limited" ? candidates.filter(c => c.rtw === "time_limited")
    : visaFilter === "clear" ? candidates.filter(c => c.visa === "british_citizen" || c.visa === "settled_status")
    : candidates;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>All Candidates</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline"><Upload size={16} /> Upload CV</button>
          <button className="btn btn-primary"><Plus size={16} /> Add Candidate</button>
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
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i} style={{ cursor: "pointer" }} onClick={() => onSelectCandidate(c)}>
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
                    <RTWStatus rtw={c.rtw} visa={c.visa} />
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: c.match >= 90 ? "var(--status-green)" : c.match >= 80 ? "var(--status-blue)" : "var(--status-amber)" }}>
                    {c.match}%
                  </span>
                </td>
                <td><span className="badge badge-gray">{c.source}</span></td>
                <td><Eye size={16} color="var(--text-secondary)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidateDetail({ candidate: c, onBack }: { candidate: typeof candidates[0]; onBack: () => void }) {
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
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span className="badge badge-green">SWE: {c.swe}</span>
              <VisaBadge visa={c.visa} />
              {c.crossCouncil && <span className="badge badge-purple"><Flag size={12} /> Applied at another council</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline"><Phone size={16} /> Call</button>
          <button className="btn btn-outline"><Mail size={16} /> Email</button>
          <button className="btn btn-primary"><Send size={16} /> Submit to Council</button>
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
            <RTWStatus rtw={c.rtw} visa={c.visa} />
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
        </div>

        {(c.rtw === "requires_sponsorship" || c.rtw === "time_limited") && (
          <div style={{ marginTop: 16, padding: 12, background: "rgba(217,119,6,0.1)", borderRadius: 8, border: "1px solid rgba(217,119,6,0.3)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>⚠️ Action Required</p>
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
            { label: "SWE Registration", status: c.sweStatus === "active" ? "done" : "warning", detail: c.swe },
            { label: "Enhanced DBS", status: c.dbs === "clear" ? "done" : "pending", detail: c.dbs === "clear" ? "Clear" : "In progress" },
            { label: "Reference 1", status: c.ref1 === "received" ? "done" : "pending", detail: c.ref1 },
            { label: "Reference 2", status: c.ref2 === "received" ? "done" : c.ref2 === "chasing" ? "warning" : "pending", detail: c.ref2 },
            { label: "Right to Work", status: c.rtw === "verified" ? "done" : "warning", detail: c.rtw === "verified" ? "Verified" : "Action needed" },
            { label: "Qualifications", status: c.quals === "verified" ? "done" : "pending", detail: c.quals === "verified" ? "Verified" : "Pending" },
          ].map((item, i) => (
            <div key={i} className="compliance-item" style={{ borderColor: item.status === "done" ? "#86efac" : item.status === "warning" ? "#fcd34d" : "#e2e8f0" }}>
              {item.status === "done" ? <CheckCircle2 size={18} color="var(--status-green)" /> : item.status === "warning" ? <AlertTriangle size={18} color="var(--status-amber)" /> : <Clock size={18} color="var(--text-secondary)" />}
              <div>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
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
              {[
                { name: "Amara Osei", visa: "Skilled Worker", expiry: "15/08/2027", sponsorship: "Required", council: "Manchester CC", licence: "Yes", action: "Request CoS" },
                { name: "Michael Chen", visa: "Graduate", expiry: "01/03/2027", sponsorship: "Future", council: "Stockport MBC", licence: "Yes", action: "Set reminder" },
                { name: "James Adeyemi", visa: "Health & Care Worker", expiry: "30/06/2028", sponsorship: "Required", council: "Salford CC", licence: "Checking", action: "Verify licence" },
                { name: "Fatima Al-Hassan", visa: "Spouse", expiry: "22/11/2026", sponsorship: "No", council: "Manchester CC", licence: "N/A", action: "None" },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td><VisaBadge visa={r.visa.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")} /></td>
                  <td style={{ fontWeight: 600, color: new Date(r.expiry.split("/").reverse().join("-")) < new Date("2027-06-01") ? "var(--status-amber)" : "inherit" }}>{r.expiry}</td>
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
                  <td><button className="btn btn-outline btn-sm">{r.action}</button></td>
                </tr>
              ))}
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
              {candidates.map((c, i) => {
                const checks = [c.sweStatus === "active", c.dbs === "clear", c.ref1 === "received", c.ref2 === "received", c.rtw === "verified", c.quals === "verified"];
                const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.sweStatus === "active" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <AlertTriangle size={16} color="var(--status-amber)" />}</td>
                    <td>{c.dbs === "clear" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>{c.ref1 === "received" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>{c.ref2 === "received" ? <CheckCircle2 size={16} color="var(--status-green)" /> : c.ref2 === "chasing" ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>
                      {c.rtw === "verified" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <AlertTriangle size={16} color="var(--status-amber)" />}
                      {c.rtw === "requires_sponsorship" && <span style={{ fontSize: 10, color: "var(--status-amber)", display: "block" }}>Sponsor</span>}
                    </td>
                    <td>{c.quals === "verified" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
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
                  <td><span className={`badge ${p.m1Status === "paid" ? "badge-green" : p.m1Status === "pending" ? "badge-amber" : "badge-gray"}`}>{p.m1} — {p.m1Status}</span></td>
                  <td><span className={`badge ${p.m2Status === "paid" ? "badge-green" : p.m2Status === "pending" ? "badge-amber" : "badge-gray"}`}>{p.m2} — {p.m2Status}</span></td>
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
                  <td><button className="btn btn-outline btn-sm">Manage</button></td>
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
            <button className="btn btn-outline btn-sm">Configure</button>
          </div>
          <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><strong>Data Retention Policy</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>6 months post-decision. 12-month re-consent for talent pool.</span></div>
            <button className="btn btn-outline btn-sm">Review</button>
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
