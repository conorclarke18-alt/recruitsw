"use client";
import { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, width = 600 }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text-primary)" }}>
        {label}{required && <span style={{ color: "var(--status-red)" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, outline: "none", transition: "border-color 0.2s",
};

export const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "auto" as const };

export const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
