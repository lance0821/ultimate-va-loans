# Next-Generation Veteran Home Loans Product Requirements Document (PRD)

## Goals and Background Context

### Goals
* To deliver a "Verified Pre-Approval" to users in under 20 minutes, giving them confidence and certainty at the start of their home search.
* To achieve an average "application to closing" time that is 25% faster than the industry average for VA loans.
* To eliminate user anxiety by providing a fully transparent, real-time dashboard showing the exact status of their loan application at all times.
* To build a trusted, market-leading brand for veteran home loans, reflected in a Net Promoter Score (NPS) of +70 or higher.

### Background Context
The current mortgage industry provides a slow, opaque, and frustrating experience for consumers, including tech-savvy veterans who expect modern digital services. This project aims to solve this by creating a technology-first platform that completely reinvents the mortgage workflow.

By using API integrations and AI to automate data collection and analysis, we will provide a radically faster, more transparent home-buying journey. Our solution will focus not just on the loan transaction itself but on providing value throughout the process, turning mandatory waiting periods into productive opportunities for our users and positioning our service as a trusted partner.

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-28 | 1.0 | Initial PRD draft. | John (PM) |
| 2025-06-28 | 1.1 | Pivoted from automated (Plaid) to manual document upload model. Revised requirements and epics. | John (PM) |

## Requirements

### Functional

* **FR1:** Users must be able to create a secure account using an email address and password.
* **FR2:** Authenticated users must be able to log in and out of the platform.
* **FR_new_1:** The user dashboard must provide a clear, step-by-step interface for uploading multiple required documents (e.g., bank statements, pay stubs).
* **FR_new_2:** The system must securely store each uploaded document using Supabase Storage and associate it with the correct user and loan application.
* **FR_new_3:** Each uploaded document must have a status (e.g., `Pending Review`, `Approved`, `Rejected`) that is visible to both the user and an internal loan officer.
* **FR_new_4:** A secure internal interface must exist for an authorized loan officer to view a user's submitted documents for review.

### Non Functional

* **NFR1:** The web application must be fully responsive, providing a seamless experience on all modern desktop, tablet, and mobile browsers.
* **NFR3:** All sensitive user data (PII, financial information) must be securely stored and encrypted both at rest and in transit.
* **NFR4:** The system must be designed to comply with relevant financial lending regulations (e.g., TILA, RESPA).

## User Interface Design Goals

### Overall UX Vision
The user experience must be centered on clarity, speed, and trust. The design should feel modern, clean, and professional, avoiding the cluttered and confusing nature of traditional financial applications. Every interaction should be intuitive, guiding the user effortlessly through what is normally a very complex process. The goal is to make the user feel empowered and informed, not overwhelmed.

### Key Interaction Paradigms
* **Guided Application Workflow:** The initial loan application should be a step-by-step "wizard" that breaks the process into small, manageable chunks. This prevents the user from seeing a massive form and abandoning the process.
* **Dashboard-Centric:** After the initial application, the user's primary interface will be a central dashboard that provides an at-a-glance summary of their loan status, a clear list of any pending tasks, and access to support.

### Core Screens and Views
For the MVP, the following core screens are required to facilitate the user journey:
* Landing Page / Login Screen
* User Registration Screen
* A multi-step Application "Wizard"
* The main User Dashboard showing real-time status
* A basic Account Settings page

### Accessibility
The platform should meet **WCAG 2.1 AA** standards to ensure it is accessible to all users, including those with disabilities.

### Branding
To be defined. The overall aesthetic should communicate professionalism, security, and modernity. It should feel more like a modern tech product than a traditional bank.

### Target Device and Platforms
The application will be a responsive web application, designed to work seamlessly on all modern desktop, tablet, and mobile browsers.

## Technical Assumptions

### Repository Structure
* A **Monorepo** is the recommended approach to manage both the Next.js frontend and the chosen backend in a single repository, simplifying development and code sharing.

### Service Architecture
* The project will use **Supabase** as its backend Platform as a Service (PaaS), handling the database, authentication, and file storage.

