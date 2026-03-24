"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Types
export type VisaType = "british_citizen" | "settled_status" | "skilled_worker" | "graduate_visa" | "spouse_visa" | "health_care_visa" | "pre_settled" | "other";
export type RTWStatus = "verified" | "requires_sponsorship" | "time_limited" | "pending" | "expired";
export type CompStatus = "done" | "pending" | "warning" | "na";

export type PipelineStage = "new" | "screened" | "submitted" | "under_review" | "shortlisted" | "interview_scheduled" | "interviewed" | "offer" | "compliance" | "started" | "rejected" | "withdrawn";

export type WarmStatus = "active" | "open" | "passive" | "not_looking";

export type CounterOfferRisk = "low" | "medium" | "high";

export type WithdrawalReason = "accepted_another" | "salary_too_low" | "counter_offered" | "changed_mind" | "failed_compliance" | "location" | "other";

export interface CommunicationEntry {
  date: string;
  time: string;
  type: "call" | "email" | "note" | "system" | "sms";
  message: string;
  by: string;
}

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
  // ATS Integration fields
  atsReference: string;
  atsSystem: string;
  atsUrl: string;
  applicationLink: string;
  applicationLinkActive: boolean;
  importedFrom: "manual" | "ats_import" | "api_sync" | "psp_created";
  // Sponsorship
  acceptsSponsorship: boolean;
  sponsorLicenceHeld: boolean;
  // Caseload & Team info
  caseloadInfo: string;        // e.g. "15-18 cases"
  teamSize: string;            // e.g. "6 SWs + 1 TM + 2 FSWs"
  supervisionFreq: string;     // e.g. "Monthly formal, weekly informal"
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
  pipelineStage: PipelineStage;
  stageEnteredAt: string;        // ISO date when entered current stage
  status: "new" | "screening" | "shortlisted" | "interviewing" | "offered" | "hired" | "rejected" | "withdrawn";
  notes: string;
  createdAt: string;
  // CV & Submission
  cvFileName: string;
  cvUploaded: boolean;
  submittedBy: string;
  submittedAt: string;
  emailNotifications: string[];
  // New fields
  motivation: string;            // Why leaving current role
  warmStatus: WarmStatus;
  counterOfferRisk: CounterOfferRisk;
  yearsInCurrentRole: number;
  currentEmployer: string;
  withdrawalReason: WithdrawalReason | null;
  communicationLog: CommunicationEntry[];
  // Extended compliance
  proofOfId: CompStatus;
  proofOfAddress: CompStatus;
  niNumber: CompStatus;
  sweCertificate: CompStatus;
  occHealth: CompStatus;
  employmentHistory: CompStatus;
  drivingLicence: CompStatus;
  criminalDeclaration: CompStatus;
  conflictDeclaration: CompStatus;
  safeguardingTraining: CompStatus;
  contractSigned: CompStatus;
  offerLetterSigned: CompStatus;
}

