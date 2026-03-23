"use client";
import { useState } from "react";
import { useData } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";
import { Briefcase, Building2, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  requestedBy: string;
  requestedByRole: "hiring_manager" | "recruitment_team";
  council: string;
}

export default function VacancyRequestForm({ open, onClose, requestedBy, requestedByRole, council }: Props) {
  const { addVacancyRequest } = useData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: "",
    team: "",
    grade: "Grade 8",
    salaryMin: "",
    salaryMax: "",
    description: "",
    essential: "",
    desirable: "",
    justification: "",
    replacementFor: "",
    fundingApproved: false,
    atsReference: "",
    internalSystem: "Jobtrain",
  });

  const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    if (!form.role || !form.team) return;
    addVacancyRequest({
      council,
      requestedBy,
      requestedByRole,
      role: form.role,
      team: form.team,
      grade: form.grade,
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      description: form.description,
      essential: form.essential,
      desirable: form.desirable,
      justification: form.justification,
      replacementFor: form.replacementFor,
      fundingApproved: form.fundingApproved,
      atsReference: form.atsReference,
      internalSystem: form.internalSystem,
    });
    setForm({ role: "", team: "", grade: "Grade 8", salaryMin: "", salaryMax: "", description: "", essential: "", desirable: "", justification: "", replacementFor: "", fundingApproved: false, atsReference: "", internalSystem: "Jobtrain" });
    setStep(1);
    onClose();
  };

  const reset = () => { setStep(1); onClose(); };

  return (
    <Modal open={open} onClose={reset} title={requestedByRole === "hiring_manager" ? "Request a New Vacancy" : "Create a New Vacancy"} width={680}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Role Details", "Justification & Budget", "Person Spec", "Review"].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 4, background: i + 1 <= step ? "var(--council-blue)" : "#e2e8f0", marginBottom: 6, transition: "background 0.3s" }} />
            <span style={{ fontSize: 10, color: i + 1 <= step ? "var(--council-blue)" : "var(--text-secondary)", fontWeight: i + 1 === step ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#1e40af" }}>
            <Building2 size={16} style={{ display: "inline", marginRight: 6 }} />
            <strong>{council}</strong> — {requestedByRole === "hiring_manager" ? "This request will be sent to your recruitment team for approval, then to PSP for sourcing." : "This vacancy will be sent to PSP for sourcing once approved."}
          </div>

          <FormField label="Job Title" required>
            <input style={inputStyle} placeholder="e.g. Senior Social Worker — Children in Need" value={form.role} onChange={(e) => set("role", e.target.value)} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Team / Service Area" required>
              <input style={inputStyle} placeholder="e.g. Children's Services" value={form.team} onChange={(e) => set("team", e.target.value)} />
            </FormField>
            <FormField label="Grade">
              <select style={selectStyle} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Grade 13"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Salary Min (£)">
              <input style={inputStyle} type="number" placeholder="33945" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
            </FormField>
            <FormField label="Salary Max (£)">
              <input style={inputStyle} type="number" placeholder="37336" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Job Description">
            <textarea style={textareaStyle} placeholder="Describe the role, responsibilities, team context..." value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FormField>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button className="btn btn-outline" onClick={reset}>Cancel</button>
            <button className="btn btn-council" onClick={() => form.role && form.team ? setStep(2) : null} style={{ opacity: form.role && form.team ? 1 : 0.5 }}>Next: Justification →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <FormField label="Why is this role needed?" required>
            <textarea style={textareaStyle} placeholder="e.g. Replacement for leaver, caseloads are at 22 per SW vs target 18, team carrying 2 vacancies..." value={form.justification} onChange={(e) => set("justification", e.target.value)} />
          </FormField>
          <FormField label="Replacement for / New Post">
            <input style={inputStyle} placeholder="e.g. Sarah Thompson (leaver) or New post (DfE funded)" value={form.replacementFor} onChange={(e) => set("replacementFor", e.target.value)} />
          </FormField>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 16 }}>
            <input type="checkbox" checked={form.fundingApproved} onChange={(e) => set("fundingApproved", e.target.checked)} id="funding" />
            <label htmlFor="funding" style={{ fontSize: 13 }}><strong>Budget / funding approved</strong> — I confirm this post has been approved in the workforce plan or has dedicated funding</label>
          </div>

          <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Internal System Reference</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FormField label="Your ATS / HR System">
                <select style={selectStyle} value={form.internalSystem} onChange={(e) => set("internalSystem", e.target.value)}>
                  <option value="Jobtrain">Jobtrain</option>
                  <option value="Eploy">Eploy</option>
                  <option value="Tribepad">Tribepad</option>
                  <option value="iTrent">iTrent (MHR)</option>
                  <option value="Oracle">Oracle HCM</option>
                  <option value="Manual">Manual / Email</option>
                  <option value="None">Not yet raised internally</option>
                </select>
              </FormField>
              <FormField label="Internal Reference Number">
                <input style={inputStyle} placeholder="e.g. JT-MCC-2026-0847" value={form.atsReference} onChange={(e) => set("atsReference", e.target.value)} />
              </FormField>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
              If you&apos;ve already raised this vacancy in your council&apos;s system, enter the reference so PSP can link it. If not, leave blank — you can add it later.
            </p>
          </div>

          {!form.fundingApproved && (
            <div style={{ padding: 10, background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>This request will be flagged as <strong>funding not confirmed</strong>. Your recruitment team may hold it until budget is approved.</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-council" onClick={() => setStep(3)}>Next: Person Spec →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <FormField label="Essential Criteria">
            <textarea style={textareaStyle} placeholder="SWE registered, 3+ years PQE in children's services, experience with court work..." value={form.essential} onChange={(e) => set("essential", e.target.value)} />
          </FormField>
          <FormField label="Desirable Criteria">
            <textarea style={textareaStyle} placeholder="Practice educator qualification, NAAS assessed..." value={form.desirable} onChange={(e) => set("desirable", e.target.value)} />
          </FormField>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
            <strong>Tip:</strong> Roles with fewer than 8 essential criteria fill 40% faster. Focus on must-haves. PSP can help refine the person spec to maximise candidate attraction.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-council" onClick={() => setStep(4)}>Next: Review →</button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Briefcase size={20} color="var(--council-blue)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{form.role || "Untitled Vacancy"}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
              <div><strong>Council:</strong> {council}</div>
              <div><strong>Grade:</strong> {form.grade}</div>
              <div><strong>Team:</strong> {form.team}</div>
              <div><strong>Requested by:</strong> {requestedBy}</div>
              <div><strong>Salary:</strong> {form.salaryMin && form.salaryMax ? `£${Number(form.salaryMin).toLocaleString()} - £${Number(form.salaryMax).toLocaleString()}` : "TBC"}</div>
              <div><strong>Funding:</strong> <span className={`badge ${form.fundingApproved ? "badge-green" : "badge-amber"}`}>{form.fundingApproved ? "Approved" : "Not confirmed"}</span></div>
              {form.replacementFor && <div><strong>Replacement for:</strong> {form.replacementFor}</div>}
              {form.atsReference && <div><strong>Internal Ref:</strong> {form.atsReference} ({form.internalSystem})</div>}
            </div>
            {form.justification && <div style={{ marginTop: 12, padding: 10, background: "white", borderRadius: 8 }}><strong style={{ fontSize: 12 }}>Justification:</strong> <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{form.justification}</span></div>}
            {form.description && <p style={{ fontSize: 12, marginTop: 8, color: "var(--text-secondary)" }}>{form.description}</p>}
          </div>

          <div style={{ padding: 12, background: requestedByRole === "hiring_manager" ? "#eff6ff" : "#f0fdf4", borderRadius: 8, fontSize: 13, color: requestedByRole === "hiring_manager" ? "#1e40af" : "#166534", marginBottom: 16 }}>
            {requestedByRole === "hiring_manager"
              ? "This request will be sent to your Recruitment Team for approval. Once approved, PSP will begin sourcing candidates."
              : "This vacancy will be visible to PSP immediately. They will begin sourcing candidates once you confirm it's ready."}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
            <button className="btn btn-council" onClick={handleSubmit}>
              ✓ {requestedByRole === "hiring_manager" ? "Submit Request" : "Create Vacancy"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