### Testing requirements
* The MVP will require, at a minimum, comprehensive **unit and integration tests** for all new functionality to ensure reliability. The specific testing frameworks and coverage targets will be defined in the Architecture Document.

### Additional Technical Assumptions and Requests
* **Frontend Stack:** The frontend will be built with **Next.js** and styled with **Tailwind CSS** and the **shadcn/ui** component library.
* **Backend:** Supabase will serve as the primary backend.
* **AI Workflows:** The use of **n8n** should be considered by the architect for implementing any potential AI or automation workflows.
* **Security:** The system will handle sensitive financial data and must be designed for high security and compliance standards.

## Epics

* **Epic 1: Foundational Setup & User Onboarding (No Change)**
    * **Goal:** Establish the core project infrastructure, implement secure user account creation and login, and create the basic application shell and dashboard.
* **Epic 2: Manual Application & Document Upload (New)**
    * **Goal:** To provide a clear, secure, and guided interface for users to manually complete their loan application by uploading all required financial documents.
* **Epic 3: Document Review & Application Tracking (Revised)**
    * **Goal:** To allow internal loan officers to review submitted documents and to provide users with real-time status updates on their document review and overall application progress.

---
## Epic 1: Foundational Setup & User Onboarding

**Goal:** To establish the core technical foundation of the project, including a secure and functional user authentication system, and a basic application shell that provides an authenticated 'home' for the user to land on after logging in.

### Story 1.1: Project Initialization & Basic Layout
As a developer, I want to initialize the Next.js project with the chosen tech stack and create a basic application layout, so that we have a runnable foundation to build upon.

#### Acceptance Criteria
* The project is created using the latest stable version of Next.js with TypeScript and Tailwind CSS.
* The project structure follows the Monorepo pattern outlined in the Technical Assumptions.
* A basic `Layout` component is created that includes a simple header and footer.
* The application runs locally without errors after the initial setup.

### Story 1.2: User Registration
As a new user, I want to create a secure account using my email and a password, so that I can access the platform.

#### Acceptance Criteria
* A registration page is created with a form containing fields for email, password, and password confirmation.
* Client-side validation provides immediate feedback if the email format is invalid or if passwords do not match.
* On successful submission, a new user record is created in the backend system.
* If the email address is already in use, a clear error message is displayed to the user.
* After successful registration, the user is automatically logged in and redirected to the dashboard.

### Story 1.3: User Login & Session Management
As a registered user, I want to log in to the platform securely, so that I can access my personal information and application status.

#### Acceptance Criteria
* A login page is created with a form for email and password.
* On successful login, a secure session is created and persisted for the user.
* If invalid credentials are provided, a generic "Invalid email or password" error message is displayed.
* Authenticated users are redirected to their dashboard upon login.

### Story 1.4: Basic Authenticated Dashboard
As a logged-in user, I want to see a personalized dashboard and have the ability to log out, so that I know I am in a secure, authenticated area.

#### Acceptance Criteria
* A dashboard page is created at a protected route (e.g., `/dashboard`).
* If an unauthenticated user attempts to access the dashboard, they are redirected to the login page.
* The dashboard displays a simple "Welcome, [user's email]!" message.
* A functional logout button is present on the dashboard, which, when clicked, ends the user's session and redirects them to the login page.

---
## Epic 2: Manual Application & Document Upload (New)

**Goal:** To provide a clear, secure, and guided interface for users to manually complete their loan application by uploading all required financial documents.

### Story 2.1: Display Document Checklist UI
As a user on my dashboard, I want to see a clear checklist of all the documents I need to provide, so I know exactly what is required of me.

#### Acceptance Criteria
1.  The user dashboard displays a section titled "Required Documents".
2.  This section contains a list of required document types (e.g., "Pay Stub - Last 30 days," "Bank Statement - Last 2 months," "W-2 - Last 2 years"). For the MVP, this list can be hardcoded.
3.  Each item on the checklist has a status indicator, which defaults to "Not Uploaded."

### Story 2.2: Implement Single Document Upload
As a user, I want to upload a single document file for a specific item on my checklist, so I can provide my required information.

