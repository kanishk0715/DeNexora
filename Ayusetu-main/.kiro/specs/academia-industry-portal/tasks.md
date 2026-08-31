# Implementation Plan: Academia–Industry Collaboration Portal

## Active Tasks

- [x] 1. Project scaffolding and shared infrastructure
  - Initialize monorepo: `backend/`, `ai-service/`, `frontend/`
  - Configure MongoDB Atlas + Mongoose, shared `.env.example`, API response envelope
  - _Requirements: 17.1, 17.3_

- [-] 2. Authentication and role-based access control
  - [x] 2.1 User model with bcrypt password hashing
  - [x] 2.2 Auth routes: register, login, logout, email-verify, forgot/reset-password
  - [x] 2.3 JWT middleware for token verification and role extraction
  - [x] 2.4 Role-guard middleware accepting array of permitted roles
  - _Requirements: 1.1–1.6, 17.2, 17.5_

- [x] 3. Core data models
  - [x] 3.1 Mongoose models: `Skill`, `AssessmentResult`, `Opportunity`, `Application`, `Portfolio`, `Notification`, `AuditLog`
  - [x] 3.2 Student Profile and Academician Profile models
  - _Requirements: 2.2, 2.9, 3.7, 4.1, 5.2, 7.5, 9.1_

- [x] 4. Skill gap and scoring engine (`backend/lib/scoring.ts`)
  - [x] 4.1 `computeSkillGap(required, student)` — numeric gap + priority enum
  - [x] 4.2 `computeMatchScore(studentProfile, opportunity)` — six-component weighted formula
  - [x] 4.3 `computePlacementReadinessScore(studentProfile)` — seven-component weighted formula
  - _Requirements: 2.2, 2.9, 3.3, 5.2, 9.7_

- [x] 5. Skill assessment module
  - [x] 5.1 Assessment model + seed questionnaire data
  - [x] 5.2 Assessment routes: list, get-by-id, submit (with scoring + AssessmentResult persistence)
  - _Requirements: 2.1–2.6_

- [ ] 6. Opportunities module
  - [ ] 6.1 Opportunity CRUD routes with role guards (Industry_Partner for write ops)
  - [ ] 6.2 Search/filter by skill, industry, location, type, work mode — ordered by Match_Score
  - _Requirements: 4.1–4.6, 5.1_

- [ ] 7. Applications module
  - [ ] 7.1 Submit application: duplicate check, Match_Score, Portfolio snapshot, notify partner
  - [ ] 7.2 Status update route with state-machine enforcement + student notification
  - [ ] 7.3 Withdraw route and student applications dashboard
  - _Requirements: 5.2–5.7_

- [ ] 8. Digital portfolio module
  - [ ] 8.1 Portfolio CRUD + auto-update on assessment complete / certification earned / internship done
  - [ ] 8.2 Item verification route (Institution_Admin / Industry_Partner)
  - [ ] 8.3 Public portfolio endpoint `/api/portfolio/:username` (no auth)
  - _Requirements: 9.1–9.6_

- [ ] 9. Python AI service — core
  - [ ] 9.1 `/ai/analyze-skills` — assessment answers → Skill_Profile JSON
  - [ ] 9.2 `/ai/match-score` — student + opportunity → Match_Score
  - [ ] 9.3 `/ai/recommendations` — ranked opportunities and learning programs
  - _Requirements: 2.2, 3.1–3.3, 6.6_

- [ ] 10. Notification system
  - [ ] 10.1 Notification model + in-app routes (create, list, mark-as-read, preferences)
  - [ ] 10.2 Email service (Nodemailer/SendGrid) with retry + delivery logging
  - [ ] 10.3 Wire triggers: application status change, assessment done, certificate earned, deadline alerts
  - _Requirements: 15.1–15.5_

- [ ] 11. React frontend — core shell
  - [ ] 11.1 App shell: React Router, Tailwind layout, role-based route guards
  - [ ] 11.2 Auth pages: login, register, email-verify, forgot/reset password
  - [ ] 11.3 Notification bell with unread badge
  - _Requirements: 1.1, 1.3–1.5, 15.1, 15.3_

- [ ] 12. React frontend — student workflows
  - [ ] 12.1 Student dashboard: skill summary, Placement_Readiness_Score gauge, recommended opportunities
  - [ ] 12.2 Assessment page: questions, submit, Skill_Profile + gap chart
  - [ ] 12.3 Opportunities search + apply flow
  - [ ] 12.4 Applications tracker with status timeline
  - [ ] 12.5 Portfolio page (private + public shareable views)
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 5.1–5.5, 9.4–9.7_

- [ ] 13. React frontend — industry and institution workflows
  - [ ] 13.1 Industry dashboard: recruitment funnel, active postings, applicant management
  - [ ] 13.2 Opportunity create/edit forms with skills picker
  - [ ] 13.3 Institution admin dashboard: metrics, trends, CSV/PDF download
  - _Requirements: 4.1, 4.2, 10.1–10.3, 13.1–13.4_

- [ ] 14. Analytics and placement management
  - [ ] 14.1 Institution analytics endpoint (aggregate metrics, filters, CSV/PDF export)
  - [ ] 14.2 Skill demand analytics (required skills across active postings)
  - [ ] 14.3 Placement routes: shortlisting, offer recording, status → Placed, funnel analytics
  - _Requirements: 10.1–10.3, 10.6, 13.1–13.6_

---

## Future Tasks (work on later)

- [ ] Industry learning programs module (enrollment, waitlist, certification issuance)
- [ ] Academician portal module (FDP, Faculty_Internship, Research_Collaboration flows)
- [ ] Industry–Academia collaboration module (mentorship, workshops, innovation challenges)
- [ ] Document management module (upload, signed URLs, audit log)
- [ ] Resume AI skill extraction endpoint + normalization
- [ ] External integrations (OAuth SSO, institutional DB sync, webhooks)
- [ ] Security hardening (Helmet, CORS allowlist, GDPR data export/deletion)
- [ ] Scheduled jobs (deadline auto-close, stale profile flagging, deadline alerts)
- [ ] Health check endpoints for backend and AI service
- [ ] Platform_Admin user management page
- [ ] Academician dashboard frontend

---

## Property-Based Tests (add when ready)

- Property 1: Skill gap non-negativity and classification correctness
- Property 2: Match score bounded range [0, 100]
- Property 3: Match score weights sum to 1.00
- Property 4: Placement readiness score bounded range [0, 100]
- Property 5: Skill gap drives recommendation ordering
- Property 6: No duplicate applications
- Property 7: Application status monotonicity
- Property 8: Skill verification level monotonicity
- Property 9: Public portfolio filters unverified items
- Property 10: Opportunity auto-close on deadline
- Property 11: Resume skill normalization idempotence
- Property 12: Placed student excluded from recommendations
- Property 13: Assessment score round-trip consistency
- Property 14: Password storage safety
- Property 15: Document upload type and size validation
