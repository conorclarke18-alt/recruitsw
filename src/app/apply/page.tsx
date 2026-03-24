"use client";
import { useState } from "react";
import { useData } from "@/components/DataStore";
import { FormField, inputStyle, selectStyle, textareaStyle } from "@/components/Modal";
import { Building2, Shield, CheckCircle2, Upload, Plane, Briefcase } from "lucide-react";

export default function ApplyPage() {
  const { vacancies, addCandidate, showToast } = useData();
  const liveVacancies = vacancies.filter((v) => v.status === "live" && v.applicationLinkActive);
  const [selectedVacancy, setSelectedVacancy] = useState<string | null>(liveVacancies[0]?.id || null);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const vacancy = vacancies.find((v) => v.id === selectedVacancy);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", swe: "", pqe: "", location: "",
    visa: "british_citizen",
    visaDetails: "", available: "",
    coverLetter: "", notes: "",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.swe) return;
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: vacancy?.role.split(" — ")[0] || "Social Worker",
      pqe: form.pqe,
      swe: form.swe,
      sweStatus: "active",
      source: "Direct Application",
      visa: form.visa as "british_citizen" | "settled_status" | "skilled_worker" | "graduate_visa" | "spouse_visa" | "health_care_visa",
      visaDetails: form.visaDetails || form.visa,
      visaExpiry: "",
      dbs: "pending",
      ref1: "pending",
      ref2: "pending",
      rtw: form.visa === "british_citizen" || form.visa === "settled_status" ? "verified" : form.visa === "skilled_worker" || form.visa === "health_care_visa" ? "requires_sponsorship" : form.visa === "graduate_visa" ? "time_limited" : "pending",
      quals: "pending",
      location: form.location,
      available: form.available,
      crossCouncil: false,
      notes: `Applied via application link for ${vacancy?.role || "vacancy"}. ${form.coverLetter ? "Cover note: " + form.coverLetter : ""}`,
      cvFileName: "",
      cvUploaded: false,
      submittedBy: "Direct Application",
      submittedAt: new Date().toISOString().split("T")[0],
      emailNotifications: ["Application received - " + new Date().toLocaleDateString("en-GB")],
      pipelineStage: "new",
      stageEnteredAt: new Date().toISOString(),
      motivation: form.coverLetter || "Not specified",
      warmStatus: "active",
      counterOfferRisk: "low",
      yearsInCurrentRole: 0,
      currentEmployer: "",
      withdrawalReason: null,
      communicationLog: [{ date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0,5), type: "system", message: `Direct application submitted for ${vacancy?.role || "vacancy"}`, by: "System" }],
      proofOfId: "pending",
      proofOfAddress: "pending",
      niNumber: "pending",
      sweCertificate: "pending",
      occHealth: "pending",
      employmentHistory: "pending",
      drivingLicence: "pending",
      criminalDeclaration: "pending",
      conflictDeclaration: "pending",
      safeguardingTraining: "pending",
      contractSigned: "pending",
      offerLetterSigned: "pending",
    });
    setSubmitted(true);
    showToast("Application submitted successfully!", "success");
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 40, maxWidth: 500, textAlign: "center" }}>
          <CheckCircle2 size={64} color="var(--status-green)" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Application Submitted!</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            Thank you, {form.name}. Your application for <strong>{vacancy?.role}</strong> at <strong>{vacancy?.council}</strong> has been received.
          </p>
          <div style={{ padding: 16, background: "#f0fdf4", borderRadius: 10, textAlign: "left", fontSize: 14, marginBottom: 20 }}>
            <strong>What happens next:</strong>
            <ol style={{ paddingLeft: 20, marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Your application will be screened within 48 hours</li>
              <li>If shortlisted, the recruitment team will contact you</li>
              <li>You&apos;ll receive updates by email at {form.email}</li>
            </ol>
          </div>
          <div className="gdpr-notice" style={{ textAlign: "left" }}>
            <Shield size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 11 }}>
              Your data is processed under Article 6(1)(e) public task and 6(1)(b) pre-contractual steps.
              You can request access, correction, or deletion of your data at any time by emailing dpo@recruitsw.co.uk.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ background: "var(--council-blue-dark)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Building2 size={24} color="white" />
          <div>
            <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{vacancy?.council || "Council"}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginLeft: 8 }}>via RecruitSW</span>
          </div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Permanent Social Work Recruitment</span>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        {/* Vacancy Selector */}
        {!selectedVacancy ? (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Current Vacancies</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Select a role to apply for:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {liveVacancies.map((v) => (
                <button key={v.id} onClick={() => setSelectedVacancy(v.id)} className="card" style={{ cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{v.role}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{v.team} &middot; {v.salary} &middot; {v.grade}</p>
                  </div>
                  <span className="badge badge-green">Apply</span>
                </button>
              ))}
            </div>
          </div>
        ) : vacancy && (
          <>
            {/* Job Header */}
            <div className="card" style={{ marginBottom: 20, borderLeft: "4px solid var(--council-blue)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Briefcase size={20} color="var(--council-blue)" />
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{vacancy.role}</h1>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                <span>{vacancy.council}</span>
                <span>{vacancy.team}</span>
                <span>{vacancy.salary}</span>
                <span>{vacancy.grade}</span>
              </div>
              {vacancy.description && <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{vacancy.description}</p>}
              {vacancy.essential && <div style={{ marginBottom: 8 }}><strong style={{ fontSize: 12 }}>Essential:</strong> <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{vacancy.essential}</span></div>}
              {vacancy.desirable && <div><strong style={{ fontSize: 12 }}>Desirable:</strong> <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{vacancy.desirable}</span></div>}
            </div>

            {/* Progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["Your Details", "Right to Work", "Submit"].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 4, borderRadius: 4, background: i + 1 <= step ? "var(--council-blue)" : "#e2e8f0", marginBottom: 6 }} />
                  <span style={{ fontSize: 11, color: i + 1 <= step ? "var(--council-blue)" : "var(--text-secondary)", fontWeight: i + 1 === step ? 700 : 400 }}>{s}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Details</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="Full Name" required>
                    <input style={inputStyle} placeholder="Sarah Mitchell" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </FormField>
                  <FormField label="Email" required>
                    <input style={inputStyle} type="email" placeholder="s.mitchell@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </FormField>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="Phone">
                    <input style={inputStyle} placeholder="07912 345678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </FormField>
                  <FormField label="SWE Registration Number" required>
                    <input style={inputStyle} placeholder="SW12345" value={form.swe} onChange={(e) => set("swe", e.target.value)} />
                  </FormField>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <FormField label="PQE (years)">
                    <input style={inputStyle} placeholder="e.g. 6 years or NQ" value={form.pqe} onChange={(e) => set("pqe", e.target.value)} />
                  </FormField>
                  <FormField label="Location">
                    <input style={inputStyle} placeholder="Manchester" value={form.location} onChange={(e) => set("location", e.target.value)} />
                  </FormField>
                  <FormField label="Availability">
                    <input style={inputStyle} placeholder="2 weeks notice" value={form.available} onChange={(e) => set("available", e.target.value)} />
                  </FormField>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-outline" onClick={() => setSelectedVacancy(null)}>← Back to Vacancies</button>
                  <button className="btn btn-council" onClick={() => form.name && form.email && form.swe ? setStep(2) : null} style={{ opacity: form.name && form.email && form.swe ? 1 : 0.5 }}>Next: Right to Work →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Plane size={20} color="var(--status-amber)" />
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Right to Work</h2>
                </div>
                <FormField label="Immigration Status" required>
                  <select style={selectStyle} value={form.visa} onChange={(e) => set("visa", e.target.value)}>
                    <option value="british_citizen">🇬🇧 British Citizen</option>
                    <option value="settled_status">🇪🇺 EU Settled Status</option>
                    <option value="spouse_visa">💍 Spouse / Partner Visa</option>
                    <option value="skilled_worker">⚠️ Skilled Worker Visa (requires sponsorship)</option>
                    <option value="health_care_visa">🏥 Health & Care Worker Visa (requires sponsorship)</option>
                    <option value="graduate_visa">🎓 Graduate Visa (time-limited)</option>
                  </select>
                </FormField>
                {(form.visa === "skilled_worker" || form.visa === "health_care_visa") && (
                  <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, fontSize: 13, color: "#92400e", marginBottom: 16 }}>
                    <strong>⚠️ Sponsorship Required</strong> — You have indicated you require visa sponsorship. The council will need to hold a valid Sponsor Licence. This will be discussed during the recruitment process.
                  </div>
                )}
                <FormField label="Additional visa details (optional)">
                  <textarea style={{...textareaStyle, minHeight: 60}} placeholder="Any additional details about your immigration status..." value={form.visaDetails} onChange={(e) => set("visaDetails", e.target.value)} />
                </FormField>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-council" onClick={() => setStep(3)}>Next: Review & Submit →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Review & Submit</h2>
                <FormField label="Cover Note / Supporting Statement">
                  <textarea style={textareaStyle} placeholder="Tell us why you're interested in this role and what you'd bring to the team..." value={form.coverLetter} onChange={(e) => set("coverLetter", e.target.value)} />
                </FormField>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 13 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div><strong>Name:</strong> {form.name}</div>
                    <div><strong>Email:</strong> {form.email}</div>
                    <div><strong>Phone:</strong> {form.phone || "Not provided"}</div>
                    <div><strong>SWE:</strong> {form.swe}</div>
                    <div><strong>PQE:</strong> {form.pqe || "Not specified"}</div>
                    <div><strong>Location:</strong> {form.location || "Not specified"}</div>
                    <div><strong>Visa:</strong> {form.visa.replace(/_/g, " ")}</div>
                    <div><strong>Available:</strong> {form.available || "Not specified"}</div>
                  </div>
                </div>
                <FormField label="Upload CV (optional)">
                  <div style={{ padding: 20, border: "2px dashed var(--border)", borderRadius: 8, textAlign: "center", cursor: "pointer" }}>
                    <Upload size={24} color="var(--text-secondary)" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Drag & drop your CV here, or click to browse</p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>PDF or Word, max 5MB</p>
                  </div>
                </FormField>

                <div className="gdpr-notice" style={{ marginBottom: 16 }}>
                  <Shield size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 11 }}>
                    By submitting this application, your data will be processed by {vacancy.council} under Article 6(1)(e) public task and by Pro Social Partners Ltd under Article 6(1)(b) pre-contractual steps.
                    Your data will be retained for 6 months after the recruitment decision. You can request access, correction, or deletion at any time.
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-council" onClick={handleSubmit}>
                    <CheckCircle2 size={16} /> Submit Application
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
