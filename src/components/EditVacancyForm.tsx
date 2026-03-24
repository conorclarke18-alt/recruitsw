"use client";
import { useState, useEffect } from "react";
import { useData, Vacancy } from "./DataStore";
import { Modal, FormField, inputStyle, selectStyle, textareaStyle } from "./Modal";
import { Banknote, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";

// Salary benchmarking data for social work roles in the UK
const salaryBenchmarks: Record<string, { min: number; median: number; max: number; market: string }> = {
  "ASYE Social Worker": { min: 30000, median: 34500, max: 37500, market: "Strong supply — most NQSWs actively seeking ASYE posts. Competitive at median." },
  "Social Worker": { min: 33000, median: 38000, max: 42000, market: "Moderate demand — 2+ years PQE increasingly hard to find. Above median recommended." },
  "Senior Social Worker": { min: 39000, median: 44500, max: 48000, market: "High demand — court work and safeguarding experience scarce. Top quartile attracts best." },
  "Advanced Practitioner": { min: 42000, median: 47000, max: 52000, market: "Very high demand — practice educators and BIAs in short supply." },
  "Team Manager": { min: 48000, median: 54000, max: 60000, market: "Critical shortage — experienced managers leaving for consultancy. Maximise package." },
  "Practice Manager": { min: 45000, median: 51000, max: 57000, market: "High demand — similar to Team Manager. Adults slightly easier to fill than children's." },
  "Service Manager": { min: 55000, median: 65000, max: 75000, market: "Very hard to fill — typically headhunted. Relocation packages common." },
  "Principal Social Worker": { min: 52000, median: 60000, max: 70000, market: "Specialist role — limited pool. Most councils struggle to fill within 60 days." },
  "default": { min: 33000, median: 40000, max: 50000, market: "Check specific role benchmarks for accurate data." },
};

function getSalaryAdvice(role: string, salaryMin: number, salaryMax: number) {
  // Find best matching benchmark
  const key = Object.keys(salaryBenchmarks).find(k => role.toLowerCase().includes(k.toLowerCase())) || "default";
  const bench = salaryBenchmarks[key];

  const midpoint = (salaryMin + salaryMax) / 2;
  const benchMid = bench.median;
  const pctDiff = Math.round(((midpoint - benchMid) / benchMid) * 100);

  let rating: "excellent" | "good" | "below" | "risk";
  let advice: string;

  if (midpoint >= bench.max) {
    rating = "excellent";
    advice = `This salary is in the top quartile for this role type. You should attract strong candidates quickly — estimated 15-20 day fill time.`;
  } else if (midpoint >= bench.median) {
    rating = "good";
    advice = `This salary is at or above the market median. Competitive for most candidates — estimated 25-30 day fill time.`;
  } else if (midpoint >= bench.min) {
    rating = "below";
    advice = `This salary is below the market median by ${Math.abs(pctDiff)}%. You may struggle to attract experienced candidates. Consider increasing by £${(benchMid - midpoint).toLocaleString()} to reach median.`;
  } else {
    rating = "risk";
    advice = `This salary is significantly below market rate (${Math.abs(pctDiff)}% below median). High risk of no suitable applicants or losing candidates to counter-offers. Strongly recommend increasing to at least £${bench.min.toLocaleString()}.`;
  }

  return { bench, pctDiff, rating, advice, key };
}

export function SalaryBenchmark({ role, salaryMin, salaryMax }: { role: string; salaryMin: number; salaryMax: number }) {
  if (!salaryMin || !salaryMax) return null;
  const { bench, rating, advice, key } = getSalaryAdvice(role, salaryMin, salaryMax);

  const colors = {
    excellent: { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: <CheckCircle2 size={16} color="#16a34a" /> },
    good: { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af", icon: <TrendingUp size={16} color="#2563eb" /> },
    below: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e", icon: <AlertTriangle size={16} color="#d97706" /> },
    risk: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", icon: <AlertTriangle size={16} color="#dc2626" /> },
  };
  const c = colors[rating];

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 14, marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {c.icon}
        <strong style={{ fontSize: 13, color: c.text }}>
          Salary Benchmark — {key === "default" ? "General Social Work" : key}
        </strong>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 8, fontSize: 12 }}>
        <span>Market Low: <strong>£{bench.min.toLocaleString()}</strong></span>
        <span>Median: <strong>£{bench.median.toLocaleString()}</strong></span>
        <span>Market High: <strong>£{bench.max.toLocaleString()}</strong></span>
      </div>
      {/* Visual bar */}
      <div style={{ position: "relative", height: 8, background: "#e2e8f0", borderRadius: 4, marginBottom: 8 }}>
        <div style={{ position: "absolute", left: "50%", top: -2, width: 2, height: 12, background: "#64748b" }} />
        <div style={{
          position: "absolute",
          left: `${Math.max(0, Math.min(100, ((salaryMin - bench.min) / (bench.max - bench.min)) * 100))}%`,
          width: `${Math.max(5, Math.min(100, ((salaryMax - salaryMin) / (bench.max - bench.min)) * 100))}%`,
          height: 8, borderRadius: 4,
          background: rating === "excellent" ? "#16a34a" : rating === "good" ? "#2563eb" : rating === "below" ? "#d97706" : "#dc2626",
        }} />
      </div>
      <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5 }}>{advice}</p>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{bench.market}</p>
    </div>
  );
}

