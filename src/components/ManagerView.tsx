"use client";
import { useState, useMemo } from "react";
import {
  UserCheck, Briefcase, Users, Calendar, CheckCircle2,
  AlertTriangle, Clock, Eye, Star, ThumbsUp, ThumbsDown,
  Shield, Plane, MessageSquare, ChevronRight, FileText,
  Mail, Send, Link, Video, X, FileDown, Paperclip,
  PlusCircle, Heart, TrendingDown, Building2, ClipboardList
} from "lucide-react";
import { useData, Vacancy, Candidate } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";

/* ─── Demo motivation / counter-offer data ─────────────────────── */

interface CandidateMotivation {
  whyLeaving: string;
  warmStatus: "active" | "open" | "passive";
  counterOfferRisk: "low" | "medium" | "high";
  counterOfferDetail: string;
}

const candidateMotivations: Record<string, CandidateMotivation> = {
  "C-001": {
    whyLeaving: "Seeking career progression — wants more complex court work. Currently limited to CIN cases.",
    warmStatus: "active",
    counterOfferRisk: "medium",
    counterOfferDetail: "4 years at Liverpool CC",
  },
  "C-003": {
    whyLeaving: "Workload — current caseload of 26 with no admin support. Wants better work-life balance.",
    warmStatus: "active",
    counterOfferRisk: "low",
    counterOfferDetail: "Only 1 year at current council, wants to leave",
  },
  "C-005": {
    whyLeaving: "Relocation — partner moving to Manchester area. Happy in current role but needs to move.",
    warmStatus: "open",
    counterOfferRisk: "low",
    counterOfferDetail: "Relocating — counter-offer won't solve geography",
  },
  "C-004": {
    whyLeaving: "NQ seeking ASYE placement. Wants a council with strong ASYE support programme.",
    warmStatus: "active",
    counterOfferRisk: "low",
    counterOfferDetail: "NQ — no counter-offer risk",
  },
};

/* ─── Demo vacancy enrichment data ─────────────────────────────── */

interface VacancyExtra {
  caseload: string;
  teamComposition: string;
  supervision: string;
}

const vacancyExtras: Record<string, VacancyExtra> = {
  "V-2024-001": {
    caseload: "15-18 cases",
    teamComposition: "6 SWs + 1 TM + 2 family support workers",
    supervision: "Monthly formal, weekly informal, group supervision fortnightly",
  },
  "V-2024-003": {
    caseload: "12-15 cases (ASYE protected)",
    teamComposition: "8 SWs + 2 TMs + 1 practice educator + 3 family support workers",
    supervision: "Weekly formal (ASYE), fortnightly group supervision, dedicated ASYE support",
  },
};

/* ─── Demo PSP messages ────────────────────────────────────────── */

interface PspMessage {
  from: "manager" | "psp";
  text: string;
  time: string;
}

const demoPspMessages: Record<string, PspMessage[]> = {
  "C-001": [
    { from: "manager", text: "Can you check if Sarah has LAC experience?", time: "Yesterday, 2:15 PM" },
    { from: "psp", text: "Yes, confirmed 2 years LAC at Liverpool CC — Conor, PSP", time: "Yesterday, 3:42 PM" },
  ],
};

/* ─── Helper components ────────────────────────────────────────── */

