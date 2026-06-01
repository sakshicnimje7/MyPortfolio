import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "SAP BTP Integration Engine",
    slug: "sap-btp-integration-engine",
    description: "A comprehensive backend engine built on SAP BTP using CAP framework and cloud connectors to synchronize distributed on-premise ERP environments.",
    shortDesc: "Custom integration microservices on SAP BTP using Cloud Connector, CAP, and Node.js.",
    tags: "SAP BTP,Node.js,Cloud Connector,CAP",
    category: "SAP",
    githubUrl: "https://github.com/sakshicnimje7/sap-btp-integration",
    liveUrl: "#",
    featured: true,
    order: 1
  },
  {
    title: "Enterprise Spring Boot Gateway",
    slug: "enterprise-spring-boot-gateway",
    description: "High-performance API Gateway built with Spring Cloud Gateway and JWT authentication, implementing rate limiting, dynamic routing, and custom security filters.",
    shortDesc: "High-performance API Gateway built with Spring Cloud Gateway and JWT auth for secure enterprise routing.",
    tags: "Spring Boot,Spring Security,JWT,Gateway",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/spring-gateway",
    liveUrl: "#",
    featured: true,
    order: 2
  },
  {
    title: "AI-Powered Code Assistant for ABAP",
    slug: "ai-powered-code-assistant-for-abap",
    description: "A specialized generative AI assistant fine-tuned on Llama 3 weights to interpret natural language requests and suggest clean, modern ABAP Cloud syntax.",
    shortDesc: "Fine-tuned Llama 3 model specialized in generating clean, modern ABAP Cloud syntax and CDS Views.",
    tags: "Llama 3,Python,FastAPI,ABAP Cloud",
    category: "AI",
    githubUrl: "https://github.com/sakshicnimje7/abap-ai-assistant",
    liveUrl: "#",
    featured: true,
    order: 3
  },
  {
    title: "Voxel Art 3D Engine Playground",
    slug: "voxel-art-3d-engine-playground",
    description: "An interactive WebGL sandbox designed for constructing voxel models dynamically in the browser, featuring custom vertex positioning, shadow mapping, and post-processing filters.",
    shortDesc: "Interactive 3D voxel renderer in the browser using React Three Fiber, custom shaders, and WebGL.",
    tags: "Three.js,React Three Fiber,WebGL,GSAP",
    category: "Frontend",
    githubUrl: "https://github.com/sakshicnimje7/voxel-art-engine",
    liveUrl: "#",
    featured: false,
    order: 4
  },
  {
    title: "EWM Warehouse Optimizer",
    slug: "ewm-warehouse-optimizer",
    description: "Custom ABAP Cloud algorithms designed to optimize storage bin allocation and pathfinding rules inside complex warehouse modules (SAP EWM).",
    shortDesc: "Custom ABAP Cloud algorithms to optimize storage bin allocation and pathfinding in SAP EWM.",
    tags: "ABAP Cloud,SAP EWM,Algorithms,SAP UI5",
    category: "SAP",
    githubUrl: null,
    liveUrl: "#",
    featured: false,
    order: 5
  },
  {
    title: "Reactive Spring WebFlux Chat Service",
    slug: "reactive-spring-webflux-chat-service",
    description: "A real-time reactive WebSocket-based messaging platform utilizing Java WebFlux, dynamic message broadcasting, and Redis Pub/Sub channels for state caching.",
    shortDesc: "Real-time bi-directional messaging platform utilizing reactive WebSockets and Redis Pub/Sub.",
    tags: "Spring WebFlux,Reactive WebSockets,Redis,Docker",
    category: "Java",
    githubUrl: "https://github.com/sakshicnimje7/spring-reactive-chat",
    liveUrl: "#",
    featured: false,
    order: 6
  }
];

const blogPosts = [
  {
    title: "Getting Started with ABAP Cloud",
    slug: "getting-started-with-abap-cloud",
    tags: "SAP,ABAP,Cloud",
    excerpt: "An introduction to the clean core paradigm and ABAP Cloud development model.",
    content: `# Getting Started with ABAP Cloud

ABAP Cloud is the modern development model for the clean core strategy in SAP systems.

## Why ABAP Cloud?

It restricts access to standard SAP repository objects, enforcing standard public APIs and cloud-ready extensions.

> ABAP Cloud is not just a language subset; it is a new paradigm for building sustainable ERP extensions.

Here is a simple example of an ABAP Cloud class structure:

\`\`\`abap
CLASS lcl_demo DEFINITION.
  PUBLIC SECTION.
    METHODS run.
ENDCLASS.

CLASS lcl_demo IMPLEMENTATION.
  METHOD run.
    out->write( 'Hello, ABAP Cloud!' ).
  ENDMETHOD.
ENDCLASS.
\`\`\`

By avoiding modifications to core tables and relying on CDS Views for data exposure, you ensure your extensions remain upgrade-stable.`,
    published: true
  },
  {
    title: "Building Reactive APIs with Spring WebFlux",
    slug: "building-reactive-apis-with-spring-webflux",
    tags: "Java,Spring,Reactive",
    excerpt: "Learn how to use non-blocking database drivers and reactive streams in Spring Boot.",
    content: `# Building Reactive APIs with Spring WebFlux

Reactive programming provides massive concurrency benefits with fewer threads by utilizing non-blocking event loops.

## Core Reactive Classes

- **Mono**: A reactive publisher emitting 0 or 1 element.
- **Flux**: A reactive publisher emitting 0 to N elements.

Here is how you can set up a reactive rest endpoint:

\`\`\`java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @GetMapping
    public Flux<String> getMessages() {
        return Flux.just("Hello", "Reactive", "World")
                   .delayElements(Duration.ofMillis(100));
    }
}
\`\`\`

Combined with R2DBC, Spring WebFlux lets you build database-backed systems that handle thousands of concurrent connections with low memory footprints.`,
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
    title: "DSA Using Java",
    issuer: "Infosys",
    category: "Infosys",
    certified: false
  },
  {
    title: "Java Foundation Certification",
    issuer: "Infosys",
    category: "Infosys",
    certified: false
  },
  {
    title: "Database Management Systems",
    issuer: "Infosys",
    category: "Infosys",
    certified: false
  },
  {
    title: "Agile Scrum in Practice",
    issuer: "Infosys",
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
