#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const client = path.join(dist, "client");

const publicRoutes = [
  "publications",
  "projects/teacher-ai-course",
  "projects/teacher-ai-workshops",
  "projects/k12-ai-curriculum",
  "projects/vibe-coded-products",
];

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

for (const route of publicRoutes) {
  const routeDirectory = path.join(client, route);
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(index, path.join(routeDirectory, "index.html"));
}

console.log(
  `Prepared Sites build and ${publicRoutes.length} static route entries: dist/server/index.js and dist/.openai/hosting.json`,
);
