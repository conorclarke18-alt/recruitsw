"use client";
import { useState } from "react";
import { useData, Candidate, PipelineStage } from "./DataStore";
import { ChevronRight, Clock, Plane, Flag, FileText, GripVertical, AlertTriangle } from "lucide-react";

const stages: { id: PipelineStage; label: string; color: string }[] = [
  { id: "new", label: "New", color: "#6b7280" },
  { id: "screened", label: "Screened", color: "#2563eb" },
  { id: "submitted", label: "Submitted", color: "#7c3aed" },
  { id: "shortlisted", label: "Shortlisted", color: "#0891b2" },
  { id: "interview_scheduled", label: "Interview", color: "#d97706" },
  { id: "interviewed", label: "Interviewed", color: "#ea580c" },
  { id: "offer", label: "Offer", color: "#16a34a" },
  { id: "compliance", label: "Compliance", color: "#0d9488" },
  { id: "started", label: "Started", color: "#059669" },
];

const rejectedStages: PipelineStage[] = ["rejected", "withdrawn"];

function daysInStage(stageEnteredAt: string): number {
  if (!stageEnteredAt) return 0;
  const entered = new Date(stageEnteredAt);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - entered.getTime()) / (1000 * 60 * 60 * 24)));
}

function DaysTimer({ days }: { days: number }) {
  const color = days > 14 ? "var(--status-red)" : days > 7 ? "var(--status-amber)" : "var(--text-secondary)";
  return (
    <span style={{ fontSize: 10, color, display: "flex", alignItems: "center", gap: 2 }}>
      <Clock size={10} /> {days}d
    </span>
  );
}

function CandidateCard({ candidate: c, onSelect }: { candidate: Candidate; onSelect: (c: Candidate) => void }) {
  const days = daysInStage(c.stageEnteredAt);
  return (
    <div
      onClick={() => onSelect(c)}
      style={{
        padding: 10, background: "white", borderRadius: 8, cursor: "pointer",
        border: "1px solid var(--border)", transition: "box-shadow 0.2s",
        display: "flex", flexDirection: "column", gap: 4,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--psp-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
            {c.name.split(" ").map(n => n[0]).join("")}
          </div>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</span>
        </div>
        <DaysTimer days={days} />
      </div>
      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{c.role} &middot; {c.pqe} PQE</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: c.match >= 90 ? "var(--status-green)" : c.match >= 80 ? "var(--status-blue)" : "var(--status-amber)" }}>
          {c.match}%
        </span>
        {c.cvUploaded && <span style={{ fontSize: 10, color: "var(--status-green)" }}>📄</span>}
        {c.rtw === "requires_sponsorship" && <span style={{ fontSize: 10 }}>⚠️</span>}
        {c.crossCouncil && <span style={{ fontSize: 10 }}>🏛️</span>}
        {c.counterOfferRisk === "high" && <span style={{ fontSize: 10 }}>🔴</span>}
      </div>
    </div>
  );
}

