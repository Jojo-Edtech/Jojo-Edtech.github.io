import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const scholarProfileUrl =
  "https://scholar.google.com/citations?user=FZX2uYwAAAAJ&hl=en&pagesize=100";
const baselineDataUrl = new URL("../src/data.ts", import.meta.url);
const generatedDataUrl = new URL("../src/publication-updates.generated.json", import.meta.url);
const reportDirectoryUrl = new URL("../qa/", import.meta.url);
const reportUrl = new URL("../qa/scholar-sync-report.json", import.meta.url);

const allowedCrossrefTypes = new Set(["journal-article", "book-chapter"]);

function decodeHtml(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
  };

  return value.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (entity, hex, decimal, named) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    return namedEntities[named.toLowerCase()] ?? entity;
  });
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeTitle(value) {
  return cleanText(value)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\bsystematics review\b/g, "systematic review")
    .replace(/\b&\b/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractScholarTitles(html) {
  return [...html.matchAll(/<a[^>]*class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
}

function extractBaselineRecords(source) {
  const arrayStart = source.indexOf("const baselinePublications");
  const arrayEnd = source.indexOf("\n];", arrayStart);
  if (arrayStart < 0 || arrayEnd < 0) {
    throw new Error("The baseline publication array could not be located.");
  }

  const publicationSource = source.slice(arrayStart, arrayEnd + 3);
  const titles = [...publicationSource.matchAll(/\btitle:\s*(?:\r?\n\s*)?"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const dois = [...publicationSource.matchAll(/\bdoi:\s*"(https:\/\/doi\.org\/[^"]+)"/g)].map(
    (match) => match[1],
  );
  const ids = [...publicationSource.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
  return { titles, dois, ids };
}

async function writeFailureReport(reason) {
  await mkdir(fileURLToPath(reportDirectoryUrl), { recursive: true });
  await writeFile(
    reportUrl,
    `${JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        status: "failed-closed",
        reason,
      },
      null,
      2,
    )}\n`,
  );
}

function hasXinyanZhou(authors = []) {
  return authors.some(
    (author) =>
      (author.family ?? "").trim().toLowerCase() === "zhou" &&
      (author.given ?? "").trim().toLowerCase().includes("xinyan"),
  );
}

function isFirstAuthor(authors = []) {
  const first = authors[0];
  return Boolean(
    first &&
      (first.family ?? "").trim().toLowerCase() === "zhou" &&
      (first.given ?? "").trim().toLowerCase().includes("xinyan"),
  );
}

function initials(given = "") {
  return given
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(" ");
}

function formatAuthors(authors = []) {
  const names = authors.map((author) => {
    const family = (author.family ?? "").trim();
    const givenInitials = initials(author.given ?? "");
    return [family, givenInitials].filter(Boolean).join(", ");
  });

  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, & ${names.at(-1)}`;
}

function publicationYear(item) {
  const dateParts =
    item["published-print"]?.["date-parts"] ??
    item["published-online"]?.["date-parts"] ??
    item.published?.["date-parts"] ??
    item.issued?.["date-parts"];
  return Number(dateParts?.[0]?.[0]);
}

function formatVolumeIssuePages(item) {
  const volumeIssue = item.volume
    ? `${item.volume}${item.issue ? `(${item.issue})` : ""}`
    : "";
  const locator = item.page
    ? item.page
    : item["article-number"]
      ? `Article ${item["article-number"]}`
      : "";
  return [volumeIssue, locator].filter(Boolean).join(", ") || "Advance online publication";
}

function slugify(value) {
  return normalizeTitle(value).replaceAll(" ", "-").slice(0, 64).replace(/-+$/g, "");
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en",
      "User-Agent": "XinyanPortfolioPublicationSync/1.0",
      ...headers,
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function findVerifiedCrossrefRecord(title) {
  const endpoint = new URL("https://api.crossref.org/works");
  endpoint.searchParams.set("query.title", title);
  endpoint.searchParams.set("query.author", "Xinyan Zhou");
  endpoint.searchParams.set("rows", "10");

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "User-Agent": "XinyanPortfolioPublicationSync/1.0",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Crossref HTTP ${response.status}`);
  const payload = await response.json();
  const candidates = payload.message?.items ?? [];
  const normalizedTarget = normalizeTitle(title);

  return candidates.find((item) => {
    const candidateTitle = cleanText(item.title?.[0] ?? "");
    return (
      allowedCrossrefTypes.has(item.type) &&
      Boolean(item.DOI) &&
      normalizeTitle(candidateTitle) === normalizedTarget &&
      hasXinyanZhou(item.author)
    );
  });
}

async function main() {
  const [baselineSource, generatedSource] = await Promise.all([
    readFile(baselineDataUrl, "utf8"),
    readFile(generatedDataUrl, "utf8"),
  ]);
  const baseline = extractBaselineRecords(baselineSource);
  const generated = JSON.parse(generatedSource);
  const knownTitles = new Set(
    [...baseline.titles, ...generated.map((record) => record.title)].map(normalizeTitle),
  );
  const knownDois = new Set(
    [...baseline.dois, ...generated.map((record) => record.doi)].map((doi) => doi.toLowerCase()),
  );
  const knownIds = new Set([...baseline.ids, ...generated.map((record) => record.id)]);

  let scholarHtml;
  try {
    scholarHtml = await fetchText(scholarProfileUrl);
  } catch (error) {
    await writeFailureReport(error instanceof Error ? error.message : "Unknown Scholar fetch error");
    throw new Error("Google Scholar could not be checked; public publication data was left unchanged.");
  }

  if (/captcha|unusual traffic|not a robot/i.test(scholarHtml)) {
    await writeFailureReport("Google Scholar requested human verification");
    throw new Error("Google Scholar requested human verification; public publication data was left unchanged.");
  }

  const scholarTitles = extractScholarTitles(scholarHtml);
  if (scholarTitles.length === 0) {
    await writeFailureReport("No Google Scholar records were found");
    throw new Error("No Google Scholar records were found; public publication data was left unchanged.");
  }

  const newScholarTitles = scholarTitles.filter((title) => !knownTitles.has(normalizeTitle(title)));
  const accepted = [];
  const heldForReview = [];

  for (const scholarTitle of newScholarTitles) {
    let crossrefRecord;
    try {
      crossrefRecord = await findVerifiedCrossrefRecord(scholarTitle);
    } catch {
      heldForReview.push({ title: scholarTitle, reason: "Crossref lookup failed" });
      continue;
    }

    if (!crossrefRecord) {
      heldForReview.push({
        title: scholarTitle,
        reason: "No exact published journal article or book chapter with Xinyan Zhou was verified in Crossref",
      });
      continue;
    }

    const doi = `https://doi.org/${crossrefRecord.DOI}`;
    if (knownDois.has(doi.toLowerCase())) continue;

    const year = publicationYear(crossrefRecord);
    const journal = cleanText(crossrefRecord["container-title"]?.[0] ?? "");
    if (!year || !journal) {
      heldForReview.push({ title: scholarTitle, reason: "Published year or venue is missing" });
      continue;
    }

    const canonicalTitle = cleanText(crossrefRecord.title?.[0] ?? scholarTitle);
    let id = slugify(canonicalTitle);
    if (knownIds.has(id)) id = `${id}-${year}`;

    const record = {
      id,
      authors: formatAuthors(crossrefRecord.author),
      year,
      title: canonicalTitle,
      journal,
      volumeIssuePages: formatVolumeIssuePages(crossrefRecord),
      doi,
      leadAuthored: isFirstAuthor(crossrefRecord.author),
      featured: false,
      relatedProjects: [],
    };
    accepted.push(record);
    knownTitles.add(normalizeTitle(record.title));
    knownDois.add(record.doi.toLowerCase());
    knownIds.add(record.id);
  }

  if (accepted.length > 0) {
    await writeFile(generatedDataUrl, `${JSON.stringify([...generated, ...accepted], null, 2)}\n`);
  }

  await mkdir(fileURLToPath(reportDirectoryUrl), { recursive: true });
  await writeFile(
    reportUrl,
    `${JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        status: "checked",
        scholarProfileUrl,
        scholarRecordCount: scholarTitles.length,
        publicRecordCountBeforeSync: baseline.titles.length + generated.length,
        automaticallyAdded: accepted,
        heldForReview,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `Scholar sync checked ${scholarTitles.length} profile records: ${accepted.length} verified published record(s) added; ${heldForReview.length} record(s) held outside the public site.`,
  );
}

await main();
