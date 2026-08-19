import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = new URL("../dist/client/", import.meta.url);
const clientRootPath = fileURLToPath(clientRoot);

const baselineDois = [
  "https://doi.org/10.1016/j.tate.2026.105384",
  "https://doi.org/10.1186/s40468-025-00416-2",
  "https://doi.org/10.1080/10494820.2026.2614080",
  "https://doi.org/10.1080/10494820.2025.2487538",
  "https://doi.org/10.1016/j.caeo.2025.100327",
  "https://doi.org/10.1186/s40594-026-00629-8",
  "https://doi.org/10.1177/07356331261421079",
  "https://doi.org/10.1080/10494820.2024.2400090",
  "https://doi.org/10.1186/s40561-025-00379-0",
  "https://doi.org/10.1016/j.caeai.2022.100118",
  "https://doi.org/10.1007/s10763-023-10382-x",
  "https://doi.org/10.1007/978-981-19-9217-9_9",
];

const privatePathPatterns = [/\/Users\//, /\/var\/folders\//, /file:\/\//i];
const forbiddenPublicExtensions = new Set([
  ".doc",
  ".docx",
  ".pdf",
  ".zip",
  ".pptx",
  ".xls",
  ".xlsx",
  ".csv",
  ".tsv",
  ".map",
  ".key",
  ".pem",
  ".env",
]);

const authoredStatusPatterns = [
  /under[\s-]?review/i,
  /\bsubmitted\b/i,
  /\bunpublished\b/i,
  /\bmanuscript\b/i,
  /\bin preparation\b/i,
  /\bforthcoming\b/i,
];

const unpublishedConceptPatterns = [
  /human[\s-]centred AI/i,
  /human[\s-]centered AI/i,
];

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\b(?:api[_-]?key|client[_-]?secret)\s*[:=]\s*["'][^"']+["']/i,
];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else files.push(path);
  }

  return files;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const dataPath = new URL("../src/data.ts", import.meta.url);
const generatedPublicationPath = new URL("../src/publication-updates.generated.json", import.meta.url);
const appPath = new URL("../src/App.tsx", import.meta.url);
const cssPath = new URL("../src/styles.css", import.meta.url);
const mainPath = new URL("../src/main.tsx", import.meta.url);
const packagePath = new URL("../package.json", import.meta.url);
const typesPath = new URL("../src/types.ts", import.meta.url);
const dataText = await readFile(dataPath, "utf8");
const generatedPublicationText = await readFile(generatedPublicationPath, "utf8");
const appText = await readFile(appPath, "utf8");
const cssText = await readFile(cssPath, "utf8");
const mainText = await readFile(mainPath, "utf8");
const packageText = await readFile(packagePath, "utf8");
const typesText = await readFile(typesPath, "utf8");
const authoredText = [dataText, generatedPublicationText, appText, cssText, mainText, typesText].join("\n");

const doiMatches = [
  ...[...dataText.matchAll(/doi:\s*"(https:\/\/doi\.org\/[^"]+)"/g)].map((match) => match[1]),
  ...[...generatedPublicationText.matchAll(/"doi":\s*"(https:\/\/doi\.org\/[^"]+)"/g)].map((match) => match[1]),
];
const featuredCount =
  (dataText.match(/featured:\s*true/g) ?? []).length +
  (generatedPublicationText.match(/"featured":\s*true/g) ?? []).length;
const projectSlugs = [...dataText.matchAll(/\n\s+slug:\s*"([^"]+)"/g)].map((match) => match[1]);

