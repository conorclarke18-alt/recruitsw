"use client";
import { useState, useMemo } from "react";
import {
  Building2, BarChart3, Users, Briefcase, FileCheck, Calendar,
  ChevronRight, Search, Filter, Plus, Eye, CheckCircle2, XCircle,
  AlertTriangle, AlertCircle, Clock, Star, Send, Phone, Mail,
  Shield, Plane, Flag, UserCheck, FileText, Download, ChevronDown, ChevronUp, X
} from "lucide-react";
import { useData, Vacancy, Candidate } from "./DataStore";
import ImportVacancyForm from "./ImportVacancyForm";
import VacancyRequestForm from "./VacancyRequestForm";

// Helpers
function visaLabel(visa: Candidate["visa"]): string {
  const map: Record<string, string> = {
    british_citizen: "British Citizen",
    settled_status: "EU Settled Status",
    skilled_worker: "Skilled Worker Visa",
    graduate_visa: "Graduate Visa",
    spouse_visa: "Spouse Visa",
    health_care_visa: "Health & Care Visa",
    pre_settled: "Pre-Settled Status",
    other: "Other",
  };
  return map[visa] || visa;
}

function rtwLabel(rtw: Candidate["rtw"]): string {
  const map: Record<string, string> = {
    verified: "✅ Verified",
    requires_sponsorship: "⚠️ Needs Sponsorship",
    time_limited: "⏳ Time-Limited",
    pending: "⏳ Pending",
    expired: "❌ Expired",
  };
  return map[rtw] || rtw;
}

function slaStatus(daysOpen: number): "green" | "amber" | "red" {
  if (daysOpen > 25) return "red";
  if (daysOpen > 14) return "amber";
  return "green";
}

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

