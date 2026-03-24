"use client";
import { useState } from "react";
import { useData, VisaType, RTWStatus, CompStatus } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";
import { Plane } from "lucide-react";

const visaOptions: { value: VisaType; label: string; needsSponsorship: boolean }[] = [
  { value: "british_citizen", label: "🇬🇧 British Citizen", needsSponsorship: false },
  { value: "settled_status", label: "🇪🇺 EU Settled Status", needsSponsorship: false },
  { value: "pre_settled", label: "🇪🇺 EU Pre-Settled Status", needsSponsorship: false },
  { value: "spouse_visa", label: "💍 Spouse / Partner Visa", needsSponsorship: false },
  { value: "skilled_worker", label: "⚠️ Skilled Worker Visa (needs sponsorship)", needsSponsorship: true },
  { value: "health_care_visa", label: "🏥 Health & Care Worker Visa (needs sponsorship)", needsSponsorship: true },
  { value: "graduate_visa", label: "🎓 Graduate Visa (time-limited)", needsSponsorship: false },
  { value: "other", label: "Other — specify in notes", needsSponsorship: false },
];

export default function AddCandidateForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addCandidate } = useData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "", pqe: "", swe: "",
    sweStatus: "active" as "active" | "conditions" | "suspended" | "pending",
    source: "PSP Network",
    visa: "british_citizen" as VisaType,
    visaDetails: "", visaExpiry: "",
    location: "", available: "",
    dbs: "pending" as CompStatus, ref1: "pending" as CompStatus, ref2: "pending" as CompStatus,
    rtw: "pending" as RTWStatus, quals: "pending" as CompStatus,
    crossCouncil: false, notes: "",
  });

  const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const selectedVisa = visaOptions.find((v) => v.value === form.visa);

  const handleVisaChange = (visa: VisaType) => {
    const opt = visaOptions.find((v) => v.value === visa);
    let rtw: RTWStatus = "pending";
    if (visa === "british_citizen" || visa === "settled_status") rtw = "verified";
    else if (visa === "skilled_worker" || visa === "health_care_visa") rtw = "requires_sponsorship";
    else if (visa === "graduate_visa") rtw = "time_limited";
    else if (visa === "spouse_visa" || visa === "pre_settled") rtw = "verified";
    set("visa", visa);
    setForm((f) => ({ ...f, visa, rtw, visaDetails: opt?.label.replace(/^[^\s]+ /, "") || "" }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.role || !form.swe) return;
    addCandidate({
      name: form.name, email: form.email, phone: form.phone, role: form.role,
      pqe: form.pqe, swe: form.swe, sweStatus: form.sweStatus, source: form.source,
      visa: form.visa, visaDetails: form.visaDetails || selectedVisa?.label || "",
      visaExpiry: form.visaExpiry, dbs: form.dbs, ref1: form.ref1, ref2: form.ref2,
      rtw: form.rtw, quals: form.quals, location: form.location, available: form.available,
      crossCouncil: form.crossCouncil, notes: form.notes,
      cvFileName: form.name.replace(/ /g, "_") + "_CV.pdf",
      cvUploaded: true,
      submittedBy: "PSP",
      submittedAt: new Date().toISOString().split("T")[0],
      emailNotifications: ["Application received - " + new Date().toLocaleDateString("en-GB")],
      pipelineStage: "new",
      stageEnteredAt: new Date().toISOString(),
      motivation: form.notes || "Not specified",
      warmStatus: "active",
      counterOfferRisk: "low",
      yearsInCurrentRole: 0,
      currentEmployer: "",
      withdrawalReason: null,
      communicationLog: [{ date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0,5), type: "system" as const, message: `Candidate added by PSP`, by: "PSP" }],
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
    setForm({ name: "", email: "", phone: "", role: "", pqe: "", swe: "", sweStatus: "active", source: "PSP Network", visa: "british_citizen", visaDetails: "", visaExpiry: "", location: "", available: "", dbs: "pending", ref1: "pending", ref2: "pending", rtw: "pending", quals: "pending", crossCouncil: false, notes: "" });
    setStep(1);
    onClose();
  };

  const reset = () => { setStep(1); onClose(); };

  return (
    <Modal open={open} onClose={reset} title="Add New Candidate" width={650}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Personal Details", "Visa & Right to Work", "Compliance"].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 4, background: i + 1 <= step ? "var(--psp-green)" : "#e2e8f0", marginBottom: 6 }} />
            <span style={{ fontSize: 11, color: i + 1 <= step ? "var(--psp-green)" : "var(--text-secondary)", fontWeight: i + 1 === step ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Full Name" required>
              <input style={inputStyle} placeholder="Sarah Mitchell" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </FormField>
            <FormField label="Target Role" required>
              <input style={inputStyle} placeholder="Senior Social Worker" value={form.role} onChange={(e) => set("role", e.target.value)} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Email">
              <input style={inputStyle} type="email" placeholder="s.mitchell@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <input style={inputStyle} placeholder="07912 345678" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <FormField label="SWE Number" required>
              <input style={inputStyle} placeholder="SW12345" value={form.swe} onChange={(e) => set("swe", e.target.value)} />
            </FormField>
            <FormField label="PQE">
              <input style={inputStyle} placeholder="e.g. 6 years or NQ" value={form.pqe} onChange={(e) => set("pqe", e.target.value)} />
            </FormField>
            <FormField label="Source">
              <select style={selectStyle} value={form.source} onChange={(e) => set("source", e.target.value)}>
                {["PSP Network", "WhatsApp", "Direct", "Agency", "Referral", "Job Board"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Location">
              <input style={inputStyle} placeholder="Manchester" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </FormField>
            <FormField label="Availability">
              <input style={inputStyle} placeholder="Immediate / 2 weeks / 1 month" value={form.available} onChange={(e) => set("available", e.target.value)} />
            </FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button className="btn btn-outline" onClick={reset}>Cancel</button>
            <button className="btn btn-primary" onClick={() => form.name && form.role && form.swe ? setStep(2) : null} style={{ opacity: form.name && form.role && form.swe ? 1 : 0.5 }}>Next: Visa & RTW →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Plane size={20} color="var(--status-amber)" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visa & Right to Work</h3>
          </div>
          <FormField label="Immigration Status" required>
            <select style={selectStyle} value={form.visa} onChange={(e) => handleVisaChange(e.target.value as VisaType)}>
              {visaOptions.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </FormField>

          {selectedVisa?.needsSponsorship && (
            <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#92400e" }}>
              <strong>⚠️ Sponsorship Required</strong> — This candidate will need the council to hold a valid UKVI Sponsor Licence and issue a Certificate of Sponsorship before their start date. Social Workers are on the Shortage Occupation List.
            </div>
          )}

          {form.visa === "graduate_visa" && (
            <div style={{ padding: 12, background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#1e40af" }}>
              <strong>ℹ️ Time-Limited</strong> — Graduate Visa allows full employment but is time-limited. The candidate will need sponsorship to extend.
            </div>
          )}

          {(form.visa !== "british_citizen" && form.visa !== "settled_status") && (
            <FormField label="Visa Expiry Date">
              <input style={inputStyle} type="date" value={form.visaExpiry} onChange={(e) => set("visaExpiry", e.target.value)} />
            </FormField>
          )}

          <FormField label="Visa Details / Notes">
            <textarea style={textareaStyle} placeholder="Any additional visa or immigration details..." value={form.visaDetails} onChange={(e) => set("visaDetails", e.target.value)} />
          </FormField>

          <FormField label="Right to Work Status">
            <select style={selectStyle} value={form.rtw} onChange={(e) => set("rtw", e.target.value)}>
              <option value="verified">✅ Verified — can work in UK</option>
              <option value="requires_sponsorship">⚠️ Requires Sponsorship</option>
              <option value="time_limited">⏳ Time-Limited</option>
              <option value="pending">⏱ Pending verification</option>
              <option value="expired">❌ Expired</option>
            </select>
          </FormField>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Compliance →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { field: "dbs", label: "Enhanced DBS" },
              { field: "ref1", label: "Reference 1" },
              { field: "ref2", label: "Reference 2" },
              { field: "quals", label: "Qualifications" },
            ].map((item) => (
              <FormField key={item.field} label={item.label}>
                <select style={selectStyle} value={(form as unknown as Record<string, string>)[item.field]} onChange={(e) => set(item.field, e.target.value)}>
                  <option value="pending">⏱ Pending</option>
                  <option value="done">✅ Complete</option>
                  <option value="warning">⚠️ Issue / Chasing</option>
                  <option value="na">N/A</option>
                </select>
              </FormField>
            ))}
          </div>
          <FormField label="SWE Registration Status">
            <select style={selectStyle} value={form.sweStatus} onChange={(e) => set("sweStatus", e.target.value)}>
              <option value="active">✅ Active</option>
              <option value="conditions">⚠️ Active with Conditions</option>
              <option value="suspended">❌ Suspended</option>
              <option value="pending">⏱ Pending Registration</option>
            </select>
          </FormField>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 16 }}>
            <input type="checkbox" checked={form.crossCouncil} onChange={(e) => set("crossCouncil", e.target.checked)} id="cross-council" />
            <label htmlFor="cross-council" style={{ fontSize: 13 }}>Candidate has applied at another council in the RecruitSW network</label>
          </div>
          <FormField label="Notes">
            <textarea style={textareaStyle} placeholder="Any additional notes about this candidate..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </FormField>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>✓ Add Candidate</button>
          </div>
        </>
      )}
    </Modal>
  );
}
