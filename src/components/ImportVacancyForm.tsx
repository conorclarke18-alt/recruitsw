"use client";
import { useState } from "react";
import { useData } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";
import { Download, Link, CheckCircle2, Loader2, Building2, Globe, Zap } from "lucide-react";

export default function ImportVacancyForm({ open, onClose, council }: { open: boolean; onClose: () => void; council: string }) {
  const { addVacancy, showToast } = useData();
  const [step, setStep] = useState<"method" | "import" | "review">("method");
  const [importing, setImporting] = useState(false);
  const [method, setMethod] = useState<"url" | "ref" | "manual">("url");
  const [form, setForm] = useState({
    atsSystem: "Jobtrain",
    atsReference: "",
    atsUrl: "",
    // These get "fetched" from the ATS
    role: "",
    team: "",
    manager: "",
    grade: "Grade 9",
    salaryMin: "",
    salaryMax: "",
    description: "",
    essential: "",
    desirable: "",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Simulate fetching job details from ATS
  const simulateImport = () => {
    setImporting(true);
    setTimeout(() => {
      // Simulate data coming back from the ATS
      if (method === "url" || method === "ref") {
        setForm((f) => ({
          ...f,
          role: f.role || "Social Worker — Family Safeguarding",
          team: f.team || "Family Safeguarding Service",
          manager: f.manager || "James Okafor",
          grade: f.grade || "Grade 9",
          salaryMin: f.salaryMin || "37336",
          salaryMax: f.salaryMax || "40476",
          description: f.description || "An exciting opportunity to join our Family Safeguarding team, working with families to reduce risk and prevent children entering care. You will carry a caseload of approximately 18 families and work closely with adult mental health, substance misuse, and domestic abuse practitioners.",
          essential: f.essential || "SWE registered, 2+ years PQE in children's social work, experience with child protection conferences",
          desirable: f.desirable || "Systemic practice training, experience with motivational interviewing",
        }));
      }
      setImporting(false);
      setStep("review");
      showToast("Job details imported from " + form.atsSystem, "success");
    }, 2000);
  };

  const handleSubmit = () => {
    if (!form.role || !form.team || !form.manager) return;
    const slug = form.role.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    addVacancy({
      council,
      role: form.role,
      team: form.team,
      manager: form.manager,
      grade: form.grade,
      salary: form.salaryMin && form.salaryMax ? `£${Number(form.salaryMin).toLocaleString()} - £${Number(form.salaryMax).toLocaleString()}` : "TBC",
      status: "live",
      description: form.description,
      essential: form.essential,
      desirable: form.desirable,
      atsReference: form.atsReference,
      atsSystem: form.atsSystem,
      atsUrl: form.atsUrl,
      applicationLink: `apply.recruitsw.co.uk/${council.toLowerCase().replace(/[^a-z]+/g, "")}/${slug}`,
      applicationLinkActive: true,
      importedFrom: method === "manual" ? "manual" : "ats_import",
      acceptsSponsorship: true,
      sponsorLicenceHeld: council === "Manchester CC" || council === "Salford CC",
      caseloadInfo: "",
      teamSize: "",
      supervisionFreq: "",
    });
    reset();
  };

  const reset = () => {
    setStep("method");
    setForm({ atsSystem: "Jobtrain", atsReference: "", atsUrl: "", role: "", team: "", manager: "", grade: "Grade 9", salaryMin: "", salaryMax: "", description: "", essential: "", desirable: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={reset} title="Import Vacancy from Your System" width={680}>
      {step === "method" && (
        <>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 14 }}>
            Pull a job from your council&apos;s recruitment system into RecruitSW so PSP can start sourcing candidates immediately.
          </p>

          {/* ATS System Selector */}
          <FormField label="Which system does your council use?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { id: "Jobtrain", label: "Jobtrain", desc: "Most common council ATS" },
                { id: "Eploy", label: "Eploy", desc: "Cloud recruitment" },
                { id: "Tribepad", label: "Tribepad", desc: "Modern ATS" },
                { id: "iTrent", label: "iTrent (MHR)", desc: "HR & payroll" },
                { id: "Oracle", label: "Oracle HCM", desc: "Enterprise" },
                { id: "Other", label: "Other", desc: "Manual entry" },
              ].map((sys) => (
                <button key={sys.id} onClick={() => set("atsSystem", sys.id)} style={{
                  padding: 12, borderRadius: 8, textAlign: "center", cursor: "pointer",
                  border: form.atsSystem === sys.id ? "2px solid var(--council-blue)" : "1px solid var(--border)",
                  background: form.atsSystem === sys.id ? "#eff6ff" : "white",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{sys.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{sys.desc}</div>
                </button>
              ))}
            </div>
          </FormField>

          {/* Import Method */}
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>How would you like to import?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "url", icon: <Globe size={18} />, label: "Paste job listing URL", desc: "We'll pull the details from your careers page automatically" },
                { id: "ref", icon: <Link size={18} />, label: "Enter your internal reference number", desc: `We'll look it up in ${form.atsSystem}` },
                { id: "manual", icon: <Building2 size={18} />, label: "Enter details manually", desc: "Type the job details yourself — link to your ATS later" },
              ].map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id as "url" | "ref" | "manual")} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 10, cursor: "pointer", textAlign: "left",
                  border: method === m.id ? "2px solid var(--council-blue)" : "1px solid var(--border)",
                  background: method === m.id ? "#eff6ff" : "white",
                }}>
                  <div style={{ color: "var(--council-blue)" }}>{m.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn btn-outline" onClick={reset}>Cancel</button>
            <button className="btn btn-council" onClick={() => setStep("import")}>Continue →</button>
          </div>
        </>
      )}

      {step === "import" && !importing && (
        <>
          {method === "url" && (
            <>
              <FormField label={`Paste the job listing URL from ${form.atsSystem}`} required>
                <input style={inputStyle} placeholder={`e.g. https://jobs.manchester.gov.uk/vacancy/social-worker-12345`} value={form.atsUrl} onChange={(e) => set("atsUrl", e.target.value)} />
              </FormField>
              <div style={{ padding: 12, background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#166534", marginBottom: 16 }}>
                <Zap size={14} style={{ display: "inline", marginRight: 4 }} />
                RecruitSW will automatically extract the job title, salary, description, and person spec from the listing.
              </div>
            </>
          )}
          {method === "ref" && (
            <>
              <FormField label={`${form.atsSystem} reference number`} required>
                <input style={inputStyle} placeholder="e.g. JT-MCC-2026-0847" value={form.atsReference} onChange={(e) => set("atsReference", e.target.value)} />
              </FormField>
              <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
                <Link size={14} style={{ display: "inline", marginRight: 4 }} />
                We&apos;ll look this up in {form.atsSystem} and pull in all the job details. You can review and edit before publishing.
              </div>
            </>
          )}
          {method === "manual" && (
            <>
              <FormField label="Job Title" required>
                <input style={inputStyle} placeholder="e.g. Senior Social Worker — Children in Need" value={form.role} onChange={(e) => set("role", e.target.value)} />
              </FormField>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Team / Service Area" required>
                  <input style={inputStyle} placeholder="Children's Services" value={form.team} onChange={(e) => set("team", e.target.value)} />
                </FormField>
                <FormField label="Hiring Manager" required>
                  <input style={inputStyle} placeholder="James Okafor" value={form.manager} onChange={(e) => set("manager", e.target.value)} />
                </FormField>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <FormField label="Grade">
                  <select style={selectStyle} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                    {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Grade 13"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </FormField>
                <FormField label="Salary Min (£)">
                  <input style={inputStyle} type="number" placeholder="37336" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
                </FormField>
                <FormField label="Salary Max (£)">
                  <input style={inputStyle} type="number" placeholder="40476" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Description">
                <textarea style={textareaStyle} placeholder="Role description..." value={form.description} onChange={(e) => set("description", e.target.value)} />
              </FormField>
              <FormField label="Essential Criteria">
                <textarea style={{...textareaStyle, minHeight: 60}} placeholder="SWE registered, 2+ years PQE..." value={form.essential} onChange={(e) => set("essential", e.target.value)} />
              </FormField>
              <FormField label="Internal Reference (optional)">
                <input style={inputStyle} placeholder="JT-MCC-2026-XXXX" value={form.atsReference} onChange={(e) => set("atsReference", e.target.value)} />
              </FormField>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep("method")}>← Back</button>
            {method === "manual" ? (
              <button className="btn btn-council" onClick={() => { if (form.role && form.team && form.manager) setStep("review"); }} style={{ opacity: form.role && form.team && form.manager ? 1 : 0.5 }}>Review →</button>
            ) : (
              <button className="btn btn-council" onClick={simulateImport} style={{ opacity: (method === "url" ? form.atsUrl : form.atsReference) ? 1 : 0.5 }}>
                <Download size={16} /> Import from {form.atsSystem}
              </button>
            )}
          </div>
        </>
      )}

      {step === "import" && importing && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
            <Loader2 size={40} color="var(--council-blue)" />
          </div>
          <p style={{ marginTop: 16, fontWeight: 600, fontSize: 16 }}>Importing from {form.atsSystem}...</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Extracting job title, salary, description, and person spec</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {step === "review" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <CheckCircle2 size={20} color="var(--status-green)" />
            <span style={{ fontWeight: 600, color: "var(--status-green)" }}>
              {method !== "manual" ? `Imported from ${form.atsSystem}` : "Ready to publish"}
            </span>
            {form.atsReference && <span className="badge badge-blue">{form.atsReference}</span>}
          </div>

          {/* Editable review */}
          <FormField label="Job Title" required>
            <input style={inputStyle} value={form.role} onChange={(e) => set("role", e.target.value)} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Team" required>
              <input style={inputStyle} value={form.team} onChange={(e) => set("team", e.target.value)} />
            </FormField>
            <FormField label="Hiring Manager" required>
              <input style={inputStyle} value={form.manager} onChange={(e) => set("manager", e.target.value)} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <FormField label="Grade">
              <select style={selectStyle} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </FormField>
            <FormField label="Salary Min (£)">
              <input style={inputStyle} type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
            </FormField>
            <FormField label="Salary Max (£)">
              <input style={inputStyle} type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea style={textareaStyle} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FormField>
          <FormField label="Essential Criteria">
            <textarea style={{...textareaStyle, minHeight: 60}} value={form.essential} onChange={(e) => set("essential", e.target.value)} />
          </FormField>

          {/* Application Link Preview */}
          <div style={{ padding: 16, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Globe size={18} color="var(--status-green)" />
              <strong style={{ fontSize: 14, color: "#166534" }}>Application Tracking Link</strong>
            </div>
            <p style={{ fontSize: 13, color: "#166534", marginBottom: 8 }}>
              This unique link will be generated for this vacancy. Add it to your {form.atsSystem} listing or council careers page. Every candidate who applies through this link is automatically tracked in RecruitSW.
            </p>
            <div style={{ background: "white", padding: "10px 14px", borderRadius: 8, fontFamily: "monospace", fontSize: 13, color: "var(--council-blue)", border: "1px solid #86efac" }}>
              https://apply.recruitsw.co.uk/{council.toLowerCase().replace(/[^a-z]+/g, "")}/{form.role ? form.role.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 25) : "vacancy"}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
              Candidates see a council-branded application form. PSP screens applications and shortlists the best candidates for you.
            </p>
          </div>

          <div style={{ padding: 12, background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
            <strong>What happens next:</strong>
            <ol style={{ paddingLeft: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
              <li>This vacancy goes live in RecruitSW immediately</li>
              <li>PSP begins sourcing from their 25,000+ social worker network</li>
              <li>Add the application link to your {form.atsSystem} listing to capture direct applicants too</li>
              <li>All candidates — from PSP sourcing and direct applications — appear in one pipeline</li>
              <li>You review, shortlist, and interview through RecruitSW or your internal process</li>
            </ol>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button className="btn btn-outline" onClick={() => setStep("import")}>← Edit</button>
            <button className="btn btn-council" onClick={handleSubmit} style={{ opacity: form.role && form.team && form.manager ? 1 : 0.5 }}>
              <CheckCircle2 size={16} /> Publish & Generate Application Link
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
