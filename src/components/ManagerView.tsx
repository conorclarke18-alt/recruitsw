"use client";
import { useState, useMemo } from "react";
import {
  UserCheck, Briefcase, Users, Calendar, CheckCircle2,
  AlertTriangle, Clock, Eye, Star, ThumbsUp, ThumbsDown,
  Shield, Plane, MessageSquare, ChevronRight, FileText,
  Mail, Send, Link, Video, X, FileDown
} from "lucide-react";
import { useData, Vacancy, Candidate } from "./DataStore";
import { Modal } from "./Modal";

export default function ManagerView() {
  const [activeTab, setActiveTab] = useState("action");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const { vacancies, candidates, updateCandidate, showToast } = useData();

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
      text: `ASYE vacancy has candidates — schedule interviews when ready.`,
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
  setActiveTab,
  showToast,
}: {
  myVacancies: Vacancy[];
  setActiveTab: (tab: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
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
              <span className={`badge ${v.status === "live" ? "badge-green" : v.status === "interviewing" ? "badge-blue" : "badge-amber"}`}>{v.status}</span>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 14 }}>
              <span><strong>{v.shortlisted}</strong> shortlisted</span>
              <span><strong>{v.applicants}</strong> applicants</span>
              <span><strong>{v.daysOpen}</strong> days open</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("candidates")}>
                <Users size={14} /> View Candidates
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => showToast(`Schedule interviews for ${v.role} — contact PSP to coordinate panel availability.`, "info")}>
                <Calendar size={14} /> Schedule Interviews
              </button>
            </div>
          </div>
        ))}
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

  const sendInvite = () => {
    if (!inviteCandidate) return;
    updateCandidate(inviteCandidate.id, { status: "interviewing" });
    showToast(`Interview invite sent to ${inviteCandidate.name} — they'll select available slots from your diary`, "success");
    setInviteCandidate(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Email Preview Modal */}
      <Modal open={!!inviteCandidate} onClose={() => setInviteCandidate(null)} title="Send Interview Invitation" width={620}>
        {inviteCandidate && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email Preview */}
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

                {/* Booking Link */}
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
                    <strong>⚠️ Note:</strong> We understand you require visa sponsorship. This will be discussed as part of the interview process. Manchester City Council holds a valid UKVI Sponsor Licence.
                  </div>
                )}

                <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                  If you have any questions, please reply to this email or contact the recruitment team.
                </p>
                <p style={{ marginTop: 8 }}>Best regards,<br /><strong>Manchester City Council Recruitment Team</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>via RecruitSW</span></p>
              </div>
            </div>

            {/* Attachments */}
            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge badge-gray" style={{ padding: "6px 12px" }}>
                <FileDown size={12} style={{ marginRight: 4 }} /> {inviteCandidate.cvFileName || "CV.pdf"}
              </span>
              <span className="badge badge-gray" style={{ padding: "6px 12px" }}>
                <FileText size={12} style={{ marginRight: 4 }} /> Interview_Scorecard.pdf
              </span>
            </div>

            {/* Calendar sync info */}
            <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#166534" }}>
              <strong>How it works:</strong> The candidate clicks the booking link and sees time slots when <strong>all panel members</strong> are free (synced from your Microsoft 365 calendars). Once they select slots, you&apos;ll be notified and can confirm the time. A calendar invite with the MS Teams link is sent automatically.
            </div>

            {/* Actions */}
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

          return (
            <div key={c.id} className="card" style={{ borderLeft: `4px solid ${c.match >= 90 ? "var(--status-green)" : c.match >= 85 ? "var(--status-blue)" : "var(--status-amber)"}` }}>
              {/* Header */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, cursor: "pointer" }}
                onClick={() => setExpandedCandidate(isExpanded ? null : c.id)}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7c3aed", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
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

                  {/* Decision Buttons */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
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
                      onClick={() => showToast("Your question has been sent to PSP. They will respond within 4 working hours.", "info")}
                    >
                      <MessageSquare size={16} /> Ask PSP a Question
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
        {interviewingCandidates.map((c) => (
          <div key={c.id} className="card" style={{ borderLeft: "4px solid #7c3aed" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: 8 }}>Upcoming</span>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{c.name} — {c.role} Interview</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Panel: You, Rachel Adams &middot; MS Teams</p>
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
        ))}
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
}: {
  interviewingCandidates: Candidate[];
  showToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  const competencies = ["Safeguarding Knowledge", "Assessment Skills", "Partnership Working", "Communication", "Professional Development"];

  const [scores, setScores] = useState<Record<string, Record<number, number>>>({});
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    interviewingCandidates.length > 0 ? interviewingCandidates[0].id : null
  );

  const candidate = interviewingCandidates.find((c) => c.id === selectedCandidate);
  const candidateScores = selectedCandidate ? (scores[selectedCandidate] || {}) : {};

  const handleScore = (compIndex: number, score: number) => {
    if (!selectedCandidate) return;
    setScores((prev) => ({
      ...prev,
      [selectedCandidate]: {
        ...(prev[selectedCandidate] || {}),
        [compIndex]: score,
      },
    }));
  };

  const handleSubmit = () => {
    const filledCount = Object.keys(candidateScores).length;
    if (filledCount < competencies.length) {
      showToast(`Please score all ${competencies.length} competencies before submitting. You have scored ${filledCount}.`, "warning");
      return;
    }
    showToast(`Scores submitted for ${candidate?.name || "candidate"}. Panel consensus will be available once all members submit.`, "success");
  };

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
              {c.name}
            </button>
          ))}
        </div>
      )}

      {candidate && (
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{candidate.name} — {candidate.role}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Score independently before viewing panel consensus</p>
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
                          <button
                            key={n}
                            onClick={() => handleScore(i, n)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              border: "1px solid var(--border)",
                              background: n <= (candidateScores[i] || 0) ? "#7c3aed" : "white",
                              color: n <= (candidateScores[i] || 0) ? "white" : "var(--text-primary)",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
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
              <button className="btn" style={{ background: "#7c3aed", color: "white" }} onClick={handleSubmit}>
                Submit Scores
              </button>
              <button className="btn btn-outline" onClick={() => showToast("Draft saved. You can return to complete scoring later.", "info")}>
                Save Draft
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 10, background: "#f3e8ff", borderRadius: 8, fontSize: 12, color: "#6b21a8" }}>
            <strong>Note:</strong> You must submit your scores before you can view other panel members&apos; assessments. This prevents social proof bias and ensures independent evaluation.
          </div>
        </div>
      )}
    </div>
  );
}
