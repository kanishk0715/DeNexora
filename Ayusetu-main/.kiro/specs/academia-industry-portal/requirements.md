# Requirements Document

## Introduction

The Academia–Industry Collaboration Portal (SIH Problem Statement #44) is a centralized platform that bridges the gap between academic institutions and industries. It serves four primary user groups: students, academicians, industry partners, and institutional administrators. The platform enables skill assessment, personalized skill gap analysis, internship and job matching, faculty development programs, collaboration facilitation, digital portfolios, and data-driven analytics — supporting the complete lifecycle of skill development, internships, and placements.

This portal is developed for the Ministry of Ayush / All India Institute of Ayurveda under the Smart Automation theme, aligned with the Smart India Hackathon (SIH) problem statement.

The complete lifecycle the platform supports:
**Assessment → Skill Profile → Skill Gap Analysis → Learning Recommendation → Internship/Job Matching → Application → Evaluation → Placement → Digital Portfolio**

---

## Glossary

- **Student**: A learner enrolled in an academic institution seeking skill development, internships, or placement opportunities.
- **Academician**: A faculty member or researcher seeking industrial training, FDPs, consultancy, or collaborative research opportunities.
- **Industry_Partner**: A company or organization that posts internships, jobs, learning programs, or collaboration opportunities on the platform.
- **Institution_Admin**: An administrator representing an academic institution who monitors student progress, placement analytics, and manages institutional data.
- **Platform_Admin**: A super-administrator who manages users, roles, verifications, and platform-wide configurations.
- **Skill_Profile**: A structured record of a student's assessed technical skills, soft skills, aptitude scores, and proficiency levels on a 0–100 scale.
- **Skill_Gap**: The difference between a skill score a student currently possesses and the skill score required for a target role or industry.
- **Skill_Gap_Priority**: A classification of a Skill_Gap: Ready (gap 0–10), Moderate Gap (11–25), Significant Gap (26–40), Major Gap (41+).
- **Placement_Readiness_Score**: A composite score computed as: Technical Skills 40% + Soft Skills 15% + Aptitude 15% + Projects 10% + Certifications 5% + Internship Experience 10% + Resume Quality 5%.
- **Match_Score**: A weighted compatibility score between a student's profile and an opportunity, computed as: Technical Skills 50% + Soft Skills 15% + Education 10% + Career Interest 10% + Projects 10% + Location Preference 5%.
- **Opportunity**: An internship, job, apprenticeship, project, FDP, workshop, or collaboration initiative posted on the platform.
- **Application**: A student's or academician's formal expression of interest in an Opportunity.
- **Portfolio**: A student's verified digital record of skills, certifications, projects, internships, and achievements.
- **Recommendation_Engine**: The platform subsystem (Python + FastAPI AI service) that matches students to opportunities and learning programs based on Skill_Profile.
- **Assessment**: A structured questionnaire or aptitude test used to evaluate a student's technical and soft skills.
- **Certification**: A verified credential confirming skill acquisition, issued by an industry or third-party provider.
- **FDP**: Faculty Development Program — a structured training or workshop opportunity for academicians.
- **Mentor**: An industry professional assigned to guide a student or academician through an internship or collaboration.
- **Verification_Level**: The trust level of a skill or credential: Self-Declared → Assessment_Verified → Course_Verified → Industry_Verified.

---

## Requirements

### Requirement 1: User Registration and Role-Based Access Control

**User Story:** As a new user (student, academician, industry partner, or institution admin), I want to register on the platform and access role-specific features, so that I can use the portal according to my role and responsibilities.

#### Acceptance Criteria

1. WHEN a new user submits a valid registration form with required fields (name, email, password, role, organization/institution), THE Platform SHALL create a new account and send an email verification link.
2. WHEN a user submits a registration form with an email address already registered, THE Platform SHALL reject the registration and display a descriptive error message indicating the email is already in use.
3. WHEN a user verifies their email address via the verification link, THE Platform SHALL activate the account and grant role-specific access to the following scopes: Student, Academician, Industry_Partner, Institution_Admin, Platform_Admin.
4. IF a user attempts to access a resource not permitted for their assigned role, THEN THE Platform SHALL deny access and return an authorization error without exposing system internals.
5. WHEN a user provides valid credentials during login, THE Platform SHALL authenticate the user, issue a JWT token, and return the user's role and profile summary.
6. IF a JWT token expires or is invalidated, THEN THE Platform SHALL require the user to re-authenticate before accessing any protected resource.
7. WHEN a Platform_Admin changes a user's role, THE Platform SHALL update the user's access permissions immediately without requiring re-registration.
8. THE Platform SHALL enforce rate limiting on the login endpoint, blocking further attempts from an IP address after a configurable number of failed attempts within a defined time window.
9. WHEN an Industry_Partner registers, THE Platform SHALL require organization verification by a Platform_Admin before the Industry_Partner account is granted posting privileges.

---

### Requirement 2: Skill Assessment

**User Story:** As a student, I want to complete a skill assessment questionnaire covering technical skills, soft skills, and aptitude, so that I receive an objective evaluation of my capabilities aligned with industry expectations.

#### Acceptance Criteria

1. WHEN a student initiates a skill assessment, THE Platform SHALL present a questionnaire containing questions from the Industry_Partner-defined skill taxonomy, covering Technical Skills, Soft Skills, and Aptitude categories.
2. WHEN a student submits a completed assessment, THE Platform SHALL compute a Skill_Profile with a numeric score (0–100) per assessed skill and an overall Skill_Gap_Priority classification for each gap relative to industry-defined benchmarks.
3. THE Skill_Profile SHALL include scores for: Technical Skills (e.g. JavaScript, Python, SQL), Soft Skills (e.g. Communication, Teamwork, Leadership), and Aptitude (e.g. Logical Reasoning, Quantitative, Verbal).
4. WHEN a student completes an assessment, THE Platform SHALL persist the Skill_Profile associated with the student's account and retain historical assessment records.
5. WHEN a student requests to retake an assessment, THE Platform SHALL allow reassessment and update the active Skill_Profile with the most recent results while preserving historical records.
6. IF a student submits an assessment with unanswered mandatory questions, THEN THE Platform SHALL reject the submission and highlight all unanswered mandatory questions.
7. WHERE an assessment contains adaptive questioning, THE Platform SHALL adjust subsequent questions based on the student's responses to preceding questions.
8. WHEN an Industry_Partner updates the skill taxonomy or benchmark scores, THE Platform SHALL flag all existing Skill_Profiles as stale and prompt affected students to retake the assessment.
9. THE Platform SHALL compute a Skill_Gap for each skill as: Skill_Gap = Required_Skill_Score − Student_Skill_Score, and classify it using Skill_Gap_Priority thresholds.

---

### Requirement 3: Skill Mapping and Personalized Recommendations

**User Story:** As a student, I want the platform to recommend relevant industries, job roles, and skill development programs based on my Skill_Profile and career interests, so that I can focus my development on areas that improve my employability.

#### Acceptance Criteria

1. WHEN a student's Skill_Profile is created or updated, THE Recommendation_Engine SHALL generate a ranked list of relevant industries and job roles using the skill-to-career mapping maintained by the platform.
2. WHEN a student's Skill_Gap is identified, THE Recommendation_Engine SHALL recommend specific learning programs, certifications, and training resources that address each identified gap, ordered by gap priority (Major Gap first).
3. THE Recommendation_Engine SHALL compute a Match_Score for each recommended opportunity or program and rank recommendations in descending order of Match_Score.
4. WHEN a student updates career preferences (target industries, career goals, location preference), THE Recommendation_Engine SHALL recalculate and refresh recommendations.
5. IF a student has no active Skill_Profile, THEN THE Platform SHALL prompt the student to complete an assessment before displaying personalized recommendations.
6. THE Platform SHALL display the rationale for each recommendation, identifying matched skills and unmet skill gaps for the given role or program.
7. THE Platform SHALL maintain a skill-to-career mapping (e.g. Frontend Developer requires: JavaScript, React, HTML, CSS, Git) that Industry_Partners and Platform_Admins can update.

---

### Requirement 4: Industry Opportunity Posting

**User Story:** As an industry partner, I want to post internship, apprenticeship, project, and job opportunities with required skills and eligibility criteria, so that I can attract suitable candidates from academic institutions.

#### Acceptance Criteria

1. WHEN an Industry_Partner submits an opportunity posting with all required fields (title, type, required skills with proficiency levels, duration, stipend/compensation, eligibility criteria, application deadline, number of positions), THE Platform SHALL publish the opportunity and make it discoverable by eligible students.
2. WHEN an Industry_Partner submits an opportunity posting with missing mandatory fields, THE Platform SHALL reject the submission and enumerate which fields are incomplete.
3. WHEN the application deadline for an opportunity passes, THE Platform SHALL automatically close the opportunity and stop accepting new applications.
4. WHEN an Industry_Partner edits a published opportunity, THE Platform SHALL update the listing and notify all existing applicants of material changes.
5. WHEN an Industry_Partner withdraws a published opportunity, THE Platform SHALL remove it from active listings and notify all applicants of the cancellation.
6. THE Platform SHALL support the following opportunity types: Internship, Apprenticeship, Live Project, Entry-Level Job, and Research Collaboration.
7. WHEN an opportunity is published, THE Recommendation_Engine SHALL include it in eligibility-matched student recommendation feeds.

---

### Requirement 5: Student Application and Tracking

**User Story:** As a student, I want to search, apply for, and track internship and placement opportunities through a single platform, so that I can manage my entire application lifecycle efficiently.

#### Acceptance Criteria

1. WHEN a student searches for opportunities using filters (skill, industry, location, opportunity type, duration, work mode), THE Platform SHALL return a ranked list of matching opportunities ordered by Match_Score.
2. WHEN a student applies for an opportunity, THE Platform SHALL record the application with a timestamp, attach the student's Portfolio, compute the Match_Score at time of application, and notify the Industry_Partner.
3. IF a student applies for an opportunity for which they do not meet the minimum eligibility criteria, THEN THE Platform SHALL display a warning listing the unmet criteria but SHALL still permit submission.
4. WHEN an Industry_Partner updates the application status (Applied → Under Review → Shortlisted → Assessment → Interview → Selected / Rejected), THE Platform SHALL notify the student of each status change.
5. THE Platform SHALL provide a student dashboard displaying all active and historical applications with their current status and timeline.
6. WHEN a student withdraws an application, THE Platform SHALL update the application status to Withdrawn and notify the Industry_Partner.
7. THE Platform SHALL prevent a student from submitting duplicate applications to the same opportunity.

---

### Requirement 6: Industry Learning Programs

**User Story:** As an industry partner, I want to publish training programs, certification courses, workshops, and mentorship initiatives, so that students can acquire in-demand skills before applying.

#### Acceptance Criteria

1. WHEN an Industry_Partner publishes a learning program with required fields (title, type, skills covered, duration, format, enrollment deadline, capacity), THE Platform SHALL make the program available for student enrollment.
2. WHEN a student enrolls in a learning program, THE Platform SHALL record the enrollment and provide access to program materials.
3. WHEN a student completes a learning program and passes any associated assessment, THE Platform SHALL issue a Certification at Verification_Level Course_Verified and add it to the student's Portfolio.
4. IF enrollment capacity for a learning program is reached, THEN THE Platform SHALL close enrollment and add subsequent interested students to a waitlist.
5. WHEN a learning program enrollment deadline passes, THE Platform SHALL automatically close new enrollments.
6. THE Recommendation_Engine SHALL recommend learning programs that directly address a student's identified Skill_Gap, prioritizing programs targeting Major Gap and Significant Gap skills.

---

### Requirement 7: Academician Opportunity Portal

**User Story:** As an academician, I want to explore and apply for faculty internships, industrial training, FDPs, consultancy opportunities, and collaborative research projects, so that I can gain practical exposure and align my teaching with current industry practices.

#### Acceptance Criteria

1. THE Platform SHALL provide a dedicated Academician dashboard listing opportunities of types: Faculty Internship, FDP, Industrial Training, Consultancy Project, and Research Collaboration.
2. WHEN an Industry_Partner publishes an academician-targeted opportunity, THE Platform SHALL make it visible in the Academician portal and notify subscribed academicians based on their areas of expertise.
3. WHEN an Academician applies for an opportunity, THE Platform SHALL record the application and attach the Academician's academic profile, areas of expertise, and uploaded CV.
4. WHEN the status of an Academician's application is updated by an Industry_Partner, THE Platform SHALL notify the Academician via in-app notification and email.
5. THE Platform SHALL allow Academicians to maintain a professional profile listing: expertise areas, publications, research interests, institutional affiliation, and previous industry engagements.
6. WHEN an Academician completes an FDP or industrial training, THE Platform SHALL record a completion certificate and update the Academician's profile with the verified credential.

---

### Requirement 8: Industry–Academia Collaboration Features

**User Story:** As an industry partner, I want to facilitate collaboration with academic institutions through mentorship programs, workshops, guest lectures, innovation challenges, and live projects, so that I can contribute to talent development and access fresh perspectives.

#### Acceptance Criteria

1. THE Platform SHALL support creation and management of collaboration initiatives of types: Mentorship Program, Workshop, Guest Lecture, Innovation Challenge, and Live Industry Project.
2. WHEN an Industry_Partner creates a collaboration initiative, THE Platform SHALL notify eligible students and academicians based on profile relevance.
3. WHEN a student or Academician registers for a collaboration initiative, THE Platform SHALL confirm registration, assign them to the initiative, and provide access to relevant materials.
4. WHEN a Mentor submits feedback on a student's participation in a mentorship program, THE Platform SHALL record the feedback with a timestamp and make it visible to the student and Institution_Admin.
5. WHEN an innovation challenge deadline passes, THE Platform SHALL close submissions and allow the Industry_Partner to evaluate entries and announce results.
6. THE Platform SHALL allow Institution_Admins to co-host collaboration initiatives with Industry_Partners.

---

### Requirement 9: Student Digital Portfolio

**User Story:** As a student, I want to maintain a digital portfolio of my verified skills, certifications, projects, internships, and achievements, so that I can present a credible and shareable record of my capabilities to prospective employers.

#### Acceptance Criteria

1. THE Platform SHALL automatically update the Portfolio when a student completes an assessment (Verification_Level: Assessment_Verified), earns a Certification (Course_Verified or Industry_Verified), or completes an internship.
2. WHEN a student manually adds a skill, project, or achievement, THE Platform SHALL mark it as Self-Declared (Verification_Level: Self-Declared) until validated by an authorized verifier.
3. WHEN an authorized verifier (Institution_Admin or Industry_Partner) validates a portfolio item, THE Platform SHALL upgrade its Verification_Level, record the verifier's identity, and store the verification timestamp.
4. THE Platform SHALL generate a shareable public Portfolio URL (e.g. portal.com/student/{username}) accessible without requiring a platform account.
5. WHEN a student's Portfolio is accessed via the public link, THE Platform SHALL display only items with Verification_Level of Assessment_Verified or higher, unless the student explicitly enables display of Self-Declared items.
6. THE Portfolio SHALL include: assessed skill scores with Verification_Level, completed certifications, internship records, project contributions, academic achievements, and mentor feedback summaries.
7. THE Platform SHALL compute and display a Placement_Readiness_Score on the student's Portfolio dashboard.

---

### Requirement 10: Institution Analytics and Monitoring Dashboard

**User Story:** As an institution admin, I want to monitor student skill development, internship participation, and placement progress through dashboards and analytics, so that I can make data-driven decisions to improve academic and career outcomes.

#### Acceptance Criteria

1. THE Platform SHALL provide an Institution_Admin dashboard displaying aggregate metrics: total students assessed, average skill scores by domain, internship participation rate, placement rate, active applications count, and industry partnership count.
2. WHEN an Institution_Admin applies filters (department, batch year, skill domain, date range), THE Platform SHALL update all dashboard metrics to reflect the filtered cohort.
3. THE Platform SHALL generate downloadable reports in CSV and PDF formats covering all dashboard metrics.
4. THE Platform SHALL allow Institution_Admins to drill down from aggregate metrics to individual student records while respecting each student's privacy settings.
5. WHERE an institution has enabled benchmarking, THE Platform SHALL display institution-level metrics alongside anonymized national and industry averages.
6. THE Platform SHALL display skill demand analytics aggregated from all published opportunities, showing the most in-demand skills and their frequency across postings.

---

### Requirement 11: Internship Progress Tracking and Mentor Feedback

**User Story:** As a student and institution admin, I want to track internship progress, receive structured mentor feedback, and formally record internship completion, so that internships are properly documented and contribute to the student's verified record.

#### Acceptance Criteria

1. WHEN a student's internship application is marked Selected by an Industry_Partner, THE Platform SHALL create an Internship Record linked to the student, Industry_Partner, Mentor, and opportunity.
2. WHEN a Mentor submits a progress report for a student, THE Platform SHALL record it with a timestamp and make it accessible to both the student and Institution_Admin.
3. WHEN an internship reaches its scheduled end date, THE Platform SHALL prompt the Mentor and Industry_Partner to submit a completion evaluation.
4. WHEN a completion evaluation is submitted and approved, THE Platform SHALL add a verified Internship Completion record to the student's Portfolio.
5. IF a student's progress report indicates unsatisfactory performance, THEN THE Platform SHALL alert the assigned Institution_Admin and Mentor.
6. THE Platform SHALL track and display internship milestones, tasks, and submission deadlines within the Internship Record.

---

### Requirement 12: Secure Document Management

**User Story:** As any user on the platform, I want to securely upload, store, and share documents such as resumes, certificates, internship reports, and academic records, so that my documents are protected and accessible only to authorized parties.

#### Acceptance Criteria

1. WHEN a user uploads a document, THE Platform SHALL validate the file type (permitted: PDF, DOCX, JPG, PNG) and file size (maximum 10 MB) before storing it.
2. IF a user uploads a document exceeding 10 MB or of an unsupported format, THEN THE Platform SHALL reject the upload and display a descriptive error specifying the violation.
3. THE Platform SHALL store all uploaded documents in cloud storage (e.g. Cloudinary or AWS S3) with access controlled by signed URLs, not stored directly in the database.
4. WHEN a user shares a document with another user or external party, THE Platform SHALL generate a time-limited signed URL.
5. WHEN a sharing link expires, THE Platform SHALL revoke access to the document via that link automatically.
6. THE Platform SHALL maintain an audit log of all document uploads, accesses, and deletions, recording the user identity and timestamp for each event.

---

### Requirement 13: Placement Recruitment Management

**User Story:** As an industry partner and institution admin, I want to manage the recruitment lifecycle including shortlisting, interview scheduling, and placement outcomes, so that the hiring process is efficient, trackable, and outcome-oriented.

#### Acceptance Criteria

1. WHEN an Industry_Partner shortlists a student, THE Platform SHALL notify the student and update the application status to Shortlisted.
2. THE Platform SHALL allow Industry_Partners to filter and rank applicants by Match_Score, Placement_Readiness_Score, and portfolio completeness.
3. WHEN an Industry_Partner records a placement offer and the student accepts, THE Platform SHALL update the student's status to Placed, notify the Institution_Admin, and record the placement outcome in the student's Portfolio.
4. THE Platform SHALL provide recruitment funnel analytics for Industry_Partners: applications received, shortlisted, offered, accepted, rejected.
5. WHEN a student is marked Placed, THE Platform SHALL exclude the student from further active placement opportunity recommendations.
6. THE Platform SHALL allow Institution_Admins to generate placement reports by batch year, department, and industry sector.

---

### Requirement 14: AI-Powered Resume Skill Extraction

**User Story:** As a student, I want the platform to automatically extract skills from my uploaded resume, so that my skill profile is enriched without requiring me to manually enter every skill.

#### Acceptance Criteria

1. WHEN a student uploads a resume document, THE Platform SHALL pass it to the AI/ML service for skill extraction and return a list of identified skills.
2. WHEN the AI/ML service extracts skills from a resume, THE Platform SHALL present the extracted skills to the student for confirmation before adding them to the Skill_Profile.
3. THE Platform SHALL normalize skill aliases during extraction (e.g. "React.js", "ReactJS", "React" SHALL all map to the canonical skill name "React").
4. WHEN extracted skills are confirmed by the student, THE Platform SHALL add them to the Skill_Profile at Verification_Level Self-Declared.
5. IF the AI/ML service is unavailable, THEN THE Platform SHALL notify the student and allow manual skill entry as a fallback.

---

### Requirement 15: Notification System

**User Story:** As any user, I want to receive timely in-app and email notifications for relevant platform events, so that I stay informed about application updates, deadlines, and opportunities without constantly checking the portal.

#### Acceptance Criteria

1. THE Platform SHALL send in-app notifications for: new recommended internship or job posting, application status change, mentor feedback received, course recommendation, assessment completion, certificate verification, and approaching application deadlines.
2. THE Platform SHALL send email notifications for: account verification, password reset, application status changes, internship selection, and placement offers.
3. WHEN a user marks a notification as read, THE Platform SHALL update its status to Read and remove it from the unread notification count.
4. THE Platform SHALL allow users to configure notification preferences, enabling or disabling specific notification categories.
5. IF an email notification fails to deliver, THEN THE Platform SHALL retry delivery with exponential backoff up to three attempts and log the final delivery status.

---

### Requirement 16: Integration with External Platforms

**User Story:** As a platform administrator, I want the portal to integrate with external learning platforms, certification providers, and institutional databases, so that data flows seamlessly and users benefit from a unified experience.

#### Acceptance Criteria

1. THE Platform SHALL support OAuth 2.0-based authentication with external institutional SSO providers.
2. WHEN a student earns a certification from an integrated external provider, THE Platform SHALL automatically import and store the certification at Verification_Level Course_Verified in the student's Portfolio.
3. THE Platform SHALL provide a documented REST API for institutional databases to synchronize student enrollment, academic records, and department data.
4. WHEN an external system pushes data via the REST API, THE Platform SHALL validate the payload schema before persisting any records.
5. IF an external API integration fails, THEN THE Platform SHALL log the failure, retry with exponential backoff, and alert the Platform_Admin if failures persist beyond three consecutive attempts.
6. THE Platform SHALL support outbound webhooks allowing integrated systems to receive real-time notifications on application status changes, placement outcomes, and assessment completions.

---

### Requirement 17: Platform Security and Data Privacy

**User Story:** As any user, I want my personal data and documents to be protected, and as an administrator, I want the platform to comply with data protection best practices, so that user trust is maintained.

#### Acceptance Criteria

1. THE Platform SHALL enforce HTTPS for all client-server communications.
2. THE Platform SHALL hash all passwords using bcrypt before storage and SHALL NOT store plaintext passwords.
3. THE Platform SHALL use Helmet middleware to set secure HTTP headers and configure CORS to permit requests only from trusted frontend domains.
4. WHEN a user requests deletion of their account, THE Platform SHALL anonymize or delete all personally identifiable information within 30 days, retaining only records required for audit compliance.
5. THE Platform SHALL implement rate limiting on authentication endpoints using express-rate-limit, configurable per IP and per account.
6. IF a security event (multiple failed login attempts, anomalous bulk data export) is detected, THEN THE Platform SHALL log the event, alert the Platform_Admin, and optionally suspend the affected account pending review.
7. THE Platform SHALL provide users with a data export feature allowing them to download all their personal data in JSON format.