assert(doiMatches.length >= baselineDois.length, `Expected at least ${baselineDois.length} publications, found ${doiMatches.length}`);
assert(new Set(doiMatches).size === doiMatches.length, "Every DOI must be unique");
assert(baselineDois.every((doi) => doiMatches.includes(doi)), "A verified baseline DOI is missing");
assert(featuredCount === 4, `Expected four featured publications, found ${featuredCount}`);
assert(projectSlugs.length === 4, `Expected four projects, found ${projectSlugs.length}`);
assert(!dataText.includes('"research-collaboration"'), "International collaboration must not remain modelled as a project");
assert(dataText.includes('title: "AIED in Schools and Universities"'), "Approved Project 03 title is missing");
assert(dataText.includes('slug: "vibe-coded-products"'), "Vibe-coded products project is missing");
assert(
  dataText.includes('role: "Product Designer & Vibe-Coding Developer"'),
  "Vibe-coded products project must be a public active project",
);
assert(!dataText.includes('status: "coming-soon"'), "Vibe-coded products should no longer be marked as coming soon");
const vibeProductAssets = [
  "englishdemo.png",
  "aied-journal.png",
  "aithomas.png",
  "study-house.png",
  "ai-prof-chai.png",
];
for (const asset of vibeProductAssets) {
  assert(dataText.includes(`/assets/vibe-coding-showcase/${asset}`), `Vibe-coding product asset is missing: ${asset}`);
}
assert(
  (dataText.match(/\/assets\/vibe-coding-showcase\//g) ?? []).length === vibeProductAssets.length,
  "Vibe-coding product asset count changed unexpectedly",
);
for (const href of [
  "https://jojo-edtech.github.io/englishdemo/",
  "https://jojo-edtech.github.io/aied-journal/",
  "https://jojo-edtech.github.io/AIthomas/?v=fc99c8f",
  "https://ourstudyhouse.netlify.app/",
  "https://jojo-edtech.github.io/ai-prof-chai/",
]) {
  assert(dataText.includes(href), `Vibe-coding public link is missing: ${href}`);
}
assert(!dataText.includes("https://github.com/Jojo-Edtech/study-house"), "Private study-house repository link leaked");
const courseGalleryAssets = [
  "lesson-design-scaffold.jpg",
  "session-6-local-case.jpg",
  "course-format-24-hours.jpg",
  "applied-capstone.jpg",
];
assert(
  courseGalleryAssets.every((asset) => dataText.includes(`/assets/teacher-ai-course/${asset}`)),
  "Teacher AI course gallery must include exactly the four owner-approved core-evidence assets",
);
assert(
  (dataText.match(/\/assets\/teacher-ai-course\//g) ?? []).length === courseGalleryAssets.length,
  "Teacher AI course gallery asset count changed unexpectedly",
);
assert(dataText.includes("Interviewed 40 frontline teachers"), "Project 01 interview evidence is missing");
assert(
  dataText.includes("two senior instructional designers"),
  "Project 01 instructional-design collaboration evidence is missing",
);
assert(appText.includes('className="project-card-action"'), "Project cards need an explicit clickable affordance");
assert(appText.includes('data-publication-status="published"'), "Published-item audit marker is missing");
assert(appText.includes('data-experience-kind={project.slug === "teacher-ai-workshops"'), "Workshop audit marker is missing");
assert(dataText.includes('role: "Workshop Lead & Speaker"'), "Approved workshop role is missing");
assert(
  dataText.includes('"Liaised directly with schools across the Greater Bay Area on planning and coordination."'),
  "Approved workshop liaison wording is missing",
);
assert(appText.includes('"First-author"') && appText.includes('"Co-author"'), "Publication author-role labels are missing");
assert(!appText.includes('"Lead-authored"'), "Old lead-authored label remains in the interface");
assert(!appText.includes('"Collaborative publications"'), "Old collaborative-publications heading remains in the interface");
assert(dataText.includes('category: "Academic Visit"'), "Academic Visit heading data is missing");
assert(!dataText.includes('category: "Academic Mobility"'), "Old Academic Mobility heading remains in data");
assert(dataText.includes('name: "GCCCE 2026"'), "GCCCE 2026 conference entry is missing");
assert(
  dataText.includes('name: "The 2nd Reimagining STEAM Education"'),
  "The 2nd Reimagining STEAM Education conference entry is missing",
);
assert(dataText.includes('category: "Peer Review Service"'), "Peer Review Service heading data is missing");
assert(!dataText.includes('category: "Peer Review"'), "Old Peer Review heading remains in data");
assert(dataText.includes('name: "Teaching and Teacher Education"'), "Teaching and Teacher Education peer-review entry is missing");
assert(
  dataText.includes('name: "Computers and Education: Artificial Intelligence"'),
  "Computers and Education: Artificial Intelligence peer-review entry is missing",
);
assert(!appText.includes('className="vision section-pad"'), "Removed homepage vision section returned");
assert(!appText.includes('hero-note-top'), "The homepage publication-count badge returned");
assert(
  !appText.includes('<span><strong>12</strong> published works</span>'),
  "The boastful homepage publication-count copy returned",
);
assert(
  appText.includes("data-publication-count={publications.length}"),
  "The contextual publication total must be derived from the publication dataset",
);
assert(
  appText.includes("<strong>{publications.length}</strong>"),
  "The visible publication total must not be hard-coded",
);
assert(appText.includes('<ul className="interest-grid">'), "Research interests lost their list semantics");
assert(
  appText.includes('location.hash === "#projects" ? "location"'),
  "The Projects section must use the aria-current location state",
);
assert(appText.includes('data-collaboration-visual="abstract-network"'), "Abstract collaboration network marker is missing");
assert(appText.includes('data-collaboration-placement="homepage"'), "Collaboration map is not marked as homepage content");
assert(!appText.includes('project.slug === "research-collaboration"'), "Collaboration map is still attached to a project route");
assert(
  /This\s+network shows collaboration locations; publication cards on this site list published work only\./.test(appText),
  "The collaboration-network and published-record boundary is missing",
);
const homePageStart = appText.indexOf("function HomePage()");
const publicationsPageStart = appText.indexOf("function PublicationsPage()");
const collaborationMapPlacement = appText.indexOf("<CollaborationMap />", homePageStart);
assert(
  collaborationMapPlacement > homePageStart && collaborationMapPlacement < publicationsPageStart,
  "Collaboration map is not rendered on the homepage",
);
assert(
  appText.indexOf("<CollaborationMap />", collaborationMapPlacement + 1) === -1,
  "Collaboration map is rendered on more than one page",
);
for (const location of ["United States", "Canada", "Japan"]) {
  assert(appText.includes(`name: "${location}"`), `${location} collaboration location is missing`);
}
assert(!/world-map/i.test(appText), "Map asset or map wording remains in the public interface");
assert(!/gradient\s*\(/i.test(cssText), "CSS gradients are not permitted in this visual system");
assert(!/scroll-behavior\s*:\s*smooth/i.test(cssText), "Smooth scrolling must remain disabled");
assert(!/behavior\s*:\s*["']smooth["']/i.test(appText), "JavaScript smooth scrolling must remain disabled");
assert(!appText.includes("scrollIntoView("), "scrollIntoView must not compete with route focus restoration");
assert(appText.includes('scrollRestoration = "manual"'), "Browser scroll restoration must remain under route control");
assert(appText.includes("initialLocationKey") && appText.includes("location.key"), "Initial focus and repeated hash navigation safeguards are missing");
assert(!/bodoni/i.test([mainText, cssText, packageText].join("\n")), "Decorative Bodoni typography must not return");
for (const pattern of authoredStatusPatterns) {
  assert(!pattern.test(authoredText), `Non-public manuscript status leaked into authored source: ${pattern}`);
}
for (const pattern of unpublishedConceptPatterns) {
  assert(!pattern.test(authoredText), `Unpublished research framing leaked into authored source: ${pattern}`);
}
for (const pattern of privatePathPatterns) {
  assert(!pattern.test(authoredText), "Local filesystem path leaked into authored source");
}
for (const field of ["date: string", "body:", "relatedDois: string[]", "images?: ProjectImage[]", "products?: ProjectProduct[]"]) {
  assert(typesText.includes(field), `Project interface is missing ${field}`);
}
for (const field of ["journal: string", "volumeIssuePages: string", "doi: string", "relatedProjects: string[]"]) {
  assert(typesText.includes(field), `Publication interface is missing ${field}`);
}
for (const field of ["category: string", "name: string", "year?: string", "location?: string", "institution?: string"]) {
  assert(typesText.includes(field), `AcademicHighlight interface is missing ${field}`);
}

const clientFiles = await listFiles(clientRootPath);
assert(clientFiles.some((file) => file.endsWith("/index.html")), "Production client is missing index.html");
assert(clientFiles.some((file) => file.endsWith("/404.html")), "Production client is missing 404.html");
for (const route of [
  "publications",
  "projects/teacher-ai-course",
  "projects/teacher-ai-workshops",
  "projects/k12-ai-curriculum",
  "projects/vibe-coded-products",
]) {
  assert(
    clientFiles.some((file) => file.endsWith(`/${route}/index.html`)),
    `Production client is missing a static entry for /${route}`,
  );
}

for (const file of clientFiles) {
  const extension = extname(file).toLowerCase();
  const displayPath = relative(clientRootPath, file);
  assert(!forbiddenPublicExtensions.has(extension), `Forbidden public artifact: ${displayPath}`);
  assert(!/(^|[\\/])qa([\\/.-]|$)/i.test(displayPath), `QA artifact leaked into public build: ${displayPath}`);

  if ([".html", ".js", ".css", ".txt", ".json"].includes(extension)) {
    const text = await readFile(file, "utf8");
    for (const pattern of privatePathPatterns) {
      assert(!pattern.test(text), `Local filesystem path leaked into dist/client/${displayPath}`);
    }
    for (const pattern of secretPatterns) {
      assert(!pattern.test(text), `Potential credential leaked into dist/client/${displayPath}`);
    }
    for (const pattern of unpublishedConceptPatterns) {
      assert(!pattern.test(text), `Unpublished research framing leaked into dist/client/${displayPath}`);
    }
  }

  assert(!/(?:cuhk|crest|emblem|school-logo)/i.test(displayPath), `Institutional logo-like asset leaked into public build: ${displayPath}`);
}

await stat(new URL("../dist/client/assets/hero-editorial-ai-education-v2.png", import.meta.url));
await stat(new URL("../dist/client/assets/research-editorial-collage-v2.png", import.meta.url));
assert(!clientFiles.some((file) => /world-map/i.test(file)), "Map asset leaked into the public build");
for (const asset of courseGalleryAssets) {
  await stat(new URL(`../dist/client/assets/teacher-ai-course/${asset}`, import.meta.url));
}
for (const asset of vibeProductAssets) {
  await stat(new URL(`../dist/client/assets/vibe-coding-showcase/${asset}`, import.meta.url));
}

console.log(`Public-site audit passed: ${doiMatches.length} verified DOI records, a dynamic contextual publication total, four projects with explicit link affordances, four owner-approved course-evidence figures, five public vibe-coding product screenshots, editorial assets, an abstract homepage collaboration network, instant navigation, and no restricted content or artifacts.`);
