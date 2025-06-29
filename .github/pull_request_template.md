**Title:** `feat: Implement Story 1.1 - Project Layout`

**Description**

This pull request establishes the foundational structure for the "Next-Gen VA Loans" project. It includes the initialization of a Turborepo monorepo, the creation of the primary `web` application using Next.js, and the implementation of the main application layout.

**Related Story**

* Closes **Story 1.1: Project Initialization & Basic Layout**

**Changes Made**

* Initialized a Turborepo monorepo using Bun.
* Created the `web` and `admin` Next.js applications in the `/apps` directory.
* Configured Tailwind CSS and initialized `shadcn/ui` for the `web` app.
* Implemented the main application layout with `Header`, `Footer`, and `MainLayout` components.

**How to Test**

1.  Check out this branch.
2.  Run `bun install` from the root directory.
3.  Run `bun dev`.
4.  Navigate to `http://localhost:3000`.
5.  **Expected Result:** The page should load successfully and display the new Header and Footer around the default Next.js content.