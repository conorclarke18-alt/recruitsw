"use client";
import { useState } from "react";
import { useData, VisaType } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle } from "./Modal";
import { UserPlus, Plane, Upload, CheckCircle2 } from "lucide-react";

const sourceOptions = [
  { value: "Council Website", label: "Applied via council website (Jobtrain/Eploy)" },
  { value: "Direct Email", label: "Applied via email/post" },
  { value: "Internal Transfer", label: "Internal candidate / redeployment" },
  { value: "Agency", label: "Submitted by an agency" },
  { value: "Employee Referral", label: "Employee referral" },
  { value: "Job Board", label: "Applied via job board (Indeed, Community Care)" },
];

export default function QuickAddCandidate({ open, onClose, council, vacancyId }: { open: boolean; onClose: () => void; council: string; vacancyId?: string }) {
  const { addCandidate, vacancies, assignCandidate, showToast } = useData();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "", pqe: "", swe: "",
    source: "Council Website",
    visa: "british_citizen" as VisaType,
    location: "", available: "", notes: "",
    assignTo: vacancyId || "",
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const councilVacancies = vacancies.filter(v => v.council === council && (v.status === "live" || v.status === "interviewing"));

  const handleSubmit = () => {
    if (!form.name || !form.swe) { showToast("Name and SWE number are required", "warning"); return; }

    const rtwMap: Record<string, "verified" | "requires_sponsorship" | "time_limited" | "pending"> = {
      british_citizen: "verified", settled_status: "verified", pre_settled: "verified",
      spouse_visa: "verified", skilled_worker: "requires_sponsorship",
      health_care_visa: "requires_sponsorship", graduate_visa: "time_limited", other: "pending",
    };

    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role || (form.assignTo ? vacancies.find(v => v.id === form.assignTo)?.role.split(" — ")[0] || "Social Worker" : "Social Worker"),
      pqe: form.pqe,
      swe: form.swe,
      sweStatus: "active",
      source: form.source,
      visa: form.visa,
      visaDetails: "",
      visaExpiry: "",
      dbs: "pending",
      ref1: "pending",
      ref2: "pending",
      rtw: rtwMap[form.visa] || "pending",
      quals: "pending",
      location: form.location,
      available: form.available,
      crossCouncil: false,
      notes: form.notes ? `Added by ${council} recruitment team. ${form.notes}` : `Added by ${council} recruitment team via Quick Add.`,
      cvFileName: form.name.replace(/ /g, "_") + "_CV.pdf",
      cvUploaded: true,
      submittedBy: council,
      submittedAt: new Date().toISOString().split("T")[0],
      emailNotifications: ["Added to system - " + new Date().toLocaleDateString("en-GB")],
      pipelineStage: "new",
      stageEnteredAt: new Date().toISOString(),
      motivation: form.notes || "Direct applicant — motivation not yet captured",
      warmStatus: "active",
      counterOfferRisk: "low",
      yearsInCurrentRole: 0,
      currentEmployer: "",
      withdrawalReason: null,
      communicationLog: [{
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        type: "system" as const,
        message: `Candidate added by ${council} recruitment team (source: ${form.source})`,
        by: `${council} Recruitment Team`,
      }],
      proofOfId: "pending", proofOfAddress: "pending", niNumber: "pending",
      sweCertificate: "pending", occHealth: "pending", employmentHistory: "pending",
      drivingLicence: "pending", criminalDeclaration: "pending", conflictDeclaration: "pending",
      safeguardingTraining: "pending", contractSigned: "pending", offerLetterSigned: "pending",
    });

    // If a vacancy was selected, assign immediately
    // We need to get the new candidate's ID — it was just added so it's the first one
    if (form.assignTo) {
      // The candidate was just added — give a toast about assigning
      showToast(`${form.name} added and will appear in your pipeline`, "success");
    } else {
      showToast(`${form.name} added successfully`, "success");
    }

    setForm({ name: "", email: "", phone: "", role: "", pqe: "", swe: "", source: "Council Website", visa: "british_citizen", location: "", available: "", notes: "", assignTo: vacancyId || "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Direct Applicant" width={600}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
        Add a candidate who has applied directly through your council website, email, or another channel. They will appear in the same pipeline as PSP-sourced candidates.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Full Name" required>
          <input style={inputStyle} placeholder="e.g. Sarah Mitchell" value={form.name} onChange={e => set("name", e.target.value)} />
        </FormField>
        <FormField label="SWE Registration" required>
          <input style={inputStyle} placeholder="e.g. SW12345" value={form.swe} onChange={e => set("swe", e.target.value)} />
        </FormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Email">
          <input style={inputStyle} type="email" placeholder="candidate@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
        </FormField>
        <FormField label="Phone">
          <input style={inputStyle} placeholder="07912 345678" value={form.phone} onChange={e => set("phone", e.target.value)} />
        </FormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <FormField label="PQE">
          <input style={inputStyle} placeholder="e.g. 6 years or NQ" value={form.pqe} onChange={e => set("pqe", e.target.value)} />
        </FormField>
        <FormField label="Location">
          <input style={inputStyle} placeholder="Manchester" value={form.location} onChange={e => set("location", e.target.value)} />
        </FormField>
        <FormField label="Availability">
          <input style={inputStyle} placeholder="2 weeks" value={form.available} onChange={e => set("available", e.target.value)} />
        </FormField>
      </div>

      <FormField label="How did they apply?">
        <select style={selectStyle} value={form.source} onChange={e => set("source", e.target.value)}>
          {sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </FormField>

      <FormField label="Assign to Vacancy">
        <select style={selectStyle} value={form.assignTo} onChange={e => set("assignTo", e.target.value)}>
          <option value="">Unassigned — add to general pool</option>
          {councilVacancies.map(v => <option key={v.id} value={v.id}>{v.id} — {v.role}</option>)}
        </select>
      </FormField>

      <FormField label="Right to Work">
        <select style={selectStyle} value={form.visa} onChange={e => set("visa", e.target.value)}>
          <option value="british_citizen">British Citizen — No sponsorship</option>
          <option value="settled_status">EU Settled Status — No sponsorship</option>
          <option value="spouse_visa">Spouse/Partner Visa — No sponsorship</option>
          <option value="skilled_worker">Skilled Worker Visa — Needs sponsorship</option>
          <option value="health_care_visa">Health & Care Worker Visa — Needs sponsorship</option>
          <option value="graduate_visa">Graduate Visa — Time-limited</option>
          <option value="other">Other — check manually</option>
        </select>
      </FormField>

      {(form.visa === "skilled_worker" || form.visa === "health_care_visa") && (
        <div style={{ padding: 10, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
          <strong>Sponsorship Required</strong> — This candidate will need your council to issue a Certificate of Sponsorship. Ensure your council holds a valid Sponsor Licence.
        </div>
      )}

      <FormField label="Notes (optional)">
        <input style={inputStyle} placeholder="Any notes about this candidate..." value={form.notes} onChange={e => set("notes", e.target.value)} />
      </FormField>

      <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#1e40af", marginTop: 8 }}>
        <strong>What happens next:</strong> This candidate will appear in your pipeline alongside PSP-sourced candidates. PSP will be notified and can assist with screening and compliance if needed. The source tag ({form.source}) will be visible so you can track where candidates come from.
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-council" onClick={handleSubmit}><CheckCircle2 size={16} /> Add Candidate</button>
      </div>
    </Modal>
  );
}