#### Acceptance Criteria
1.  Each checklist item with a "Not Uploaded" status has a functional "Upload" button.
2.  Clicking "Upload" opens the user's native file browser.
3.  The user can select a single file (PDF, JPG, PNG formats must be supported).
4.  The selected file is securely uploaded to Supabase Storage.
5.  Upon successful upload, the corresponding checklist item's status updates to "Pending Review."
6.  The user sees a success message confirming the file was uploaded.

### Story 2.3: Implement Document Deletion
As a user, I want to be able to delete a document I have uploaded, so I can correct a mistake (e.g., uploading the wrong file).

#### Acceptance Criteria
1.  A "Delete" option is available next to any document with a "Pending Review" status.
2.  Clicking "Delete" shows a confirmation prompt to prevent accidental deletion.
3.  Upon confirmation, the file is permanently deleted from Supabase Storage.
4.  The corresponding checklist item's status reverts to "Not Uploaded."

### Story 2.4: Submit Full Application
As a user who has uploaded all required documents, I want to be able to formally submit my application for review.

#### Acceptance Criteria
1.  A "Submit Application for Review" button is visible and enabled on the dashboard only when all checklist items have a status of "Pending Review."
2.  Clicking the button updates the overall `LoanApplication` status to "In Review."
3.  After submission, the UI prevents any further document uploads or deletions for that application.
4.  The user is shown a confirmation message indicating their application has been successfully submitted and is now being reviewed.

---
## Epic 3: Document Review & Application Tracking (Revised)

**Goal:** To allow internal loan officers to review submitted documents and to provide users with real-time status updates on their document review and overall application progress.

### Story 3.1: Create Internal Document Viewer
As a loan officer, I want a secure interface where I can view all the documents submitted for a specific loan application, so I can begin my review process.

#### Acceptance Criteria
1.  A secure, internal-facing page is created that is only accessible to authorized loan officer roles.
2.  The page lists all loan applications that have a status of "In Review."
3.  A loan officer can select an application and be taken to a detail view.
4.  The detail view lists all documents uploaded by the user for that application and provides a link to view each one.

### Story 3.2: Implement Document Approve/Reject Logic
As a loan officer, I want the ability to approve or reject each individual document, so that I can process the application.

#### Acceptance Criteria
1.  In the internal document viewer, each document has an "Approve" and a "Reject" button.
2.  Clicking "Approve" changes that document's status to "Approved."
3.  Clicking "Reject" prompts the officer to provide a brief, user-facing reason for the rejection.
4.  Upon submitting the reason, the document's status is changed to "Rejected."

### Story 3.3: Update User Dashboard with Document Status
As a user, I want to see the real-time status of each document I uploaded, so I know if my submission was accepted or if I need to make a correction.

#### Acceptance Criteria
1.  The "Required Documents" checklist on the user's dashboard is updated to show the individual status of each document (`Approved`, `Rejected`, etc.).
2.  If a document's status is "Rejected," the reason provided by the loan officer is clearly displayed to the user.
3.  A user is able to use the "Delete" and "Upload" functions again for any document marked as "Rejected."

### Story 3.4: Implement Final Application Approval
As a loan officer who has approved all documents, I want to give final approval to the application, so I can move the user to the next stage of the mortgage process.

#### Acceptance Criteria
1.  In the internal viewer, a "Grant Final Approval" button becomes enabled only after all individual documents for an application have a status of "Approved."
2.  Clicking the button changes the overall `LoanApplication` status to "HandoffComplete" (or a similar final status).
3.  The user's dashboard updates to show a final success message (e.g., "Congratulations! Your documents have been approved.").
4.  The "Loan Officer Handoff" email (as defined in the original plan) is triggered and sent to the user.

---
## Next Steps

1.  **Handoff to UX Expert (Sally):** Review this revised PRD and update the `front-end-spec.md` to reflect the new manual document upload and review flows.
2.  **Handoff to Architect (Winston):** After the UI/UX Spec is revised, update the `fullstack-architecture.md` to design the document management system using Supabase.