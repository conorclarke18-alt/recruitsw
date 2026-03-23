"use client";
import { useState } from "react";
import {
  UserCheck, Briefcase, Users, Calendar, CheckCircle2,
  AlertTriangle, Clock, Eye, Star, ThumbsUp, ThumbsDown,
  Shield, Plane, MessageSquare, ChevronRight, FileText
} from "lucide-react";

const myVacancies = [
  { id: "MCC-2024-001", role: "Senior Social Worker — Children in Need", salary: "£42,708 - £46,731", status: "live", shortlisted: 3, interviewing: 1, daysOpen: 12 },
  { id: "MCC-2024-003", role: "ASYE Social Worker", salary: "£33,945 - £37,336", status: "live", shortlisted: 5, interviewing: 0, daysOpen: 7 },
];

const candidatesForReview = [
  {
    name: "Sarah Mitchell", role: "Senior Social Worker", pqe: "6 years", match: 94, swe: "Active",
    visa: "british_citizen", visaLabel: "🇬🇧 British Citizen", rtw: "verified", rtwLabel: "✅ No sponsorship needed",
    summary: "Strong children's safeguarding experience across two local authorities. 6 years PQE with consistent career progression. Current senior role includes court work and complex case management.",
    strengths: ["Court work experience", "Safeguarding lead in current role", "NAAS Stage 3 assessed"],
    considerations: ["Currently in notice period — available in 2 weeks", "Relocating from Liverpool"],
  },
  {
    name: "Amara Osei", role: "Social Worker", pqe: "3 years", match: 87, swe: "Active",
    visa: "skilled_worker", visaLabel: "⚠️ Skilled Worker Visa", rtw: "requires_sponsorship", rtwLabel: "⚠️ Requires council sponsorship",
    summary: "3 years PQE in children's referral and assessment. Strong assessment skills with positive feedback from IROs. Currently working in a neighbouring authority.",
    strengths: ["R&A experience", "Bilingual (English/French)", "Positive IRO feedback"],
    considerations: ["Requires Skilled Worker Visa sponsorship — council must issue CoS", "3 years PQE (meets minimum but junior for the grade)"],
  },
  {
    name: "Priya Sharma", role: "Senior Social Worker", pqe: "8 years", match: 91, swe: "Active",
    visa: "british_citizen", visaLabel: "🇬🇧 British Citizen", rtw: "verified", rtwLabel: "✅ No sponsorship needed",
    summary: "Highly experienced practitioner with 8 years across children in need and LAC. Practice educator for ASYEs. Previously applied at another council in the RecruitSW network.",
    strengths: ["Practice educator", "LAC and CIN experience", "Stable career history"],
    considerations: ["Previously applied at another council in the network", "Available in 3 weeks"],
  },
  {
    name: "Michael Chen", role: "ASYE Social Worker", pqe: "NQ", match: 82, swe: "Active",
    visa: "graduate_visa", visaLabel: "🎓 Graduate Visa", rtw: "time_limited", rtwLabel: "⏳ Visa expires Mar 2027 — sponsorship needed for extension",
    summary: "Newly qualified with strong placement experience in children's services. Final placement was in R&A at a neighbouring authority. Enthusiastic and highly motivated.",
    strengths: ["Final placement in children's R&A", "Research dissertation on child neglect", "Bilingual (English/Mandarin)"],
    considerations: ["NQ — will need ASYE support programme", "Graduate Visa expires March 2027 — will need sponsorship to retain beyond that date"],
  },
];

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState("action");
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);

  const tabs = [
    { id: "action", label: "Action Required", icon: <AlertTriangle size={16} /> },
    { id: "vacancies", label: "My Vacancies", icon: <Briefcase size={16} /> },
    { id: "candidates", label: "Review Candidates", icon: <Users size={16} /> },
    { id: "interviews", label: "My Interviews", icon: <Calendar size={16} /> },
    { id: "scoring", label: "Score Interviews", icon: <Star size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "#4c1d95", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <UserCheck size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>RecruitSW</span>
          <span style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 600, background: "rgba(196,181,253,0.2)", padding: "2px 8px", borderRadius: 4 }}>HIRING MANAGER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Children&apos;s Services</span>
          <div style={{ width: 32, height: 32, background: "#8b5cf6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "white" }}>JO</div>
        </div>
      </header>

      <nav className="tab-nav" style={{ background: "white" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)} style={activeTab === tab.id ? { color: "#7c3aed", borderBottomColor: "#7c3aed" } : {}}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{tab.icon} {tab.label}</span>
          </button>
        ))}
      </nav>

      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {activeTab === "action" && <ActionTab />}
        {activeTab === "vacancies" && <ManagerVacancies />}
        {activeTab === "candidates" && <ReviewCandidates expandedCandidate={expandedCandidate} setExpandedCandidate={setExpandedCandidate} />}
        {activeTab === "interviews" && <ManagerInterviews />}
        {activeTab === "scoring" && <ScoringTab />}
      </main>
    </div>
  );
}

function ActionTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back, James</h2>
      <p style={{ color: "var(--text-secondary)" }}>Here&apos;s what needs your attention today.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <div className="stat-card"><span className="stat-value" style={{ color: "#7c3aed" }}>2</span><span className="stat-label">Active Vacancies</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-amber)" }}>4</span><span className="stat-label">Candidates to Review</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-blue)" }}>1</span><span className="stat-label">Interview This Week</span></div>
        <div className="stat-card"><span className="stat-value" style={{ color: "var(--status-green)" }}>1</span><span className="stat-label">Scorecard to Complete</span></div>
      </div>

      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={18} color="var(--status-amber)" /> Needs Your Decision
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { text: "4 candidates shortlisted for Senior SW — Children in Need. Review and approve for interview.", action: "Review Now", urgent: true },
            { text: "Interview scorecard pending for last week's Team Manager candidate.", action: "Complete Score", urgent: true },
            { text: "ASYE vacancy has 5 shortlisted candidates — schedule interviews when ready.", action: "View", urgent: false },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: a.urgent ? "#fef3c7" : "#f8fafc", borderRadius: 8 }}>
              {a.urgent ? <AlertCircle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}
              <span style={{ flex: 1, fontSize: 13 }}>{a.text}</span>
              <button className="btn btn-outline btn-sm">{a.action}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Data Protection Notice</strong> — You are viewing candidate data as part of a legitimate recruitment process under Article 6(1)(e).
          Candidate information must not be shared outside the interview panel. All actions are logged for audit purposes.
        </span>
      </div>
    </div>
  );
}

