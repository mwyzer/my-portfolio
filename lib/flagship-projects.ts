import type { PortfolioAbout, PortfolioProject, CaseStudy } from "@/types/database";

export interface FlagshipProjectEntry {
  matchTitles: string[];
  project: PortfolioProject;
}

const NOW_ISO = "2026-11-15T00:00:00.000Z";

export const DEFAULT_HERO_PROOF: string[] = [
  "Core Languages · Python 3 / Go / Java 21 / TypeScript",
  "AI & Verification · LangGraph / RAG / 250+ Automated Test Suites",
  "Production Infra · Docker / PostgreSQL / Redis / Kafka / CI/CD",
];

export const DEFAULT_SKILLS: string[] = [
  "Python 3",
  "Go (Golang)",
  "Java 21",
  "TypeScript",
  "FastAPI",
  "Spring Boot 3",
  "Go Gin",
  "React 18",
  "Next.js",
  "Vue 3 / Nuxt 4",
  "PostgreSQL",
  "Redis",
  "Apache Kafka",
  "Docker",
  "LangGraph",
  "RAG",
];

const UPGRADED_TITLE = "Software Engineer (Python 3 · Go · Java 21 · TypeScript) & AI Engineer";
const UPGRADED_BIO =
  "Full-Stack and Backend Software Engineer with 5+ years of experience building scalable backend services, distributed systems, and AI-enabled platforms across Python 3, Go, Java 21, and TypeScript. Author of 20+ production-oriented repositories featuring 250+ automated test suites, Dockerized environments, and deterministic domain engines.";

const UPGRADED_EXPERIENCE = `September 2025 - Present
Mentor - Tujuh Belas Agustus 1945 University, North Jakarta
• Designed programming problems, reference solutions, and deterministic grading rubrics in Programming Fundamentals and Software Engineering
• Mentored students in algorithms, data structures, debugging, and software projects

December 2025 - Present
Mentor - Ganesha Operation
• Provided mentoring in Informatics, Algorithmic Problem Solving, and Computational Thinking

May 2025 - Present
Facilitator - PT. Anagata Sisedu Nusantara
• Delivered instruction aligned with the national curriculum on coding and AI
• Guided students in developing logical thinking, problem-solving, and digital literacy skills

August 2024 - February 2025
Full Stack Developer - PT. Pasifik Wija Teknologi, North Kalimantan
• Built a web application for internet voucher sales and customer management (Laravel 10, MySQL, Laravel Filament)
• Developed a corporate platform with normalized relational schemas and RBAC (Laravel 10, Tailwind, MySQL)

August 2023 - July 2024
Technical Support & Backend Developer - PT. Taman Kreasi Indonesia, Semarang
• Audited and debugged high-volume incoming cargo logs in production relational databases
• Maintained, refactored, and modernized legacy business modules (Laravel 5.5 to Laravel 8, MySQL, PostgreSQL)
• Created an employee KPI & performance monitoring platform with analytical charts (Laravel 8, PostgreSQL, jQuery)

August 2022 - November 2022
Software Developer - PT. Tutoria Sentra Edukasi, East Jakarta
• Engineered custom API integrations bridging Moodle LMS with Laravel backend services
• Designed and implemented a web platform connecting courses, tutors, and students
• Performed troubleshooting for networks, computers, and cross-system integrations`;

export function normalizePortfolioProfile(dbProfile: PortfolioAbout | null): PortfolioAbout {
  const base: PortfolioAbout = dbProfile ?? {
    id: "default-profile",
    created_at: NOW_ISO,
    updated_at: NOW_ISO,
    name: "Muhammad Wyzer",
    title: UPGRADED_TITLE,
    bio: UPGRADED_BIO,
    avatar_url: "https://gitlab.com/uploads/-/system/user/avatar/6791914/avatar.png?width=800",
    resume_url: "/CV_Muhammad_Wyzer.pdf",
    skills: DEFAULT_SKILLS,
    social_links: {},
  };

  const isLegacyTitle =
    !base.title ||
    base.title.trim().toLowerCase() === "full stack developer & mentor";
  const isLegacyBio =
    !base.bio ||
    base.bio.includes("over 3 years of experience building web applications using Laravel");
  const isLegacySkills =
    !base.skills ||
    base.skills.length === 0 ||
    base.skills.includes("jQuery") ||
    base.skills.includes("Moodle");

  const rawSocial = (base.social_links as Record<string, any> | null) ?? {};
  const existingProof = Array.isArray(rawSocial.heroProof) ? rawSocial.heroProof : [];
  const isLegacyProof =
    existingProof.length === 0 ||
    existingProof.some((p: string) => typeof p === "string" && p.includes("Laravel / .NET"));

  const cleanStr = (val: string) => val.replace(/—/g, "-").replace(/–/g, "-");

  const rawExperience = typeof rawSocial.experience === "string" ? rawSocial.experience : "";
  const isLegacyExperience =
    !rawExperience || !rawExperience.includes("deterministic grading rubrics");

  const upgradedSocial: Record<string, any> = {
    linkedin: rawSocial.linkedin || "https://www.linkedin.com/in/muhammad-wyzer/",
    github: rawSocial.github || "https://github.com/mwyzer",
    gitlab: rawSocial.gitlab || "https://gitlab.com/mwyzer",
    email: rawSocial.email || "muhammad.wyzer@gmail.com",
    phone: rawSocial.phone || "+62 822 1137 6074",
    ...rawSocial,
    heroProof: isLegacyProof ? DEFAULT_HERO_PROOF : existingProof.map(cleanStr),
    experience: cleanStr(isLegacyExperience ? UPGRADED_EXPERIENCE : rawExperience),
    education: typeof rawSocial.education === "string" ? cleanStr(rawSocial.education) : rawSocial.education,
    certifications:
      typeof rawSocial.certifications === "string" ? cleanStr(rawSocial.certifications) : rawSocial.certifications,
  };

  return {
    ...base,
    title: isLegacyTitle ? UPGRADED_TITLE : cleanStr(base.title),
    bio: isLegacyBio ? UPGRADED_BIO : cleanStr(base.bio),
    resume_url: base.resume_url || "/CV_Muhammad_Wyzer.pdf",
    skills: isLegacySkills ? DEFAULT_SKILLS : base.skills,
    social_links: upgradedSocial,
  };
}

