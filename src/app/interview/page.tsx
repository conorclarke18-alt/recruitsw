"use client";
import { useState, useMemo } from "react";
import { Building2, Calendar, Clock, CheckCircle2, Video, MapPin, Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";

// This is the candidate-facing interview booking page
// They receive a link like: interview.recruitsw.co.uk/book/mcc-senior-sw-001?candidate=sarah-mitchell

export default function InterviewBookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Demo: interview details passed via URL in real app
  const interview = {
    council: "Manchester City Council",
    role: "Senior Social Worker — Children in Need",
    ref: "MCC-2024-001",
    candidate: "Sarah Mitchell",
    panelMembers: ["James Okafor — Service Manager", "Rachel Adams — Team Manager"],
    duration: "1 hour",
    type: "MS Teams Video Call",
    location: "Remote — MS Teams link will be sent on confirmation",
    notes: "Please prepare a 10-minute presentation on a complex case you have managed (anonymised). The panel will ask competency-based questions covering safeguarding, assessment, partnership working, and professional development.",
    deadline: "Please select your availability by Friday 28 March 2026",
  };

  // Generate available slots for the next 2 weeks from manager's "calendar"
  const getWeekDates = (offset: number) => {
    const dates: { date: string; day: string; dayNum: number; month: string; slots: { time: string; available: boolean }[] }[] = [];
    const now = new Date(2026, 2, 24); // Mon 24 March 2026
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() + (offset * 7));

    for (let i = 0; i < 5; i++) { // Monday-Friday
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Simulate some slots being available/unavailable based on manager's diary
      const daySlots = [
        { time: "09:00 - 10:00", available: i !== 0 && i !== 3 },
        { time: "10:30 - 11:30", available: i !== 1 },
        { time: "13:00 - 14:00", available: i !== 2 && i !== 4 },
        { time: "14:30 - 15:30", available: i !== 0 },
        { time: "16:00 - 17:00", available: i === 1 || i === 3 },
      ];

      // Second week has fewer slots (simulating busier diary)
      const weekSlots = offset === 0 ? daySlots : daySlots.filter((_, idx) => idx < 3);

      dates.push({
        date: d.toISOString().split("T")[0],
        day: dayNames[d.getDay()],
        dayNum: d.getDate(),
        month: monthNames[d.getMonth()],
        slots: weekSlots,
      });
    }
    return dates;
  };

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const toggleSlot = (dateStr: string, time: string) => {
    const key = `${dateStr}|${time}`;
    setSelectedSlots((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
    if (!selectedDate) setSelectedDate(dateStr);
  };

  const handleConfirm = () => {
    if (selectedSlots.length === 0) return;
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 40, maxWidth: 550, textAlign: "center" }}>
          <CheckCircle2 size={64} color="var(--status-green)" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Availability Submitted!</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
            Thank you, {interview.candidate}. Your available slots have been sent to the interview panel.
          </p>

          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 16, textAlign: "left", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 8 }}>Your Selected Availability</h3>
            {selectedSlots.sort().map((slot, i) => {
              const [date, time] = slot.split("|");
              const d = new Date(date);
              const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 14, borderBottom: i < selectedSlots.length - 1 ? "1px solid #dcfce7" : "none" }}>
                  <Calendar size={14} color="#166534" />
                  <span><strong>{dayNames[d.getDay()]} {d.getDate()} {["Jan","Feb","Mar","Apr","May"][d.getMonth()]}</strong> — {time}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#eff6ff", borderRadius: 10, padding: 16, textAlign: "left", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 8 }}>What Happens Next</h3>
            <ol style={{ paddingLeft: 20, fontSize: 13, color: "#1e40af", display: "flex", flexDirection: "column", gap: 4 }}>
              <li>The panel will review your availability and confirm a time</li>
              <li>You&apos;ll receive a <strong>calendar invite</strong> with the MS Teams link</li>
              <li>Interview materials and the scoring criteria will be emailed 48 hours before</li>
              <li>If you need to reschedule, reply to the confirmation email</li>
            </ol>
          </div>

          <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)" }}>
            <strong>Interview Preparation:</strong> {interview.notes}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ background: "var(--council-blue-dark)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Building2 size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{interview.council}</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginLeft: 4 }}>Interview Booking</span>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        {/* Interview Details Card */}
        <div className="card" style={{ marginBottom: 24, borderLeft: "4px solid var(--council-blue)" }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1 }}>Interview Invitation</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{interview.role}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>Hello {interview.candidate} — please select your available time slots below.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Clock size={16} color="var(--council-blue)" />
              <span><strong>Duration:</strong> {interview.duration}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Video size={16} color="var(--council-blue)" />
              <span><strong>Format:</strong> {interview.type}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Users size={16} color="var(--council-blue)" />
              <span><strong>Panel:</strong> {interview.panelMembers.length} members</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <MapPin size={16} color="var(--council-blue)" />
              <span><strong>Location:</strong> Remote</span>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: 10, background: "#f8fafc", borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Panel Members:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {interview.panelMembers.map((m, i) => (
                <span key={i} className="badge badge-blue">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div style={{ padding: 14, background: "#eff6ff", borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Calendar size={20} color="#1e40af" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1e40af" }}>Select one or more time slots when you are available</p>
            <p style={{ fontSize: 13, color: "#1e40af", marginTop: 2 }}>
              Green slots are when all panel members are free. Select multiple options to give the panel flexibility. {interview.deadline}.
            </p>
          </div>
        </div>

        {/* Week Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} style={{ opacity: weekOffset === 0 ? 0.4 : 1 }}>
            <ChevronLeft size={16} /> Previous Week
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            {weekOffset === 0 ? "This Week" : "Next Week"} — {weekDates[0]?.dayNum} {weekDates[0]?.month} to {weekDates[4]?.dayNum} {weekDates[4]?.month} 2026
          </span>
          <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset(Math.min(1, weekOffset + 1))} style={{ opacity: weekOffset === 1 ? 0.4 : 1 }}>
            Next Week <ChevronRight size={16} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
          {weekDates.map((day) => (
            <div key={day.date} style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
              {/* Day header */}
              <div style={{ padding: "10px 12px", background: selectedDate === day.date ? "var(--council-blue)" : "#f8fafc", textAlign: "center", borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: selectedDate === day.date ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>{day.day}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: selectedDate === day.date ? "white" : "var(--text-primary)" }}>{day.dayNum}</div>
                <div style={{ fontSize: 11, color: selectedDate === day.date ? "rgba(255,255,255,0.7)" : "var(--text-secondary)" }}>{day.month}</div>
              </div>
              {/* Slots */}
              <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {day.slots.map((slot) => {
                  const key = `${day.date}|${slot.time}`;
                  const isSelected = selectedSlots.includes(key);
                  return (
                    <button
                      key={slot.time}
                      onClick={() => slot.available ? toggleSlot(day.date, slot.time) : null}
                      style={{
                        padding: "8px 6px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        border: "none",
                        cursor: slot.available ? "pointer" : "not-allowed",
                        transition: "all 0.2s",
                        background: !slot.available ? "#f1f5f9" : isSelected ? "var(--status-green)" : "#f0fdf4",
                        color: !slot.available ? "#cbd5e1" : isSelected ? "white" : "#166534",
                        textDecoration: !slot.available ? "line-through" : "none",
                      }}
                    >
                      {isSelected && "✓ "}{slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Summary */}
        {selectedSlots.length > 0 && (
          <div className="card" style={{ borderLeft: "4px solid var(--status-green)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--status-green)" }}>
              ✓ {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} selected
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selectedSlots.sort().map((slot, i) => {
                const [date, time] = slot.split("|");
                const d = new Date(date);
                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
                return (
                  <span key={i} className="badge badge-green" style={{ padding: "6px 12px", fontSize: 12 }}>
                    {dayNames[d.getDay()]} {d.getDate()} — {time}
                    <button onClick={() => toggleSlot(date, time)} style={{ background: "none", border: "none", color: "#166534", cursor: "pointer", marginLeft: 4, fontWeight: 700 }}>×</button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Preparation Notes */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Interview Preparation</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{interview.notes}</p>
        </div>

        {/* Confirm Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {selectedSlots.length === 0 ? "Select at least one available slot" : `${selectedSlots.length} slot${selectedSlots.length !== 1 ? "s" : ""} selected — the panel will confirm your interview time`}
          </span>
          <button
            className="btn btn-council"
            onClick={handleConfirm}
            style={{ padding: "12px 24px", fontSize: 15, opacity: selectedSlots.length > 0 ? 1 : 0.4 }}
          >
            <CheckCircle2 size={18} /> Confirm My Availability
          </button>
        </div>

        {/* Footer */}
        <div className="gdpr-notice">
          <Shield size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 11 }}>
            Your availability is shared only with the interview panel at {interview.council}.
            Calendar data is synced via Microsoft 365 and processed under Article 6(1)(b) pre-contractual steps.
            Contact dpo@recruitsw.co.uk for data queries.
          </span>
        </div>
      </main>
    </div>
  );
}