export default function EditVacancyForm({ open, onClose, vacancy }: { open: boolean; onClose: () => void; vacancy: Vacancy | null }) {
  const { updateVacancy, showToast } = useData();
  const [form, setForm] = useState({
    role: "", team: "", manager: "", grade: "", salaryMin: "", salaryMax: "",
    status: "live" as Vacancy["status"], description: "", essential: "", desirable: "",
    acceptsSponsorship: true, caseloadInfo: "", teamSize: "", supervisionFreq: "",
  });

  useEffect(() => {
    if (vacancy) {
      const salaryParts = vacancy.salary.replace(/[£,]/g, "").split(" - ");
      setForm({
        role: vacancy.role, team: vacancy.team, manager: vacancy.manager,
        grade: vacancy.grade, salaryMin: salaryParts[0] || "", salaryMax: salaryParts[1] || "",
        status: vacancy.status, description: vacancy.description,
        essential: vacancy.essential, desirable: vacancy.desirable,
        acceptsSponsorship: vacancy.acceptsSponsorship,
        caseloadInfo: vacancy.caseloadInfo, teamSize: vacancy.teamSize,
        supervisionFreq: vacancy.supervisionFreq,
      });
    }
  }, [vacancy]);

  const set = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!vacancy) return;
    updateVacancy(vacancy.id, {
      role: form.role, team: form.team, manager: form.manager, grade: form.grade,
      salary: form.salaryMin && form.salaryMax ? `£${Number(form.salaryMin).toLocaleString()} - £${Number(form.salaryMax).toLocaleString()}` : vacancy.salary,
      status: form.status, description: form.description, essential: form.essential,
      desirable: form.desirable, acceptsSponsorship: form.acceptsSponsorship,
      caseloadInfo: form.caseloadInfo, teamSize: form.teamSize, supervisionFreq: form.supervisionFreq,
    });
    showToast(`Vacancy "${form.role}" updated`, "success");
    onClose();
  };

  if (!vacancy) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit: ${vacancy.role}`} width={700}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Role Title" required>
          <input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} />
        </FormField>
        <FormField label="Team">
          <input style={inputStyle} value={form.team} onChange={e => set("team", e.target.value)} />
        </FormField>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <FormField label="Hiring Manager">
          <input style={inputStyle} value={form.manager} onChange={e => set("manager", e.target.value)} />
        </FormField>
        <FormField label="Grade">
          <select style={selectStyle} value={form.grade} onChange={e => set("grade", e.target.value)}>
            {["Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","Grade 13","SCP"].map(g => <option key={g}>{g}</option>)}
          </select>
        </FormField>
        <FormField label="Status">
          <select style={selectStyle} value={form.status} onChange={e => set("status", e.target.value)}>
            {["draft","live","interviewing","offer","filled","closed"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Salary Min (£)">
          <input style={inputStyle} type="number" value={form.salaryMin} onChange={e => set("salaryMin", e.target.value)} />
        </FormField>
        <FormField label="Salary Max (£)">
          <input style={inputStyle} type="number" value={form.salaryMax} onChange={e => set("salaryMax", e.target.value)} />
        </FormField>
      </div>

      {/* Salary Benchmark */}
      <SalaryBenchmark role={form.role} salaryMin={Number(form.salaryMin)} salaryMax={Number(form.salaryMax)} />

      <FormField label="Job Description">
        <textarea style={textareaStyle} value={form.description} onChange={e => set("description", e.target.value)} />
      </FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Essential Criteria">
          <textarea style={{ ...textareaStyle, minHeight: 60 }} value={form.essential} onChange={e => set("essential", e.target.value)} />
        </FormField>
        <FormField label="Desirable Criteria">
          <textarea style={{ ...textareaStyle, minHeight: 60 }} value={form.desirable} onChange={e => set("desirable", e.target.value)} />
        </FormField>
      </div>

      {/* Team Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <FormField label="Caseload Info">
          <input style={inputStyle} placeholder="e.g. 15-18 cases" value={form.caseloadInfo} onChange={e => set("caseloadInfo", e.target.value)} />
        </FormField>
        <FormField label="Team Size">
          <input style={inputStyle} placeholder="e.g. 6 SWs + 1 TM" value={form.teamSize} onChange={e => set("teamSize", e.target.value)} />
        </FormField>
        <FormField label="Supervision Frequency">
          <input style={inputStyle} placeholder="e.g. Monthly formal" value={form.supervisionFreq} onChange={e => set("supervisionFreq", e.target.value)} />
        </FormField>
      </div>

      {/* Sponsorship Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: form.acceptsSponsorship ? "#fffbeb" : "#f8fafc", border: `1px solid ${form.acceptsSponsorship ? "#fcd34d" : "var(--border)"}`, borderRadius: 10, marginTop: 8 }}>
        <input type="checkbox" checked={form.acceptsSponsorship} onChange={e => set("acceptsSponsorship", e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
        <div>
          <strong style={{ fontSize: 13 }}>Accept candidates requiring visa sponsorship</strong>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
            {form.acceptsSponsorship
              ? "Social Workers are on the Shortage Occupation List. Your council must hold a valid Sponsor Licence to hire these candidates."
              : "Only candidates with existing right to work (British, Settled Status, Spouse Visa) will be submitted."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}><CheckCircle2 size={16} /> Save Changes</button>
      </div>
    </Modal>
  );
}
