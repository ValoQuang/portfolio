export const profile = {
  name: "Quang Truong Ngoc",
  shortName: "Quang",
  location: "Espoo, Finland",
  email: "qtruongngoc95@gmail.com",
  phone: "+358 40 643 3423",
  linkedin: "https://linkedin.com/in/quang-truong-07b150215",
  github: "https://github.com/ValoQuang",
  role: "Full Stack Software Engineer",
  yearsExperience: 4,
  manifesto:
    "Vietnamese-Finnish engineer building event-driven systems and real-time interfaces. I move comfortably between Redis pub/sub queues, Sequelize migrations, and 3D Canvas worlds — and I like the seam where they meet.",
};

export type Chapter = {
  id: string;
  index: number;
  company: string;
  role: string;
  city: string;
  period: string;
  orbit: number;
  size: number;
  hue: [number, number, number];
  ring?: boolean;
  summary: string;
  beats: string[];
};

export const chapters: Chapter[] = [
  {
    id: "s5tech",
    index: 0,
    company: "S5Tech LTD",
    role: "Full Stack Software Engineer",
    city: "Singapore — Remote",
    period: "Jun 2024 — Present",
    orbit: 5.6,
    size: 1.05,
    hue: [0.07, 0.62, 0.55],
    ring: true,
    summary:
      "Owning the funding module of an iGaming wallet engine that sustains 10k+ concurrent transactions/sec through Redis-backed queues, cron jobs, and websocket state sync.",
    beats: [
      "Scaled the platform from a single market to 13+, designing a high-level funding profile system that adapts per-market payment rules.",
      "Hardened deposit/withdraw flows against third-party banks using RSA, MD5, and SHA-256 according to each provider's spec.",
      "Integrated game ecosystems with Evolution (SE) and Fachai (CN), and stood up a proxy layer protecting the origin.",
      "Shipped Redis pub/sub debugging workflows with Redis Insight and live order-status sync over websockets.",
      "Mentor other astronaut and strive forward together."
    ],
  },
  {
    id: "sayduck",
    index: 1,
    company: "Sayduck Oy",
    role: "Frontend Engineer",
    city: "Espoo, Finland",
    period: "Mar 2022 — Jun 2024",
    orbit: 9.4,
    size: 0.85,
    hue: [0.55, 0.18, 0.46],
    summary:
      "Migrated a JavaScript codebase to TypeScript and built 3D product configurators with Three.js and the HTML5 Canvas API.",
    beats: [
      "Authored an internal Three.js SDK supporting client-specific customization needs.",
      "Tuned API performance via Apollo GraphQL queries and mutations.",
      "Migrated state from Zustand to Redux as the surface area outgrew it.",
      "Career break Jul–Dec 2023 — Anti-Air Infantry, Finnish Defence Forces.",
    ],
  },
  {
    id: "integrify",
    index: 2,
    company: "Integrify Oy",
    role: "Junior Frontend Engineer",
    city: "Espoo, Finland",
    period: "Mar 2021 — Mar 2022",
    orbit: 13.2,
    size: 0.7,
    hue: [0.95, 0.35, 0.6],
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
    title: "Frontend",
    items: [
      "TypeScript",
      "React / Vite",
      "Redux Toolkit",
      "Zustand",
      "TanStack",
      "Material UI",
      "Tailwind",
      "Three.js / R3F",
    ],
  },
  {
    title: "Backend & Data",
    items: [
      "Node.js",
      "PostgreSQL",
      "Sequelize ORM",
      "MongoDB",
      "Redis Pub/Sub",
      "Redis Insight",
      "Node-cron",
      "WebSockets",
    ],
  },
  {
    title: "Platform & Tooling",
    items: [
      "AWS S3 & CloudWatch",
      "GitHub Actions CI/CD",
      "Docker",
      "Jest",
      "Sentry",
      "Postman",
      "Ngrok",
      "Codex / Cursor",
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
