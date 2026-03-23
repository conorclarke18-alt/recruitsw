"use client";
import { useState } from "react";
import { useData } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";
import { Briefcase } from "lucide-react";

export default function CreateVacancyForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addVacancy } = useData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    council: "Manchester CC",
    role: "",
    team: "",
    manager: "",
    grade: "Grade 8",
    salaryMin: "",
    salaryMax: "",
    status: "draft" as "draft" | "live",
    description: "",
    essential: "",
    desirable: "",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    if (!form.role || !form.team || !form.manager) return;
    const slug = form.role.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    addVacancy({
      council: form.council,
      role: form.role,
      team: form.team,
      manager: form.manager,
      grade: form.grade,
      salary: form.salaryMin && form.salaryMax ? `£${Number(form.salaryMin).toLocaleString()} - £${Number(form.salaryMax).toLocaleString()}` : "TBC",
      status: form.status,
      description: form.description,
      essential: form.essential,
      desirable: form.desirable,
      atsReference: "",
      atsSystem: "None",
      atsUrl: "",
      applicationLink: `apply.recruitsw.co.uk/${form.council.toLowerCase().replace(/[^a-z]+/g, "")}/${slug}`,
      applicationLinkActive: false,
      importedFrom: "psp_created",
    });
    setForm({ council: "Manchester CC", role: "", team: "", manager: "", grade: "Grade 8", salaryMin: "", salaryMax: "", status: "draft" as "draft" | "live", description: "", essential: "", desirable: "" });
    setStep(1);
    onClose();
  };

  const reset = () => { setStep(1); onClose(); };

  return (
    <Modal open={open} onClose={reset} title="Create New Vacancy" width={650}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Role Details", "Person Spec", "Review"].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 4, background: i + 1 <= step ? "var(--psp-green)" : "#e2e8f0", marginBottom: 6, transition: "background 0.3s" }} />
            <span style={{ fontSize: 11, color: i + 1 <= step ? "var(--psp-green)" : "var(--text-secondary)", fontWeight: i + 1 === step ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Council" required>
              <select style={selectStyle} value={form.council} onChange={(e) => set("council", e.target.value)}>
                <option>Manchester CC</option>
                <option>Salford CC</option>
                <option>Stockport MBC</option>
                <option>Trafford</option>
              </select>
            </FormField>
            <FormField label="Grade">
              <select style={selectStyle} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Grade 13"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Job Title" required>
            <input style={inputStyle} placeholder="e.g. Senior Social Worker — Children in Need" value={form.role} onChange={(e) => set("role", e.target.value)} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Team / Service Area" required>
              <input style={inputStyle} placeholder="e.g. Children's Services" value={form.team} onChange={(e) => set("team", e.target.value)} />
            </FormField>
            <FormField label="Hiring Manager" required>
              <input style={inputStyle} placeholder="e.g. James Okafor" value={form.manager} onChange={(e) => set("manager", e.target.value)} />
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
            <textarea style={textareaStyle} placeholder="Describe the role, responsibilities, and team..." value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FormField>
          <FormField label="Initial Status">
            <select style={selectStyle} value={form.status} onChange={(e) => set("status", e.target.value as "draft" | "live")}>
              <option value="draft">Draft — Save for review</option>
              <option value="live">Live — Publish immediately</option>
            </select>
          </FormField>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button className="btn btn-outline" onClick={reset}>Cancel</button>
            <button className="btn btn-primary" onClick={() => form.role && form.team && form.manager ? setStep(2) : null} style={{ opacity: form.role && form.team && form.manager ? 1 : 0.5 }}>Next: Person Spec →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <FormField label="Essential Criteria">
            <textarea style={textareaStyle} placeholder="SWE registered, 3+ years PQE in children's services, experience with court work..." value={form.essential} onChange={(e) => set("essential", e.target.value)} />
          </FormField>
          <FormField label="Desirable Criteria">
            <textarea style={textareaStyle} placeholder="Practice educator qualification, NAAS assessed..." value={form.desirable} onChange={(e) => set("desirable", e.target.value)} />
          </FormField>
          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
            <strong>Tip:</strong> Roles with fewer than 8 essential criteria fill 40% faster. Focus on must-haves and move nice-to-haves to desirable.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Review →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Briefcase size={20} color="var(--psp-green)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{form.role || "Untitled Vacancy"}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
              <div><strong>Council:</strong> {form.council}</div>
              <div><strong>Grade:</strong> {form.grade}</div>
              <div><strong>Team:</strong> {form.team}</div>
              <div><strong>Manager:</strong> {form.manager}</div>
              <div><strong>Salary:</strong> {form.salaryMin && form.salaryMax ? `£${Number(form.salaryMin).toLocaleString()} - £${Number(form.salaryMax).toLocaleString()}` : "TBC"}</div>
              <div><strong>Status:</strong> <span className={`badge ${form.status === "live" ? "badge-green" : "badge-gray"}`}>{form.status}</span></div>
            </div>
            {form.description && <p style={{ fontSize: 13, marginTop: 12, color: "var(--text-secondary)" }}>{form.description}</p>}
            {form.essential && <div style={{ marginTop: 8 }}><strong style={{ fontSize: 12 }}>Essential:</strong> <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{form.essential}</span></div>}
            {form.desirable && <div style={{ marginTop: 4 }}><strong style={{ fontSize: 12 }}>Desirable:</strong> <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{form.desirable}</span></div>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>✓ Create Vacancy</button>
          </div>
        </>
      )}
    </Modal>
  );
}
