"use client";
import { Modal } from "./Modal";
import { Mail, Send, CheckCircle2 } from "lucide-react";

type EmailType = "application_received" | "shortlisted" | "interview_invite" | "offer" | "rejection" | "compliance_request" | "reference_request";

const emailTemplates: Record<EmailType, { subject: string; body: (data: Record<string, string>) => string }> = {
  application_received: {
    subject: "Application Received — {role} at {council}",
    body: (d) => `Dear ${d.name},

Thank you for your application for the position of ${d.role} at ${d.council}.

We have received your application and it is now being reviewed by our recruitment team. You will hear from us within 5 working days regarding the next steps.

Your reference number is: ${d.ref}

What happens next:
1. Your application will be screened against the essential criteria
2. If shortlisted, you will be contacted to arrange an interview
3. You can track your application status at any time via the RecruitSW portal

If you have any questions, please contact the recruitment team.

Kind regards,
${d.council} Recruitment Team
via RecruitSW

---
This email was sent as part of a legitimate recruitment process under Article 6(1)(e) UK GDPR.
Your data will be retained for 6 months after the recruitment decision.
To request access, correction, or deletion of your data, reply to this email.`,
  },
  shortlisted: {
    subject: "You've Been Shortlisted — {role} at {council}",
    body: (d) => `Dear ${d.name},

Great news! Your application for ${d.role} at ${d.council} has been shortlisted.

The hiring manager has reviewed your profile and would like to invite you to the next stage of the process. You will receive an interview invitation shortly with available dates and times.

Please ensure your contact details are up to date and check your email regularly.

Kind regards,
${d.council} Recruitment Team
via RecruitSW`,
  },
  interview_invite: {
    subject: "Interview Invitation — {role} at {council}",
    body: (d) => `Dear ${d.name},

You are invited to attend an interview for the position of ${d.role} at ${d.council}.

Interview Details:
- Date: ${d.date || "[To be confirmed]"}
- Time: ${d.time || "[To be confirmed]"}
- Format: ${d.format || "Microsoft Teams (link will follow)"}
- Panel: ${d.panel || "[To be confirmed]"}
- Duration: Approximately 45-60 minutes

Please click the link below to select your preferred interview slot:
[Book Interview Slot]

What to prepare:
- A 10-minute presentation on "${d.presentationTopic || "your approach to safeguarding in social work"}"
- Examples of your experience against the person specification
- Questions you may have about the role and team

Please confirm your attendance by replying to this email within 48 hours.

Kind regards,
${d.council} Recruitment Team
via RecruitSW`,
  },
  offer: {
    subject: "Conditional Offer of Employment — {role} at {council}",
    body: (d) => `Dear ${d.name},

Following your successful interview, I am pleased to offer you the position of ${d.role} at ${d.council}.

Offer Details:
- Role: ${d.role}
- Grade: ${d.grade || "Grade 10"}
- Salary: ${d.salary || "As discussed"}
- Start Date: ${d.startDate || "To be agreed"}
- Contract: Permanent, full-time
- Hours: 36 hours per week

This offer is conditional upon satisfactory completion of the following pre-employment checks:

1. Enhanced DBS check (with barred list check)
2. Two satisfactory professional references
3. Social Work England registration verification
4. Right to Work verification
5. Occupational health clearance
6. Qualification verification
7. Full employment history with gaps explained
${d.needsSponsorship === "true" ? "8. Certificate of Sponsorship (CoS) — our HR team will contact you regarding visa sponsorship arrangements\n" : ""}
You will receive a separate email with links to complete each requirement through the RecruitSW compliance portal.

Please confirm your acceptance within 5 working days by replying to this email.

We look forward to welcoming you to the team!

Kind regards,
${d.manager || "Hiring Manager"}
${d.council}`,
  },
  rejection: {
    subject: "Update on Your Application — {role} at {council}",
    body: (d) => `Dear ${d.name},

Thank you for your interest in the position of ${d.role} at ${d.council} and for taking the time to apply.

After careful consideration, I regret to inform you that on this occasion your application has not been successful. This was a competitive process and the decision was not easy.

${d.feedback ? `Feedback: ${d.feedback}\n` : ""}If you would like detailed feedback on your application, please reply to this email and we will arrange this.

We would like to keep your details on our talent pool for future opportunities that may suit your skills and experience. If you would prefer not to be contacted, please let us know.

We wish you every success in your career.

Kind regards,
${d.council} Recruitment Team
via RecruitSW`,
  },
  compliance_request: {
    subject: "Pre-Employment Checks Required — {role} at {council}",
    body: (d) => `Dear ${d.name},

Congratulations on your conditional offer for ${d.role} at ${d.council}!

To progress your appointment, we need you to complete the following pre-employment checks. Please action each item as soon as possible to avoid delays to your start date.

Required Documents & Checks:

1. ENHANCED DBS CHECK
   Please complete the online DBS application using this link: [DBS Application Link]
   You will need: passport/driving licence, 3 years of address history

2. PROFESSIONAL REFERENCES
   Please provide contact details for two professional referees:
   - Referee 1 (current/most recent employer — must be line manager)
   - Referee 2 (previous employer or professional contact)
   We will contact them directly with your consent.

3. SOCIAL WORK ENGLAND (SWE) REGISTRATION
   Please provide your SWE registration number: ${d.swe || "___________"}
   We will verify this against the public register.

4. RIGHT TO WORK
   ${d.needsSponsorship === "true"
    ? "As you require visa sponsorship, our HR/immigration team will contact you separately regarding the Certificate of Sponsorship process."
    : "Please provide a copy of your passport or share code from the Home Office online checking service."}

5. QUALIFICATION CERTIFICATES
   Please upload copies of your social work degree and any post-qualifying awards.

6. PROOF OF IDENTITY & ADDRESS
   - Passport or driving licence
   - Utility bill or bank statement (dated within 3 months)

7. OCCUPATIONAL HEALTH
   You will receive a separate link to complete the occupational health questionnaire.

8. EMPLOYMENT HISTORY
   Please provide a full employment history with no gaps. Any gaps must be explained.

9. CRIMINAL CONVICTIONS DECLARATION
   Please complete the self-declaration form attached.

Upload all documents via the RecruitSW compliance portal: [Portal Link]

Target completion date: ${d.deadline || "Within 10 working days"}

If you have any questions about any of the above, please reply to this email.

Kind regards,
${d.council} Recruitment Team
via RecruitSW`,
  },
  reference_request: {
    subject: "Professional Reference Request — {candidateName} for {role}",
    body: (d) => `Dear ${d.refereeName || "Referee"},

I am writing to request a professional reference for ${d.name}, who has applied for the position of ${d.role} at ${d.council}.

${d.name} has given your name as a referee and has consented to us contacting you.

Please could you complete the reference form using the secure link below:
[Complete Reference Form]

The reference should cover:
- Dates of employment and role held
- Key responsibilities
- Performance and conduct
- Sickness absence record
- Any safeguarding or disciplinary concerns
- Whether you would re-employ this individual

As this is a social work position working with ${d.serviceArea || "vulnerable people"}, we are required to follow safer recruitment practices in line with DfE guidance.

Please return the reference within 5 working days. If you have any questions, please reply to this email.

Thank you for your assistance.

Kind regards,
${d.council} Recruitment Team
via RecruitSW`,
  },
};

export default function EmailPreview({ open, onClose, type, data }: { open: boolean; onClose: () => void; type: EmailType; data: Record<string, string> }) {
  const template = emailTemplates[type];
  if (!template) return null;

  const subject = template.subject.replace(/\{(\w+)\}/g, (_, key) => data[key] || `[${key}]`);
  const body = template.body(data);

  return (
    <Modal open={open} onClose={onClose} title="Email Preview" width={700}>
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: 20, fontFamily: "monospace" }}>
        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <div><strong>To:</strong> {data.email || data.refereeName || "[recipient]"}</div>
          <div><strong>From:</strong> recruitment@{(data.council || "council").toLowerCase().replace(/[^a-z]+/g, "")}.gov.uk via RecruitSW</div>
          <div><strong>Subject:</strong> {subject}</div>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />
        <pre style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", color: "var(--text-primary)" }}>
          {body}
        </pre>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>This is a preview — email will be sent when connected to Microsoft 365</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onClose}><Send size={16} /> Send Email</button>
        </div>
      </div>
    </Modal>
  );
}

export { emailTemplates };
export type { EmailType };