export interface VacancyRequest {
  id: string;
  council: string;
  requestedBy: string;  // "James Okafor" or "Sunita Patel" etc
  requestedByRole: "hiring_manager" | "recruitment_team";
  role: string;
  team: string;
  grade: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  essential: string;
  desirable: string;
  justification: string; // why the role is needed
  replacementFor: string; // leaver name or "New post"
  fundingApproved: boolean;
  atsReference: string; // reference from their internal system (Jobtrain, Eploy etc)
  internalSystem: string; // "Jobtrain" | "Eploy" | "Tribepad" | "iTrent" | "Oracle" | "Manual" | "None"
  status: "pending_approval" | "approved" | "rejected" | "converted"; // converted = turned into a live vacancy
  createdAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  convertedVacancyId: string | null;
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
  vacancyRequests: VacancyRequest[];
  addVacancyRequest: (r: Omit<VacancyRequest, "id" | "createdAt" | "status" | "approvedBy" | "approvedAt" | "rejectionReason" | "convertedVacancyId">) => void;
  approveVacancyRequest: (id: string, approvedBy: string) => void;
  rejectVacancyRequest: (id: string, reason: string) => void;
  convertRequestToVacancy: (requestId: string) => void;
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
  { id: "V-2024-001", council: "Manchester CC", role: "Senior Social Worker — Children in Need", team: "Children's Services", manager: "James Okafor", grade: "Grade 10", salary: "£42,708 - £46,731", status: "live", applicants: 8, shortlisted: 3, daysOpen: 12, createdAt: "2026-03-11", description: "We are seeking an experienced Senior Social Worker to join our Children in Need team. You will manage a complex caseload and provide supervision to newly qualified staff.", essential: "SWE registered, 3+ years PQE in children's services, experience with court work", desirable: "Practice educator qualification, NAAS assessed", atsReference: "JT-MCC-2026-0831", atsSystem: "Jobtrain", atsUrl: "https://jobs.manchester.gov.uk/vacancy/senior-social-worker-cin-0831", applicationLink: "apply.recruitsw.co.uk/mcc/senior-sw-cin-001", applicationLinkActive: true, importedFrom: "ats_import", acceptsSponsorship: true, sponsorLicenceHeld: true, caseloadInfo: "15-18 cases", teamSize: "6 SWs + 1 TM + 2 family support workers", supervisionFreq: "Monthly formal, weekly informal, group supervision fortnightly" },
  { id: "V-2024-002", council: "Manchester CC", role: "Team Manager — Safeguarding", team: "Safeguarding Hub", manager: "Rachel Adams", grade: "Grade 12", salary: "£52,805 - £56,024", status: "live", applicants: 4, shortlisted: 1, daysOpen: 21, createdAt: "2026-03-02", description: "Lead a team of social workers within the Safeguarding Hub, managing referrals, strategy discussions, and S47 enquiries.", essential: "SWE registered, 5+ years PQE, 2+ years management experience", desirable: "Experience with multi-agency partnerships", atsReference: "JT-MCC-2026-0819", atsSystem: "Jobtrain", atsUrl: "https://jobs.manchester.gov.uk/vacancy/team-manager-safeguarding-0819", applicationLink: "apply.recruitsw.co.uk/mcc/tm-safeguarding-002", applicationLinkActive: true, importedFrom: "ats_import", acceptsSponsorship: true, sponsorLicenceHeld: true, caseloadInfo: "Manages team of 6 (no personal caseload)", teamSize: "6 SWs + 1 Senior + 1 BSO", supervisionFreq: "Monthly formal per staff member, weekly team meeting" },
  { id: "V-2024-003", council: "Salford CC", role: "ASYE Social Worker", team: "Referral & Assessment", manager: "James Okafor", grade: "Grade 8", salary: "£33,945 - £37,336", status: "live", applicants: 14, shortlisted: 5, daysOpen: 7, createdAt: "2026-03-16", description: "An exciting opportunity for a newly qualified social worker to complete their ASYE within a supportive Referral & Assessment team.", essential: "SWE registered, social work degree, right to work in UK", desirable: "Placement experience in children's services", atsReference: "EP-SCC-4521", atsSystem: "Eploy", atsUrl: "https://salford.eploy.net/vacancy/4521", applicationLink: "apply.recruitsw.co.uk/salford/asye-sw-003", applicationLinkActive: true, importedFrom: "ats_import", acceptsSponsorship: true, sponsorLicenceHeld: true, caseloadInfo: "12-15 cases (protected ASYE caseload)", teamSize: "8 SWs + 2 Seniors + 1 TM + ASYE assessor", supervisionFreq: "Fortnightly formal, weekly ASYE support group, daily check-ins" },
  { id: "V-2024-004", council: "Stockport MBC", role: "Practice Manager — Adults", team: "Adult Services", manager: "Linda Chowdhury", grade: "Grade 11", salary: "£47,754 - £51,802", status: "interviewing", applicants: 6, shortlisted: 3, daysOpen: 28, createdAt: "2026-02-23", description: "Oversee a team of adult social workers, ensuring high-quality assessments and care planning.", essential: "SWE registered, 5+ years PQE in adults, management experience", desirable: "BIA qualification, AMHP approved", atsReference: "SMBC-2026-PM-112", atsSystem: "iTrent", atsUrl: "", applicationLink: "apply.recruitsw.co.uk/stockport/practice-mgr-004", applicationLinkActive: true, importedFrom: "manual", acceptsSponsorship: true, sponsorLicenceHeld: false, caseloadInfo: "Manages team (small advisory caseload of 3-5)", teamSize: "5 SWs + 2 OTs + 1 BSO", supervisionFreq: "Monthly formal, reflective practice group monthly" },
  { id: "V-2024-005", council: "Manchester CC", role: "Social Worker — MASH", team: "Multi-Agency Hub", manager: "Linda Chowdhury", grade: "Grade 9", salary: "£37,336 - £40,476", status: "offer", applicants: 11, shortlisted: 4, daysOpen: 35, createdAt: "2026-02-16", description: "Work within the Multi-Agency Safeguarding Hub triaging referrals and coordinating with partner agencies.", essential: "SWE registered, 2+ years PQE, children's experience", desirable: "MASH or duty experience", atsReference: "JT-MCC-2026-0802", atsSystem: "Jobtrain", atsUrl: "https://jobs.manchester.gov.uk/vacancy/sw-mash-0802", applicationLink: "apply.recruitsw.co.uk/mcc/sw-mash-005", applicationLinkActive: false, importedFrom: "ats_import", acceptsSponsorship: true, sponsorLicenceHeld: true, caseloadInfo: "Duty-based (no allocated caseload)", teamSize: "4 SWs + 1 Senior + police + health + education", supervisionFreq: "Weekly formal, daily duty debrief" },
  { id: "V-2024-006", council: "Trafford", role: "Senior Practitioner — LAC", team: "Looked After Children", manager: "Rachel Adams", grade: "Grade 10", salary: "£42,708 - £46,731", status: "draft", applicants: 0, shortlisted: 0, daysOpen: 0, createdAt: "2026-03-23", description: "Join our LAC team supporting children in care, attending reviews and ensuring care plans are progressed.", essential: "SWE registered, 4+ years PQE, LAC experience", desirable: "Practice educator, life story work experience", atsReference: "", atsSystem: "None", atsUrl: "", applicationLink: "apply.recruitsw.co.uk/trafford/senior-lac-006", applicationLinkActive: false, importedFrom: "psp_created", acceptsSponsorship: false, sponsorLicenceHeld: false, caseloadInfo: "14-16 cases", teamSize: "5 SWs + 1 TM + IRO support", supervisionFreq: "Monthly formal, weekly case discussion" },
];