function WarmStatusBadge({ status }: { status: "active" | "open" | "passive" }) {
  const colors = {
    active: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    open: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
    passive: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  };
  const c = colors[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CounterOfferBadge({ risk, detail }: { risk: "low" | "medium" | "high"; detail: string }) {
  const colors = {
    low: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    medium: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    high: { bg: "#fecaca", text: "#991b1b", border: "#fca5a5" },
  };
  const c = colors[risk];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}` }} title={detail}>
      <TrendingDown size={12} />
      Counter-offer risk: {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────── */

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState("action");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const { vacancies, candidates, updateCandidate, addVacancyRequest, showToast } = useData();

  const myVacancies = useMemo(
    () => vacancies.filter((v) => v.manager === "James Okafor"),
    [vacancies]
  );

  const myVacancyIds = useMemo(
    () => myVacancies.map((v) => v.id),
    [myVacancies]
  );

  const myCandidates = useMemo(
    () => candidates.filter((c) => c.assignedVacancy && myVacancyIds.includes(c.assignedVacancy)),
    [candidates, myVacancyIds]
  );

  const candidatesToReview = useMemo(
    () => myCandidates.filter((c) => c.status !== "rejected" && c.status !== "hired" && c.status !== "withdrawn"),
    [myCandidates]
  );

  const interviewingCandidates = useMemo(
    () => myCandidates.filter((c) => c.status === "interviewing"),
    [myCandidates]
  );

  const tabs = [
    { id: "action", label: "Action Required", icon: <AlertTriangle size={16} /> },
    { id: "vacancies", label: "My Vacancies", icon: <Briefcase size={16} /> },
    { id: "candidates", label: "Review Candidates", icon: <Users size={16} /> },
    { id: "interviews", label: "My Interviews", icon: <Calendar size={16} /> },
    { id: "scoring", label: "Score Interviews", icon: <Star size={16} /> },
    { id: "request", label: "Request Vacancy", icon: <PlusCircle size={16} /> },
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
        {activeTab === "action" && (
          <ActionTab
            myVacancies={myVacancies}
            candidatesToReview={candidatesToReview}
            interviewingCandidates={interviewingCandidates}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        )}
        {activeTab === "vacancies" && (
          <ManagerVacancies
            myVacancies={myVacancies}
            myCandidates={myCandidates}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        )}
        {activeTab === "candidates" && (
          <ReviewCandidates
            candidates={candidatesToReview}
            vacancies={myVacancies}
            expandedCandidate={expandedCandidate}
            setExpandedCandidate={setExpandedCandidate}
            updateCandidate={updateCandidate}
            showToast={showToast}
          />
        )}
        {activeTab === "interviews" && (
          <ManagerInterviews
            interviewingCandidates={interviewingCandidates}
            showToast={showToast}
          />
        )}
        {activeTab === "scoring" && (
          <ScoringTab
            interviewingCandidates={interviewingCandidates}
            showToast={showToast}
            updateCandidate={updateCandidate}
          />
        )}
        {activeTab === "request" && (
          <VacancyRequestTab
            addVacancyRequest={addVacancyRequest}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}

/* ─── Action Tab ──────────────────────────────────────────────── */

function ActionTab({
  myVacancies,
  candidatesToReview,
  interviewingCandidates,
  setActiveTab,
  showToast,
}: {
  myVacancies: Vacancy[];
  candidatesToReview: Candidate[];
  interviewingCandidates: Candidate[];
  setActiveTab: (tab: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  const shortlistedCount = candidatesToReview.filter((c) => c.status === "shortlisted").length;
  const interviewCount = interviewingCandidates.length;
  const scorecardPending = interviewCount > 0 ? 1 : 0;

  const actionItems = [
    {
      text: `${shortlistedCount} candidate${shortlistedCount !== 1 ? "s" : ""} shortlisted — review and approve for interview.`,
      action: "Review Now",
      urgent: shortlistedCount > 0,
      onClick: () => setActiveTab("candidates"),
    },
    {
      text: "Interview scorecard pending — complete your scoring after interviews.",
      action: "Complete Score",
      urgent: scorecardPending > 0,
      onClick: () => setActiveTab("scoring"),
    },
    {
      text: "ASYE vacancy has candidates — schedule interviews when ready.",
      action: "View",
      urgent: false,
      onClick: () => setActiveTab("vacancies"),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back, James</h2>
      <p style={{ color: "var(--text-secondary)" }}>Here&apos;s what needs your attention today.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("vacancies")}>
          <span className="stat-value" style={{ color: "#7c3aed" }}>{myVacancies.length}</span>
          <span className="stat-label">Active Vacancies</span>
        </div>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("candidates")}>
          <span className="stat-value" style={{ color: "var(--status-amber)" }}>{shortlistedCount}</span>
          <span className="stat-label">Candidates to Review</span>
        </div>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("interviews")}>
          <span className="stat-value" style={{ color: "var(--status-blue)" }}>{interviewCount}</span>
          <span className="stat-label">Interviews Scheduled</span>
        </div>
        <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("scoring")}>
          <span className="stat-value" style={{ color: "var(--status-green)" }}>{scorecardPending}</span>
          <span className="stat-label">Scorecards to Complete</span>
        </div>
      </div>

      <div className="card" style={{ borderLeft: "4px solid var(--status-amber)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={18} color="var(--status-amber)" /> Needs Your Decision
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {actionItems.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: a.urgent ? "#fef3c7" : "#f8fafc", borderRadius: 8 }}>
              {a.urgent ? <AlertTriangle size={16} color="var(--status-amber)" /> : <Clock size={16} color="var(--text-secondary)" />}
              <span style={{ flex: 1, fontSize: 13 }}>{a.text}</span>
              <button className="btn btn-outline btn-sm" onClick={a.onClick}>{a.action}</button>
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

/* ─── Vacancies Tab ───────────────────────────────────────────── */

function ManagerVacancies({
  myVacancies,
  myCandidates,
  setActiveTab,
  showToast,
}: {
  myVacancies: Vacancy[];
  myCandidates: Candidate[];
  setActiveTab: (tab: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>My Vacancies</h2>
        <button className="btn" style={{ background: "#7c3aed", color: "white" }} onClick={() => setActiveTab("request")}>
          <PlusCircle size={16} /> Request New Vacancy
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {myVacancies.map((v) => {
          const extra = vacancyExtras[v.id];
          const assignedCandidates = myCandidates.filter((c) => c.assignedVacancy === v.id);
          return (
            <div key={v.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{v.role}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{v.id} &middot; {v.salary}</p>
                </div>
                <span className={`badge ${v.status === "live" ? "badge-green" : v.status === "interviewing" ? "badge-blue" : "badge-amber"}`}>{v.status}</span>
              </div>

              <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 14 }}>
                <span><strong>{v.shortlisted}</strong> shortlisted</span>
                <span><strong>{v.applicants}</strong> applicants</span>
                <span><strong>{v.daysOpen}</strong> days open</span>
              </div>

              {/* Caseload / Team Info */}
              {extra && (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                  <div style={{ padding: 10, background: "#f3e8ff", borderRadius: 8, fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#6b21a8", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <ClipboardList size={12} /> Caseload
                    </div>
                    <span style={{ color: "#4c1d95" }}>{extra.caseload}</span>
                  </div>
                  <div style={{ padding: 10, background: "#f3e8ff", borderRadius: 8, fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#6b21a8", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={12} /> Team
                    </div>
                    <span style={{ color: "#4c1d95" }}>{extra.teamComposition}</span>
                  </div>
                  <div style={{ padding: 10, background: "#f3e8ff", borderRadius: 8, fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#6b21a8", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Shield size={12} /> Supervision
                    </div>
                    <span style={{ color: "#4c1d95" }}>{extra.supervision}</span>
                  </div>
                </div>
              )}

              {/* Assigned candidates summary */}
              {assignedCandidates.length > 0 && (
                <div style={{ marginTop: 12, padding: 10, background: "#f8fafc", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>Candidates assigned:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {assignedCandidates.map((c) => (
                      <span key={c.id} className={`badge ${c.status === "shortlisted" ? "badge-green" : c.status === "interviewing" ? "badge-blue" : "badge-amber"}`}>
                        {c.name} ({c.status})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("candidates")}>
                  <Users size={14} /> View Candidates
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => showToast(`Schedule interviews for ${v.role} — contact PSP to coordinate panel availability.`, "info")}>
                  <Calendar size={14} /> Schedule Interviews
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Review Candidates Tab ───────────────────────────────────── */

function ReviewCandidates({
  candidates,
  vacancies,
  expandedCandidate,
  setExpandedCandidate,
  updateCandidate,
  showToast,
}: {
  candidates: Candidate[];
  vacancies: Vacancy[];
  expandedCandidate: string | null;
  setExpandedCandidate: (id: string | null) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  const vacancyMap = useMemo(() => {
    const map: Record<string, Vacancy> = {};
    vacancies.forEach((v) => { map[v.id] = v; });
    return map;
  }, [vacancies]);

  const [inviteCandidate, setInviteCandidate] = useState<Candidate | null>(null);
  const [askPspCandidate, setAskPspCandidate] = useState<string | null>(null);
  const [pspQuestion, setPspQuestion] = useState("");

  const sendInvite = () => {
    if (!inviteCandidate) return;
    updateCandidate(inviteCandidate.id, { status: "interviewing" });
    showToast(`Interview invite sent to ${inviteCandidate.name} — they'll select available slots from your diary`, "success");
    setInviteCandidate(null);
  };

  const sendPspQuestion = (candidateId: string, candidateName: string) => {
    if (!pspQuestion.trim()) return;
    showToast(`Question sent to PSP about ${candidateName}. They will respond within 4 working hours.`, "info");
    setPspQuestion("");
    setAskPspCandidate(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Email Preview Modal */}
      <Modal open={!!inviteCandidate} onClose={() => setInviteCandidate(null)} title="Send Interview Invitation" width={620}>
        {inviteCandidate && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)", width: 40 }}>To:</span>
                  <span>{inviteCandidate.name} &lt;{inviteCandidate.email}&gt;</span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)", width: 40 }}>From:</span>
                  <span>Manchester City Council via RecruitSW &lt;interviews@recruitsw.co.uk&gt;</span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)", width: 40 }}>Re:</span>
                  <span style={{ fontWeight: 600 }}>Interview Invitation — {inviteCandidate.assignedVacancy ? vacancyMap[inviteCandidate.assignedVacancy]?.role : inviteCandidate.role}</span>
                </div>
              </div>
              <div style={{ padding: 20, fontSize: 14, lineHeight: 1.8 }}>
                <p>Dear {inviteCandidate.name},</p>
                <p style={{ marginTop: 12 }}>
                  Thank you for your application for the role of <strong>{inviteCandidate.assignedVacancy ? vacancyMap[inviteCandidate.assignedVacancy]?.role : inviteCandidate.role}</strong> at Manchester City Council.
                </p>
                <p style={{ marginTop: 8 }}>
                  We are pleased to invite you to interview. Please use the link below to <strong>select your available time slots</strong> from the interview panel&apos;s diary:
                </p>

                <div style={{ margin: "16px 0", padding: 16, background: "#eff6ff", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                    <Calendar size={20} color="#1e40af" />
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#1e40af" }}>Select Your Interview Time</span>
                  </div>
                  <div style={{ background: "white", padding: "10px 16px", borderRadius: 8, fontFamily: "monospace", fontSize: 13, color: "var(--council-blue)", border: "1px solid #bfdbfe", cursor: "pointer" }}>
                    https://interview.recruitsw.co.uk/book/mcc-{(inviteCandidate.assignedVacancy || "").toLowerCase()}
                  </div>
                  <p style={{ fontSize: 12, color: "#1e40af", marginTop: 8 }}>
                    Available slots are synced with the panel&apos;s Microsoft 365 calendars
                  </p>
                </div>

                <p><strong>Interview details:</strong></p>
                <ul style={{ paddingLeft: 20, fontSize: 13 }}>
                  <li><strong>Format:</strong> MS Teams Video Call (link sent on confirmation)</li>
                  <li><strong>Duration:</strong> 1 hour</li>
                  <li><strong>Panel:</strong> James Okafor (Service Manager), Rachel Adams (Team Manager)</li>
                  <li><strong>Preparation:</strong> Please prepare a 10-minute case presentation (anonymised)</li>
                </ul>

                {inviteCandidate.rtw === "requires_sponsorship" && (
                  <div style={{ marginTop: 12, padding: 10, background: "#fffbeb", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
                    <strong>Note:</strong> We understand you require visa sponsorship. This will be discussed as part of the interview process. Manchester City Council holds a valid UKVI Sponsor Licence.
                  </div>
                )}

                <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                  If you have any questions, please reply to this email or contact the recruitment team.
                </p>
                <p style={{ marginTop: 8 }}>Best regards,<br /><strong>Manchester City Council Recruitment Team</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>via RecruitSW</span></p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge badge-gray" style={{ padding: "6px 12px" }}>
                <FileDown size={12} style={{ marginRight: 4 }} /> {inviteCandidate.cvFileName || "CV.pdf"}
              </span>
              <span className="badge badge-gray" style={{ padding: "6px 12px" }}>
                <FileText size={12} style={{ marginRight: 4 }} /> Interview_Scorecard.pdf
              </span>
            </div>

            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#166534" }}>
              <strong>How it works:</strong> The candidate clicks the booking link and sees time slots when <strong>all panel members</strong> are free (synced from your Microsoft 365 calendars). Once they select slots, you&apos;ll be notified and can confirm the time. A calendar invite with the MS Teams link is sent automatically.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-outline" onClick={() => setInviteCandidate(null)}>Cancel</button>
              <button className="btn" style={{ background: "#7c3aed", color: "white" }} onClick={sendInvite}>
                <Send size={16} /> Send Interview Invitation
              </button>
            </div>
          </div>
        )}
      </Modal>

      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Review Shortlisted Candidates</h2>
      <p style={{ color: "var(--text-secondary)" }}>PSP has screened and shortlisted these candidates for your vacancies. Review each and decide whether to invite to interview.</p>

      {candidates.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
          <Users size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p>No candidates to review at this time.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {candidates.map((c) => {
          const vacancy = c.assignedVacancy ? vacancyMap[c.assignedVacancy] : null;
          const isExpanded = expandedCandidate === c.id;
          const motivation = candidateMotivations[c.id];
          const existingMessages = demoPspMessages[c.id] || [];

          return (
            <div key={c.id} className="card" style={{ borderLeft: `4px solid ${c.match >= 90 ? "var(--status-green)" : c.match >= 85 ? "var(--status-blue)" : "var(--status-amber)"}` }}>
              {/* Header */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, cursor: "pointer" }}
                onClick={() => setExpandedCandidate(isExpanded ? null : c.id)}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7c3aed", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {c.role} &middot; {c.pqe} PQE &middot; SWE: {c.sweStatus === "active" ? "Active" : c.sweStatus}
                      {vacancy && <> &middot; <em>{vacancy.role}</em></>}
                    </p>
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      <span className={`badge ${c.match >= 90 ? "badge-green" : c.match >= 80 ? "badge-blue" : "badge-amber"}`}>Match: {c.match}%</span>
                      <span className={`badge ${c.rtw === "verified" ? "badge-green" : "badge-amber"}`}>{c.visaDetails.split(" — ")[0]}</span>
                      <span className={`badge ${c.status === "interviewing" ? "badge-blue" : c.status === "shortlisted" ? "badge-green" : "badge-amber"}`}>{c.status}</span>
                      {motivation && <WarmStatusBadge status={motivation.warmStatus} />}
                    </div>

                    {/* Motivation - always visible */}
                    {motivation && (
                      <div style={{ marginTop: 8, padding: "6px 10px", background: "#faf5ff", borderRadius: 6, border: "1px solid #e9d5ff", fontSize: 12 }}>
                        <span style={{ fontWeight: 700, color: "#6b21a8" }}>Why they&apos;re leaving: </span>
                        <span style={{ color: "#581c87" }}>{motivation.whyLeaving}</span>
                      </div>
                    )}

                    {/* Counter-offer risk + CV link - always visible */}
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {motivation && <CounterOfferBadge risk={motivation.counterOfferRisk} detail={motivation.counterOfferDetail} />}
                      {c.cvUploaded && (
                        <button
                          onClick={(e) => { e.stopPropagation(); showToast(`Opening ${c.cvFileName}...`, "info"); }}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#f8fafc", color: "#7c3aed", border: "1px solid #e9d5ff", cursor: "pointer" }}
                        >
                          <Paperclip size={12} /> {c.cvFileName}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* CV & Submission Info */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, background: "#7c3aed15", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileDown size={20} color="#7c3aed" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.cvFileName || "CV not uploaded"}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Submitted by {c.submittedBy} on {c.submittedAt}</div>
                      </div>
                      {c.cvUploaded && (
                        <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast(`Opening ${c.cvFileName}...`, "info")}>
                          <Eye size={14} /> View CV
                        </button>
                      )}
                    </div>
                    {c.rtw === "requires_sponsorship" && (
                      <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, border: "1px solid #fcd34d", display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
                        <Plane size={18} color="var(--status-amber)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 12, color: "#92400e" }}>REQUIRES SPONSORSHIP</div>
                          <div style={{ fontSize: 11, color: "#92400e" }}>Council must issue CoS</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8 }}>
                    <p style={{ fontSize: 14, lineHeight: 1.6 }}>{c.notes}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                      Location: {c.location} &middot; Available: {c.available} &middot; Source: {c.source}
                      {c.crossCouncil && <> &middot; <strong style={{ color: "var(--status-amber)" }}>Previously applied at another council</strong></>}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--status-green)", marginBottom: 8 }}>Compliance Status</h4>
                      <ul style={{ paddingLeft: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                        <li>DBS: {c.dbs === "done" ? "Complete" : c.dbs === "pending" ? "Pending" : "Issue"}</li>
                        <li>Reference 1: {c.ref1 === "done" ? "Received" : c.ref1 === "pending" ? "Pending" : "Issue"}</li>
                        <li>Reference 2: {c.ref2 === "done" ? "Received" : c.ref2 === "pending" ? "Pending" : "Issue"}</li>
                        <li>Qualifications: {c.quals === "done" ? "Verified" : c.quals === "pending" ? "Pending" : "Issue"}</li>
                      </ul>
                    </div>
                    <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--status-amber)", marginBottom: 8 }}>Right to Work</h4>
                      <ul style={{ paddingLeft: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                        <li>{c.visaDetails}</li>
                        {c.visaExpiry && <li>Visa expiry: {c.visaExpiry}</li>}
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
                        <li>This candidate requires your council to sponsor their visa</li>
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
                        This candidate&apos;s visa allows full employment now but expires {c.visaExpiry || "soon"}.
                        If you wish to retain them beyond that date, the council will need to sponsor a Skilled Worker Visa.
                        No immediate action required — flag to HR if you decide to proceed to offer.
                      </p>
                    </div>
                  )}

                  {/* Ask PSP section */}
                  {askPspCandidate === c.id ? (
                    <div style={{ padding: 16, background: "#faf5ff", borderRadius: 10, border: "1px solid #e9d5ff" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#6b21a8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <MessageSquare size={16} /> Ask PSP about {c.name}
                      </div>
                      {/* Existing messages */}
                      {existingMessages.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                          {existingMessages.map((msg, mi) => (
                            <div key={mi} style={{ padding: 10, borderRadius: 8, background: msg.from === "manager" ? "#ede9fe" : "white", border: "1px solid #e9d5ff", fontSize: 13 }}>
                              <div style={{ fontWeight: 700, fontSize: 11, color: msg.from === "manager" ? "#6b21a8" : "#166534", marginBottom: 2 }}>
                                {msg.from === "manager" ? "You" : "PSP (Conor)"} &middot; {msg.time}
                              </div>
                              {msg.text}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          value={pspQuestion}
                          onChange={(e) => setPspQuestion(e.target.value)}
                          placeholder="Type your question about this candidate..."
                          style={{ flex: 1, padding: "10px 12px", border: "1px solid #d8b4fe", borderRadius: 8, fontSize: 13, outline: "none" }}
                          onKeyDown={(e) => { if (e.key === "Enter") sendPspQuestion(c.id, c.name); }}
                        />
                        <button
                          className="btn"
                          style={{ background: "#7c3aed", color: "white" }}
                          onClick={() => sendPspQuestion(c.id, c.name)}
                        >
                          <Send size={14} /> Send to PSP
                        </button>
                        <button className="btn btn-outline" onClick={() => { setAskPspCandidate(null); setPspQuestion(""); }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Decision Buttons */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                    {c.status !== "interviewing" && (
                      <button
                        className="btn"
                        style={{ background: "#7c3aed", color: "white" }}
                        onClick={() => setInviteCandidate(c)}
                      >
                        <ThumbsUp size={16} /> Invite to Interview
                      </button>
                    )}
                    {c.status === "interviewing" && (
                      <span className="badge badge-blue" style={{ padding: "8px 16px", fontSize: 13 }}>
                        <Calendar size={12} style={{ marginRight: 4 }} /> Invited — awaiting diary selection
                      </span>
                    )}
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        updateCandidate(c.id, { status: "rejected" });
                        showToast(`${c.name} marked as not suitable`, "info");
                      }}
                    >
                      <ThumbsDown size={16} /> Not Suitable
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setAskPspCandidate(askPspCandidate === c.id ? null : c.id)}
                    >
                      <MessageSquare size={16} /> Ask PSP
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

/* ─── Interviews Tab ──────────────────────────────────────────── */

function ManagerInterviews({
  interviewingCandidates,
  showToast,
}: {
  interviewingCandidates: Candidate[];
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>My Interviews</h2>

      {interviewingCandidates.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
          <Calendar size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p>No interviews scheduled. Invite candidates from the Review tab.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {interviewingCandidates.map((c) => {
          const motivation = candidateMotivations[c.id];
          return (
            <div key={c.id} className="card" style={{ borderLeft: "4px solid #7c3aed" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: 8 }}>Upcoming</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name} — {c.role} Interview</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Panel: You, Rachel Adams &middot; MS Teams</p>
                  {motivation && (
                    <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <WarmStatusBadge status={motivation.warmStatus} />
                      <CounterOfferBadge risk={motivation.counterOfferRisk} detail={motivation.counterOfferDetail} />
                    </div>
                  )}
                  {motivation && (
                    <div style={{ marginTop: 6, padding: "4px 8px", background: "#faf5ff", borderRadius: 6, fontSize: 12, color: "#581c87", border: "1px solid #e9d5ff" }}>
                      <strong>Why leaving:</strong> {motivation.whyLeaving}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => showToast(`Interview pack for ${c.name} — documentation will be sent to your email.`, "info")}
                  >
                    <FileText size={14} /> Interview Pack
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => showToast(`Opening ${c.cvFileName}...`, "info")}
                  >
                    <Paperclip size={14} /> CV
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => showToast(`Scorecard for ${c.name} is ready. Complete it after the interview in the Score Interviews tab.`, "info")}
                  >
                    <Star size={14} /> Scorecard
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: c.rtw === "verified" ? "#f0fdf4" : "#fffbeb", borderRadius: 8, fontSize: 12 }}>
                <strong>Right to Work:</strong> {c.visaDetails}
                {c.rtw === "verified" && " — RTW verified."}
                {c.rtw === "requires_sponsorship" && " — Sponsorship required. Consult HR before making an offer."}
                {c.rtw === "time_limited" && ` — Visa expires ${c.visaExpiry}. Flag to HR if proceeding to offer.`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Panel Contingency</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>If a panel member can&apos;t attend, mark them as unavailable and assign a substitute. Minimum 2 panel members required.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} color="var(--status-green)" />
            <span style={{ fontSize: 13 }}>James Okafor (You)</span>
          </div>
          <div style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} color="var(--status-green)" />
            <span style={{ fontSize: 13 }}>Rachel Adams</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => showToast("Contact PSP to arrange a substitute panel member.", "info")}>
            <Users size={14} /> Add Substitute
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Scoring Tab ─────────────────────────────────────────────── */

function ScoringTab({
  interviewingCandidates,
  showToast,
  updateCandidate,
}: {
  interviewingCandidates: Candidate[];
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
}) {
  const competencies = [
    { name: "Safeguarding Knowledge & Practice", desc: "Understanding of child protection frameworks, s47, PLO, thresholds" },
    { name: "Assessment & Analysis Skills", desc: "Ability to gather info, analyse risk, write clear assessments" },
    { name: "Partnership Working & Communication", desc: "Multi-agency collaboration, family engagement, professional communication" },
    { name: "Professional Development & Reflective Practice", desc: "Commitment to CPD, use of supervision, reflective capacity" },
    { name: "Values, Ethics & Anti-Discriminatory Practice", desc: "BASW Code of Ethics, anti-oppressive practice, cultural competence" },
  ];

  const [scores, setScores] = useState<Record<string, Record<number, number>>>({});
  const [compNotes, setCompNotes] = useState<Record<string, Record<number, string>>>({});
  const [strengths, setStrengths] = useState<Record<string, string>>({});
  const [concerns, setConcerns] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    interviewingCandidates.length > 0 ? interviewingCandidates[0].id : null
  );

  const candidate = interviewingCandidates.find((c) => c.id === selectedCandidate);
  const candidateScores = selectedCandidate ? (scores[selectedCandidate] || {}) : {};
  const candidateNotes = selectedCandidate ? (compNotes[selectedCandidate] || {}) : {};
  const candidateStrengths = selectedCandidate ? (strengths[selectedCandidate] || "") : "";
  const candidateConcerns = selectedCandidate ? (concerns[selectedCandidate] || "") : "";
  const candidateRecommendation = selectedCandidate ? (recommendation[selectedCandidate] || "") : "";
  const isSubmitted = selectedCandidate ? (submitted[selectedCandidate] || false) : false;

  const handleScore = (compIndex: number, score: number) => {
    if (!selectedCandidate || isSubmitted) return;
    setScores((prev) => ({
      ...prev,
      [selectedCandidate]: {
        ...(prev[selectedCandidate] || {}),
        [compIndex]: score,
      },
    }));
  };

  const handleCompNote = (compIndex: number, note: string) => {
    if (!selectedCandidate || isSubmitted) return;
    setCompNotes((prev) => ({
      ...prev,
      [selectedCandidate]: {
        ...(prev[selectedCandidate] || {}),
        [compIndex]: note,
      },
    }));
  };

  const handleSubmit = () => {
    if (!selectedCandidate) return;
    const filledCount = Object.keys(candidateScores).length;
    if (filledCount < competencies.length) {
      showToast(`Please score all ${competencies.length} competencies before submitting. You have scored ${filledCount}.`, "warning");
      return;
    }
    if (!candidateStrengths.trim()) {
      showToast("Please complete the Strengths field before submitting.", "warning");
      return;
    }
    if (!candidateConcerns.trim()) {
      showToast("Please complete the Concerns field before submitting.", "warning");
      return;
    }
    if (!candidateRecommendation) {
      showToast("Please select an overall recommendation before submitting.", "warning");
      return;
    }
    setSubmitted((prev) => ({ ...prev, [selectedCandidate]: true }));
    // Save scores to candidate record
    const scoreData = competencies.map((comp, i) => ({
      competency: comp.name,
      score: candidateScores[i] || 0,
      notes: candidateNotes[i] || "",
    }));
    updateCandidate(selectedCandidate, {
      notes: `${candidate?.notes || ""}\n\n--- Interview Score (James Okafor) ---\nAvg: ${avgScore}/5 | Recommendation: ${candidateRecommendation}\nStrengths: ${candidateStrengths}\nConcerns: ${candidateConcerns}\nScores: ${scoreData.map(s => `${s.competency}: ${s.score}/5`).join(", ")}`,
      communicationLog: [
        ...(candidate?.communicationLog || []),
        {
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
          type: "system" as const,
          message: `Interview scored by James Okafor — Average: ${avgScore}/5, Recommendation: ${candidateRecommendation}`,
          by: "James Okafor (Hiring Manager)",
        },
      ],
    });
    showToast(`Scores submitted for ${candidate?.name || "candidate"} (${avgScore}/5). Saved to candidate record.`, "success");
  };

  const totalScore = Object.values(candidateScores).reduce((a, b) => a + b, 0);
  const avgScore = Object.keys(candidateScores).length > 0 ? (totalScore / Object.keys(candidateScores).length).toFixed(1) : "-";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Interview Scoring</h2>

      {interviewingCandidates.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
          <Star size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p>No candidates to score. Invite candidates to interview first.</p>
        </div>
      )}

      {interviewingCandidates.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {interviewingCandidates.map((c) => (
            <button
              key={c.id}
              className={`btn ${selectedCandidate === c.id ? "" : "btn-outline"} btn-sm`}
              style={selectedCandidate === c.id ? { background: "#7c3aed", color: "white" } : {}}
              onClick={() => setSelectedCandidate(c.id)}
            >
              {c.name} {submitted[c.id] ? " (Submitted)" : ""}
            </button>
          ))}
        </div>
      )}

      {candidate && (
        <div className="card">
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{candidate.name} — {candidate.role}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Score independently before viewing panel consensus</p>
            </div>
            {Object.keys(candidateScores).length > 0 && (
              <div style={{ textAlign: "center", padding: "8px 16px", background: "#f3e8ff", borderRadius: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#7c3aed" }}>{avgScore}</div>
                <div style={{ fontSize: 11, color: "#6b21a8", fontWeight: 600 }}>Avg Score</div>
              </div>
            )}
          </div>

          {isSubmitted && (
            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#166534", fontWeight: 600 }}>
              <CheckCircle2 size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 6 }} />
              Scores submitted. You will be able to view other panel members&apos; scores once they have also submitted.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {competencies.map((comp, i) => (
              <div key={i} style={{ padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{i + 1}. {comp.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{comp.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => handleScore(i, n)}
                        disabled={isSubmitted}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: "2px solid " + (candidateScores[i] === n ? "#7c3aed" : "var(--border)"),
                          background: candidateScores[i] === n ? "#7c3aed" : "white",
                          color: candidateScores[i] === n ? "white" : "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: isSubmitted ? "not-allowed" : "pointer",
                          opacity: isSubmitted ? 0.6 : 1,
                          transition: "all 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={candidateNotes[i] || ""}
                  onChange={(e) => handleCompNote(i, e.target.value)}
                  placeholder="Key observations for this competency..."
                  disabled={isSubmitted}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, outline: "none", opacity: isSubmitted ? 0.6 : 1 }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 4 }}>
                Strengths <span style={{ color: "var(--status-red)" }}>*</span>
              </label>
              <textarea
                value={candidateStrengths}
                onChange={(e) => selectedCandidate && setStrengths((p) => ({ ...p, [selectedCandidate]: e.target.value }))}
                placeholder="What were the candidate's key strengths in interview?"
                disabled={isSubmitted}
                style={{ width: "100%", padding: 10, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, minHeight: 70, resize: "vertical", opacity: isSubmitted ? 0.6 : 1 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 4 }}>
                Concerns <span style={{ color: "var(--status-red)" }}>*</span>
              </label>
              <textarea
                value={candidateConcerns}
                onChange={(e) => selectedCandidate && setConcerns((p) => ({ ...p, [selectedCandidate]: e.target.value }))}
                placeholder="Any concerns or areas for development?"
                disabled={isSubmitted}
                style={{ width: "100%", padding: 10, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, minHeight: 70, resize: "vertical", opacity: isSubmitted ? 0.6 : 1 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                Overall Recommendation <span style={{ color: "var(--status-red)" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { value: "strong_hire", label: "Strong Hire", bg: "#166534", border: "#86efac" },
                  { value: "hire", label: "Hire", bg: "#16a34a", border: "#86efac" },
                  { value: "borderline", label: "Borderline", bg: "#d97706", border: "#fcd34d" },
                  { value: "do_not_hire", label: "Do Not Hire", bg: "#dc2626", border: "#fca5a5" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => selectedCandidate && !isSubmitted && setRecommendation((p) => ({ ...p, [selectedCandidate]: opt.value }))}
                    disabled={isSubmitted}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: isSubmitted ? "not-allowed" : "pointer",
                      border: `2px solid ${candidateRecommendation === opt.value ? opt.bg : "var(--border)"}`,
                      background: candidateRecommendation === opt.value ? opt.bg : "white",
                      color: candidateRecommendation === opt.value ? "white" : "var(--text-primary)",
                      opacity: isSubmitted ? 0.6 : 1,
                      transition: "all 0.15s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {!isSubmitted && (
                <>
                  <button className="btn" style={{ background: "#7c3aed", color: "white" }} onClick={handleSubmit}>
                    <Send size={16} /> Submit Scores
                  </button>
                  <button className="btn btn-outline" onClick={() => showToast("Draft saved. You can return to complete scoring later.", "info")}>
                    Save Draft
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: "#f3e8ff", borderRadius: 8, fontSize: 12, color: "#6b21a8" }}>
            <strong>Note:</strong> You must submit your scores before you can view other panel members&apos; assessments. This prevents social proof bias and ensures independent evaluation.
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Vacancy Request Tab ─────────────────────────────────────── */

function VacancyRequestTab({
  addVacancyRequest,
  showToast,
}: {
  addVacancyRequest: (r: Parameters<ReturnType<typeof useData>["addVacancyRequest"]>[0]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  const [form, setForm] = useState({
    role: "",
    team: "Children's Services",
    grade: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    justification: "",
    replacementFor: "",
    isNewPost: false,
    fundingApproved: false,
    essential: "",
    desirable: "",
    currentCaseload: "",
    teamSize: "",
    atsReference: "",
    internalSystem: "Jobtrain",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.role.trim()) { showToast("Please enter a job title.", "warning"); return; }
    if (!form.grade.trim()) { showToast("Please enter a grade.", "warning"); return; }
    if (!form.justification.trim()) { showToast("Please provide a justification for this vacancy.", "warning"); return; }

    addVacancyRequest({
      council: "Manchester CC",
      requestedBy: "James Okafor",
      requestedByRole: "hiring_manager",
      role: form.role,
      team: form.team,
      grade: form.grade,
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      description: form.description,
      essential: form.essential,
      desirable: form.desirable,
      justification: form.justification + (form.currentCaseload ? ` | Current caseload per SW: ${form.currentCaseload}` : "") + (form.teamSize ? ` | Team size: ${form.teamSize}` : ""),
      replacementFor: form.isNewPost ? "New post" : form.replacementFor,
      fundingApproved: form.fundingApproved,
      atsReference: form.atsReference,
      internalSystem: form.internalSystem,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Vacancy Request Submitted</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 500, margin: "0 auto" }}>
            Your request for <strong>{form.role}</strong> has been sent to the recruitment team for approval.
            You will be notified once it has been reviewed.
          </p>
          <button
            className="btn"
            style={{ background: "#7c3aed", color: "white", marginTop: 24 }}
            onClick={() => {
              setForm({ role: "", team: "Children's Services", grade: "", salaryMin: "", salaryMax: "", description: "", justification: "", replacementFor: "", isNewPost: false, fundingApproved: false, essential: "", desirable: "", currentCaseload: "", teamSize: "", atsReference: "", internalSystem: "Jobtrain" });
              setSubmitted(false);
            }}
          >
            <PlusCircle size={16} /> Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Request a New Vacancy</h2>
      <p style={{ color: "var(--text-secondary)" }}>Submit a request for a new or replacement post. The recruitment team will review and approve before advertising.</p>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormField label="Job Title" required>
            <input style={inputStyle} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Social Worker — Looked After Children" />
          </FormField>
          <FormField label="Team" required>
            <input style={inputStyle} value={form.team} onChange={(e) => setForm((f) => ({ ...f, team: e.target.value }))} placeholder="e.g. Children's Services" />
          </FormField>
          <FormField label="Grade" required>
            <input style={inputStyle} value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} placeholder="e.g. Grade 9" />
          </FormField>
          <FormField label="Salary Range">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, width: "auto", flex: 1 }} value={form.salaryMin} onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))} placeholder="Min (e.g. 37336)" />
              <span style={{ color: "var(--text-secondary)" }}>to</span>
              <input style={{ ...inputStyle, width: "auto", flex: 1 }} value={form.salaryMax} onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))} placeholder="Max (e.g. 40476)" />
            </div>
          </FormField>
        </div>

        <FormField label="Role Description">
          <textarea style={textareaStyle} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the role and key responsibilities..." />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormField label="Replacement or New Post?" required>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="radio" name="postType" checked={!form.isNewPost} onChange={() => setForm((f) => ({ ...f, isNewPost: false }))} /> Replacement
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="radio" name="postType" checked={form.isNewPost} onChange={() => setForm((f) => ({ ...f, isNewPost: true }))} /> New Post
              </label>
            </div>
            {!form.isNewPost && (
              <input style={inputStyle} value={form.replacementFor} onChange={(e) => setForm((f) => ({ ...f, replacementFor: e.target.value }))} placeholder="Name of leaver (e.g. Sarah Thompson)" />
            )}
          </FormField>
          <FormField label="Budget Approved?">
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "10px 0" }}>
              <input type="checkbox" checked={form.fundingApproved} onChange={(e) => setForm((f) => ({ ...f, fundingApproved: e.target.checked }))} style={{ width: 18, height: 18 }} />
              <span>Yes, funding/budget has been approved for this post</span>
            </label>
          </FormField>
        </div>

        <FormField label="Justification" required>
          <textarea style={textareaStyle} value={form.justification} onChange={(e) => setForm((f) => ({ ...f, justification: e.target.value }))} placeholder="Why is this role needed? Include impact on caseloads, team capacity, risk if unfilled..." />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormField label="Essential Criteria">
            <textarea style={textareaStyle} value={form.essential} onChange={(e) => setForm((f) => ({ ...f, essential: e.target.value }))} placeholder="e.g. SWE registered, 2+ years PQE in children's services" />
          </FormField>
          <FormField label="Desirable Criteria">
            <textarea style={textareaStyle} value={form.desirable} onChange={(e) => setForm((f) => ({ ...f, desirable: e.target.value }))} placeholder="e.g. Practice educator qualification, court work experience" />
          </FormField>
        </div>

        <div style={{ padding: 16, background: "#f3e8ff", borderRadius: 10, border: "1px solid #e9d5ff" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#6b21a8", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Building2 size={16} /> Caseload & Team Information
          </h4>
          <p style={{ fontSize: 12, color: "#581c87", marginBottom: 12 }}>This helps PSP match candidates who are looking for the right caseload and team environment.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Current Caseload Per SW">
              <input style={inputStyle} value={form.currentCaseload} onChange={(e) => setForm((f) => ({ ...f, currentCaseload: e.target.value }))} placeholder="e.g. 18-22 cases" />
            </FormField>
            <FormField label="Team Size">
              <input style={inputStyle} value={form.teamSize} onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))} placeholder="e.g. 6 SWs + 1 TM + 2 FSWs" />
            </FormField>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <FormField label="ATS Reference (if known)">
            <input style={inputStyle} value={form.atsReference} onChange={(e) => setForm((f) => ({ ...f, atsReference: e.target.value }))} placeholder="e.g. JT-MCC-2026-0847" />
          </FormField>
          <FormField label="Internal System">
            <select style={selectStyle} value={form.internalSystem} onChange={(e) => setForm((f) => ({ ...f, internalSystem: e.target.value }))}>
              <option value="Jobtrain">Jobtrain</option>
              <option value="Eploy">Eploy</option>
              <option value="Tribepad">Tribepad</option>
              <option value="iTrent">iTrent</option>
              <option value="Oracle">Oracle</option>
              <option value="Manual">Manual</option>
              <option value="None">None</option>
            </select>
          </FormField>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <button className="btn" style={{ background: "#7c3aed", color: "white", padding: "12px 32px", fontSize: 15 }} onClick={handleSubmit}>
            <Send size={16} /> Submit Vacancy Request
          </button>
          <button className="btn btn-outline" onClick={() => showToast("Draft saved.", "info")}>
            Save Draft
          </button>
        </div>
      </div>

      <div className="gdpr-notice">
        <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Approval Process</strong> — Your request will be reviewed by the recruitment team. Once approved, PSP will begin sourcing candidates. You will be notified at each stage.
        </span>
      </div>
    </div>
  );
}
