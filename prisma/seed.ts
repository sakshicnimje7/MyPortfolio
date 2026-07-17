import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "DebugChronicle",
    slug: "debug-chronicle",
    description: "A collaborative debugging and developer ticketing system designed for enterprise teams. Features real-time log ingestion, issue tracking, and integration with MySQL for audit histories.",
    shortDesc: "Collaborative developer ticketing and real-time logs tracking system.",
    tags: "Spring Boot,REST API,MySQL",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/debug-chronicle",
    liveUrl: "#",
    featured: true,
    order: 1
  },
  {
    title: "GHOSTWRITER",
    slug: "ghostwriter",
    description: "An automated document generation and text styling engine powered by NLP automation. Simplifies standard reporting and technical documentation generation.",
    shortDesc: "NLP-driven automated documentation and reports generation engine.",
    tags: "Python,NLP,Automation",
    category: "AI",
    githubUrl: "https://github.com/sakshicnimje7/ghostwriter",
    liveUrl: "#",
    featured: true,
    order: 2
  },
  {
    title: "Pulse EWM Task Optimizer",
    slug: "pulse-ewm",
    description: "Real-time task movement optimizer for SAP Extended Warehouse Management. Deployed on SAP BTP and written in ABAP to dynamically align stock allocations and warehouse routes.",
    shortDesc: "Real-time task routing and movement optimizer for SAP EWM.",
    tags: "SAP EWM,ABAP,BTP",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/pulse-ewm",
    liveUrl: "#",
    featured: true,
    order: 3
  },
  {
    title: "Wanderlust",
    slug: "wanderlust",
    description: "An immersive travel discovery application featuring high-performance GSAP page-reveals, responsive layout shifts, and dynamic theme synchronization.",
    shortDesc: "Immersive travel portal built with GSAP and custom interactive animations.",
    tags: "React,GSAP,CSS",
    category: "Frontend",
    githubUrl: "https://github.com/sakshicnimje7/wanderlust",
    liveUrl: "#",
    featured: true,
    order: 4
  },
  {
    title: "OpenEnv",
    slug: "openenv",
    description: "A lightweight environment variable and deployment configuration dashboard. Streamlines Docker container configurations and automates DevOps variables validation.",
    shortDesc: "Lightweight container deployment manager and environment config engine.",
    tags: "Spring Boot,Docker,DevOps",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/openenv",
    liveUrl: "#",
    featured: false,
    order: 5
  },
  {
    title: "Dark Warehouse Automation Hub",
    slug: "dark-warehouse",
    description: "Central dispatch system coordinating automated guided vehicles (AGVs) inside fully automated warehouses. Utilizes ABAP Cloud routines and OData services to control machinery states.",
    shortDesc: "OData-driven automation dispatch for robotic guided vehicles.",
    tags: "SAP EWM,ABAP Cloud,OData",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/dark-warehouse",
    liveUrl: "#",
    featured: false,
    order: 6
  },
  {
    title: "Vision Pick EWM System",
    slug: "vision-pick-ewm",
    description: "Pick-by-vision terminal client interface optimized for warehouse personnel. Accesses core inventory levels via custom CDS Views and renders responsive SAP UI5 templates.",
    shortDesc: "Pick-by-vision SAP UI5 application utilizing high-performance CDS Views.",
    tags: "SAP UI5,ABAP,CDS Views",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/vision-pick-ewm",
    liveUrl: "#",
    featured: false,
    order: 7
  },
  {
    title: "Warehouse Inventory Health Dashboard",
    slug: "wihd",
    description: "Global stock inventory telemetry dashboard hosted on SAP BTP. Highlights inventory metrics, turnover rates, and warehouse transaction health in real-time.",
    shortDesc: "Enterprise inventory health dashboard running on SAP BTP analytics.",
    tags: "SAP BTP,Analytics,SAPUI5",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/wihd",
    liveUrl: "#",
    featured: false,
    order: 8
  },
  {
    title: "Groot AI",
    slug: "groot-ai",
    description: "A smart botanical assistant that integrates with microcontrollers to monitor soil telemetry and uses Java Spring Boot backends and LLMs to analyze plant health.",
    shortDesc: "Smart botanical assistant utilizing Spring Boot backends and LLMs.",
    tags: "Java,AI,Spring Boot",
    category: "AI",
    githubUrl: "https://github.com/sakshicnimje7/groot-ai",
    liveUrl: "#",
    featured: false,
    order: 9
  },
  {
    title: "WellnessMarketplace Backend",
    slug: "wellness-marketplace",
    description: "Secure e-commerce API catering to health and wellness products. Features JWT stateless session auth, MySQL queries mapping, and integrated product rating calculations.",
    shortDesc: "E-commerce API for wellness products with secure JWT auth.",
    tags: "Spring Boot,JWT,MySQL,React",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/wellness-marketplace",
    liveUrl: "#",
    featured: false,
    order: 10
  },
  {
    title: "Online Exam Portal",
    slug: "online-exam-portal",
    description: "Highly scalable examinee runtime container platform. Uses Docker sandboxes to isolate code compile challenges and MySQL to log real-time test compliance metrics.",
    shortDesc: "Scalable online test portal featuring sandboxed code runtimes.",
    tags: "Spring Boot,Docker,MySQL",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/online-exam-portal",
    liveUrl: "#",
    featured: false,
    order: 11
  }
];

const blogPosts = [
  {
    title: "Getting Started with ABAP Cloud",
    slug: "getting-started-with-abap-cloud",
    tags: "SAP,ABAP,Cloud",
    excerpt: "An introduction to the clean core paradigm and ABAP Cloud development model.",
    content: `# Getting Started with ABAP Cloud\n\nABAP Cloud is the modern development model for the clean core strategy in SAP systems.`,
    published: true
  },
  {
    title: "Building Reactive APIs with Spring WebFlux",
    slug: "building-reactive-apis-with-spring-webflux",
    tags: "Java,Spring,Reactive",
    excerpt: "Learn how to use non-blocking database drivers and reactive streams in Spring Boot.",
    content: `# Building Reactive APIs with Spring WebFlux\n\nReactive programming provides massive concurrency benefits with fewer threads.`,
    published: true
  }
];

const achievements = [
  {
    title: "SAP Certified Associate — ABAP Cloud",
    issuer: "SAP",
    year: "2025",
    category: "SAP",
    certified: true
  },
  {
    title: "DSA Using Java",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "Java Foundation",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "DBMS",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "Agile Scrum",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  }
];

async function main() {
  console.log("Seeding database...");
  await prisma.project.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.achievement.deleteMany({});
  
  for (const project of projects) {
    await prisma.project.create({
      data: project
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post
    });
  }

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch(e => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Cleanup handled by Prisma
  });