const defaultCandidates: Candidate[] = [
  { id: "C-001", name: "Sarah Mitchell", email: "s.mitchell@email.com", phone: "07912 345678", role: "Senior Social Worker", pqe: "6 years", swe: "SW98234", sweStatus: "active", match: 94, source: "PSP Network", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", visaExpiry: "", dbs: "done", ref1: "done", ref2: "pending", rtw: "verified", quals: "done", location: "Manchester", available: "2 weeks", crossCouncil: false, assignedVacancy: "V-2024-001", pipelineStage: "shortlisted", stageEnteredAt: "2026-03-14", status: "shortlisted", notes: "Strong candidate, court work experience. Currently in notice period at Liverpool CC.", createdAt: "2026-03-12", cvFileName: "Sarah_Mitchell_CV.pdf", cvUploaded: true, submittedBy: "PSP", submittedAt: "2026-03-12", emailNotifications: ["Application received - 12/03/2026", "Shortlisted notification - 14/03/2026"],
    motivation: "Seeking career progression — wants more complex court work and S47 cases. Currently limited to CIN at Liverpool CC. Also wants to be closer to home in Manchester.", warmStatus: "active", counterOfferRisk: "medium", yearsInCurrentRole: 4, currentEmployer: "Liverpool City Council", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-12", time: "10:15", type: "call", message: "Initial phone screen — confirmed 6yr PQE, court experience, motivated to move for career progression. Available in 2 weeks (notice already served).", by: "Conor Clarke, PSP" },
      { date: "2026-03-12", time: "14:30", type: "system", message: "CV submitted to Manchester CC — Senior SW Children in Need (V-2024-001)", by: "System" },
      { date: "2026-03-14", time: "09:00", type: "system", message: "Shortlisted by recruitment team (Sunita Patel)", by: "System" },
      { date: "2026-03-18", time: "11:00", type: "email", message: "Interview invite sent — Tuesday 25 March, 10:00-11:00, MS Teams", by: "System" },
      { date: "2026-03-19", time: "16:45", type: "call", message: "Pre-interview prep call — briefed on Manchester CIN team structure, caseloads, interview panel. Confident and well-prepared.", by: "Conor Clarke, PSP" },
    ],
    proofOfId: "done", proofOfAddress: "done", niNumber: "done", sweCertificate: "done", occHealth: "pending", employmentHistory: "done", drivingLicence: "done", criminalDeclaration: "done", conflictDeclaration: "done", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-002", name: "David Williams", email: "d.williams@email.com", phone: "07845 678901", role: "Team Manager", pqe: "11 years", swe: "SW67891", sweStatus: "active", match: 89, source: "Direct", visa: "settled_status", visaDetails: "EU Settled Status — Indefinite leave to remain", visaExpiry: "", dbs: "done", ref1: "done", ref2: "done", rtw: "verified", quals: "done", location: "Salford", available: "1 month", crossCouncil: true, assignedVacancy: "V-2024-002", pipelineStage: "interview_scheduled", stageEnteredAt: "2026-03-18", status: "interviewing", notes: "Excellent management experience, 11 years PQE. Previously applied at another council.", createdAt: "2026-03-05", cvFileName: "David_Williams_CV.pdf", cvUploaded: true, submittedBy: "Direct Application", submittedAt: "2026-03-05", emailNotifications: ["Application received - 05/03/2026", "Screening complete - 08/03/2026", "Shortlisted notification - 10/03/2026"],
    motivation: "Management frustration — feels current LA doesn't support innovation. Wants to lead a team with proper resources and modern safeguarding approaches.", warmStatus: "active", counterOfferRisk: "high", yearsInCurrentRole: 6, currentEmployer: "Tameside MBC", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-05", time: "09:00", type: "system", message: "Direct application received via RecruitSW portal", by: "System" },
      { date: "2026-03-06", time: "11:30", type: "call", message: "Phone screen — 11yr PQE, 6yr management. Frustrated with lack of investment at current LA. Strong safeguarding background. Counter-offer risk: HIGH (6 years in role, well-liked).", by: "Conor Clarke, PSP" },
      { date: "2026-03-08", time: "14:00", type: "system", message: "Screening complete — SWE verified, all refs received", by: "System" },
      { date: "2026-03-10", time: "10:00", type: "system", message: "Shortlisted by recruitment team", by: "System" },
      { date: "2026-03-18", time: "09:30", type: "email", message: "Interview scheduled — Wed 26 March, 14:00-15:30, In-person", by: "System" },
    ],
    proofOfId: "done", proofOfAddress: "done", niNumber: "done", sweCertificate: "done", occHealth: "pending", employmentHistory: "done", drivingLicence: "done", criminalDeclaration: "done", conflictDeclaration: "done", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-003", name: "Amara Osei", email: "a.osei@email.com", phone: "07723 456789", role: "Social Worker", pqe: "3 years", swe: "SW45123", sweStatus: "active", match: 87, source: "Agency", visa: "skilled_worker", visaDetails: "Skilled Worker Visa — Expires 15/08/2027 — Requires sponsorship", visaExpiry: "2027-08-15", dbs: "pending", ref1: "done", ref2: "warning", rtw: "requires_sponsorship", quals: "done", location: "Bolton", available: "Immediate", crossCouncil: false, assignedVacancy: "V-2024-005", pipelineStage: "shortlisted", stageEnteredAt: "2026-03-13", status: "shortlisted", notes: "Good R&A experience, bilingual. Needs Skilled Worker sponsorship.", createdAt: "2026-03-10", cvFileName: "Amara_Osei_CV.pdf", cvUploaded: true, submittedBy: "Agency", submittedAt: "2026-03-10", emailNotifications: ["Application received - 10/03/2026", "Shortlisted notification - 13/03/2026", "Interview invite sent - 16/03/2026"],
    motivation: "Workload — current caseload of 26 with no admin support. Wants better work-life balance and a team that values wellbeing.", warmStatus: "active", counterOfferRisk: "low", yearsInCurrentRole: 1, currentEmployer: "Bolton Council", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-10", time: "10:00", type: "system", message: "Agency submission received (Reed Social Care)", by: "System" },
      { date: "2026-03-10", time: "14:00", type: "call", message: "Phone screen — 3yr PQE, strong R&A. Currently on 26 cases (way too high). Bilingual English/French. Needs Skilled Worker sponsorship — confirmed council has licence.", by: "Conor Clarke, PSP" },
      { date: "2026-03-13", time: "11:00", type: "system", message: "Shortlisted for SW MASH role", by: "System" },
      { date: "2026-03-16", time: "09:00", type: "email", message: "Interview invite sent", by: "System" },
    ],
    proofOfId: "done", proofOfAddress: "pending", niNumber: "pending", sweCertificate: "done", occHealth: "pending", employmentHistory: "done", drivingLicence: "na", criminalDeclaration: "pending", conflictDeclaration: "pending", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-004", name: "Michael Chen", email: "m.chen@email.com", phone: "07634 567890", role: "ASYE Social Worker", pqe: "NQ", swe: "SW78456", sweStatus: "active", match: 82, source: "PSP Network", visa: "graduate_visa", visaDetails: "Graduate Visa — Expires 01/03/2027 — Will need sponsorship for extension", visaExpiry: "2027-03-01", dbs: "done", ref1: "pending", ref2: "pending", rtw: "time_limited", quals: "pending", location: "Stockport", available: "Immediate", crossCouncil: false, assignedVacancy: "V-2024-003", pipelineStage: "screened", stageEnteredAt: "2026-03-19", status: "screening", notes: "NQ with strong placement. Graduate visa — flag for future sponsorship.", createdAt: "2026-03-17", cvFileName: "Michael_Chen_CV.pdf", cvUploaded: true, submittedBy: "PSP", submittedAt: "2026-03-17", emailNotifications: ["Application received - 17/03/2026", "Screening in progress - 19/03/2026"],
    motivation: "NQ seeking ASYE placement. Wants a council with a strong, structured ASYE support programme. Dissertation focused on child neglect assessment frameworks.", warmStatus: "active", counterOfferRisk: "low", yearsInCurrentRole: 0, currentEmployer: "N/A — newly qualified", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-17", time: "11:00", type: "call", message: "WhatsApp outreach — NQ, just finished MA at Manchester Met. Final placement was in R&A at Tameside. Very keen, articulate. Graduate visa — needs sponsorship after Mar 2027.", by: "Conor Clarke, PSP" },
      { date: "2026-03-17", time: "15:00", type: "system", message: "CV received and added to system", by: "System" },
      { date: "2026-03-19", time: "10:00", type: "system", message: "SWE registration verified — active", by: "System" },
    ],
    proofOfId: "done", proofOfAddress: "pending", niNumber: "pending", sweCertificate: "done", occHealth: "pending", employmentHistory: "done", drivingLicence: "na", criminalDeclaration: "pending", conflictDeclaration: "pending", safeguardingTraining: "pending", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-005", name: "Priya Sharma", email: "p.sharma@email.com", phone: "07567 890123", role: "Senior Social Worker", pqe: "8 years", swe: "SW34567", sweStatus: "active", match: 91, source: "WhatsApp", visa: "british_citizen", visaDetails: "British Citizen — No sponsorship required", visaExpiry: "", dbs: "done", ref1: "done", ref2: "done", rtw: "verified", quals: "done", location: "Bury", available: "3 weeks", crossCouncil: true, assignedVacancy: "V-2024-001", pipelineStage: "interview_scheduled", stageEnteredAt: "2026-03-18", status: "interviewing", notes: "8 years PQE, practice educator. Applied at another council previously.", createdAt: "2026-03-08", cvFileName: "Priya_Sharma_CV.pdf", cvUploaded: true, submittedBy: "PSP", submittedAt: "2026-03-08", emailNotifications: ["Application received - 08/03/2026", "Shortlisted notification - 11/03/2026", "Interview scheduled - 18/03/2026"],
    motivation: "Relocation — partner moving to Manchester area for work. Happy in current role but needs to be within commuting distance. Also interested in practice education opportunities.", warmStatus: "open", counterOfferRisk: "low", yearsInCurrentRole: 3, currentEmployer: "Leeds City Council", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-08", time: "09:30", type: "call", message: "WhatsApp response to Senior SW vacancy post. 8yr PQE, practice educator. Relocating — partner got job in Manchester. Low counter-offer risk (geography).", by: "Conor Clarke, PSP" },
      { date: "2026-03-08", time: "14:00", type: "system", message: "CV submitted to Manchester CC", by: "System" },
      { date: "2026-03-11", time: "10:00", type: "system", message: "Shortlisted", by: "System" },
      { date: "2026-03-18", time: "09:00", type: "email", message: "Interview scheduled — Tue 25 March, 11:30-12:30", by: "System" },
    ],
    proofOfId: "done", proofOfAddress: "done", niNumber: "done", sweCertificate: "done", occHealth: "done", employmentHistory: "done", drivingLicence: "done", criminalDeclaration: "done", conflictDeclaration: "done", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-006", name: "Fatima Al-Hassan", email: "f.alhassan@email.com", phone: "07456 789012", role: "Social Worker", pqe: "4 years", swe: "SW89012", sweStatus: "conditions", match: 78, source: "Direct", visa: "spouse_visa", visaDetails: "Spouse Visa — Expires 22/11/2026 — Eligible to work, no sponsorship needed", visaExpiry: "2026-11-22", dbs: "done", ref1: "done", ref2: "warning", rtw: "verified", quals: "done", location: "Oldham", available: "1 month", crossCouncil: false, assignedVacancy: null, pipelineStage: "new", stageEnteredAt: "2026-03-20", status: "new", notes: "Spouse visa, can work. SWE has conditions — check detail.", createdAt: "2026-03-20", cvFileName: "Fatima_Al-Hassan_CV.pdf", cvUploaded: true, submittedBy: "Direct Application", submittedAt: "2026-03-20", emailNotifications: ["Application received - 20/03/2026"],
    motivation: "Career change within SW — currently in adults, wants to move to children's services. Has completed additional safeguarding training to support the transition.", warmStatus: "open", counterOfferRisk: "low", yearsInCurrentRole: 2, currentEmployer: "Oldham Council (Adults)", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-20", time: "09:00", type: "system", message: "Direct application received via RecruitSW portal", by: "System" },
      { date: "2026-03-20", time: "14:30", type: "note", message: "SWE shows conditions — need to verify details before submitting to any council", by: "Conor Clarke, PSP" },
    ],
    proofOfId: "done", proofOfAddress: "done", niNumber: "done", sweCertificate: "warning", occHealth: "pending", employmentHistory: "done", drivingLicence: "done", criminalDeclaration: "done", conflictDeclaration: "done", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
  { id: "C-007", name: "James Adeyemi", email: "j.adeyemi@email.com", phone: "07345 678901", role: "Practice Manager", pqe: "9 years", swe: "SW56789", sweStatus: "active", match: 85, source: "PSP Network", visa: "health_care_visa", visaDetails: "Health & Care Worker Visa — Expires 30/06/2028 — Council must hold sponsor licence", visaExpiry: "2028-06-30", dbs: "pending", ref1: "pending", ref2: "pending", rtw: "requires_sponsorship", quals: "done", location: "Rochdale", available: "6 weeks", crossCouncil: false, assignedVacancy: "V-2024-004", pipelineStage: "submitted", stageEnteredAt: "2026-03-15", status: "screening", notes: "Strong practice manager. Health & Care visa — verify council sponsor licence.", createdAt: "2026-03-15", cvFileName: "James_Adeyemi_CV.pdf", cvUploaded: true, submittedBy: "PSP", submittedAt: "2026-03-15", emailNotifications: ["Application received - 15/03/2026", "Screening in progress - 17/03/2026", "Reference request sent - 19/03/2026"],
    motivation: "Professional growth — wants to move from adults into a service with more strategic influence. Interested in the Practice Manager role for the autonomy and ability to shape team culture.", warmStatus: "active", counterOfferRisk: "medium", yearsInCurrentRole: 3, currentEmployer: "Rochdale Council", withdrawalReason: null,
    communicationLog: [
      { date: "2026-03-15", time: "10:00", type: "call", message: "Phone screen — 9yr PQE, 4yr management in adults. Wants strategic role. H&C visa — need to check Stockport has sponsor licence. Strong candidate.", by: "Conor Clarke, PSP" },
      { date: "2026-03-15", time: "15:00", type: "system", message: "CV submitted to Stockport MBC — Practice Manager Adults (V-2024-004)", by: "System" },
      { date: "2026-03-17", time: "09:00", type: "system", message: "SWE verified — active, no conditions", by: "System" },
      { date: "2026-03-19", time: "10:00", type: "email", message: "Reference requests sent to 2 referees", by: "System" },
      { date: "2026-03-21", time: "11:00", type: "call", message: "Chased Stockport re: sponsor licence status. HR confirmed they DO hold one but need to check CoS availability.", by: "Conor Clarke, PSP" },
    ],
    proofOfId: "done", proofOfAddress: "pending", niNumber: "pending", sweCertificate: "done", occHealth: "pending", employmentHistory: "done", drivingLicence: "done", criminalDeclaration: "pending", conflictDeclaration: "pending", safeguardingTraining: "done", contractSigned: "pending", offerLetterSigned: "pending",
  },
];