/* ─── DASHBOARD ─── */
function CouncilDashboard() {
  const { vacancies, candidates, showToast } = useData();

  const mccVacancies = useMemo(() => vacancies.filter((v) => v.council === "Manchester CC"), [vacancies]);
  const mccVacancyIds = useMemo(() => new Set(mccVacancies.map((v) => v.id)), [mccVacancies]);
  const mccCandidates = useMemo(() => candidates.filter((c) => c.assignedVacancy && mccVacancyIds.has(c.assignedVacancy)), [candidates, mccVacancyIds]);

  const activeVacancies = mccVacancies.filter((v) => v.status === "live" || v.status === "interviewing").length;
  const pipelineCount = mccCandidates.length;
  const awaitingDecision = mccCandidates.filter((c) => c.status === "shortlisted").length;
  const offersPending = mccVacancies.filter((v) => v.status === "offer").length;
  const avgDaysOpen = mccVacancies.length > 0 ? Math.round(mccVacancies.reduce((s, v) => s + v.daysOpen, 0) / mccVacancies.length) : 0;

  // Sponsorship alerts from real candidates
  const sponsorshipCandidates = mccCandidates.filter((c) => c.rtw === "requires_sponsorship");
  const timeLimitedCandidates = mccCandidates.filter((c) => c.rtw === "time_limited");

  const [expandedVacancy, setExpandedVacancy] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Recruitment Dashboard — Manchester City Council</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--council-blue)" }}>{activeVacancies}</span><span className="stat-label">Active Vacancies</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>{pipelineCount}</span><span className="stat-label">Candidates in Pipeline</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-amber)" }}>{awaitingDecision}</span><span className="stat-label">Awaiting Shortlist Decision</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "#7c3aed" }}>{offersPending}</span><span className="stat-label">Offers Pending</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>{avgDaysOpen}d</span><span className="stat-label">Avg Time-to-Hire</span></div>
      </div>

      {/* Visa Alert */}
      {(sponsorshipCandidates.length > 0 || timeLimitedCandidates.length > 0) && (
        <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Plane size={18} color="var(--status-amber)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Sponsorship Attention Required</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sponsorshipCandidates.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fffbeb", borderRadius: 8, fontSize: 13 }}>
                <AlertTriangle size={16} color="var(--status-amber)" />
                <span><strong>{c.name}</strong> — {visaLabel(c.visa)} candidate. Your council must hold a valid Sponsor Licence and issue a CoS before start date.</span>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast(`Sponsorship review noted for ${c.name}`, "info")}>Review</button>
              </div>
            ))}
            {timeLimitedCandidates.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#eff6ff", borderRadius: 8, fontSize: 13 }}>
                <Clock size={16} color="var(--status-blue)" />
                <span><strong>{c.name}</strong> — {visaLabel(c.visa)} expires {c.visaExpiry || "TBC"}. If you wish to retain, sponsorship will be needed for extension.</span>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast(`Noted: ${c.name} visa monitoring flagged`, "info")}>Note</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Vacancy Pipeline</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Vacancy</th><th>Team</th><th>Hiring Manager</th><th>Status</th><th>Candidates</th><th>Days Open</th><th>SLA</th><th></th></tr></thead>
            <tbody>
              {mccVacancies.map((v) => {
                const sla = slaStatus(v.daysOpen);
                const isExpanded = expandedVacancy === v.id;
                return (
                  <>
                    <tr key={v.id}>
                      <td><div><span style={{ fontWeight: 600 }}>{v.role}</span><br /><span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v.id}</span></div></td>
                      <td>{v.team}</td>
                      <td>{v.manager}</td>
                      <td><span className={`badge ${v.status === "live" ? "badge-green" : v.status === "offer" ? "badge-purple" : v.status === "interviewing" ? "badge-blue" : "badge-amber"}`}>{v.status}</span></td>
                      <td>{v.applicants} applied / {v.shortlisted} shortlisted</td>
                      <td style={{ fontWeight: 600, color: v.daysOpen > 25 ? "var(--status-red)" : v.daysOpen > 14 ? "var(--status-amber)" : "var(--status-green)" }}>{v.daysOpen}d</td>
                      <td><span className={`badge ${sla === "green" ? "badge-green" : sla === "amber" ? "badge-amber" : "badge-red"}`}>{sla === "green" ? "On Track" : sla === "amber" ? "At Risk" : "Overdue"}</span></td>
                      <td><button className="btn btn-outline btn-sm" onClick={() => setExpandedVacancy(isExpanded ? null : v.id)}>{isExpanded ? "Hide" : "View"}</button></td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${v.id}-detail`}>
                        <td colSpan={9} style={{ background: "#f8fafc", padding: 16 }}>
                          <VacancyDetail vacancy={v} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
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

/* ─── VACANCY INLINE DETAIL ─── */
function VacancyDetail({ vacancy }: { vacancy: Vacancy }) {
  const { candidates } = useData();
  const assignedCandidates = candidates.filter((c) => c.assignedVacancy === vacancy.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Grade</div>
          <div style={{ fontWeight: 600 }}>{vacancy.grade}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Salary</div>
          <div style={{ fontWeight: 600 }}>{vacancy.salary}</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Description</div>
        <div style={{ fontSize: 13 }}>{vacancy.description}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Essential Criteria</div>
          <div style={{ fontSize: 13 }}>{vacancy.essential}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Desirable Criteria</div>
          <div style={{ fontSize: 13 }}>{vacancy.desirable}</div>
        </div>
      </div>
      {/* ATS & Application Link */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {vacancy.atsReference && (
          <div style={{ padding: 10, background: "#eff6ff", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 600, marginBottom: 4 }}>Internal System Reference</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{vacancy.atsReference}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Imported from {vacancy.atsSystem}</div>
            {vacancy.atsUrl && <a href={vacancy.atsUrl} target="_blank" rel="noopener" style={{ fontSize: 11, color: "#1e40af" }}>View in {vacancy.atsSystem} →</a>}
          </div>
        )}
        <div style={{ padding: 10, background: vacancy.applicationLinkActive ? "#f0fdf4" : "#f8fafc", borderRadius: 8, border: vacancy.applicationLinkActive ? "1px solid #86efac" : "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: vacancy.applicationLinkActive ? "#166534" : "var(--text-secondary)", fontWeight: 600, marginBottom: 4 }}>
            Application Tracking Link {vacancy.applicationLinkActive ? "✅ Active" : "⏸ Inactive"}
          </div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--council-blue)", wordBreak: "break-all" }}>
            https://{vacancy.applicationLink}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            Add this link to your {vacancy.atsSystem !== "None" ? vacancy.atsSystem + " listing and " : ""}careers page. All applications are automatically tracked.
          </div>
        </div>
      </div>

      {assignedCandidates.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Assigned Candidates ({assignedCandidates.length})</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {assignedCandidates.map((c) => (
              <span key={c.id} className="badge badge-blue">{c.name} — {c.status} {c.source === "Direct Application" ? "(via apply link)" : `(${c.source})`}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── VACANCIES TAB ─── */
function CouncilVacancies() {
  const { vacancies, showToast } = useData();
  const mccVacancies = useMemo(() => vacancies.filter((v) => v.council === "Manchester CC"), [vacancies]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ImportVacancyForm open={showImport} onClose={() => setShowImport(false)} council="Manchester CC" />
      <VacancyRequestForm open={showRequest} onClose={() => setShowRequest(false)} requestedBy="Sunita Patel" requestedByRole="recruitment_team" council="Manchester CC" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Our Vacancies</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setShowImport(true)}><Download size={16} /> Import from Jobtrain</button>
          <button className="btn btn-council" onClick={() => setShowRequest(true)}><Plus size={16} /> Create Vacancy</button>
        </div>
      </div>

      {/* ATS Sync Status */}
      <div style={{ padding: 12, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <CheckCircle2 size={16} color="var(--status-green)" />
          <span><strong>Jobtrain Connected</strong> — {mccVacancies.filter(v => v.atsSystem === "Jobtrain").length} vacancies synced from your ATS</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Last sync: 15 minutes ago</span>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Reference</th><th>Role</th><th>Team</th><th>Salary</th><th>Source</th><th>Status</th><th>Applicants</th><th>Days Open</th><th></th></tr></thead>
          <tbody>
            {mccVacancies.map((v) => {
              const isExpanded = expandedId === v.id;
              return (
                <>
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: "var(--council-blue)" }}>{v.id}</td>
                    <td style={{ fontWeight: 500 }}>{v.role}</td>
                    <td>{v.team}</td>
                    <td style={{ fontSize: 13 }}>{v.salary}</td>
                    <td><span className={`badge ${v.importedFrom === "ats_import" ? "badge-blue" : v.importedFrom === "psp_created" ? "badge-green" : "badge-gray"}`}>{v.importedFrom === "ats_import" ? v.atsSystem : v.importedFrom === "psp_created" ? "PSP" : "Manual"}</span></td>
                    <td><span className={`badge ${v.status === "live" ? "badge-green" : v.status === "offer" ? "badge-purple" : v.status === "interviewing" ? "badge-blue" : "badge-amber"}`}>{v.status}</span></td>
                    <td>{v.applicants}</td>
                    <td style={{ fontWeight: 600 }}>{v.daysOpen}d</td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => setExpandedId(isExpanded ? null : v.id)}>{isExpanded ? "Hide" : "View"}</button></td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${v.id}-detail`}>
                      <td colSpan={9} style={{ background: "#f8fafc", padding: 16 }}>
                        <VacancyDetail vacancy={v} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── CANDIDATE PROFILE DETAIL ─── */
function CandidateProfile({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  return (
    <div style={{ padding: 16, background: "#f8fafc", border: "1px solid var(--border)", borderRadius: 10, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: 16, fontWeight: 700 }}>{candidate.name} — Full Profile</h4>
        <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /> Close</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13 }}>
        <div><span style={{ color: "var(--text-secondary)" }}>Email:</span> {candidate.email}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Phone:</span> {candidate.phone}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Location:</span> {candidate.location}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Role:</span> {candidate.role}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>PQE:</span> {candidate.pqe}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>SWE Reg:</span> {candidate.swe} ({candidate.sweStatus})</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Source:</span> {candidate.source}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Available:</span> {candidate.available}</div>
        <div><span style={{ color: "var(--text-secondary)" }}>Status:</span> {candidate.status}</div>
      </div>
      <div style={{ fontSize: 13 }}>
        <span style={{ color: "var(--text-secondary)" }}>Visa:</span> {candidate.visaDetails}
      </div>
      {candidate.notes && (
        <div style={{ fontSize: 13 }}>
          <span style={{ color: "var(--text-secondary)" }}>Notes:</span> {candidate.notes}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 13 }}>
        <span style={{ color: "var(--text-secondary)" }}>Compliance:</span>
        <span className={`badge ${candidate.dbs === "done" ? "badge-green" : "badge-amber"}`}>DBS: {candidate.dbs}</span>
        <span className={`badge ${candidate.ref1 === "done" ? "badge-green" : "badge-amber"}`}>Ref 1: {candidate.ref1}</span>
        <span className={`badge ${candidate.ref2 === "done" ? "badge-green" : "badge-amber"}`}>Ref 2: {candidate.ref2}</span>
        <span className={`badge ${candidate.quals === "done" ? "badge-green" : "badge-amber"}`}>Quals: {candidate.quals}</span>
      </div>
    </div>
  );
}

/* ─── CANDIDATES TAB ─── */
function CouncilCandidates() {
  const { vacancies, candidates, updateCandidate, showToast } = useData();
  const mccVacancyIds = useMemo(() => new Set(vacancies.filter((v) => v.council === "Manchester CC").map((v) => v.id)), [vacancies]);
  const mccCandidates = useMemo(() => candidates.filter((c) => c.assignedVacancy && mccVacancyIds.has(c.assignedVacancy)), [candidates, mccVacancyIds]);

  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Shortlisted Candidates</h2>
      <p style={{ color: "var(--text-secondary)" }}>These candidates have been screened and shortlisted by PSP for your vacancies.</p>

      {mccCandidates.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>No candidates currently assigned to Manchester CC vacancies.</div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {mccCandidates.map((c) => (
          <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--council-blue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.role} &middot; {c.pqe} PQE &middot; SWE: {c.sweStatus === "active" ? "Active" : c.sweStatus}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span className={`badge ${c.match >= 90 ? "badge-green" : c.match >= 80 ? "badge-blue" : "badge-amber"}`}>Match: {c.match}%</span>
                    <span className={`badge ${c.visa === "british_citizen" || c.visa === "settled_status" ? "badge-green" : "badge-amber"}`}>
                      {visaLabel(c.visa)}
                    </span>
                    <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>
                      {rtwLabel(c.rtw)}
                    </span>
                    {c.crossCouncil && <span className="badge badge-purple">Previously applied at another council</span>}
                    <span className={`badge ${c.status === "interviewing" ? "badge-blue" : c.status === "shortlisted" ? "badge-green" : "badge-amber"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => setExpandedProfile(expandedProfile === c.id ? null : c.id)}><Eye size={14} /> {expandedProfile === c.id ? "Hide Profile" : "View Profile"}</button>
                {c.status !== "interviewing" && c.status !== "offered" && c.status !== "hired" && (
                  <button className="btn btn-council btn-sm" onClick={() => updateCandidate(c.id, { status: "interviewing" })}><CheckCircle2 size={14} /> Approve for Interview</button>
                )}
              </div>
            </div>

            {expandedProfile === c.id && (
              <CandidateProfile candidate={c} onClose={() => setExpandedProfile(null)} />
            )}

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
                  <strong style={{ color: "#1e40af" }}>Time-Limited Visa</strong> — This candidate&apos;s {visaLabel(c.visa)} allows unrestricted employment now, but will expire{c.visaExpiry ? ` on ${c.visaExpiry}` : ""}. If you wish to retain them long-term, sponsorship will be required for a visa extension.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── INTERVIEWS TAB ─── */
function CouncilInterviews() {
  const { vacancies, candidates, showToast } = useData();
  const mccVacancyIds = useMemo(() => new Set(vacancies.filter((v) => v.council === "Manchester CC").map((v) => v.id)), [vacancies]);
  const interviewingCandidates = useMemo(
    () => candidates.filter((c) => c.status === "interviewing" && c.assignedVacancy && mccVacancyIds.has(c.assignedVacancy)),
    [candidates, mccVacancyIds]
  );

  // Generate interview schedule from real data
  const interviews = useMemo(() => {
    const baseDate = new Date();
    return interviewingCandidates.map((c, i) => {
      const interviewDate = new Date(baseDate);
      interviewDate.setDate(interviewDate.getDate() + i + 2);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const vacancy = vacancies.find((v) => v.id === c.assignedVacancy);
      return {
        candidateId: c.id,
        candidate: c.name,
        role: `${c.role} — ${vacancy?.team || "TBC"}`,
        date: `${dayNames[interviewDate.getDay()]} ${interviewDate.getDate()} ${monthNames[interviewDate.getMonth()]} ${interviewDate.getFullYear()}`,
        time: i % 2 === 0 ? "10:00 - 11:00" : "14:00 - 15:30",
        panel: [vacancy?.manager || "TBC", "Panel Member 2"],
        type: i % 2 === 0 ? "MS Teams" : "In-person",
        status: i === 0 ? "confirmed" : "pending",
      };
    });
  }, [interviewingCandidates, vacancies]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Interview Schedule</h2>

      {interviews.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>No interviews currently scheduled. Approve candidates for interview from the Candidates tab.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {interviews.map((int, i) => (
          <div key={int.candidateId} className="card">
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
                <button className="btn btn-outline btn-sm" onClick={() => showToast(`Scorecard for ${int.candidate} — not yet completed`, "info")}>View Scorecard</button>
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

/* ─── COMPLIANCE TAB ─── */
function CouncilCompliance() {
  const { vacancies, candidates } = useData();
  const mccVacancyIds = useMemo(() => new Set(vacancies.filter((v) => v.council === "Manchester CC").map((v) => v.id)), [vacancies]);
  const mccCandidates = useMemo(() => candidates.filter((c) => c.assignedVacancy && mccVacancyIds.has(c.assignedVacancy)), [candidates, mccVacancyIds]);

  const rtwVerified = mccCandidates.filter((c) => c.rtw === "verified").length;
  const needSponsorship = mccCandidates.filter((c) => c.rtw === "requires_sponsorship").length;
  const timeLimited = mccCandidates.filter((c) => c.rtw === "time_limited").length;
  const visaExpiringSoon = mccCandidates.filter((c) => {
    if (!c.visaExpiry) return false;
    const expiry = new Date(c.visaExpiry);
    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    return expiry <= sixMonths;
  }).length;

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
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-green)" }}>{rtwVerified}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>RTW Verified</div>
          </div>
          <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-amber)" }}>{needSponsorship}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Need Sponsorship</div>
          </div>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-blue)" }}>{timeLimited}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Time-Limited</div>
          </div>
          <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--status-red)" }}>{visaExpiringSoon}</div>
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
              {mccCandidates.map((c) => {
                const checks = [
                  c.sweStatus === "active" ? 1 : 0,
                  c.dbs === "done" ? 1 : 0,
                  c.ref1 === "done" ? 1 : 0,
                  c.ref2 === "done" ? 1 : 0,
                  c.rtw === "verified" ? 1 : 0,
                  c.quals === "done" ? 1 : 0,
                ];
                const pct = Math.round((checks.reduce((a, b) => a + b, 0) / checks.length) * 100);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.sweStatus === "active" ? <CheckCircle2 size={16} color="var(--status-green)" /> : c.sweStatus === "conditions" ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>{c.dbs === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {c.ref1 === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : c.ref1 === "warning" ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}
                        {c.ref2 === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : c.ref2 === "warning" ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>
                        {rtwLabel(c.rtw)}
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
                    <td>{c.quals === "done" ? <CheckCircle2 size={16} color="var(--status-green)" /> : <Clock size={16} color="var(--text-secondary)" />}</td>
                    <td>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 80 ? "var(--status-green)" : "var(--status-amber)" }} />
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

/* ─── REPORTS TAB ─── */
function CouncilReports() {
  const { vacancies, candidates } = useData();
  const mccVacancies = useMemo(() => vacancies.filter((v) => v.council === "Manchester CC"), [vacancies]);
  const mccVacancyIds = useMemo(() => new Set(mccVacancies.map((v) => v.id)), [mccVacancies]);
  const mccCandidates = useMemo(() => candidates.filter((c) => c.assignedVacancy && mccVacancyIds.has(c.assignedVacancy)), [candidates, mccVacancyIds]);

  const filledCount = mccVacancies.filter((v) => v.status === "filled").length;
  const avgDays = mccVacancies.length > 0 ? Math.round(mccVacancies.reduce((s, v) => s + v.daysOpen, 0) / mccVacancies.length) : 0;

  // Source breakdown from real candidate data
  const sourceMap: Record<string, number> = {};
  mccCandidates.forEach((c) => {
    const src = c.source.includes("WhatsApp") ? "PSP WhatsApp" : c.source.includes("PSP") ? "PSP Network" : c.source === "Direct" ? "Direct Applications" : c.source;
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const total = mccCandidates.length || 1;
  const sources = Object.entries(sourceMap)
    .map(([source, count]) => ({ source, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);

  const sourceColors: Record<string, string> = {
    "PSP Network": "var(--psp-green)",
    "Direct Applications": "var(--council-blue)",
    "PSP WhatsApp": "var(--status-blue)",
    "Agency": "var(--status-amber)",
    "Direct": "var(--council-blue)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Recruitment Reports</h2>
        <button className="btn btn-council" onClick={() => {
          const rows = [
            ["Metric", "Value"],
            ["Vacancies Filled", String(filledCount)],
            ["Avg Time-to-Hire (days)", String(avgDays)],
            ["Cost per Hire (PSP)", "3200"],
            ["Cost per Hire (Agency avg)", "8500"],
            ["Savings vs Agency", String(filledCount * 5300)],
            ["Active Vacancies", String(mccVacancies.filter(v => v.status === "live").length)],
            ["Candidates in Pipeline", String(mccCandidates.length)],
            ...sources.map(s => [`Source: ${s.source}`, `${s.pct}%`]),
          ];
          const csv = rows.map(r => r.join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `RecruitSW-Report-Manchester-${new Date().toISOString().split("T")[0]}.csv`;
          a.click(); URL.revokeObjectURL(url);
        }}>
          <Download size={16} /> Export CSV Report
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>This Quarter</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Vacancies Filled</span><span style={{ fontWeight: 700 }}>{filledCount}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Avg Time-to-Hire</span><span style={{ fontWeight: 700, color: "var(--status-green)" }}>{avgDays} days</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Cost per Hire (via PSP)</span><span style={{ fontWeight: 700 }}>{"\u00A3"}3,200</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Cost per Hire (agency avg)</span><span style={{ fontWeight: 700, color: "var(--status-red)" }}>{"\u00A3"}8,500</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid var(--border)" }}>
              <span style={{ fontWeight: 700, color: "var(--status-green)" }}>Savings vs Agency</span>
              <span style={{ fontWeight: 700, color: "var(--status-green)", fontSize: 18 }}>{"\u00A3"}{(filledCount * 5300).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Candidate Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sources.length === 0 && <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>No candidate data available yet.</div>}
            {sources.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{s.source}</span><span style={{ fontWeight: 600 }}>{s.pct}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.pct}%`, background: sourceColors[s.source] || "var(--council-blue)" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
