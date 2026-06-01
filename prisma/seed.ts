import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "SAP BTP Integration Engine",
    category: "SAP",
    shortDesc: "Custom integration microservices on SAP BTP using Cloud Connector, CAP, and Node.js.",
    tags: "SAP BTP,Node.js,Cloud Connector,CAP",
    gitHubLink: "https://github.com/sakshicnimje7/sap-btp-integration",
    viewLink: "#"
  },
  {
    title: "Enterprise Spring Boot Gateway",
    category: "Java",
    shortDesc: "High-performance API Gateway built with Spring Cloud Gateway and JWT auth for secure enterprise routing.",
    tags: "Spring Boot,Spring Security,JWT,Gateway",
    gitHubLink: "https://github.com/sakshicnimje7/spring-gateway",
    viewLink: "#"
  },
  {
    title: "AI-Powered Code Assistant for ABAP",
    category: "AI",
    shortDesc: "Fine-tuned Llama 3 model specialized in generating clean, modern ABAP Cloud syntax and CDS Views.",
    tags: "Llama 3,Python,FastAPI,ABAP Cloud",
    gitHubLink: "https://github.com/sakshicnimje7/abap-ai-assistant",
    viewLink: "#"
  },
  {
    title: "Voxel Art 3D Engine Playground",
    category: "Frontend",
    shortDesc: "Interactive 3D voxel renderer in the browser using React Three Fiber, custom shaders, and WebGL.",
    tags: "Three.js,React Three Fiber,WebGL,GSAP",
    gitHubLink: "https://github.com/sakshicnimje7/voxel-art-engine",
    viewLink: "#"
  },
  {
    title: "EWM Warehouse Optimizer",
    category: "SAP",
    shortDesc: "Custom ABAP Cloud algorithms to optimize storage bin allocation and pathfinding in SAP EWM.",
    tags: "ABAP Cloud,SAP EWM,Algorithms,SAP UI5",
    gitHubLink: null,
    viewLink: "#"
  },
  {
    title: "Reactive Spring WebFlux Chat Service",
    category: "Java",
    shortDesc: "Real-time bi-directional messaging platform utilizing reactive WebSockets and Redis Pub/Sub.",
    tags: "Spring WebFlux,Reactive WebSockets,Redis,Docker",
    gitHubLink: "https://github.com/sakshicnimje7/spring-reactive-chat",
    viewLink: "#"
  }
];

async function main() {
  console.log("Seeding database...");
  await prisma.project.deleteMany({});
  
  for (const project of projects) {
    await prisma.project.create({
      data: project
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