const defaultVacancyRequests: VacancyRequest[] = [
  {
    id: "VR-001", council: "Manchester CC", requestedBy: "James Okafor", requestedByRole: "hiring_manager",
    role: "Social Worker — Looked After Children", team: "Children's Services", grade: "Grade 9",
    salaryMin: "37336", salaryMax: "40476",
    description: "Replacement for Sarah Thompson who is leaving at end of April. Urgent need to maintain safe caseloads in the LAC team.",
    essential: "SWE registered, 2+ years PQE in children's services, LAC experience",
    desirable: "Life story work experience, court report writing",
    justification: "Replacement post — current postholder leaving 30/04/2026. Team already carrying 2 vacancies. Caseloads at 22 per SW vs target of 18.",
    replacementFor: "Sarah Thompson (leaver)", fundingApproved: true,
    atsReference: "JT-MCC-2026-0847", internalSystem: "Jobtrain",
    status: "pending_approval", createdAt: "2026-03-22",
    approvedBy: null, approvedAt: null, rejectionReason: null, convertedVacancyId: null,
  },
  {
    id: "VR-002", council: "Manchester CC", requestedBy: "Rachel Adams", requestedByRole: "hiring_manager",
    role: "Advanced Practitioner — Edge of Care", team: "Edge of Care Service", grade: "Grade 11",
    salaryMin: "47754", salaryMax: "51802",
    description: "New post to support the expansion of the Edge of Care service, working with families to prevent children entering care.",
    essential: "SWE registered, 5+ years PQE, experience with family intervention",
    desirable: "Systemic practice training, Signs of Safety accredited",
    justification: "New post — funded by DfE Family Safeguarding grant. Service expanding from 3 to 5 practitioners.",
    replacementFor: "New post (DfE funded)", fundingApproved: true,
    atsReference: "", internalSystem: "Jobtrain",
    status: "pending_approval", createdAt: "2026-03-21",
    approvedBy: null, approvedAt: null, rejectionReason: null, convertedVacancyId: null,
  },
  {
    id: "VR-003", council: "Manchester CC", requestedBy: "Sunita Patel", requestedByRole: "recruitment_team",
    role: "2x ASYE Social Workers — Duty & Assessment", team: "Duty & Assessment", grade: "Grade 8",
    salaryMin: "33945", salaryMax: "37336",
    description: "Two ASYE positions to support the September 2026 ASYE intake. Strong ASYE programme with dedicated support.",
    essential: "SWE registered, social work degree, right to work in UK",
    desirable: "Placement in children's services, research interest in child development",
    justification: "Annual ASYE intake. Budget approved in workforce plan. Two positions to replace natural turnover.",
    replacementFor: "Annual ASYE intake", fundingApproved: true,
    atsReference: "JT-MCC-2026-0851", internalSystem: "Jobtrain",
    status: "approved", createdAt: "2026-03-18",
    approvedBy: "Sunita Patel", approvedAt: "2026-03-19", rejectionReason: null, convertedVacancyId: null,
  },
];

