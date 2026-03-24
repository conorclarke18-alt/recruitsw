"use client";
import { useState, useEffect, ReactNode } from "react";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

const DEMO_PASSWORD = "recruitsw2026";
const AUTH_KEY = "recruitsw_authenticated";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored === "true") setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = () => {
    if (password === DEMO_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (checking) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f3d24 0%, #1a5c38 40%, #1e3a5f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={32} color="#1a5c38" />
          </div>
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: -1 }}>RecruitSW</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: -2 }}>Permanent Social Work Recruitment</p>
          </div>
        </div>

        {/* Login Card */}
        <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 48, height: 48, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={24} color="#1a5c38" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Platform Access</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
            Enter your access code to view the RecruitSW platform demo.
          </p>

          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter access code"
              style={{
                width: "100%", padding: "14px 48px 14px 16px",
                border: `2px solid ${error ? "#dc2626" : "#e2e8f0"}`,
                borderRadius: 10, fontSize: 16, outline: "none",
                transition: "border-color 0.2s",
              }}
              autoFocus
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>
              Invalid access code. Please try again.
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "14px 0",
              background: "var(--psp-green)", color: "white",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            Access Platform
          </button>

          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 16 }}>
            This is a secure demo environment. All data is processed in accordance with UK GDPR.
            Contact conor@prosocialpartners.co.uk for access.
          </p>
        </div>

        {/* Footer */}
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 24 }}>
          Pro Social Partners Ltd &middot; RecruitSW Platform &middot; UK Data Only (AWS eu-west-2)
        </p>
      </div>
    </div>
  );
}
