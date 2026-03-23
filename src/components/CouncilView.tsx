"use client";
import { useState } from "react";
import {
  Building2, BarChart3, Users, Briefcase, FileCheck, Calendar,
  ChevronRight, Search, Filter, Plus, Eye, CheckCircle2, XCircle,
  AlertTriangle, AlertCircle, Clock, Star, Send, Phone, Mail,
  Shield, Plane, Flag, UserCheck, FileText, Download
} from "lucide-react";

const vacancies = [
  { id: "MCC-2024-001", role: "Senior Social Worker — Children in Need", team: "Children's Services", manager: "James Okafor", salary: "£42,708 - £46,731", status: "live", applicants: 8, shortlisted: 3, daysOpen: 12, slaStatus: "green" },
  { id: "MCC-2024-002", role: "Team Manager — Safeguarding", team: "Safeguarding Hub", manager: "Rachel Adams", salary: "£52,805 - £56,024", status: "live", applicants: 4, shortlisted: 1, daysOpen: 21, slaStatus: "amber" },
  { id: "MCC-2024-003", role: "ASYE Social Worker", team: "Referral & Assessment", manager: "James Okafor", salary: "£33,945 - £37,336", status: "live", applicants: 14, shortlisted: 5, daysOpen: 7, slaStatus: "green" },
  { id: "MCC-2024-004", role: "Social Worker — MASH", team: "Multi-Agency Hub", manager: "Linda Chowdhury", salary: "£37,336 - £40,476", status: "offer", applicants: 11, shortlisted: 4, daysOpen: 35, slaStatus: "red" },
];

const shortlistedCandidates = [
  { name: "Sarah Mitchell", role: "Senior Social Worker", pqe: "6 years", match: 94, swe: "Active", visa: "british_citizen", visaLabel: "British Citizen", rtw: "verified", rtwLabel: "✅ Verified", source: "PSP Network", crossCouncil: false },
  { name: "Priya Sharma", role: "Senior Social Worker", pqe: "8 years", match: 91, swe: "Active", visa: "british_citizen", visaLabel: "British Citizen", rtw: "verified", rtwLabel: "✅ Verified", source: "PSP WhatsApp", crossCouncil: true },
  { name: "Amara Osei", role: "Social Worker", pqe: "3 years", match: 87, swe: "Active", visa: "skilled_worker", visaLabel: "Skilled Worker Visa", rtw: "requires_sponsorship", rtwLabel: "⚠️ Needs Sponsorship", source: "Agency", crossCouncil: false },
  { name: "David Williams", role: "Team Manager", pqe: "11 years", match: 89, swe: "Active", visa: "settled_status", visaLabel: "EU Settled Status", rtw: "verified", rtwLabel: "✅ Verified", source: "Direct", crossCouncil: true },
  { name: "Michael Chen", role: "ASYE Social Worker", pqe: "NQ", match: 82, swe: "Active", visa: "graduate_visa", visaLabel: "Graduate Visa", rtw: "time_limited", rtwLabel: "⏳ Time-Limited", source: "PSP Network", crossCouncil: false },
];

export default function CouncilView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={16} /> },
    { id: "vacancies", label: "Our Vacancies", icon: <Briefcase size={16} /> },
    { id: "candidates", label: "Candidates", icon: <Users size={16} /> },
    { id: "interviews", label: "Interviews", icon: <Calendar size={16} /> },
    { id: "compliance", label: "Compliance", icon: <FileCheck size={16} /> },
    { id: "reports", label: "Reports", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "var(--council-blue-dark)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Building2 size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>RecruitSW</span>
          <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, background: "rgba(147,197,253,0.2)", padding: "2px 8px", borderRadius: 4 }}>MANCHESTER CITY COUNCIL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Recruitment Team</span>
          <div style={{ width: 32, height: 32, background: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "white" }}>SP</div>
        </div>
      </header>

      <nav className="tab-nav" style={{ background: "white" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active-council" : ""}`} onClick={() => setActiveTab(tab.id)} style={activeTab === tab.id ? { color: "var(--council-blue)", borderBottomColor: "var(--council-blue)" } : {}}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{tab.icon} {tab.label}</span>
          </button>
        ))}
      </nav>

      <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {activeTab === "dashboard" && <CouncilDashboard />}
        {activeTab === "vacancies" && <CouncilVacancies />}
        {activeTab === "candidates" && <CouncilCandidates />}
        {activeTab === "interviews" && <CouncilInterviews />}
        {activeTab === "compliance" && <CouncilCompliance />}
        {activeTab === "reports" && <CouncilReports />}
      </main>
    </div>
  );
}

function CouncilDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Recruitment Dashboard — Manchester City Council</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--council-blue)" }}>12</span><span className="stat-label">Active Vacancies</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>34</span><span className="stat-label">Candidates in Pipeline</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-amber)" }}>3</span><span className="stat-label">Awaiting Shortlist Decision</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "#7c3aed" }}>2</span><span className="stat-label">Offers Pending</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>19d</span><span className="stat-label">Avg Time-to-Hire</span></div>
      </div>

      {/* Visa Alert */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Plane size={18} color="var(--status-amber)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Sponsorship Attention Required</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fffbeb", borderRadius: 8, fontSize: 13 }}>
            <AlertTriangle size={16} color="var(--status-amber)" />
            <span><strong>Amara Osei</strong> — Skilled Worker Visa candidate. Your council must hold a valid Sponsor Licence and issue a CoS before start date.</span>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }}>Review</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#eff6ff", borderRadius: 8, fontSize: 13 }}>
            <Clock size={16} color="var(--status-blue)" />
            <span><strong>Michael Chen</strong> — Graduate Visa expires March 2027. If you wish to retain, sponsorship will be needed for extension.</span>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }}>Note</button>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Vacancy Pipeline</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Vacancy</th><th>Team</th><th>Hiring Manager</th><th>Status</th><th>Candidates</th><th>Days Open</th><th>SLA</th><th></th></tr></thead>
            <tbody>
              {vacancies.map((v) => (
                <tr key={v.id}>
                  <td><div><span style={{ fontWeight: 600 }}>{v.role}</span><br /><span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v.id}</span></div></td>
                  <td>{v.team}</td>
                  <td>{v.manager}</td>
                  <td><span className={`badge ${v.status === "live" ? "badge-green" : v.status === "offer" ? "badge-purple" : "badge-blue"}`}>{v.status}</span></td>
                  <td>{v.applicants} applied / {v.shortlisted} shortlisted</td>
                  <td style={{ fontWeight: 600, color: v.daysOpen > 25 ? "var(--status-red)" : v.daysOpen > 14 ? "var(--status-amber)" : "var(--status-green)" }}>{v.daysOpen}d</td>
                  <td><span className={`badge ${v.slaStatus === "green" ? "badge-green" : v.slaStatus === "amber" ? "badge-amber" : "badge-red"}`}>{v.slaStatus === "green" ? "On Track" : v.slaStatus === "amber" ? "At Risk" : "Overdue"}</span></td>
                  <td><button className="btn btn-outline btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Data Protection</strong> — Manchester City Council processes recruitment data as a controller under Article 6(1)(e) public task.
          PSP processes data under a Data Processing Agreement. All data held in UK (AWS eu-west-2). Candidate data retained for 6 months post-decision.
        </span>
      </div>
    </div>
  );
}

