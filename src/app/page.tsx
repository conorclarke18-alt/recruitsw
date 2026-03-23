"use client";
import { useState } from "react";
import { Shield, Building2, Users, UserCheck, Lock, Eye } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "psp",
      title: "PSP Agency",
      subtitle: "Pro Social Partners — Recruitment Management",
      icon: <Shield size={32} />,
      color: "var(--psp-green)",
      user: "Conor Clarke",
      email: "conor@prosocialpartners.co.uk",
      href: "/psp",
    },
    {
      id: "council",
      title: "Council Recruitment Team",
      subtitle: "Manchester City Council — Recruitment Hub",
      icon: <Building2 size={32} />,
      color: "var(--council-blue)",
      user: "Sunita Patel",
      email: "sunita.patel@manchester.gov.uk",
      href: "/council",
    },
    {
      id: "manager",
      title: "Hiring Manager",
      subtitle: "Manchester City Council — Children's Services",
      icon: <UserCheck size={32} />,
      color: "#7c3aed",
      user: "James Okafor",
      email: "james.okafor@manchester.gov.uk",
      href: "/manager",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f3d24 0%, #1a5c38 40%, #1e3a5f 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: 900, width: "100%" }}>
        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={32} color="#1a5c38" />
            </div>
            <div style={{ textAlign: "left" }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: -1 }}>RecruitSW</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: -2 }}>Permanent Social Work Recruitment</p>
            </div>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto" }}>
            Select a role to preview the platform. Each view shows what that user type sees when they log in.
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260, 1fr))", gap: 20 }}>
          {roles.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 28,
                textDecoration: "none",
                color: "inherit",
                border: selectedRole === role.id ? `3px solid ${role.color}` : "3px solid transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
              onMouseEnter={() => setSelectedRole(role.id)}
              onMouseLeave={() => setSelectedRole(null)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, background: `${role.color}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: role.color }}>
                  {role.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{role.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{role.subtitle}</p>
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 32, height: 32, background: `${role.color}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={16} color={role.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{role.user}</p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>{role.email}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "10px 0", background: role.color, borderRadius: 8, color: "white", fontWeight: 600, fontSize: 14 }}>
                <Eye size={16} /> View as {role.title}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div className="gdpr-notice" style={{ display: "inline-flex", maxWidth: 600, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
            <Lock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              <strong>GDPR Compliant</strong> — All data processed under Article 6(1)(e) public task and 6(1)(b) pre-contractual steps.
              Data hosted in AWS eu-west-2 (London). Row-level security ensures complete council data isolation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