export default function PipelineBoard({ onSelectCandidate }: { onSelectCandidate: (c: Candidate) => void }) {
  const { candidates, vacancies, updateCandidate, showToast } = useData();
  const [filterCouncil, setFilterCouncil] = useState("all");
  const [filterVacancy, setFilterVacancy] = useState("all");
  const [dragCandidate, setDragCandidate] = useState<string | null>(null);

  const councils = [...new Set(vacancies.map(v => v.council))];
  const activeCandidates = candidates.filter(c => !rejectedStages.includes(c.pipelineStage));
  const rejected = candidates.filter(c => rejectedStages.includes(c.pipelineStage));

  const filtered = activeCandidates.filter(c => {
    if (filterCouncil !== "all") {
      const v = vacancies.find(v => v.id === c.assignedVacancy);
      if (!v || v.council !== filterCouncil) return false;
    }
    if (filterVacancy !== "all" && c.assignedVacancy !== filterVacancy) return false;
    return true;
  });

  const moveToStage = (candidateId: string, stage: PipelineStage) => {
    const c = candidates.find(c => c.id === candidateId);
    if (!c) return;
    const stageToStatus: Record<string, Candidate["status"]> = {
      new: "new", screened: "screening", submitted: "screening", under_review: "screening",
      shortlisted: "shortlisted", interview_scheduled: "interviewing", interviewed: "interviewing",
      offer: "offered", compliance: "offered", started: "hired", rejected: "rejected", withdrawn: "withdrawn",
    };
    updateCandidate(candidateId, {
      pipelineStage: stage,
      stageEnteredAt: new Date().toISOString(),
      status: stageToStatus[stage] || c.status,
      communicationLog: [...c.communicationLog, {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        type: "system" as const,
        message: `Moved to ${stage.replace(/_/g, " ")} stage`,
        by: "PSP",
      }],
    });
    showToast(`${c.name} → ${stage.replace(/_/g, " ")}`, "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Pipeline Board</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, background: "white" }}
            value={filterCouncil} onChange={e => setFilterCouncil(e.target.value)}
          >
            <option value="all">All Councils</option>
            {councils.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, background: "white" }}
            value={filterVacancy} onChange={e => setFilterVacancy(e.target.value)}
          >
            <option value="all">All Vacancies</option>
            {vacancies.filter(v => v.status === "live" || v.status === "interviewing" || v.status === "offer").map(v => (
              <option key={v.id} value={v.id}>{v.id} — {v.role.slice(0, 30)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {stages.map(s => {
          const count = filtered.filter(c => c.pipelineStage === s.id).length;
          return (
            <div key={s.id} style={{ padding: "6px 12px", background: count > 0 ? `${s.color}15` : "#f8fafc", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 4, border: `1px solid ${count > 0 ? `${s.color}40` : "var(--border)"}` }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
              <span style={{ fontWeight: 600 }}>{count}</span>
              <span style={{ color: "var(--text-secondary)" }}>{s.label}</span>
            </div>
          );
        })}
        {rejected.length > 0 && (
          <div style={{ padding: "6px 12px", background: "#fef2f2", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 4, border: "1px solid #fca5a5" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />
            <span style={{ fontWeight: 600 }}>{rejected.length}</span>
            <span style={{ color: "var(--text-secondary)" }}>Rejected/Withdrawn</span>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {stages.map(stage => {
          const stageCandidates = filtered.filter(c => c.pipelineStage === stage.id);
          const staleCount = stageCandidates.filter(c => daysInStage(c.stageEnteredAt) > 7).length;

          return (
            <div
              key={stage.id}
              style={{
                minWidth: 200, maxWidth: 240, flex: "0 0 auto",
                background: "#f8fafc", borderRadius: 10, display: "flex", flexDirection: "column",
                border: dragCandidate ? `2px dashed ${stage.color}40` : "1px solid var(--border)",
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const candidateId = e.dataTransfer.getData("candidateId");
                if (candidateId) moveToStage(candidateId, stage.id);
                setDragCandidate(null);
              }}
            >
              {/* Column Header */}
              <div style={{ padding: "10px 12px", borderBottom: `3px solid ${stage.color}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                  <span style={{ fontWeight: 700, fontSize: 12 }}>{stage.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>{stageCandidates.length}</span>
                  {staleCount > 0 && (
                    <span title={`${staleCount} candidate(s) in this stage >7 days`} style={{ fontSize: 10, color: "var(--status-amber)" }}>
                      <AlertTriangle size={12} />
                    </span>
                  )}
                </div>
              </div>

              {/* Cards */}
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, minHeight: 60 }}>
                {stageCandidates.map(c => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData("candidateId", c.id);
                      setDragCandidate(c.id);
                    }}
                    onDragEnd={() => setDragCandidate(null)}
                  >
                    <CandidateCard candidate={c} onSelect={onSelectCandidate} />
                  </div>
                ))}
                {stageCandidates.length === 0 && (
                  <div style={{ padding: 12, textAlign: "center", fontSize: 11, color: "var(--text-secondary)", fontStyle: "italic" }}>
                    Drop candidate here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage time alerts */}
      {filtered.filter(c => daysInStage(c.stageEnteredAt) > 7).length > 0 && (
        <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color="var(--status-amber)" />
            <strong style={{ color: "#92400e" }}>Stale Pipeline Alerts</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {filtered.filter(c => daysInStage(c.stageEnteredAt) > 7).map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#92400e" }}>
                <span>{c.name} — stuck in <strong>{c.pipelineStage.replace(/_/g, " ")}</strong> for {daysInStage(c.stageEnteredAt)} days</span>
                <button className="btn btn-outline btn-sm" onClick={() => onSelectCandidate(c)} style={{ fontSize: 11 }}>Action</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
