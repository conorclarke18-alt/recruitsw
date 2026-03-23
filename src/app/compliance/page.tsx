"use client";
import { useState } from "react";
import {
  Shield, CheckCircle2, Clock, AlertTriangle, XCircle, Mail, Send,
  FileText, Upload, Eye, Download, RefreshCw, Building2, UserCheck,
  Fingerprint, GraduationCap, Heart, Briefcase, Car, Globe, Phone,
  ChevronDown, ChevronRight, Link, Copy, ExternalLink
} from "lucide-react";

// Full UK Social Worker compliance requirements
interface ComplianceItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: "complete" | "pending" | "in_progress" | "overdue" | "not_started" | "na";
  required: boolean;
  documentUploaded: boolean;
  documentName: string;
  emailSent: boolean;
  emailSentDate: string;
  autoChaseEnabled: boolean;
  lastChaseDate: string;
  notes: string;
  dueDate: string;
  completedDate: string;
  verifiedBy: string;
}

// Demo candidate going through compliance
const candidateData = {
  name: "Sarah Mitchell",
  email: "s.mitchell@email.com",
  phone: "07912 345678",
  role: "Senior Social Worker — Children in Need",
  council: "Manchester City Council",
  startDate: "14/04/2026",
  salary: "£44,500",
  manager: "James Okafor",
  offerSentDate: "20/03/2026",
  swe: "SW98234",
  visa: "British Citizen",
};