function ManagerVacancies() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>My Vacancies</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {myVacancies.map((v) => (
          <div key={v.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{v.role}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{v.id} &middot; {v.salary}</p>
              </div>
              <span className={`badge ${v.status === "live" ? "badge-green" : "badge-blue"}`}>{v.status}</span>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 14 }}>
              <span><strong>{v.shortlisted}</strong> shortlisted</span>
              <span><strong>{v.interviewing}</strong> interviewing</span>
              <span><strong>{v.daysOpen}</strong> days open</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline btn-sm"><Users size={14} /> View Candidates</button>
              <button className="btn btn-outline btn-sm"><Calendar size={14} /> Schedule Interviews</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCandidates({ expandedCandidate, setExpandedCandidate }: { expandedCandidate: number | null; setExpandedCandidate: (n: number | null) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Review Shortlisted Candidates</h2>
      <p style={{ color: "var(--text-secondary)" }}>PSP has screened and shortlisted these candidates for your Senior Social Worker vacancy. Review each and decide whether to invite to interview.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {candidatesForReview.map((c, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${c.match >= 90 ? "var(--status-green)" : c.match >= 85 ? "var(--status-blue)" : "var(--status-amber)"}` }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, cursor: "pointer" }} onClick={() => setExpandedCandidate(expandedCandidate === i ? null : i)}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7c3aed", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.role} &middot; {c.pqe} PQE &middot; SWE: {c.swe}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span className={`badge ${c.match >= 90 ? "badge-green" : c.match >= 80 ? "badge-blue" : "badge-amber"}`}>Match: {c.match}%</span>
                    <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>{c.visaLabel}</span>
                    <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`} style={{ fontSize: 11 }}>{c.rtwLabel}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} style={{ transform: expandedCandidate === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </div>

            {/* Expanded Detail */}
            {expandedCandidate === i && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>{c.summary}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--status-green)", marginBottom: 8 }}>✅ Strengths</h4>
                    <ul style={{ paddingLeft: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                      {c.strengths.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                  <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--status-amber)", marginBottom: 8 }}>⚠️ Considerations</h4>
                    <ul style={{ paddingLeft: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                      {c.considerations.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Visa/Sponsorship Warning */}
                {c.rtw === "requires_sponsorship" && (
                  <div className="visa-tracker needs-sponsor">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Plane size={18} color="var(--status-amber)" />
                      <strong style={{ color: "#92400e" }}>Sponsorship Information</strong>
                    </div>
                    <ul style={{ paddingLeft: 16, fontSize: 13, color: "#92400e", display: "flex", flexDirection: "column", gap: 4 }}>
                      <li>This candidate holds a <strong>Skilled Worker Visa</strong> and requires your council to sponsor them</li>
                      <li>Your council must hold a valid <strong>UKVI Sponsor Licence</strong></li>
                      <li>A <strong>Certificate of Sponsorship (CoS)</strong> must be issued before their start date</li>
                      <li>Social Workers are on the <strong>Shortage Occupation List</strong> — minimum salary: £20,960</li>
                      <li>The council&apos;s HR/immigration team should be consulted before making an offer</li>
                    </ul>
                  </div>
                )}
                {c.rtw === "time_limited" && (
                  <div className="visa-tracker" style={{ borderColor: "var(--status-blue)", background: "#eff6ff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Clock size={18} color="var(--status-blue)" />
                      <strong style={{ color: "#1e40af" }}>Visa Note</strong>
                    </div>
                    <p style={{ fontSize: 13, color: "#1e40af" }}>
                      This candidate&apos;s <strong>Graduate Visa</strong> allows full employment now but expires March 2027.
                      If you wish to retain them beyond that date, the council will need to sponsor a Skilled Worker Visa.
                      No immediate action required — flag to HR if you decide to proceed to offer.
                    </p>
                  </div>
                )}

                {/* Decision Buttons */}
                <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                  <button className="btn" style={{ background: "#7c3aed", color: "white" }}><ThumbsUp size={16} /> Invite to Interview</button>
                  <button className="btn btn-outline"><ThumbsDown size={16} /> Not Suitable</button>
                  <button className="btn btn-outline"><MessageSquare size={16} /> Ask PSP a Question</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Data Protection</strong> — Candidate data is shared with you as part of a legitimate recruitment process under Article 6(1)(e).
          Do not share candidate details outside the interview panel. All your actions (views, decisions, scores) are logged for audit and equality monitoring purposes.
        </span>
      </div>
    </div>
  );
}

function ManagerInterviews() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>My Interviews</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ borderLeft: "4px solid #7c3aed" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 8 }}>Tomorrow</span>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Sarah Mitchell — Senior SW Interview</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Tuesday 25 March 2026, 10:00 - 11:00 &middot; MS Teams</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Panel: You, Rachel Adams</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline btn-sm"><FileText size={14} /> Interview Pack</button>
              <button className="btn btn-outline btn-sm"><Star size={14} /> Scorecard</button>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 10, background: "#f0fdf4", borderRadius: 8, fontSize: 12 }}>
            <strong>Right to Work:</strong> 🇬🇧 British Citizen — No sponsorship required. RTW verified.
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Panel Contingency</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>If a panel member can&apos;t attend, mark them as unavailable and assign a substitute. Minimum 2 panel members required.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} color="var(--status-green)" />
              <span style={{ fontSize: 13 }}>James Okafor (You)</span>
            </div>
            <div style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} color="var(--status-green)" />
              <span style={{ fontSize: 13 }}>Rachel Adams</span>
            </div>
            <button className="btn btn-outline btn-sm"><Users size={14} /> Add Substitute</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoringTab() {
  const competencies = ["Safeguarding Knowledge", "Assessment Skills", "Partnership Working", "Communication", "Professional Development"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Interview Scoring</h2>
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Sarah Mitchell — Senior Social Worker</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Interview: 25 March 2026 &middot; Score independently before viewing panel consensus</p>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Competency</th>
                <th>Score (1-5)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {competencies.map((comp, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{comp}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid var(--border)", background: n <= (i === 0 ? 4 : i === 1 ? 5 : 0) ? "#7c3aed" : "white", color: n <= (i === 0 ? 4 : i === 1 ? 5 : 0) ? "white" : "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <input type="text" placeholder="Key observations..." style={{ width: "100%", padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Overall Strengths (mandatory)</label>
            <textarea placeholder="What were the candidate's key strengths?" style={{ width: "100%", padding: 10, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, minHeight: 60 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Concerns (mandatory)</label>
            <textarea placeholder="Any concerns or areas for development?" style={{ width: "100%", padding: 10, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, minHeight: 60 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" style={{ background: "#7c3aed", color: "white" }}>Submit Scores</button>
            <button className="btn btn-outline">Save Draft</button>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 10, background: "#f3e8ff", borderRadius: 8, fontSize: 12, color: "#6b21a8" }}>
          <strong>Note:</strong> You must submit your scores before you can view other panel members&apos; assessments. This prevents social proof bias and ensures independent evaluation.
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ size, color, ...props }: { size: number; color: string; [key: string]: unknown }) {
  return <AlertTriangle size={size} color={color} {...props} />;
}
