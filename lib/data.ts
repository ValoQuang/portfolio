export const profile = {
  name: "Quang Truong Ngoc",
  shortName: "Quang",
  location: "Espoo, Finland",
  email: "qtruongngoc95@gmail.com",
  phone: "+358 40 643 3423",
  linkedin: "https://linkedin.com/in/quang-truong-07b150215",
  github: "https://github.com/ValoQuang",
  role: "Backend Engineer, Payments",
  yearsExperience: 5,
  manifesto:
    "Vietnamese-Finnish engineer who owns the payment layer of a multi-market iGaming platform: 34 provider integrations, idempotent callbacks, row-locked state machines, and a Claude-based agent harness the team codes with every day. Frontend and 3D roots, backend by choice.",
};

export type Chapter = {
  id: string;
  index: number;
  company: string;
  role: string;
  city: string;
  period: string;
  size: number;
  summary: string;
  beats: string[];
};

export const chapters: Chapter[] = [
  {
    id: "s5tech",
    index: 0,
    company: "S5Tech LTD",
    role: "Backend Engineer, Funding Module Owner",
    city: "Singapore — Remote",
    period: "Jun 2024 — Present",
    size: 1.05,
    summary:
      "Code owner of the funding module of a multi-brand iGaming platform: 270+ merged PRs, 34 payment-provider integrations across 13 markets, and the AI harness the backend team ships with.",
    beats: [
      "Built 34 payment-provider integrations (bank transfer, QR native, e-wallet, payout) across TH, BR, MX, CO, PE, PH, PK, BD, ID, MY and more, each with its own RSA / AES / MD5 / SHA-256 signing scheme.",
      "Designed the Funding Profile and Funding Group system: payment methods, limits and bank lists configured per brand and market from DB and TOML, no deploy needed.",
      "Hardened the transaction pipeline: per-transaction mutex, SELECT … FOR UPDATE stale-write guard, idempotent provider callbacks, auto-reversal on provider error, error-code classification. Closed a double-credit race in production.",
      "Built withdraw retry-as-new-order and proxy-to-provider flows, with real-time status pushed to player and back office over Redis Pub/Sub and WebSockets.",
      "Integrated game providers end to end: Pragmatic Play Direct, Nextspin, Evolution (retry mechanism), Fa Chai, Tada.",
      "Built a Claude-based ops agent for the team: scans the ops channel for stale TechOps threads, drafts the daily report from Slack and git, runs a pre-deploy migration check on the funding module.",
      "Wrote the AI harness for the backend repo: CLAUDE.md, per-domain convention docs, and five Claude Code skills covering ticket → spec → implement → PR and payment-incident analysis. Spec approved before any code is written.",
      "Earlier: shipped the CRM back-office (React, Material UI, Redux Toolkit) and the player portal, then moved to backend and took ownership of the module.",
    ],
  },
  {
    id: "sayduck",
    index: 1,
    company: "Sayduck Oy",
    role: "Frontend Engineer",
    city: "Espoo, Finland",
    period: "Mar 2022 — Jun 2024",
    size: 0.85,
    summary:
      "Migrated a JavaScript codebase to TypeScript and built an interactive 3D product configurator with Three.js and the HTML5 Canvas API.",
    beats: [
      "Authored an internal Three.js SDK powering client-specific product customization and a richer shopping experience.",
      "Tuned API performance via Apollo GraphQL queries and mutations, and maintained reusable UI across the platform.",
      "Migrated state from Zustand to Redux as the surface area outgrew it; built Shopify app foundations.",
      "Career break Jul–Dec 2023: Anti-Air Infantry, Finnish Defence Forces.",
    ],
  },
  {
    id: "integrify",
    index: 2,
    company: "Integrify Oy",
    role: "Junior Frontend Engineer",
    city: "Espoo, Finland",
    period: "Mar 2021 — Mar 2022",
    size: 0.7,
    summary:
      "First professional chapter — Shopify Liquid storefronts and full-stack features on Lino.fi, a second-hand baby-clothes marketplace.",
    beats: [
      "Built and documented Shopify Liquid templates for client storefronts.",
      "Paired with senior engineers on full-stack features and reviews.",
      "Wrote feature documentation that became part of onboarding.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Backend & Payments",
    items: [
      "TypeScript / Node.js",
      "Express",
      "PostgreSQL / Sequelize",
      "Redis / BullMQ",
      "WebSockets",
      "Zod",
      "Payment gateway integration",
      "RSA / AES / HMAC signing",
    ],
  },
  {
    title: "AI Engineering",
    items: [
      "Claude Code skills & agents",
      "MCP servers",
      "Agent harness / CLAUDE.md",
      "Scheduled ops agents",
      "Slack bots",
      "Codex / Cursor",
    ],
  },
  {
    title: "Frontend & Platform",
    items: [
      "React / Next.js",
      "Redux Toolkit",
      "Material UI / Tailwind",
      "Three.js / R3F",
      "Jest",
      "Docker",
      "GitHub Actions CI/CD",
      "AWS S3",
    ],
  },
];

export const education = [
  {
    school: "Integrify Academy Oy",
    place: "Espoo",
    period: "Jul 2020 — Dec 2021",
    track: "Full Stack Development",
  },
  {
    school: "Metropolia UAS",
    place: "Espoo",
    period: "2014 — 2018",
    track: "BEng, Renewable Engineering Technology — Thesis: Wind Energy and its Scalability",
  },
];

export const references = [
  {
    name: "Samuel Hakala",
    role: "Senior Software Engineer — IQM Quantum Computers",
    email: "samuel.hakala@meetiqm.com",
    linkedin: "https://www.linkedin.com/in/samuel-hakala/",
  },
  {
    name: "Steven Khong",
    role: "Chief Tech Officer — S5Tech LTD",
    email: "steven.kh@s5tech.co",
    linkedin: "https://www.linkedin.com/in/steven-khong-codes/",
  },
];
