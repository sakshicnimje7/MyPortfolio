import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "Sales Order Automation & UI5 Dashboard",
    slug: "sales-order-automation-ui5-dashboard",
    description: "Built an end-to-end SAP full-stack application using SAP UI5 frontend and ABAP OData services. Automated sales order creation using BAPI_SALESORDER_CREATEFROMDAT2, developed CDS Views and analytical dashboards for sales KPIs, and configured SAP Cloud Connector to optimize ABAP SQL performance.",
    shortDesc: "Full-stack SAP UI5 dashboard with ABAP OData integration and BAPI automation.",
    tags: "SAP UI5,ABAP,BTP,OData",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/sales-order-automation",
    liveUrl: "#",
    featured: true,
    order: 1
  },
  {
    title: "Digital Wellness Marketplace",
    slug: "digital-wellness-marketplace",
    description: "Developed a full-stack e-commerce and appointment booking platform using Spring Boot, React.js, and MySQL. Designed secure REST APIs with JWT authentication and Role-Based Access Control (RBAC), managed relational databases with Hibernate/JPA, and integrated an AI-based therapy recommendation engine.",
    shortDesc: "E-commerce and booking platform built with Spring Boot, React, and MySQL.",
    tags: "Spring Boot,React.js,MySQL,JWT",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/wellness-marketplace",
    liveUrl: "#",
    featured: true,
    order: 2
  },
  {
    title: "Online Quiz & Examination System",
    slug: "online-quiz-examination-system",
    description: "Developed a secure online examination portal using Spring Boot and MySQL. Implemented stateful authentication, dynamic quiz management routines, Docker-based runner deployments, and engineered custom backend modules for question management and automated result evaluation.",
    shortDesc: "Secure quiz and test portal featuring Spring Boot backend and Docker deployment.",
    tags: "Spring Boot,MySQL,Docker,REST APIs",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/online-quiz-system",
    liveUrl: "#",
    featured: true,
    order: 3
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
    featured: false,
    order: 4
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
    order: 5
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
    title: "SAP Certified Associate — Back-End Developer — ABAP Cloud",
    issuer: "SAP",
    year: "2025",
    category: "SAP",
    certified: true
  },
  {
    title: "DSA Using Java — Infosys",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "Java Foundation Certification — Infosys",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "Database Management Systems — Infosys",
    issuer: "Infosys",
    year: "2025",
    category: "Infosys",
    certified: false
  },
  {
    title: "Agile Scrum in Practice — Infosys",
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