let nextVacancyNum = 7;
let nextCandidateNum = 8;
let nextRequestNum = 4;

export function DataProvider({ children }: { children: ReactNode }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(defaultVacancies);
  const [candidates, setCandidates] = useState<Candidate[]>(defaultCandidates);
  const [vacancyRequests, setVacancyRequests] = useState<VacancyRequest[]>(defaultVacancyRequests);
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
      acceptsSponsorship: v.acceptsSponsorship ?? true,
      sponsorLicenceHeld: v.sponsorLicenceHeld ?? false,
      caseloadInfo: v.caseloadInfo || "",
      teamSize: v.teamSize || "",
      supervisionFreq: v.supervisionFreq || "",
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
    const today = new Date().toISOString().split("T")[0];
    const newC: Candidate = {
      ...c,
      id: `C-${String(nextCandidateNum++).padStart(3, "0")}`,
      createdAt: today,
      match: Math.floor(Math.random() * 20) + 75,
      status: "new",
      assignedVacancy: null,
      pipelineStage: c.pipelineStage || "new",
      stageEnteredAt: c.stageEnteredAt || today,
      cvFileName: c.cvFileName || "",
      cvUploaded: c.cvUploaded || false,
      submittedBy: c.submittedBy || (c.source === "Direct Application" ? "Direct Application" : "PSP"),
      submittedAt: c.submittedAt || today,
      emailNotifications: c.emailNotifications || ["Application received - " + new Date().toLocaleDateString("en-GB")],
      motivation: c.motivation || "",
      warmStatus: c.warmStatus || "open",
      counterOfferRisk: c.counterOfferRisk || "low",
      yearsInCurrentRole: c.yearsInCurrentRole || 0,
      currentEmployer: c.currentEmployer || "",
      withdrawalReason: null,
      communicationLog: c.communicationLog || [{ date: today, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), type: "system", message: "Candidate added to RecruitSW", by: "System" }],
      proofOfId: c.proofOfId || "pending",
      proofOfAddress: c.proofOfAddress || "pending",
      niNumber: c.niNumber || "pending",
      sweCertificate: c.sweCertificate || "pending",
      occHealth: c.occHealth || "pending",
      employmentHistory: c.employmentHistory || "pending",
      drivingLicence: c.drivingLicence || "pending",
      criminalDeclaration: c.criminalDeclaration || "pending",
      conflictDeclaration: c.conflictDeclaration || "pending",
      safeguardingTraining: c.safeguardingTraining || "pending",
      contractSigned: c.contractSigned || "pending",
      offerLetterSigned: c.offerLetterSigned || "pending",
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

  const addVacancyRequest = useCallback((r: Omit<VacancyRequest, "id" | "createdAt" | "status" | "approvedBy" | "approvedAt" | "rejectionReason" | "convertedVacancyId">) => {
    const newR: VacancyRequest = {
      ...r,
      id: `VR-${String(nextRequestNum++).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending_approval",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      convertedVacancyId: null,
    };
    setVacancyRequests((prev) => [newR, ...prev]);
    showToast(`Vacancy request "${r.role}" submitted`);
  }, [showToast]);

  const approveVacancyRequest = useCallback((id: string, approvedBy: string) => {
    setVacancyRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" as const, approvedBy, approvedAt: new Date().toISOString().split("T")[0] } : r)));
    showToast("Vacancy request approved", "success");
  }, [showToast]);

  const rejectVacancyRequest = useCallback((id: string, reason: string) => {
    setVacancyRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const, rejectionReason: reason } : r)));
    showToast("Vacancy request rejected", "info");
  }, [showToast]);

  const convertRequestToVacancy = useCallback((requestId: string) => {
    setVacancyRequests((prev) => {
      const request = prev.find((r) => r.id === requestId);
      if (!request || request.status !== "approved") return prev;
      const vacancyId = `V-2024-${String(nextVacancyNum++).padStart(3, "0")}`;
      const slug = request.role.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
      const newVacancy: Vacancy = {
        id: vacancyId,
        council: request.council,
        role: request.role,
        team: request.team,
        manager: request.requestedBy,
        grade: request.grade,
        salary: `£${Number(request.salaryMin).toLocaleString()} - £${Number(request.salaryMax).toLocaleString()}`,
        status: "draft",
        applicants: 0,
        shortlisted: 0,
        daysOpen: 0,
        createdAt: new Date().toISOString().split("T")[0],
        description: request.description,
        essential: request.essential,
        desirable: request.desirable,
        atsReference: request.atsReference,
        atsSystem: request.internalSystem,
        atsUrl: "",
        applicationLink: `apply.recruitsw.co.uk/${request.council.toLowerCase().replace(/[^a-z]+/g, "")}/${slug}`,
        applicationLinkActive: false,
        importedFrom: "manual",
        acceptsSponsorship: true,
        sponsorLicenceHeld: false,
        caseloadInfo: "",
        teamSize: "",
        supervisionFreq: "",
      };
      setVacancies((vPrev) => [newVacancy, ...vPrev]);
      showToast(`Vacancy "${request.role}" created from request`);
      return prev.map((r) => (r.id === requestId ? { ...r, status: "converted" as const, convertedVacancyId: vacancyId } : r));
    });
  }, [showToast]);

  return (
    <DataContext.Provider value={{ vacancies, candidates, toasts, addVacancy, updateVacancy, deleteVacancy, addCandidate, updateCandidate, deleteCandidate, assignCandidate, vacancyRequests, addVacancyRequest, approveVacancyRequest, rejectVacancyRequest, convertRequestToVacancy, showToast, dismissToast }}>
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