function CouncilVacancies() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Our Vacancies</h2>
        <button className="btn btn-council"><Plus size={16} /> Request New Vacancy</button>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Reference</th><th>Role</th><th>Team</th><th>Salary</th><th>Status</th><th>Applicants</th><th>Days Open</th><th></th></tr></thead>
          <tbody>
            {vacancies.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600, color: "var(--council-blue)" }}>{v.id}</td>
                <td style={{ fontWeight: 500 }}>{v.role}</td>
                <td>{v.team}</td>
                <td style={{ fontSize: 13 }}>{v.salary}</td>
                <td><span className={`badge ${v.status === "live" ? "badge-green" : v.status === "offer" ? "badge-purple" : "badge-blue"}`}>{v.status}</span></td>
                <td>{v.applicants}</td>
                <td style={{ fontWeight: 600 }}>{v.daysOpen}d</td>
                <td><button className="btn btn-outline btn-sm">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CouncilCandidates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Shortlisted Candidates</h2>
      <p style={{ color: "var(--text-secondary)" }}>These candidates have been screened and shortlisted by PSP for your vacancies.</p>

      <div style={{ display: "grid", gap: 16 }}>
        {shortlistedCandidates.map((c, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--council-blue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.role} &middot; {c.pqe} PQE &middot; SWE: {c.swe}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span className={`badge ${c.match >= 90 ? "badge-green" : c.match >= 80 ? "badge-blue" : "badge-amber"}`}>Match: {c.match}%</span>
                    <span className={`badge ${c.visa === "british_citizen" || c.visa === "settled_status" ? "badge-green" : "badge-amber"}`}>
                      {c.visaLabel}
                    </span>
                    <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>
                      {c.rtwLabel}
                    </span>
                    {c.crossCouncil && <span className="badge badge-purple">Previously applied at another council</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm"><Eye size={14} /> View Profile</button>
                <button className="btn btn-council btn-sm"><CheckCircle2 size={14} /> Approve for Interview</button>
              </div>
            </div>

            {/* Sponsorship Warning */}
            {c.rtw === "requires_sponsorship" && (
              <div style={{ padding: 10, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                <Plane size={16} color="var(--status-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: "#92400e" }}>Sponsorship Required</strong> — This candidate holds a Skilled Worker Visa and requires your council to hold a valid Sponsor Licence with UKVI. A Certificate of Sponsorship (CoS) must be issued before their start date. Social Workers are on the Shortage Occupation List.
                </div>
              </div>
            )}
            {c.rtw === "time_limited" && (
              <div style={{ padding: 10, background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                <Clock size={16} color="var(--status-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: "#1e40af" }}>Time-Limited Visa</strong> — This candidate&apos;s Graduate Visa allows unrestricted employment now, but will expire. If you wish to retain them long-term, sponsorship will be required for a visa extension.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CouncilInterviews() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Interview Schedule</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { candidate: "Sarah Mitchell", role: "Senior SW — Children in Need", date: "Tue 25 Mar 2026", time: "10:00 - 11:00", panel: ["James Okafor", "Rachel Adams"], type: "MS Teams", status: "confirmed" },
          { candidate: "David Williams", role: "Team Manager — Safeguarding", date: "Wed 26 Mar 2026", time: "14:00 - 15:30", panel: ["Rachel Adams", "Linda Chowdhury", "External Assessor"], type: "In-person", status: "confirmed" },
          { candidate: "Amara Osei", role: "Social Worker — MASH", date: "Thu 27 Mar 2026", time: "09:30 - 10:30", panel: ["Linda Chowdhury", "James Okafor"], type: "MS Teams", status: "pending" },
        ].map((int, i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{int.candidate}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{int.role}</p>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span><Calendar size={14} style={{ display: "inline", marginRight: 4 }} />{int.date}, {int.time}</span>
                  <span>{int.type}</span>
                  <span>Panel: {int.panel.join(", ")}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`badge ${int.status === "confirmed" ? "badge-green" : "badge-amber"}`}>{int.status}</span>
                <button className="btn btn-outline btn-sm">View Scorecard</button>
              </div>
            </div>

            {/* Panel contingency */}
            <div style={{ marginTop: 12, padding: 10, background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)" }}>
              <strong>Panel Contingency:</strong> Minimum 2 panel members required. If a member is unavailable, use &quot;Mark as Unavailable&quot; to assign a substitute. All changes are audit-logged.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouncilCompliance() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Compliance Tracking</h2>

      {/* Visa Summary for Council */}
      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Plane size={18} color="var(--status-amber)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Right to Work & Sponsorship Status</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-green)" }}>28</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>RTW Verified</div>
          </div>
          <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-amber)" }}>3</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Need Sponsorship</div>
          </div>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-blue)" }}>2</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Time-Limited</div>
          </div>
          <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-red)" }}>1</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Visa Expiring &lt;6mo</div>
          </div>
        </div>

        <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, fontSize: 13 }}>
          <strong>Council Sponsor Licence Status:</strong>{" "}
          <span className="badge badge-green" style={{ marginLeft: 4 }}>Active — Licence No. XXXXXXX</span>
          <p style={{ marginTop: 4, fontSize: 12, color: "var(--text-secondary)" }}>
            Your council holds a valid UKVI Sponsor Licence. You can issue Certificates of Sponsorship for Skilled Worker and Health & Care Worker visa candidates.
            Social Workers are on the Shortage Occupation List — minimum salary threshold: £20,960.
          </p>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Candidate Compliance Overview</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Candidate</th><th>SWE</th><th>DBS</th><th>Refs</th><th>Right to Work</th><th>Sponsorship</th><th>Quals</th><th>Overall</th></tr></thead>
            <tbody>
              {shortlistedCandidates.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><CheckCircle2 size={16} color="var(--status-green)" /></td>
                  <td>{i < 3 ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                  <td>{i < 2 ? <CheckCircle2 size={16} color="var(--status-green)" /> : <AlertTriangle size={16} color="var(--status-amber)" />}</td>
                  <td>
                    <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>
                      {c.rtwLabel}
                    </span>
                  </td>
                  <td>
                    {c.rtw === "requires_sponsorship" ? (
                      <span className="badge badge-amber">⚠️ Required</span>
                    ) : c.rtw === "time_limited" ? (
                      <span className="badge badge-blue">Future</span>
                    ) : (
                      <span className="badge badge-green">Not needed</span>
                    )}
                  </td>
                  <td>{i !== 4 ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                  <td>
                    <div className="progress-bar" style={{ width: 60 }}>
                      <div className="progress-fill" style={{ width: `${i < 2 ? 100 : i < 4 ? 72 : 50}%`, background: i < 2 ? "var(--status-green)" : "var(--status-amber)" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CouncilReports() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Recruitment Reports</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>This Quarter</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Vacancies Filled</span><span style={{ fontWeight: 700 }}>8</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Avg Time-to-Hire</span><span style={{ fontWeight: 700, color: "var(--status-green)" }}>19 days</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Cost per Hire (via PSP)</span><span style={{ fontWeight: 700 }}>£3,200</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Cost per Hire (agency avg)</span><span style={{ fontWeight: 700, color: "var(--status-red)" }}>£8,500</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid var(--border)" }}><span style={{ fontWeight: 700, color: "var(--status-green)" }}>Savings vs Agency</span><span style={{ fontWeight: 700, color: "var(--status-green)", fontSize: 18 }}>£42,400</span></div>
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Candidate Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { source: "PSP Network", pct: 45, color: "var(--psp-green)" },
              { source: "Direct Applications", pct: 25, color: "var(--council-blue)" },
              { source: "PSP WhatsApp", pct: 18, color: "var(--status-blue)" },
              { source: "Agency", pct: 12, color: "var(--status-amber)" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{s.source}</span><span style={{ fontWeight: 600 }}>{s.pct}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
