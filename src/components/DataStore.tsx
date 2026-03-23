"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Types
export type VisaType = "british_citizen" | "settled_status" | "skilled_worker" | "graduate_visa" | "spouse_visa" | "health_care_visa" | "pre_settled" | "other";
export type RTWStatus = "verified" | "requires_sponsorship" | "time_limited" | "pending" | "expired";
export type CompStatus = "done" | "pending" | "warning" | "na";

export interface Vacancy {
  id: string;
  council: string;
  role: string;
  team: string;
  manager: string;
  grade: string;
  salary: string;
  status: "draft" | "live" | "interviewing" | "offer" | "filled" | "closed";
  applicants: number;
  shortlisted: number;
  daysOpen: number;
  createdAt: string;
  description: string;
  essential: string;
  desirable: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  pqe: string;
  swe: string;
  sweStatus: "active" | "conditions" | "suspended" | "pending";
  match: number;
  source: string;
  visa: VisaType;
  visaDetails: string;
  visaExpiry: string;
  dbs: CompStatus;
  ref1: CompStatus;
  ref2: CompStatus;
  rtw: RTWStatus;
  quals: CompStatus;
  location: string;
  available: string;
  crossCouncil: boolean;
  assignedVacancy: string | null;
  status: "new" | "screening" | "shortlisted" | "interviewing" | "offered" | "hired" | "rejected" | "withdrawn";
  notes: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface DataContextType {
  vacancies: Vacancy[];
  candidates: Candidate[];
  toasts: Toast[];
  addVacancy: (v: Omit<Vacancy, "id" | "applicants" | "shortlisted" | "daysOpen" | "createdAt">) => void;
  updateVacancy: (id: string, updates: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;
  addCandidate: (c: Omit<Candidate, "id" | "createdAt" | "match" | "status" | "assignedVacancy">) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  assignCandidate: (candidateId: string, vacancyId: string) => void;
  showToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

// Default data
const defaultVacancies: Vacancy[] = [
  { id: "V-2024-001", council: "Manchester CC", role: "Senior Social Worker — Children in Need", team: "Children's Services", manager: "James Okafor", grade: "Grade 10", salary: "£42,708 - £46,731", status: "live", applicants: 8, shortlisted: 3, daysOpen: 12, createdAt: "2026-03-11", description: "We are seeking an experienced Senior Social Worker to join our Children in Need team. You will manage a complex caseload and provide supervision to newly qualified staff.", essential: "SWE registered, 3+ years PQE in children's services, experience with court work", desirable: "Practice educator qualification, NAAS assessed" },
  { id: "V-2024-002", council: "Manchester CC", role: "Team Manager — Safeguarding", team: "Safeguarding Hub", manager: "Rachel Adams", grade: "Grade 12", salary: "£52,805 - £56,024", status: "live", applicants: 4, shortlisted: 1, daysOpen: 21, createdAt: "2026-03-02", description: "Lead a team of social workers within the Safeguarding Hub, managing referrals, strategy discussions, and S47 enquiries.", essential: "SWE registered, 5+ years PQE, 2+ years management experience", desirable: "Experience with multi-agency partnerships" },
  { id: "V-2024-003", council: "Salford CC", role: "ASYE Social Worker", team: "Referral & Assessment", manager: "James Okafor", grade: "Grade 8", salary: "£33,945 - £37,336", status: "live", applicants: 14, shortlisted: 5, daysOpen: 7, createdAt: "2026-03-16", description: "An exciting opportunity for a newly qualified social worker to complete their ASYE within a supportive Referral & Assessment team.", essential: "SWE registered, social work degree, right to work in UK", desirable: "Placement experience in children's services" },
  { id: "V-2024-004", council: "Stockport MBC", role: "Practice Manager — Adults", team: "Adult Services", manager: "Linda Chowdhury", grade: "Grade 11", salary: "£47,754 - £51,802", status: "interviewing", applicants: 6, shortlisted: 3, daysOpen: 28, createdAt: "2026-02-23", description: "Oversee a team of adult social workers, ensuring high-quality assessments and care planning.", essential: "SWE registered, 5+ years PQE in adults, management experience", desirable: "BIA qualification, AMHP approved" },
  { id: "V-2024-005", council: "Manchester CC", role: "Social Worker — MASH", team: "Multi-Agency Hub", manager: "Linda Chowdhury", grade: "Grade 9", salary: "£37,336 - £40,476", status: "offer", applicants: 11, shortlisted: 4, daysOpen: 35, createdAt: "2026-02-16", description: "Work within the Multi-Agency Safeguarding Hub triaging referrals and coordinating with partner agencies.", essential: "SWE registered, 2+ years PQE, children's experience", desirable: "MASH or duty experience" },
  { id: "V-2024-006", council: "Trafford", role: "Senior Practitioner — LAC", team: "Looked After Children", manager: "Rachel Adams", grade: "Grade 10", salary: "£42,708 - £46,731", status: "draft", applicants: 0, shortlisted: 0, daysOpen: 0, createdAt: "2026-03-23", description: "Join our LAC team supporting children in care, attending reviews and ensuring care plans are progressed.", essential: "SWE registered, 4+ years PQE, LAC experience", desirable: "Practice educator, life story work experience" },
];

const defaultCandidates: Candidate[] = [
  { id: "C-001", name: "Sarah Mitchell", email: "s.mitchell@email.com", phone: "07912 345678", role: "Senior Social Worker", pqe: "6 years", swe: "SW98234", sweStatus: "active", match: 94, source: "PSP Network", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", visaExpiry: "", dbs: "done", ref1: "done", ref2: "pending", rtw: "verified", quals: "done", location: "Manchester", available: "2 weeks", crossCouncil: false, assignedVacancy: "V-2024-001", status: "shortlisted", notes: "Strong candidate, court work experience. Currently in notice period at Liverpool CC.", createdAt: "2026-03-12" },
  { id: "C-002", name: "David Williams", email: "d.williams@email.com", phone: "07845 678901", role: "Team Manager", pqe: "11 years", swe: "SW67891", sweStatus: "active", match: 89, source: "Direct", visa: "settled_status", visaDetails: "EU Settled Status — Indefinite leave to remain", visaExpiry: "", dbs: "done", ref1: "done", ref2: "done", rtw: "verified", quals: "done", location: "Salford", available: "1 month", crossCouncil: true, assignedVacancy: "V-2024-002", status: "shortlisted", notes: "Excellent management experience, 11 years PQE. Previously applied at another council.", createdAt: "2026-03-05" },
  { id: "C-003", name: "Amara Osei", email: "a.osei@email.com", phone: "07723 456789", role: "Social Worker", pqe: "3 years", swe: "SW45123", sweStatus: "active", match: 87, source: "Agency", visa: "skilled_worker", visaDetails: "Skilled Worker Visa — Expires 15/08/2027 — Requires sponsorship", visaExpiry: "2027-08-15", dbs: "pending", ref1: "done", ref2: "warning", rtw: "requires_sponsorship", quals: "done", location: "Bolton", available: "Immediate", crossCouncil: false, assignedVacancy: "V-2024-005", status: "shortlisted", notes: "Good R&A experience, bilingual. Needs Skilled Worker sponsorship.", createdAt: "2026-03-10" },
  { id: "C-004", name: "Michael Chen", email: "m.chen@email.com", phone: "07634 567890", role: "ASYE Social Worker", pqe: "NQ", swe: "SW78456", sweStatus: "active", match: 82, source: "PSP Network", visa: "graduate_visa", visaDetails: "Graduate Visa — Expires 01/03/2027 — Will need sponsorship for extension", visaExpiry: "2027-03-01", dbs: "done", ref1: "pending", ref2: "pending", rtw: "time_limited", quals: "pending", location: "Stockport", available: "Immediate", crossCouncil: false, assignedVacancy: "V-2024-003", status: "screening", notes: "NQ with strong placement. Graduate visa — flag for future sponsorship.", createdAt: "2026-03-17" },
  { id: "C-005", name: "Priya Sharma", email: "p.sharma@email.com", phone: "07567 890123", role: "Senior Social Worker", pqe: "8 years", swe: "SW34567", sweStatus: "active", match: 91, source: "WhatsApp", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", visaExpiry: "", dbs: "done", ref1: "done", ref2: "done", rtw: "verified", quals: "done", location: "Bury", available: "3 weeks", crossCouncil: true, assignedVacancy: "V-2024-001", status: "shortlisted", notes: "8 years PQE, practice educator. Applied at another council previously.", createdAt: "2026-03-08" },
  { id: "C-006", name: "Fatima Al-Hassan", email: "f.alhassan@email.com", phone: "07456 789012", role: "Social Worker", pqe: "4 years", swe: "SW89012", sweStatus: "conditions", match: 78, source: "Direct", visa: "spouse_visa", visaDetails: "Spouse Visa — Expires 22/11/2026 — Eligible to work, no sponsorship needed", visaExpiry: "2026-11-22", dbs: "done", ref1: "done", ref2: "warning", rtw: "verified", quals: "done", location: "Oldham", available: "1 month", crossCouncil: false, assignedVacancy: null, status: "new", notes: "Spouse visa, can work. SWE has conditions — check detail.", createdAt: "2026-03-20" },
  { id: "C-007", name: "James Adeyemi", email: "j.adeyemi@email.com", phone: "07345 678901", role: "Practice Manager", pqe: "9 years", swe: "SW56789", sweStatus: "active", match: 85, source: "PSP Network", visa: "health_care_visa", visaDetails: "Health & Care Worker Visa — Expires 30/06/2028 — Council must hold sponsor licence", visaExpiry: "2028-06-30", dbs: "pending", ref1: "pending", ref2: "pending", rtw: "requires_sponsorship", quals: "done", location: "Rochdale", available: "6 weeks", crossCouncil: false, assignedVacancy: "V-2024-004", status: "screening", notes: "Strong practice manager. Health & Care visa — verify council sponsor licence.", createdAt: "2026-03-15" },
];

let nextVacancyNum = 7;
let nextCandidateNum = 8;

export function DataProvider({ children }: { children: ReactNode }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(defaultVacancies);
  const [candidates, setCandidates] = useState<Candidate[]>(defaultCandidates);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addVacancy = useCallback((v: Omit<Vacancy, "id" | "applicants" | "shortlisted" | "daysOpen" | "createdAt">) => {
    const newV: Vacancy = {
      ...v,
      id: `V-2024-${String(nextVacancyNum++).padStart(3, "0")}`,
      applicants: 0,
      shortlisted: 0,
      daysOpen: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setVacancies((prev) => [newV, ...prev]);
    showToast(`Vacancy "${v.role}" created successfully`);
  }, [showToast]);

  const updateVacancy = useCallback((id: string, updates: Partial<Vacancy>) => {
    setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    showToast("Vacancy updated");
  }, [showToast]);

  const deleteVacancy = useCallback((id: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id));
    showToast("Vacancy deleted", "info");
  }, [showToast]);

  const addCandidate = useCallback((c: Omit<Candidate, "id" | "createdAt" | "match" | "status" | "assignedVacancy">) => {
    const newC: Candidate = {
      ...c,
      id: `C-${String(nextCandidateNum++).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      match: Math.floor(Math.random() * 20) + 75,
      status: "new",
      assignedVacancy: null,
    };
    setCandidates((prev) => [newC, ...prev]);
    showToast(`Candidate "${c.name}" added successfully`);
  }, [showToast]);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (updates.status === "rejected") showToast("Candidate rejected", "info");
    else if (updates.status === "shortlisted") showToast("Candidate shortlisted", "success");
    else if (updates.status === "offered") showToast("Offer sent to candidate", "success");
    else showToast("Candidate updated");
  }, [showToast]);

  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    showToast("Candidate removed", "info");
  }, [showToast]);

  const assignCandidate = useCallback((candidateId: string, vacancyId: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, assignedVacancy: vacancyId, status: "shortlisted" as const } : c)));
    setVacancies((prev) => prev.map((v) => (v.id === vacancyId ? { ...v, shortlisted: v.shortlisted + 1 } : v)));
    showToast("Candidate assigned to vacancy");
  }, [showToast]);

  return (
    <DataContext.Provider value={{ vacancies, candidates, toasts, addVacancy, updateVacancy, deleteVacancy, addCandidate, updateCandidate, deleteCandidate, assignCandidate, showToast, dismissToast }}>
      {children}
      {/* Toast notifications */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} onClick={() => dismissToast(t.id)} style={{
            padding: "12px 20px", borderRadius: 10, color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)", minWidth: 280, animation: "slideIn 0.3s ease",
            background: t.type === "success" ? "#16a34a" : t.type === "error" ? "#dc2626" : t.type === "warning" ? "#d97706" : "#2563eb",
          }}>
            {t.type === "success" ? "✓ " : t.type === "error" ? "✗ " : t.type === "warning" ? "⚠ " : "ℹ "}{t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </DataContext.Provider>
  );
}