export const FLAGSHIP_PROJECT_ENTRIES: FlagshipProjectEntry[] = [
  {
    matchTitles: ["workforceos"],
    project: {
      id: "workforceos",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "WorkForceOS",
      subtitle: "Enterprise Workforce Scheduling & Risk Intelligence Platform",
      description:
        "Modular monolith REST API platform for shift-based organizations centralizing scheduling, attendance corrections, leave/overtime/swap approvals, shift handovers, audit logging, and a hybrid Heuristic + LLM Workforce Risk Intelligence Engine.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/WorkForceOS",
      youtube_url: null,
      technologies: [
        "Java 21",
        "Spring Boot 3",
        "PostgreSQL",
        "Flyway",
        "Angular 16",
        "TypeScript",
        "JUnit 5",
        "Docker",
      ],
      featured: true,
      order: 1,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Organizations with shift-based employees struggle with fragmented roster management, midnight/cross-timezone shift handovers, manual overtime approvals, and undetected operational fatigue or compliance risks.",
        solution:
          "Built a Java 21 / Spring Boot 3 modular monolith and Angular 16 frontend that centralizes shift templates, roster publishing, attendance tracking, multi-stage approvals, shift handovers, and an automated Workforce Risk Intelligence Pipeline.",
        architecture: "",
        architectureDiagram: `[Angular 16 Client (Workforce & Risk Dashboards)]
                 |
                 v  (HTTPS / Bearer JWT)
[Spring Boot 3 / Java 21 Modular Monolith]
  |-- Auth & Security Filter (/api/v1/auth)
  |-- Scheduling & Roster Engine (Templates, Assignments, Publish)
  |-- Attendance & Approval State Machines (Leave, Overtime, Swap)
  |-- Shift Handover Workflow (Create -> Submit -> Acknowledge)
  +-- Workforce Risk Intelligence Pipeline
        |-- Deterministic Heuristic Risk Engine
        |-- LLM Risk Analyzer & Recommendation Generator
        +-- Flyway / PostgreSQL Persistence (Assessments & Alerts)`,
        highlights: [
          "Architected a Spring Boot 3 / Java 21 modular monolith covering employees, shift rosters, attendance corrections, leave/overtime/swap requests, and shift handovers.",
          "Engineered a Workforce Risk Intelligence Pipeline combining deterministic heuristic rules with LLM analysis to persist risk assessments and trigger alerts.",
          "Wrote 89 automated JUnit 5 and Spring Boot test files verifying domain invariants, security filters, approval state machines, and cross-shift edge cases.",
        ],
        capabilities: {
          fullStackEngineering: ["Angular 16 Dashboards", "JWT Role-Based UI", "REST API Integration"],
          backendData: ["Java 21", "Spring Boot 3", "PostgreSQL", "Flyway Migrations"],
          aiEngineering: ["Heuristic + LLM Risk Engine", "Automated Operational Recommendations"],
          deliveryQuality: ["89 Automated Test Files", "JUnit 5 & Spring Test", "Docker Multi-Stage Build"],
        },
        engineeringDecisions: [
          {
            problem: "Pure LLM risk evaluation can be non-deterministic and slow on large shift rosters.",
            decision: "Hybrid Heuristic + LLM Risk Pipeline",
            reason: "Deterministic heuristic rules catch hard compliance/overtime violations instantaneously while LLM analysis enriches root-cause recommendations.",
          },
          {
            problem: "Microservices overhead for tightly coupled scheduling, attendance, and handover domains.",
            decision: "Spring Boot 3 Modular Monolith",
            reason: "Enforces strict package boundaries and fast in-process transactions while keeping deployment and testing reproducible in Docker.",
          },
        ],
        contribution: [
          "Designed domain models, REST API controllers, and JWT security filters in Java 21.",
          "Implemented the Workforce Risk Intelligence Pipeline and Flyway PostgreSQL schema migrations.",
          "Authored 89 unit and integration test suites across domain, service, and controller layers.",
        ],
        metrics: ["411 Source Files", "89 Automated Test Files", "3 Docker Configs", "Java 21 + Spring Boot 3"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["nautical erp", "nautica_erp"],
    project: {
      id: "nautica-erp",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "Nautical ERP (nautica_erp)",
      subtitle: "Autonomous Maritime Operations & Voyage Clearance Engine",
      description:
        "Commercial shipping ERP automating SOLAS, STCW 2010, and MARPOL compliance checks through a Deterministic Maritime Clearance Engine paired with a Google Gemini AI Maritime Superintendent Agent.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/nautica_erp",
      youtube_url: null,
      technologies: [
        "Python 3",
        "FastAPI",
        "Async SQLAlchemy 2.0",
        "PostgreSQL",
        "TypeScript",
        "Google Gemini SDK",
        "pytest",
        "Docker",
      ],
      featured: true,
      order: 2,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Before a commercial vessel can cast off (Port Clearance), Technical Superintendents must manually audit dozens of SOLAS hull/engine defect logs, STCW 2010 crew certificates, and MARPOL bunker fuel reserves.",
        solution:
          "Engineered an async FastAPI + PostgreSQL platform featuring a Deterministic Maritime Clearance Engine that mathematically verifies fuel buffers, crew manning tables, and critical defects before generating an AI Superintendent audit report.",
        architecture: "",
        architectureDiagram: `[Web / API Client]
        |
        v  (HTTP / JSON)
[FastAPI Application (Async Python 3)]
  |-- Routers: Vessels, Crew, Voyages, Bunker, Maintenance, AI Agent
  |-- Deterministic Maritime Clearance Engine
  |     |-- Steaming Hours = Distance / Knots
  |     |-- Safe Fuel = Base Fuel * 1.15 (15% Reserve Buffer)
  |     |-- STCW 2010 Expiry & Minimum Manning Verification
  |     +-- SOLAS Critical PMS Defect Screening
  +-- AI Maritime Superintendent Agent (google-genai SDK)
        |
        v
[PostgreSQL (Async SQLAlchemy 2.0)]`,
        highlights: [
          "Built a Deterministic Maritime Clearance Engine enforcing SOLAS, STCW 2010, and MARPOL regulations prior to vessel departure.",
          "Implemented mathematical verifiers for steaming hours, mandatory 15% safe reserve bunker fuel buffer, VLSFO/MGO burn-rate anomalies, and crew certification expiry.",
          "Integrated Google Gemini SDK for structured Multi-Factor Voyage Clearance Audit reports backed by 17 pytest suites.",
        ],
        capabilities: {
          fullStackEngineering: ["TypeScript Frontend", "RESTful OpenAPI Schema"],
          backendData: ["FastAPI", "Async SQLAlchemy 2.0", "PostgreSQL"],
          aiEngineering: ["Deterministic Rule Engine + Gemini Agent", "Multi-Factor Compliance Audit"],
          deliveryQuality: ["17 Automated Test Files", "pytest Async Suite", "Dockerized Stack"],
        },
        engineeringDecisions: [
          {
            problem: "Safety-critical maritime clearance cannot rely solely on probabilistic LLM outputs.",
            decision: "Deterministic Clearance Engine Before LLM Synthesis",
            reason: "Hard mathematical and regulatory checks (15% fuel reserve, STCW expiry, SOLAS defects) are computed deterministically first; the AI agent only synthesizes verified facts.",
          },
          {
            problem: "Concurrent multi-table queries across vessels, crew, bunker logs, and maintenance tickets.",
            decision: "Async SQLAlchemy 2.0 with PostgreSQL",
            reason: "Provides non-blocking database I/O and strict transactional integrity during voyage clearance audits.",
          },
        ],
        contribution: [
          "Designed the maritime domain schema covering Vessels, Crew STCW Certificates, Voyages, Bunker Logs, and PMS Defects.",
          "Implemented the deterministic SOLAS/STCW/MARPOL clearance algorithms and pytest verification suite.",
        ],
        metrics: ["119 Source Files", "17 Automated Test Files", "3 Docker Configs", "SOLAS / STCW / MARPOL Engine"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["fihos", "go-react-fihos"],
    project: {
      id: "fihos",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "FIHOS (go-react-fihos)",
      subtitle: "Multi-Tenant Wi-Fi Hotspot Billing & Network Operating System",
      description:
        "Production-oriented 6-container platform (Go/Gin backend, background workers, React/Vite frontend, PostgreSQL 17, Redis 7) for managing multi-tenant Wi-Fi hotspots, MikroTik routers, vouchers, customer wallets, and bandwidth rate boosts.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/go-react-fihos",
      youtube_url: null,
      technologies: [
        "Go (Golang)",
        "Gin",
        "React 18",
        "TypeScript",
        "PostgreSQL 17",
        "Redis 7",
        "golang-migrate",
        "Docker Compose",
      ],
      featured: true,
      order: 3,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Internet cafes, coffee shops, and neighborhood ISPs need a single multi-tenant platform to synchronize MikroTik routers, issue voucher batches, bill monthly subscribers, schedule temporary speed boosts, and detect abnormal traffic.",
        solution:
          "Architected a 6-service containerized Go + React system featuring dedicated background workers for router synchronization, rate-boost window reconciliation, HMAC-signed payment webhooks, and traffic anomaly alerting.",
        architecture: "",
        architectureDiagram: `[React/Vite Web UI (nginx :8081)] ---> [Go/Gin API Server (:8080)]
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
                     v                        v                        v
        [PostgreSQL 17 (:55432)]      [Redis 7 (:6380)]       [Go Background Worker]
        (Multi-Tenant Data &          (Session Store &        (MikroTik REST Sync,
         golang-migrate)               Rate Cache)             Billing, Anomaly Engine)`,
        highlights: [
          "Engineered a 6-container Docker Compose architecture (web, api, worker, migrate, postgres 17, redis 7) with strict X-Tenant-Id multi-tenant isolation.",
          "Built concurrent Go background workers for MikroTik REST router sync/probing (with deterministic simulate mode), scheduled bandwidth rate boosts, and session reconciliation.",
          "Implemented customer wallets, monthly billing window generation, HMAC-signed payment webhooks, and an automated traffic anomaly detection engine.",
        ],
        capabilities: {
          fullStackEngineering: ["React 18 + Vite SPA", "Nginx Reverse Proxy", "Multi-Tenant RBAC"],
          backendData: ["Go (Gin)", "PostgreSQL 17", "Redis 7", "golang-migrate"],
          aiEngineering: ["Traffic Anomaly Detection Engine", "Automated Usage Rollups & Alerts"],
          deliveryQuality: ["18 Automated Test Files", "Deterministic Router Simulation Mode", "6-Service Docker Stack"],
        },
        engineeringDecisions: [
          {
            problem: "Testing router synchronization and bandwidth rate-boost reconciliation without physical MikroTik hardware.",
            decision: "Pluggable Router Transport with Deterministic Simulate Mode",
            reason: "Allows unit, integration, and E2E tests to deterministically verify router state reconciliation offline while supporting real MikroTik REST transport in production.",
          },
          {
            problem: "Periodic router probing, billing window generation, and anomaly rollups blocking HTTP API latency.",
            decision: "Dedicated Go Background Worker Container",
            reason: "Separates latency-sensitive HTTP/WebSocket API traffic from scheduled background reconciliation jobs.",
          },
        ],
        contribution: [
          "Built the Go/Gin API, background worker routines, database migrations, and React dashboard.",
          "Implemented HMAC-signed webhook verification and 18 unit/integration/E2E test files.",
        ],
        metrics: ["140 Source Files", "18 Automated Test Files", "6 Docker Services", "Go + PostgreSQL 17 + Redis 7"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["propertyhub", "golang-next-property-listings"],
    project: {
      id: "propertyhub",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "PropertyHub",
      subtitle: "Multi-Tenant Property Listing Marketplace (Go 1.25 & Kafka)",
      description:
        "Enterprise multi-tenant property marketplace for real estate agencies, banks, and corporate asset owners across Indonesia featuring 4-tier RBAC, multi-stage listing review workflows, Kafka event streaming, and audit logging.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/golang-next-property-listings",
      youtube_url: null,
      technologies: [
        "Go 1.25",
        "Gin",
        "GORM",
        "PostgreSQL 16",
        "Apache Kafka 3.9",
        "React 18",
        "TypeScript",
        "Docker",
        "GitHub Actions",
        "Playwright",
        "k6",
      ],
      featured: true,
      order: 4,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Property agencies, banks managing foreclosed assets, and corporate property owners need a unified multi-tenant SaaS marketplace with strict data isolation, structured listing verification, and full audit trails.",
        solution:
          "Built a containerized Go 1.25 and React 18 platform backed by PostgreSQL 16 and Apache Kafka 3.9, implementing 4-tier RBAC, deterministic listing approval state machines, and automated CI/CD verification.",
        architecture: "",
        architectureDiagram: `[React 18 + TypeScript Client]
              |
              v  (REST API / JWT + RBAC)
[Go 1.25 + Gin Backend Service]
  |-- Multi-Tenant Isolation & 4-Tier RBAC (Platform Admin, Tenant Admin, Salesman, Buyer)
  |-- Listing Review State Machine (Draft -> Pending Review -> Approved / Rejected)
  |-- Immutable Audit Log Service
  +-- Event Producer/Consumer ---> [Apache Kafka 3.9]
              |
              v
      [PostgreSQL 16]`,
        highlights: [
          "Architected a multi-tenant Go 1.25 backend enforcing strict tenant boundaries across Platform Admin, Tenant Admin, Salesman, and Buyer roles.",
          "Implemented a deterministic listing review state machine (Draft -> Pending Review -> Approved/Rejected) with immutable audit logs.",
          "Integrated Apache Kafka 3.9 for asynchronous domain events, 7 Docker configurations, k6 load testing, and 17 automated test files.",
        ],
        capabilities: {
          fullStackEngineering: ["React 18 + TypeScript", "Role-Specific Dashboards", "Multi-Step Listing Workflows"],
          backendData: ["Go 1.25 + Gin + GORM", "PostgreSQL 16", "Apache Kafka 3.9"],
          aiEngineering: ["Automated Audit Trail & Activity Correlation"],
          deliveryQuality: ["17 Automated Test Files", "Playwright E2E & k6 Load Tests", "GitHub Actions CI/CD"],
        },
        engineeringDecisions: [
          {
            problem: "Preventing unverified or cross-tenant property listings from appearing on the public marketplace.",
            decision: "Strict State Machine + Tenant-Scoped Middleware",
            reason: "Every listing transition is validated against role permissions and tenant ownership before state mutation and audit logging.",
          },
          {
            problem: "Decoupling audit logging and notification triggers from core listing CRUD latency.",
            decision: "Apache Kafka 3.9 Event Streaming",
            reason: "Publishes listing lifecycle and tenant events asynchronously for high throughput under load.",
          },
        ],
        contribution: [
          "Designed the Go 1.25 backend architecture, PostgreSQL schema, Kafka integration, and React 18 frontend.",
          "Configured 7 Docker environments, GitHub Actions CI/CD pipelines, Playwright E2E tests, and k6 load scripts.",
        ],
        metrics: ["157 Source Files", "17 Automated Test Files", "7 Docker Configs", "Go 1.25 + Kafka 3.9"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["talentmatch ai", "talentmatch-ai---flask---reactjs"],
    project: {
      id: "talentmatch-ai",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "TalentMatch AI",
      subtitle: "Explainable Resume Screening & IR Evaluation Pipeline",
      description:
        "End-to-end AI recruitment platform turning resumes and job descriptions into explainable, measurable hiring decisions using a weighted multi-signal hybrid scoring pipeline benchmarked with NDCG and MRR metrics.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/TalentMatch-AI---Flask---ReactJS",
      youtube_url: null,
      technologies: [
        "Python 3.11",
        "Flask 3",
        "React 18",
        "TypeScript 5.3",
        "Vector Embeddings",
        "OpenAI / Anthropic",
        "pytest",
        "Docker",
        "GitHub Actions",
      ],
      featured: true,
      order: 5,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Candidate screening is often driven by subjective gut feel or brittle keyword filters that provide no explainability, skill-gap breakdown, or quantitative ranking evaluation.",
        solution:
          "Engineered a Python 3.11 (Flask 3) and React 18 platform with a dual-provider LLM extraction layer, vector semantic search, weighted multi-signal hybrid scoring, and Information Retrieval (NDCG, MRR) benchmarking.",
        architecture: "",
        architectureDiagram: `[Resume Upload / Job Spec]
            |
            v
[Dual-Provider LLM Layer (OpenAI + Anthropic Fallback)]
            |
            v
[Vector Embeddings + Semantic Search] ---> [Weighted Hybrid Scoring Engine]
                                             |-- 38% Skills Match
                                             |-- 24% Semantic Similarity
                                             +-- 38% Experience, Education, Domain
                                                        |
                                                        v
                                    [Explainable Ranking + IR Eval (NDCG, MRR)]`,
        highlights: [
          "Built a weighted multi-signal scoring pipeline (38% skills, 24% semantic vector similarity, experience, education, projects, domain fit) with plain-language justification.",
          "Implemented a dual-provider LLM abstraction layer (OpenAI + Anthropic) with automatic failover and zero vendor lock-in.",
          "Created an Information Retrieval (IR) evaluation suite computing NDCG and MRR metrics across 27 automated test files.",
        ],
        capabilities: {
          fullStackEngineering: ["React 18 + TypeScript 5.3", "Interactive Candidate Ranking UI"],
          backendData: ["Python 3.11 + Flask 3", "Vector Embeddings & Semantic Search"],
          aiEngineering: ["Hybrid Multi-Signal Scoring", "Dual-Provider LLM Failover", "IR Metrics (NDCG, MRR)"],
          deliveryQuality: ["27 Automated Test Files", "6 Docker Configs", "GitHub Actions CI/CD"],
        },
        engineeringDecisions: [
          {
            problem: "Pure vector similarity often ranks generalist resumes above candidates with exact required technical skills.",
            decision: "Weighted Multi-Signal Hybrid Scoring (38% Skills + 24% Semantic + 38% Metadata)",
            reason: "Combines exact skill-graph matching with semantic context, verified quantitatively using NDCG and MRR ranking metrics.",
          },
          {
            problem: "Single LLM API outages or rate limits breaking resume ingestion pipelines.",
            decision: "Dual-Provider Abstraction with Automatic Fallback",
            reason: "Seamlessly switches between OpenAI and Anthropic providers while enforcing identical structured output schemas.",
          },
        ],
        contribution: [
          "Designed and built the full-stack platform, hybrid scoring engine, dual-LLM layer, and IR evaluation benchmark.",
          "Wrote 27 automated test suites and containerized the application with 6 Docker configurations and CI/CD.",
        ],
        metrics: ["145 Source Files", "27 Automated Test Files", "6 Docker Configs", "NDCG & MRR Evaluated"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["shipping ops agent", "shipping-ops-agent"],
    project: {
      id: "shipping-ops-agent",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "Shipping Ops Agent",
      subtitle: "Multi-Agent Maritime Logistics & Deterministic Data Reconciliation",
      description:
        "LangGraph multi-agent system (1 Coordinator + 6 Specialist Agents) with FastAPI and Next.js addressing 91 real-world shipping operations pain points, including ISO 6346 container check-digit verification and manifest reconciliation.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/shipping-ops-agent",
      youtube_url: null,
      technologies: [
        "Python 3",
        "FastAPI",
        "LangGraph",
        "Next.js",
        "TypeScript",
        "Pandas",
        "pytest",
      ],
      featured: true,
      order: 6,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Shipping operations staff handle heterogeneous Excel manifests, stacking lists, vendor invoices, and schedule updates manually, leading to container mismatches, duplicate invoices, and missed CY closing deadlines.",
        solution:
          "Built a 1-Coordinator + 6-Specialist LangGraph system (Reconciliation, Data Input, Reporting, Email Triage, Tariff, Schedule) that parses operational files into deterministic review items gated by human-in-the-loop approval.",
        architecture: "",
        architectureDiagram: `[Request + Uploaded Files (.xlsx, .csv, .eml)]
                      |
                      v
        [Coordinator Agent (Router)]
                      |
                      v
  [6 Specialist Agents (Deterministic + LLM)]
   |-- Rekonsiliasi (Manifest vs Stacking List, ISO 6346 Check Digit)
   |-- Input Data (Fuzzy Vendor Match, Duplicate/Swapped Invoices)
   |-- Jadwal (ETD Shift, CY Closing Recalculation, Roll Proposal)
   +-- Laporan / Email / Tarif
                      |
                      v
     [LangGraph Interrupt (Human Review Gate)]
                      |
                      v
     [Finalize: Validated Excel / CSV / .eml Outputs + Audit Log]`,
        highlights: [
          "Designed a 1-Coordinator + 6-Specialist Agent contract addressing 91 surveyed shipping operations pain points.",
          "Implemented deterministic maritime verifiers: ISO 6346 container check-digit calculation, look-alike container ID detection, weight/POD/seal cross-checking, and fuzzy vendor invoice matching.",
          "Enforced safety via LangGraph human-in-the-loop interrupts so no accounting CSV or customer notice is emitted without per-item human approval.",
        ],
        capabilities: {
          fullStackEngineering: ["Next.js + TypeScript Dashboard", "Schema-Generated API Types"],
          backendData: ["Python 3 + FastAPI", "Multi-Layout Excel/CSV/EML Parsers"],
          aiEngineering: ["LangGraph Multi-Agent Orchestration", "Human-in-the-Loop Interrupt Gates"],
          deliveryQuality: ["9 Automated Test Files", "Deterministic ISO 6346 & Invoice Verifiers"],
        },
        engineeringDecisions: [
          {
            problem: "Autonomous agents writing directly to accounting imports or sending liner emails can propagate costly errors.",
            decision: "Mandatory LangGraph Interrupt Before Finalize()",
            reason: "Separates analysis (producing structured ReviewItems) from execution (writing approved items only + immutable audit log).",
          },
          {
            problem: "Detecting typos in 11-character shipping container numbers across manifest and stacking spreadsheets.",
            decision: "Deterministic ISO 6346 Check-Digit & Look-Alike Verifier",
            reason: "Uses exact modulo-11 positional weighting rather than LLM guessing to flag invalid container IDs with 100% precision.",
          },
        ],
        contribution: [
          "Translated 91 shipping staff survey pain points into 6 specialist agent workflows and deterministic data validators.",
          "Built the FastAPI backend, LangGraph state machines, Next.js review UI, and pytest verification suite.",
        ],
        metrics: ["62 Source Files", "9 Automated Test Files", "7 Specialized Agents", "91 Pain Points Solved"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["lms mahasiswa", "vue-lms-mahasiswa"],
    project: {
      id: "lms-mahasiswa",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "LMS Mahasiswa",
      subtitle: "Full-Stack Academic Learning Management System (Nuxt 4 & Supabase)",
      description:
        "Centralized Learning Management System built with Nuxt 4, Vue 3, TypeScript, Pinia, and Supabase supporting Student, Instructor, and Administrator workflows with 50 automated Vitest and Playwright test files.",
      image_url: null,
      live_url: "https://nuxt-lms-mahasiswa.vercel.app",
      github_url: "https://github.com/mwyzer/vue-lms-mahasiswa",
      youtube_url: null,
      technologies: [
        "Nuxt 4",
        "Vue 3",
        "TypeScript",
        "Pinia",
        "Supabase",
        "PostgreSQL",
        "Nitro",
        "Vitest",
        "Playwright",
      ],
      featured: false,
      order: 7,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "University course materials, assignments, attendance records, and grades are often fragmented across multiple platforms, causing students to miss deadlines and instructors to lose visibility into learning progress.",
        solution:
          "Built a unified Nuxt 4 + Vue 3 + Supabase platform implementing role-based dashboards for Students, Instructors, and Administrators, complete with interactive quizzes, AI study assistant, and Python playground.",
        architecture: "",
        architectureDiagram: `[Nuxt 4 + Vue 3 + TypeScript Client (PWA)]
  |-- Pinia State Stores (Auth, Courses, Assignments, Quizzes)
  |-- Role Guards (Student / Instructor / Administrator)
  +-- Nitro Server Routes & API Middleware
              |
              v
[Supabase Backend (PostgreSQL + Row-Level Security + Auth)]`,
        highlights: [
          "Implemented 3 complete role workflows (Student, Instructor, Administrator) backed by Supabase Auth and PostgreSQL Row-Level Security (RLS).",
          "Built course material modules, assignment submission tracking, interactive quizzes, attendance logging, and an embedded Python playground.",
          "Wrote 50 automated unit, component, and E2E test files using Vitest and Playwright.",
        ],
        capabilities: {
          fullStackEngineering: ["Nuxt 4 + Vue 3", "TypeScript", "Pinia State Management", "PWA Support"],
          backendData: ["Supabase Auth", "PostgreSQL Row-Level Security", "Nitro Server API"],
          aiEngineering: ["Embedded AI Study Assistant", "In-Browser Python Playground"],
          deliveryQuality: ["50 Automated Test Files", "Vitest Unit Tests", "Playwright E2E Suite"],
        },
        engineeringDecisions: [
          {
            problem: "Ensuring strict data isolation between students, instructors, and administrators in a BaaS architecture.",
            decision: "PostgreSQL Row-Level Security (RLS) + Nuxt Route Middleware",
            reason: "Enforces authorization at both the database engine level and client/SSR navigation layer.",
          },
        ],
        contribution: [
          "Architected the Nuxt 4 application, Pinia stores, Supabase schema, and 50 automated test files.",
        ],
        metrics: ["211 Source Files", "50 Automated Test Files", "3 Role Dashboards"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["acadio"],
    project: {
      id: "acadio",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "Acadio",
      subtitle: "University Academic Information System (Go Gin & React TypeScript)",
      description:
        "Modern Academic Information System (SIAKAD) built with Go (Gin + GORM), PostgreSQL, and React 18 TypeScript featuring clean architecture, JWT authentication, RBAC, and Dockerized deployment.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/acadio",
      youtube_url: null,
      technologies: [
        "Go (Golang)",
        "Gin",
        "GORM",
        "PostgreSQL",
        "React 18",
        "TypeScript",
        "Tailwind CSS",
        "Docker",
      ],
      featured: false,
      order: 8,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Legacy campus academic portals suffer from slow query performance during course enrollment (KRS) periods and tightly coupled monolithic codebases.",
        solution:
          "Engineered a clean-architecture Go (Gin + GORM) backend and React 18 TypeScript frontend with strict handler/repository separation, JWT RBAC middleware, and 23 automated test files.",
        architecture: "",
        architectureDiagram: `[React 18 + TypeScript + Vite SPA]
                |
                v  (REST JSON + JWT)
[Go + Gin Backend (Clean Architecture)]
  |-- Middleware (CORS, JWT Auth, Role Guard, Logger)
  |-- Handlers (HTTP Transport Layer)
  |-- Repositories (GORM Data Access Layer)
  +-- PostgreSQL Database + Automated Seeder`,
        highlights: [
          "Structured the Go backend using Clean Architecture (cmd, config, internal/auth, middleware, handlers, repositories, models).",
          "Implemented JWT authentication and Role-Based Access Control (RBAC) across academic management endpoints.",
          "Created 23 automated test files and 3 Docker configurations for reproducible deployment.",
        ],
        capabilities: {
          fullStackEngineering: ["React 18 + TypeScript", "Recharts Analytics", "Tailwind CSS"],
          backendData: ["Go + Gin Framework", "GORM + PostgreSQL", "Database Seeding"],
          aiEngineering: [],
          deliveryQuality: ["23 Automated Test Files", "3 Docker Configs", "Clean Architecture"],
        },
        engineeringDecisions: [
          {
            problem: "Maintaining testability across academic scheduling and grading endpoints.",
            decision: "Repository Pattern with Clean Architecture in Go",
            reason: "Decouples HTTP Gin handlers from GORM database queries, enabling fast unit and integration testing.",
          },
        ],
        contribution: [
          "Built the Go Gin backend, PostgreSQL GORM models, React TypeScript frontend, and 23 test files.",
        ],
        metrics: ["105 Source Files", "23 Automated Test Files", "3 Docker Configs"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["road & building condition analyzers", "penilai-kondisi-jalan", "cek-kondisi-rumah"],
    project: {
      id: "road-condition-analyzer",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "Road & Building Condition Analyzers",
      subtitle: "Bina Marga SDI Pavement & OpenCV Structural Assessment Suite",
      description:
        "Civil engineering inspection suite (Python/Streamlit/OpenCV & Next.js/TypeScript) implementing Bina Marga Surface Distress Index (SDI) calculations, Gaussian kernel smoothing along road stationing, z-score outlier detection, and accelerometer RMS analysis.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/penilai-kondisi-jalan",
      youtube_url: null,
      technologies: [
        "Python 3",
        "OpenCV",
        "NumPy / SciPy",
        "Streamlit",
        "Next.js",
        "TypeScript",
        "pytest",
      ],
      featured: false,
      order: 9,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Field surveys for road pavement distress (Bina Marga SDI method) and residential building damage are manually recorded on paper, prone to calculation errors, and lack spatial smoothing or sensor correlation.",
        solution:
          "Developed two complementary engineering applications (penilai-kondisi-jalan in Python/Streamlit and cek-kondisi-rumah in Next.js/TypeScript/OpenCV) that combine deterministic civil engineering formulas with automated photo/video frame analysis.",
        architecture: "",
        architectureDiagram: `[Multi-Source Field Input]
  |-- Single/Batch JPEG Photos (EXIF GPS Extraction)
  |-- Short Survey Videos (Sharpest-Frame Sampling via OpenCV)
  |-- Smartphone Accelerometer CSV (Vertical Vibration RMS)
              |
              v
[Deterministic Civil Engineering Engine]
  |-- Bina Marga SDI Formula (Crack Area/Width, Potholes, Rutting)
  |-- Gaussian Kernel Smoothing along Stationing (STA)
  |-- Statistical Outlier Detection (|z| > 2 & 95% CI)
  +-- 8-Component Weighted Building Condition Index & Cost Estimator`,
        highlights: [
          "Implemented deterministic Bina Marga Surface Distress Index (SDI) computation from crack area, crack width, pothole count, and wheel rutting depth.",
          "Engineered video sharp-frame extraction (Laplacian variance), Gaussian kernel smoothing along road stationing (STA), and z-score anomaly detection (|z| > 2).",
          "Built smartphone accelerometer vertical vibration RMS processing and EXIF GPS coordinate mapping across 96 files and 13 automated test files.",
        ],
        capabilities: {
          fullStackEngineering: ["Next.js + TypeScript Web App", "Streamlit Interactive Engineering Workbench"],
          backendData: ["Python 3 + OpenCV", "CSV / GeoJSON Spatial Import & Export", "EXIF GPS Parsing"],
          aiEngineering: ["Multimodal Vision Defect Detection", "Gaussian Smoothing & Z-Score Outlier Analysis"],
          deliveryQuality: ["13 Automated Test Files", "Offline Manual + AI Hybrid Mode"],
        },
        engineeringDecisions: [
          {
            problem: "Frame-by-frame noise when assessing road segments from moving survey videos.",
            decision: "Sharpest-Frame Selection + Mean/Median/Max Aggregation + Gaussian STA Smoothing",
            reason: "Averages crack area, takes median crack width/rutting, and takes max potholes across sharp frames before applying Gaussian smoothing along stationing.",
          },
        ],
        contribution: [
          "Implemented the Bina Marga SDI calculator, OpenCV image/video analyzers, accelerometer RMS processor, and test suites.",
        ],
        metrics: ["96 Source Files", "13 Automated Test Files", "Bina Marga SDI + OpenCV"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["forecast product", "bread forecast", "bread-forecasting"],
    project: {
      id: "bread-forecast",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "Bread Forecast",
      subtitle: "Automated Bakery Dropping & Return-Risk Estimation System",
      description:
        "High-volume data validation and demand estimation web application processing 21,763+ D9017F Excel rows across 105 outlets and 46 products to classify return risk and optimize distribution quantities.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/bread-forecasting",
      youtube_url: null,
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "XLSX Parser",
      ],
      featured: false,
      order: 10,
      category: "work",
      views: 0,
      case_study: {
        problem:
          "Manual bread dropping estimation using spreadsheet formulas across 105 retail outlets was slow, error-prone, and failed to flag high return-risk outlets in time.",
        solution:
          "Built a Next.js + TypeScript analytical application that parses D9017F Excel files client-side, validates 21,763+ rows instantaneously, classifies outlet return risk (Low, Medium, High), and exports weekly/detailed distribution plans.",
        architecture: "",
        architectureDiagram: `[D9017F Excel Upload (21,763+ Rows)]
                |
                v
[Client-Side TypeScript Validation & Parsing Engine]
  |-- Multi-Dimensional Filtering (Dropping Day, Week Invoice, Invoice Day)
  |-- Return-Rate & Risk Classifier (Low / Medium / High)
  |-- Configurable Threshold & Multiplier Formula Engine
                |
                v
[Interactive Dashboard + Weekly/Detailed Excel Exporter]`,
        highlights: [
          "Automated schema validation and parsing of 21,763+ historical transaction rows from D9017F Excel files.",
          "Implemented configurable return-risk thresholds classifying 1,113 forecast entries across 105 outlets and 46 SKUs.",
          "Built one-click Excel export for both Detailed Estimations and Weekly Dropping Schedules.",
        ],
        capabilities: {
          fullStackEngineering: ["Next.js + TypeScript", "Client-Side High-Volume XLSX Processing", "Analytical Charts"],
          backendData: ["21,763+ Row Validation Pipeline", "Configurable Multiplier Formulas"],
          aiEngineering: ["Automated Return-Risk Classification Engine"],
          deliveryQuality: ["Zero-Latency Browser Processing", "Automated Excel Report Generation"],
        },
        engineeringDecisions: [
          {
            problem: "Uploading and round-tripping 20,000+ Excel rows to a serverless backend caused timeouts and latency.",
            decision: "In-Memory Client-Side Typed Processing Pipeline",
            reason: "Processes and validates all 21,763 rows directly in the browser in milliseconds with instant threshold recalculation.",
          },
        ],
        contribution: [
          "Designed the forecasting formula engine, D9017F parser, risk classification dashboard, and Excel export module.",
        ],
        metrics: ["21,763 Validated Rows", "105 Retail Outlets", "46 Products", "1,113 Forecast Outputs"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
  {
    matchTitles: ["modernhub"],
    project: {
      id: "modernhub",
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      title: "ModernHub - Team Work & Project Management Platform",
      subtitle: "Role-Based Project, Task & Activity Audit Management System",
      description:
        "Role-based work management platform built with CodeIgniter 4, PHP 8.2, and MySQL 8 enabling organizations to assign, track, and audit employee tasks across projects with recoverable soft deletion and REST API endpoints.",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/modernhub",
      youtube_url: null,
      technologies: [
        "CodeIgniter 4",
        "PHP 8.2+",
        "MySQL 8",
        "Tailwind CSS",
        "Docker",
        "PHPUnit",
      ],
      featured: false,
      order: 11,
      category: "personal",
      views: 0,
      case_study: {
        problem:
          "Organizations lacked visibility into employee workload and overdue tasks due to manual task tracking and missing activity audit trails.",
        solution:
          "Built a CodeIgniter 4 + MySQL 8 platform with Admin, Manager, and Member role boundaries, task workflow deadlines, activity audit logging, and recoverable soft deletion.",
        architecture: "",
        architectureDiagram: `[Role-Aware Web UI / REST API Client]
                 |
                 v
[CodeIgniter 4 (PHP 8.2+) Application]
  |-- Role Guards (Admin / Manager / Member)
  |-- Project & Task Workflow Engine
  |-- Activity Audit Trail & Soft-Delete Recovery
                 |
                 v
          [MySQL 8 Database]`,
        highlights: [
          "Implemented 3-tier role-based access control (Admin, Manager, Member) for project and task lifecycle management.",
          "Engineered an immutable activity audit trail and recoverable soft-deletion workflow backed by MySQL 8 and PHPUnit tests.",
        ],
        capabilities: {
          fullStackEngineering: ["CodeIgniter 4 MVC", "Tailwind CSS Dashboards", "REST API"],
          backendData: ["PHP 8.2+", "MySQL 8", "Activity Audit Logging"],
          aiEngineering: [],
          deliveryQuality: ["PHPUnit Test Suite", "Dockerized Environment"],
        },
        engineeringDecisions: [
          {
            problem: "Accidental deletion of active project tasks losing historical work records.",
            decision: "Recoverable Soft Deletion + Activity Audit Log",
            reason: "Preserves referential integrity and full accountability across all project mutations.",
          },
        ],
        contribution: [
          "Designed the relational schema, RBAC filters, task workflow controllers, and PHPUnit tests.",
        ],
        metrics: ["3 Role Tiers", "REST API + MVC", "Docker + PHPUnit"],
      } satisfies CaseStudy as unknown as PortfolioProject["case_study"],
    },
  },
];

function sanitizeProjectCopy(project: PortfolioProject): PortfolioProject {
  return {
    ...project,
    title: project.title.replace(/—/g, "-"),
    subtitle: project.subtitle ? project.subtitle.replace(/—/g, "-") : project.subtitle,
    description: project.description ? project.description.replace(/—/g, "-") : project.description,
  };
}

function enrichExistingProject(dbProj: PortfolioProject, flagship: PortfolioProject): PortfolioProject {
  const existingCs = (dbProj.case_study as CaseStudy | null) ?? null;
  const flagshipCs = flagship.case_study as unknown as CaseStudy;

  const mergedCs: CaseStudy = existingCs
    ? {
        ...flagshipCs,
        ...existingCs,
        problem: existingCs.problem || flagshipCs.problem,
        solution: existingCs.solution || flagshipCs.solution,
        highlights: existingCs.highlights?.length ? existingCs.highlights : flagshipCs.highlights,
        architectureDiagram: existingCs.architectureDiagram || flagshipCs.architectureDiagram,
        engineeringDecisions: existingCs.engineeringDecisions?.length
          ? existingCs.engineeringDecisions
          : flagshipCs.engineeringDecisions,
        contribution: existingCs.contribution?.length ? existingCs.contribution : flagshipCs.contribution,
        metrics: existingCs.metrics?.length ? existingCs.metrics : flagshipCs.metrics,
        capabilities:
          existingCs.capabilities &&
          Object.values(existingCs.capabilities).some((arr) => Array.isArray(arr) && arr.length > 0)
            ? existingCs.capabilities
            : flagshipCs.capabilities,
      }
    : flagshipCs;

  const fixedGithubUrl =
    !dbProj.github_url || dbProj.github_url.includes("/99999")
      ? flagship.github_url
      : dbProj.github_url;

  const rawDesc = (dbProj.description || "").trim();
  const useFlagshipDesc = rawDesc.length < 50 || rawDesc.length > 260;

  return sanitizeProjectCopy({
    ...dbProj,
    title: flagship.title || dbProj.title,
    subtitle: dbProj.subtitle || flagship.subtitle,
    description: useFlagshipDesc ? flagship.description : rawDesc,
    github_url: fixedGithubUrl,
    live_url: dbProj.live_url || flagship.live_url,
    technologies: dbProj.technologies?.length ? dbProj.technologies : flagship.technologies,
    featured: flagship.featured,
    order: flagship.order,
    case_study: mergedCs as unknown as PortfolioProject["case_study"],
  });
}

export function mergeWithFlagshipProjects(
  dbProjects: PortfolioProject[] | null | undefined,
  options: { featuredOnly?: boolean; limit?: number } = {}
): PortfolioProject[] {
  const list = [...(dbProjects || [])];
  const matchedFlagshipIds = new Set<string>();

  const enrichedDb = list.map((dbProj) => {
    const lowerTitle = dbProj.title.trim().toLowerCase();
    const entry = FLAGSHIP_PROJECT_ENTRIES.find((e) =>
      e.matchTitles.some((t) => lowerTitle.includes(t))
    );
    if (!entry) {
      return sanitizeProjectCopy({
        ...dbProj,
        order: (dbProj.order ?? 50) + 20,
      });
    }
    matchedFlagshipIds.add(entry.project.id);
    return enrichExistingProject(dbProj, entry.project);
  });

  const missingFlagships = FLAGSHIP_PROJECT_ENTRIES.filter(
    (e) => !matchedFlagshipIds.has(e.project.id)
  ).map((e) => e.project);

  const combined = [...missingFlagships, ...enrichedDb];

  const filtered = options.featuredOnly
    ? combined.filter((p) => p.featured)
    : combined;

  filtered.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const aOrder = a.order ?? 99;
    const bOrder = b.order ?? 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    const aHasCs = Boolean(a.case_study) ? 1 : 0;
    const bHasCs = Boolean(b.case_study) ? 1 : 0;
    return bHasCs - aHasCs;
  });

  return options.limit ? filtered.slice(0, options.limit) : filtered;
}

export function resolveProjectById(
  id: string,
  dbProject: PortfolioProject | null
): PortfolioProject | null {
  if (dbProject) {
    const lowerTitle = dbProject.title.trim().toLowerCase();
    const entry = FLAGSHIP_PROJECT_ENTRIES.find(
      (e) => e.project.id === id || e.matchTitles.some((t) => lowerTitle.includes(t))
    );
    return entry ? enrichExistingProject(dbProject, entry.project) : sanitizeProjectCopy(dbProject);
  }

  const bySlug = FLAGSHIP_PROJECT_ENTRIES.find((e) => e.project.id === id);
  return bySlug ? bySlug.project : null;
}