const defaultComplianceItems: ComplianceItem[] = [
  // Identity & Right to Work
  { id: "rtw", category: "Identity & Right to Work", name: "Right to Work Verification", description: "Verify candidate has the legal right to work in the UK. For British/EU citizens: passport or birth cert + NI proof. For visa holders: share code from gov.uk.", status: "complete", required: true, documentUploaded: true, documentName: "Passport_Scan.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "British passport verified. Original seen.", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },
  { id: "id1", category: "Identity & Right to Work", name: "Photo ID (Primary)", description: "Valid passport or photo driving licence", status: "complete", required: true, documentUploaded: true, documentName: "Passport_Photo_Page.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Passport verified — valid until 2032", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },
  { id: "id2", category: "Identity & Right to Work", name: "Proof of Address", description: "Utility bill, bank statement, or council tax bill dated within last 3 months", status: "complete", required: true, documentUploaded: true, documentName: "Council_Tax_Bill.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Council tax bill Feb 2026", dueDate: "28/03/2026", completedDate: "23/03/2026", verifiedBy: "PSP — Conor Clarke" },
  { id: "ni", category: "Identity & Right to Work", name: "National Insurance Number", description: "NI number confirmation letter or P60/payslip showing NI number", status: "complete", required: true, documentUploaded: true, documentName: "P60_2025.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Confirmed via P60", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },

  // Professional Registration
  { id: "swe", category: "Professional Registration", name: "Social Work England Registration", description: "Active SWE registration. Verified against the public register at socialworkengland.org.uk", status: "complete", required: true, documentUploaded: true, documentName: "SWE_Registration_Certificate.pdf", emailSent: false, emailSentDate: "", autoChaseEnabled: false, lastChaseDate: "", notes: "SWE: SW98234 — Active, no conditions. Verified on register 22/03/2026.", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Auto-verified" },

  // DBS
  { id: "dbs", category: "DBS Check", name: "Enhanced DBS with Barred List Check", description: "Enhanced DBS check including children's and adults' barred list. Applied through council's registered body.", status: "in_progress", required: true, documentUploaded: false, documentName: "", emailSent: true, emailSentDate: "21/03/2026", autoChaseEnabled: true, lastChaseDate: "23/03/2026", notes: "DBS application submitted 21/03. ID verified at Post Office 22/03. Estimated 2-4 weeks for result.", dueDate: "07/04/2026", completedDate: "", verifiedBy: "" },
  { id: "dbs_update", category: "DBS Check", name: "DBS Update Service (if enrolled)", description: "If candidate is enrolled in the DBS Update Service, a status check can be done online for instant results.", status: "not_started", required: false, documentUploaded: false, documentName: "", emailSent: false, emailSentDate: "", autoChaseEnabled: false, lastChaseDate: "", notes: "Candidate not enrolled in Update Service. Full application required.", dueDate: "", completedDate: "", verifiedBy: "" },

  // References
  { id: "ref1", category: "References", name: "Reference 1 — Current/Most Recent Employer", description: "Must cover: dates of employment, role, reason for leaving, safeguarding concerns, sickness record, disciplinary record.", status: "complete", required: true, documentUploaded: true, documentName: "Reference_Liverpool_CC.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Received from Liverpool CC HR. Satisfactory — no concerns raised. 4 days sickness in 12 months.", dueDate: "28/03/2026", completedDate: "24/03/2026", verifiedBy: "PSP — Conor Clarke" },
  { id: "ref2", category: "References", name: "Reference 2 — Previous Employer", description: "Second professional reference covering employment history and conduct. DfE safeguarding template used.", status: "in_progress", required: true, documentUploaded: false, documentName: "", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: true, lastChaseDate: "23/03/2026", notes: "Sent to Wigan Council HR — auto-chase activated. First chase sent 23/03.", dueDate: "28/03/2026", completedDate: "", verifiedBy: "" },
  { id: "ref_safeguarding", category: "References", name: "Safeguarding Declaration (DfE Template)", description: "Enhanced reference covering safeguarding suitability using DfE Keeping Children Safe in Education template.", status: "complete", required: true, documentUploaded: true, documentName: "DfE_Safeguarding_Ref.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Completed by Liverpool CC as part of Reference 1. No safeguarding concerns.", dueDate: "28/03/2026", completedDate: "24/03/2026", verifiedBy: "PSP — Conor Clarke" },

  // Qualifications
  { id: "qual_degree", category: "Qualifications", name: "Social Work Degree Certificate", description: "BA/BSc/MA/MSc Social Work or equivalent (DipSW, CQSW for older qualifications)", status: "complete", required: true, documentUploaded: true, documentName: "MA_Social_Work_Manchester.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "MA Social Work, University of Manchester, 2019. Merit.", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },
  { id: "qual_pq", category: "Qualifications", name: "Post-Qualifying Awards", description: "Any PQ awards: Practice Educator, AMHP, BIA, Systemic Practice, etc.", status: "complete", required: false, documentUploaded: true, documentName: "NAAS_Stage3_Certificate.pdf", emailSent: false, emailSentDate: "", autoChaseEnabled: false, lastChaseDate: "", notes: "NAAS Stage 3 assessed 2024. Practice Educator Stage 1.", dueDate: "", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },

  // Health
  { id: "occ_health", category: "Occupational Health", name: "Occupational Health Clearance", description: "Pre-employment health questionnaire and clearance from council's OH provider.", status: "pending", required: true, documentUploaded: false, documentName: "", emailSent: true, emailSentDate: "21/03/2026", autoChaseEnabled: true, lastChaseDate: "", notes: "OH questionnaire sent to candidate. Awaiting completion and return.", dueDate: "04/04/2026", completedDate: "", verifiedBy: "" },

  // Employment History
  { id: "emp_history", category: "Employment History", name: "Full Employment History with Gaps Explained", description: "Complete chronological employment history from leaving education. All gaps must be explained and verified.", status: "complete", required: true, documentUploaded: true, documentName: "Employment_History_Form.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Full history provided. No unexplained gaps. Career break 2020 (maternity) — verified.", dueDate: "28/03/2026", completedDate: "23/03/2026", verifiedBy: "PSP — Conor Clarke" },

  // Driving
  { id: "driving", category: "Other Requirements", name: "Driving Licence (if required)", description: "Valid UK driving licence if role requires travel between locations.", status: "complete", required: true, documentUploaded: true, documentName: "Driving_Licence_Scan.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Full UK licence. Clean — no points.", dueDate: "28/03/2026", completedDate: "22/03/2026", verifiedBy: "PSP — Conor Clarke" },

  // Contract
  { id: "contract", category: "Offer & Contract", name: "Contract of Employment", description: "Signed employment contract between candidate and council.", status: "pending", required: true, documentUploaded: false, documentName: "", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Contract sent for e-signature via DocuSign. Awaiting candidate signature.", dueDate: "28/03/2026", completedDate: "", verifiedBy: "" },
  { id: "offer_acceptance", category: "Offer & Contract", name: "Formal Offer Acceptance", description: "Written acceptance of the offer of employment.", status: "complete", required: true, documentUploaded: true, documentName: "Offer_Acceptance_Email.pdf", emailSent: true, emailSentDate: "20/03/2026", autoChaseEnabled: false, lastChaseDate: "", notes: "Accepted via email 21/03/2026.", dueDate: "25/03/2026", completedDate: "21/03/2026", verifiedBy: "PSP — Conor Clarke" },
];

export default function CompliancePage() {
  const [items, setItems] = useState(defaultComplianceItems);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("DBS Check");
  const [showOfferEmail, setShowOfferEmail] = useState(false);
  const [showRefEmail, setShowRefEmail] = useState(false);
  const [showDBSEmail, setShowDBSEmail] = useState(false);

  // Stats
  const total = items.filter((i) => i.required).length;
  const complete = items.filter((i) => i.required && i.status === "complete").length;
  const inProgress = items.filter((i) => i.required && (i.status === "in_progress" || i.status === "pending")).length;
  const overdue = items.filter((i) => i.required && i.status === "overdue").length;
  const pct = Math.round((complete / total) * 100);

  const categories = [...new Set(items.map((i) => i.category))];

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = i.status === "not_started" ? "in_progress" : i.status === "in_progress" ? "pending" : i.status === "pending" ? "complete" : i.status === "complete" ? "not_started" : "in_progress";
        return { ...i, status: next, completedDate: next === "complete" ? new Date().toLocaleDateString("en-GB") : "" };
      })
    );
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle2 size={18} color="var(--status-green)" />;
      case "in_progress": return <RefreshCw size={18} color="var(--status-blue)" />;
      case "pending": return <Clock size={18} color="var(--status-amber)" />;
      case "overdue": return <XCircle size={18} color="var(--status-red)" />;
      default: return <Clock size={18} color="#cbd5e1" />;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "complete": return <span className="badge badge-green">Complete</span>;
      case "in_progress": return <span className="badge badge-blue">In Progress</span>;
      case "pending": return <span className="badge badge-amber">Pending</span>;
      case "overdue": return <span className="badge badge-red">Overdue</span>;
      case "na": return <span className="badge badge-gray">N/A</span>;
      default: return <span className="badge badge-gray">Not Started</span>;
    }
  };

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case "Identity & Right to Work": return <Globe size={18} />;
      case "Professional Registration": return <UserCheck size={18} />;
      case "DBS Check": return <Fingerprint size={18} />;
      case "References": return <FileText size={18} />;
      case "Qualifications": return <GraduationCap size={18} />;
      case "Occupational Health": return <Heart size={18} />;
      case "Employment History": return <Briefcase size={18} />;
      case "Other Requirements": return <Car size={18} />;
      case "Offer & Contract": return <FileText size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ background: "var(--psp-green-dark)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Shield size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>RecruitSW</span>
          <span style={{ color: "var(--psp-gold)", fontSize: 12, fontWeight: 600, background: "rgba(212,168,67,0.2)", padding: "2px 8px", borderRadius: 4 }}>COMPLIANCE</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => setShowOfferEmail(true)}>
            <Mail size={14} /> View Offer Email
          </button>
          <a href="/recruitsw/psp" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)", textDecoration: "none" }}>← Back to Dashboard</a>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        {/* Candidate Header */}
        <div className="card" style={{ marginBottom: 24, borderLeft: "4px solid var(--psp-green)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{candidateData.name} — Compliance Tracker</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                {candidateData.role} &middot; {candidateData.council} &middot; Start Date: <strong>{candidateData.startDate}</strong>
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span className="badge badge-green">SWE: {candidateData.swe}</span>
                <span className="badge badge-green">{candidateData.visa}</span>
                <span className="badge badge-blue">Offer Sent: {candidateData.offerSentDate}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `conic-gradient(var(--status-green) ${pct * 3.6}deg, #e2e8f0 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: pct === 100 ? "var(--status-green)" : "var(--text-primary)" }}>{pct}%</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{complete}/{total} complete</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div className="stat-card" style={{ borderLeft: "3px solid var(--status-green)" }}><span className="stat-value" style={{ color: "var(--status-green)", fontSize: 28 }}>{complete}</span><span className="stat-label">Complete</span></div>
          <div className="stat-card" style={{ borderLeft: "3px solid var(--status-blue)" }}><span className="stat-value" style={{ color: "var(--status-blue)", fontSize: 28 }}>{inProgress}</span><span className="stat-label">In Progress</span></div>
          <div className="stat-card" style={{ borderLeft: "3px solid var(--status-amber)" }}><span className="stat-value" style={{ color: "var(--status-amber)", fontSize: 28 }}>{items.filter(i => i.emailSent).length}</span><span className="stat-label">Emails Sent</span></div>
          <div className="stat-card" style={{ borderLeft: "3px solid var(--status-red)" }}><span className="stat-value" style={{ color: "var(--status-red)", fontSize: 28 }}>{items.filter(i => i.documentUploaded).length}</span><span className="stat-label">Docs Received</span></div>
          <div className="stat-card" style={{ borderLeft: "3px solid #7c3aed" }}><span className="stat-value" style={{ color: "#7c3aed", fontSize: 28 }}>{items.filter(i => i.autoChaseEnabled).length}</span><span className="stat-label">Auto-Chasing</span></div>
        </div>

        {/* Automated Actions Bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => setShowOfferEmail(true)}><Mail size={14} /> View Offer Email Sent</button>
          <button className="btn btn-outline" onClick={() => setShowRefEmail(true)}><Send size={14} /> View Reference Request</button>
          <button className="btn btn-outline" onClick={() => setShowDBSEmail(true)}><Fingerprint size={14} /> View DBS Application Email</button>
          <button className="btn btn-outline" onClick={() => alert("Auto-chase sends reminder emails every 3 days for outstanding items.")}><RefreshCw size={14} /> Auto-Chase Settings</button>
        </div>

        {/* Compliance Items by Category */}
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const catComplete = catItems.filter((i) => i.status === "complete").length;
          const isExpanded = expandedCategory === cat;

          return (
            <div key={cat} className="card" style={{ marginBottom: 12, overflow: "hidden" }}>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}
                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "var(--psp-green)" }}>{categoryIcon(cat)}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{cat}</h3>
                  <span className="badge badge-gray">{catComplete}/{catItems.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{ width: `${(catComplete / catItems.length) * 100}%`, background: catComplete === catItems.length ? "var(--status-green)" : "var(--status-amber)" }} />
                  </div>
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {catItems.map((item) => (
                    <div key={item.id} style={{ padding: 14, background: "#f8fafc", borderRadius: 10, border: `1px solid ${item.status === "complete" ? "#86efac" : item.status === "overdue" ? "#fca5a5" : "var(--border)"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ display: "flex", gap: 10, flex: 1 }}>
                          <div style={{ cursor: "pointer", marginTop: 2 }} onClick={() => toggleStatus(item.id)}>
                            {statusIcon(item.status)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                              {statusBadge(item.status)}
                              {item.required && <span style={{ fontSize: 10, color: "var(--status-red)", fontWeight: 600 }}>REQUIRED</span>}
                              {item.autoChaseEnabled && <span className="badge badge-purple" style={{ fontSize: 10 }}>Auto-Chase ON</span>}
                            </div>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{item.description}</p>
                            {item.notes && <p style={{ fontSize: 12, marginTop: 4, color: "var(--text-primary)" }}><strong>Notes:</strong> {item.notes}</p>}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", minWidth: 140 }}>
                          {item.documentUploaded && (
                            <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>
                              <Eye size={12} /> {item.documentName.slice(0, 20)}...
                            </button>
                          )}
                          {!item.documentUploaded && item.status !== "complete" && (
                            <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>
                              <Upload size={12} /> Upload Doc
                            </button>
                          )}
                          {item.emailSent && (
                            <span style={{ fontSize: 10, color: "var(--status-green)" }}>✓ Email sent {item.emailSentDate}</span>
                          )}
                          {item.dueDate && item.status !== "complete" && (
                            <span style={{ fontSize: 10, color: "var(--status-amber)" }}>Due: {item.dueDate}</span>
                          )}
                          {item.completedDate && (
                            <span style={{ fontSize: 10, color: "var(--status-green)" }}>✓ {item.completedDate}</span>
                          )}
                          {item.verifiedBy && (
                            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>By: {item.verifiedBy}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Email Preview Modals */}
        {showOfferEmail && (
          <div onClick={() => setShowOfferEmail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 650, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Automated Offer Email — Sent {candidateData.offerSentDate}</h2>
                <button onClick={() => setShowOfferEmail(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                  <div><strong>To:</strong> {candidateData.name} &lt;{candidateData.email}&gt;</div>
                  <div><strong>From:</strong> {candidateData.council} via RecruitSW</div>
                  <div><strong>Subject:</strong> Offer of Employment — {candidateData.role}</div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                  <p>Dear {candidateData.name},</p>
                  <p style={{ marginTop: 12 }}>Following your successful interview, we are delighted to offer you the position of <strong>{candidateData.role}</strong> at <strong>{candidateData.council}</strong>.</p>
                  <div style={{ margin: "16px 0", padding: 16, background: "#f0fdf4", borderRadius: 10 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 8 }}>Your Offer Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                      <div><strong>Role:</strong> {candidateData.role}</div>
                      <div><strong>Salary:</strong> {candidateData.salary}</div>
                      <div><strong>Start Date:</strong> {candidateData.startDate}</div>
                      <div><strong>Manager:</strong> {candidateData.manager}</div>
                    </div>
                  </div>
                  <p><strong>To complete your appointment, you must provide the following:</strong></p>
                  <div style={{ margin: "12px 0", padding: 16, background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>Compliance Checklist — All Required Before Start Date</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                      {[
                        { icon: "🪪", text: "Proof of identity — valid passport or photo driving licence" },
                        { icon: "🏠", text: "Proof of address — utility bill or bank statement within last 3 months" },
                        { icon: "🇬🇧", text: "Right to Work — passport or visa documentation (share code if applicable)" },
                        { icon: "🔢", text: "National Insurance number — letter, P60, or payslip" },
                        { icon: "🛡️", text: "SWE registration number — must be active with Social Work England" },
                        { icon: "🔍", text: "Enhanced DBS — application form enclosed (or DBS Update Service consent)" },
                        { icon: "📋", text: "Two professional references — forms sent separately to your referees" },
                        { icon: "🎓", text: "Qualification certificates — social work degree + any PQ awards" },
                        { icon: "🏥", text: "Occupational Health questionnaire — link below" },
                        { icon: "📄", text: "Full employment history — form enclosed, all gaps must be explained" },
                        { icon: "🚗", text: "Driving licence — if required for the role" },
                        { icon: "✍️", text: "Signed contract of employment — sent separately for e-signature" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ margin: "12px 0", padding: 16, background: "#eff6ff", borderRadius: 10 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 8 }}>Quick Links</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Link size={14} color="#1e40af" /> <strong>DBS Application:</strong> <span style={{ color: "#1e40af" }}>https://apply.recruitsw.co.uk/dbs/{candidateData.swe}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Link size={14} color="#1e40af" /> <strong>OH Questionnaire:</strong> <span style={{ color: "#1e40af" }}>https://apply.recruitsw.co.uk/oh/{candidateData.swe}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Link size={14} color="#1e40af" /> <strong>Upload Documents:</strong> <span style={{ color: "#1e40af" }}>https://apply.recruitsw.co.uk/docs/{candidateData.swe}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Link size={14} color="#1e40af" /> <strong>Employment History Form:</strong> <span style={{ color: "#1e40af" }}>https://apply.recruitsw.co.uk/history/{candidateData.swe}</span></div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 12 }}>
                    Automated reminders will be sent every 3 days for outstanding items. Your recruitment consultant, Conor Clarke at PSP, is available if you need any support.
                  </p>
                  <p style={{ marginTop: 12 }}>Congratulations and we look forward to welcoming you to the team.</p>
                  <p style={{ marginTop: 8 }}>Best regards,<br /><strong>{candidateData.council} Recruitment Team</strong><br /><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>via RecruitSW &middot; Powered by Pro Social Partners</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRefEmail && (
          <div onClick={() => setShowRefEmail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Automated Reference Request Email</h2>
                <button onClick={() => setShowRefEmail(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>
              <div style={{ padding: 24, fontSize: 14, lineHeight: 1.8 }}>
                <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                  <div><strong>To:</strong> HR Department &lt;hr@liverpool.gov.uk&gt;</div>
                  <div><strong>From:</strong> RecruitSW References &lt;references@recruitsw.co.uk&gt;</div>
                  <div><strong>Subject:</strong> Reference Request — {candidateData.name} (SWE: {candidateData.swe})</div>
                </div>
                <p>Dear HR Colleague,</p>
                <p style={{ marginTop: 12 }}><strong>{candidateData.name}</strong> has applied for the position of <strong>{candidateData.role}</strong> at <strong>{candidateData.council}</strong> and has named your organisation as a referee.</p>
                <p>We would be grateful if you could complete the reference using the <strong>DfE safeguarding template</strong> accessible via the link below:</p>
                <div style={{ margin: "12px 0", padding: 14, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: "#1e40af" }}>https://references.recruitsw.co.uk/complete/REF-{candidateData.swe}-001</div>
                </div>
                <p>The reference must cover:</p>
                <ul style={{ paddingLeft: 20, fontSize: 13 }}>
                  <li>Dates of employment and job title</li>
                  <li>Reason for leaving</li>
                  <li>Any safeguarding concerns or investigations</li>
                  <li>Sickness absence record</li>
                  <li>Disciplinary record</li>
                  <li>Would you re-employ this person?</li>
                </ul>
                <div style={{ marginTop: 12, padding: 10, background: "#fef2f2", borderRadius: 8, fontSize: 12, color: "#991b1b" }}>
                  <strong>Important:</strong> If there are any safeguarding concerns, please contact us immediately at safeguarding@recruitsw.co.uk or call 0161 XXX XXXX.
                </div>
                <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-secondary)" }}>Auto-reminders will be sent every 3 working days if not completed. If this person did not work at your organisation, please let us know.</p>
              </div>
            </div>
          </div>
        )}

        {showDBSEmail && (
          <div onClick={() => setShowDBSEmail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Automated DBS Application Email</h2>
                <button onClick={() => setShowDBSEmail(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>
              <div style={{ padding: 24, fontSize: 14, lineHeight: 1.8 }}>
                <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                  <div><strong>To:</strong> {candidateData.name} &lt;{candidateData.email}&gt;</div>
                  <div><strong>Subject:</strong> DBS Application Required — {candidateData.role}</div>
                </div>
                <p>Dear {candidateData.name},</p>
                <p style={{ marginTop: 12 }}>As part of your pre-employment checks for <strong>{candidateData.role}</strong>, you are required to complete an <strong>Enhanced DBS check with barred list</strong> (children&apos;s and adults&apos;).</p>
                <div style={{ margin: "12px 0", padding: 14, background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
                  <p style={{ fontWeight: 700, color: "#1e40af", marginBottom: 6 }}>Complete your DBS application here:</p>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: "#1e40af" }}>https://apply.recruitsw.co.uk/dbs/{candidateData.swe}</div>
                </div>
                <p><strong>What you need:</strong></p>
                <ul style={{ paddingLeft: 20, fontSize: 13 }}>
                  <li>5 years of address history</li>
                  <li>Valid passport or driving licence number</li>
                  <li>National Insurance number</li>
                  <li>Any previous names</li>
                </ul>
                <p>After completing the online form, you will need to <strong>verify your identity at a Post Office</strong> (bring your passport and one other ID document).</p>
                <div style={{ marginTop: 12, padding: 10, background: "#f0fdf4", borderRadius: 8, fontSize: 12, color: "#166534" }}>
                  <strong>Tip:</strong> If you are enrolled in the <strong>DBS Update Service</strong>, let us know — we can do an instant status check and you may not need a new application.
                </div>
                <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-secondary)" }}>The DBS check typically takes 2-4 weeks. You cannot start employment until a satisfactory DBS result is received.</p>
              </div>
            </div>
          </div>
        )}

        {/* GDPR Notice */}
        <div className="gdpr-notice" style={{ marginTop: 16 }}>
          <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 12 }}>
            Compliance data processed under Article 6(1)(b) pre-contractual steps and 6(1)(e) public task.
            DBS data handled in accordance with DBS Code of Practice. Reference data retained for duration of employment plus 6 years.
            Candidate can access their compliance record via the candidate portal.
          </span>
        </div>
      </main>
    </div>
  );
}
