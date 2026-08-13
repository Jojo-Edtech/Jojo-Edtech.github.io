import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Books,
  Brain,
  ChalkboardTeacher,
  ChartLineUp,
  Code,
  EnvelopeSimple,
  GithubLogo,
  Handshake,
  Heart,
  LinkedinLogo,
  List,
  MapPin,
  Student,
  X,
} from "@phosphor-icons/react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { academicHighlights, profile, projects, publications, researchInterests } from "./data";
import type { ComingSoonProject, Publication } from "./types";

function ScrollAndTitle() {
  const location = useLocation();
  const initialLocationKey = useRef(location.key);

  useLayoutEffect(() => {
    const matchedProject = location.pathname.startsWith("/projects/")
      ? projects.find((project) => location.pathname.endsWith(project.slug))
      : undefined;
    const routeTitle =
      location.pathname === "/publications"
        ? "Published Work | Xinyan Zhou Jojo"
        : location.pathname.startsWith("/projects/")
          ? matchedProject
            ? `${matchedProject.title} | Xinyan Zhou Jojo`
            : "Page Not Found | Xinyan Zhou Jojo"
          : location.pathname === "/"
            ? "Xinyan Zhou Jojo | Research into Practice"
            : "Page Not Found | Xinyan Zhou Jojo";

    document.title = routeTitle;
    window.history.scrollRestoration = "manual";
    const shouldMoveFocus = location.key !== initialLocationKey.current;

    if (location.hash) {
      const target = document.querySelector<HTMLElement>(location.hash);
      if (target) {
        const headerOffset = 82;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo(0, Math.max(0, targetTop));
        if (shouldMoveFocus) target.focus({ preventScroll: true });
      }
    } else {
      window.scrollTo(0, 0);
      if (shouldMoveFocus) {
        document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
      }
    }
  }, [location.pathname, location.hash, location.key]);

  return null;
}

function ExternalLink({
  href,
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
      {children}
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isKnownProjectPage = projects.some((project) => location.pathname === `/projects/${project.slug}`);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="brand"
          to="/"
          aria-label="Xinyan Zhou Jojo, homepage"
          aria-current={location.pathname === "/" && !location.hash ? "page" : undefined}
        >
          Xinyan Zhou Jojo
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link
            to="/#projects"
            aria-current={isKnownProjectPage ? "page" : location.hash === "#projects" ? "location" : undefined}
          >
            Projects
          </Link>
          <Link to="/publications" aria-current={location.pathname === "/publications" ? "page" : undefined}>
            Publications
          </Link>
          <Link to="/#highlights" aria-current={location.hash === "#highlights" ? "location" : undefined}>
            Highlights
          </Link>
          <Link to="/#contact" aria-current={location.hash === "#contact" ? "location" : undefined}>
            Contact
          </Link>
        </nav>

        <a className="header-email" href={`mailto:${profile.email}`}>
          Let’s connect <ArrowUpRight aria-hidden="true" weight="bold" />
        </a>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <Link
            to="/#projects"
            aria-current={isKnownProjectPage ? "page" : location.hash === "#projects" ? "location" : undefined}
          >
            Projects
          </Link>
          <Link to="/publications" aria-current={location.pathname === "/publications" ? "page" : undefined}>
            Publications
          </Link>
          <Link to="/#highlights" aria-current={location.hash === "#highlights" ? "location" : undefined}>
            Academic highlights
          </Link>
          <Link to="/#contact" aria-current={location.hash === "#contact" ? "location" : undefined}>
            Contact
          </Link>
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            Email Xinyan <EnvelopeSimple aria-hidden="true" weight="bold" />
          </a>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer id="contact" className="site-footer" tabIndex={-1}>
      <div className="footer-intro">
        <p className="eyebrow eyebrow-light">Start a conversation</p>
        <h2>Research and practice in AI literacy and competence across K–12 and higher education.</h2>
      </div>
      <div className="footer-contact">
        <a className="footer-email" href={`mailto:${profile.email}`}>
          {profile.email} <ArrowUpRight aria-hidden="true" weight="bold" />
        </a>
        <div className="footer-links" aria-label="External profiles">
          <ExternalLink href={profile.scholar} ariaLabel="Google Scholar (opens in a new tab)">
            Google Scholar
          </ExternalLink>
          <ExternalLink href={profile.linkedin} ariaLabel="LinkedIn (opens in a new tab)">
            <LinkedinLogo aria-hidden="true" weight="fill" /> LinkedIn
          </ExternalLink>
          <ExternalLink href={profile.github} ariaLabel="GitHub (opens in a new tab)">
            <GithubLogo aria-hidden="true" weight="fill" /> GitHub
          </ExternalLink>
        </div>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} Xinyan Zhou Jojo · Hong Kong SAR</p>
    </footer>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell" data-portfolio-root="true">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function formatPublicationVenue(publication: Publication) {
  return `${publication.journal}, ${publication.volumeIssuePages}`;
}

function PublicationRow({ publication, compact = false }: { publication: Publication; compact?: boolean }) {
  return (
    <article className={compact ? "publication-row publication-row-compact" : "publication-row"}>
      <div className="publication-meta">
        <span>{publication.year}</span>
        <span>{publication.leadAuthored ? "First-author" : "Co-author"}</span>
      </div>
      <div className="publication-copy">
        <h3>{publication.title}</h3>
        {!compact && <p className="publication-authors">{publication.authors}</p>}
        <p className="publication-venue">{formatPublicationVenue(publication)}</p>
      </div>
      <ExternalLink
        className="publication-link"
        href={publication.doi}
        ariaLabel={`Open DOI for ${publication.title} (opens in a new tab)`}
      >
        <span>{compact ? "DOI" : publication.doi.replace("https://doi.org/", "doi:")}</span>
        <ArrowUpRight aria-hidden="true" weight="bold" />
      </ExternalLink>
    </article>
  );
}

const collaborationLocations = [
  {
    name: "Hong Kong SAR, China",
    note: "Research base",
    tone: "coral",
  },
  {
    name: "Mainland China",
    note: "Cross-regional research context",
    tone: "yellow",
  },
  {
    name: "Switzerland",
    note: "Comparative research",
    tone: "purple",
  },
  {
    name: "Austria",
    note: "Academic visit and research exchange",
    tone: "blue",
  },
  {
    name: "Japan",
    note: "Research collaboration",
    tone: "coral",
  },
  {
    name: "Canada",
    note: "Research collaboration",
    tone: "green",
  },
  {
    name: "United States",
    note: "Research collaboration",
    tone: "orange",
  },
] as const;

function CollaborationMap() {
  return (
    <section
      id="collaboration"
      className="collaboration-map section-border"
      aria-labelledby="collaboration-map-heading"
      tabIndex={-1}
      data-collaboration-visual="abstract-network"
      data-collaboration-placement="homepage"
    >
      <div className="collaboration-map-heading">
        <div>
          <p className="eyebrow">International collaboration</p>
          <h2 id="collaboration-map-heading">Research connections across regions</h2>
        </div>
        <div className="collaboration-network-badge">
          <Handshake aria-hidden="true" weight="fill" />
          <span>
            Research base
            <strong>Hong Kong SAR, China</strong>
          </span>
        </div>
      </div>

      <p className="collaboration-map-intro">
        A Hong Kong research base connects collaborative work across Asia, Europe, and North America. This
        network shows collaboration locations; publication cards on this site list published work only.
      </p>

      <div className="collaboration-network" aria-label="International research collaboration network">
        <div className="collaboration-network-hub">
          <span>Research base</span>
          <strong>Hong Kong</strong>
          <small>Connecting research across three regions</small>
        </div>

        <ul className="collaboration-location-list" aria-label="Collaboration locations">
          {collaborationLocations.map((location) => (
            <li key={location.name} className={`collaboration-location collaboration-location-${location.tone}`}>
              <span className="collaboration-connector" aria-hidden="true" />
              <div>
                <MapPin aria-hidden="true" weight="fill" />
                <span>
                  <strong>{location.name}</strong>
                  <small>{location.note}</small>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HomePage() {
  const featuredPublications = publications.filter((publication) => publication.featured);
  const highlightCategories = [...new Set(academicHighlights.map((highlight) => highlight.category))];
  const projectIcons = [ChalkboardTeacher, Handshake, Books, Code];
  const interestIcons = [Brain, Heart, Student];

  return (
    <Layout>
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Hello, I’m</p>
            <h1 tabIndex={-1}>
              Xinyan Zhou <span>Jojo.</span>
            </h1>
            <p className="hero-roleline">{profile.role} · {profile.affiliation}</p>
            <p className="hero-statement">
              I study how teachers and students develop <strong>AI literacy and competence</strong> across
              K–12 and higher education.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/#projects">
                Explore projects <ArrowRight aria-hidden="true" weight="bold" />
              </Link>
              <Link className="text-link" to="/publications">
                View published work <ArrowUpRight aria-hidden="true" weight="bold" />
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-label="AI education research-to-practice illustration">
            <div className="hero-art-card">
              <img
                src="/assets/hero-editorial-ai-education-v2.png"
                alt="An editorial illustration of books, digital learning tools, and connected AI ideas"
              />
            </div>
            <div className="hero-note hero-note-bottom">
              <ChartLineUp aria-hidden="true" weight="bold" />
              <span>Research into practice</span>
            </div>
          </div>
        </section>

        <section className="interest-panel section-pad" aria-labelledby="research-interests-heading">
          <div className="compact-heading">
            <p className="eyebrow">Current focus</p>
            <h2 id="research-interests-heading">Research interests</h2>
          </div>
          <ul className="interest-grid">
            {researchInterests.map((interest, index) => {
              const InterestIcon = interestIcons[index];
              return (
                <li className={`interest-card interest-card-${index + 1}`} key={interest}>
                  <InterestIcon aria-hidden="true" weight="duotone" />
                  <span>{interest}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="projects" className="projects section-pad section-border" tabIndex={-1}>
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>Projects</h2>
            </div>
            <p>Four project areas connecting AI education research, learning design, professional development, and digital product building.</p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => {
              const ProjectIcon = projectIcons[index];
              const isComingSoon = project.status === "coming-soon";
              return (
              <Link
                className={`project-card project-card-${index + 1}`}
                key={project.slug}
                to={`/projects/${project.slug}`}
              >
                <div className="project-card-top">
                  <span className="project-icon"><ProjectIcon aria-hidden="true" weight="duotone" /></span>
                  <ArrowUpRight aria-hidden="true" weight="bold" />
                </div>
                <span className="project-number">Project {project.number}</span>
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className={`project-card-meta${isComingSoon ? " project-card-meta-pending" : ""}`}>
                  {isComingSoon ? (
                    <>
                      <span>Portfolio preview</span>
                      <span>Content coming next</span>
                    </>
                  ) : (
                    <>
                      <span>{project.role}</span>
                      <span>{project.date}</span>
                    </>
                  )}
                </div>
                <span className="project-card-action">
                  {isComingSoon ? "View preview" : "View project"} <ArrowRight aria-hidden="true" weight="bold" />
                </span>
              </Link>
              );
            })}
          </div>
        </section>

        <CollaborationMap />

        <section
          className="featured-publications section-pad section-border"
          data-publication-count={publications.length}
        >
          <div className="publication-intro">
            <p className="eyebrow">Published evidence</p>
            <h2>Selected publications</h2>
            <p>
              Four publications that connect the site’s project areas. The complete published record is
              available on the Publications page.
            </p>
            <ExternalLink
              className="publication-total"
              href={profile.scholar}
              ariaLabel={`${publications.length} published works; open Google Scholar profile (opens in a new tab)`}
            >
              <Books aria-hidden="true" weight="duotone" />
              <span>
                <strong>{publications.length}</strong>
                <small>published works</small>
              </span>
              <ArrowUpRight aria-hidden="true" weight="bold" />
            </ExternalLink>
            <Link className="button button-secondary" to="/publications">
              All publications <ArrowRight aria-hidden="true" weight="bold" />
            </Link>
          </div>
          <div className="publication-list">
            {featuredPublications.map((publication) => (
              <PublicationRow key={publication.id} publication={publication} compact />
            ))}
          </div>
        </section>

        <section id="highlights" className="highlights section-pad section-border" tabIndex={-1}>
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Beyond the projects</p>
              <h2>Academic highlights</h2>
            </div>
            <p>Selected academic visits, conferences, peer review service, and academic distinctions.</p>
          </div>

          <div className="highlight-grid">
            {highlightCategories.map((category, index) => (
              <article className={`highlight-card highlight-${index + 1}`} key={category}>
                <h3>{category}</h3>
                <ul>
                  {academicHighlights
                    .filter((highlight) => highlight.category === category)
                    .map((highlight) => (
                      <li key={`${highlight.name}-${highlight.year ?? ""}`}>
                        <div>
                          <span className="highlight-title">{highlight.name}</span>
                          {(highlight.institution || highlight.location) && (
                            <span className="highlight-place">
                              {[highlight.institution, highlight.location].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                        {highlight.year && <span className="highlight-date">{highlight.year}</span>}
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

function ComingSoonProjectPage({ project }: { project: ComingSoonProject }) {
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <Layout>
      <main id="main-content" tabIndex={-1}>
        <article className="project-detail project-coming-soon" data-experience-kind="vibe-coded-products-preview">
          <section className="project-hero section-pad">
            <div className="project-hero-copy">
              <Link className="back-link" to="/#projects">
                <ArrowLeft aria-hidden="true" weight="bold" /> Back to projects
              </Link>
              <p className="eyebrow">{project.eyebrow}</p>
              <div className="project-title-row">
                <span className="project-number-large">Project {project.number}</span>
                <h1 tabIndex={-1}>{project.title}</h1>
              </div>
              <p className="project-lead">{project.summary}</p>
            </div>
            <div className="project-hero-visual" aria-hidden="true">
              <img src="/assets/research-editorial-collage-v2.png" alt="" />
            </div>
          </section>

          <section className="project-placeholder section-pad section-border">
            <div>
              <p className="eyebrow">Portfolio in development</p>
              <h2>Selected product stories are coming next.</h2>
            </div>
            <p>
              This page is reserved for AI education products developed through vibe coding. Product details,
              responsibilities, and visuals will be added after the public portfolio selection is confirmed.
            </p>
          </section>

          <Link className="next-project section-border" to={`/projects/${nextProject.slug}`}>
            <span>
              Next project <small>{nextProject.number}</small>
            </span>
            <strong>{nextProject.title}</strong>
            <ArrowRight aria-hidden="true" weight="bold" />
          </Link>
        </article>
      </main>
    </Layout>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    return <NotFoundPage />;
  }

  if (project.status === "coming-soon") {
    return <ComingSoonProjectPage project={project} />;
  }

  const relatedPublications = project.relatedDois
    .map((doi) => publications.find((publication) => publication.doi === doi))
    .filter((publication): publication is Publication => Boolean(publication));
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <Layout>
      <main id="main-content" tabIndex={-1}>
        <article
          className="project-detail"
          data-experience-kind={project.slug === "teacher-ai-workshops" ? "teacher-ai-workshops" : undefined}
        >
          <section className="project-hero section-pad">
            <div className="project-hero-copy">
              <Link className="back-link" to="/#projects">
                <ArrowLeft aria-hidden="true" weight="bold" /> Back to projects
              </Link>
              <p className="eyebrow">{project.eyebrow}</p>
              <div className="project-title-row">
                <span className="project-number-large">Project {project.number}</span>
                <h1 tabIndex={-1}>{project.title}</h1>
              </div>
              <p className="project-lead">{project.summary}</p>
            </div>
            <div className="project-hero-visual" aria-hidden="true">
              <img src="/assets/research-editorial-collage-v2.png" alt="" />
            </div>
          </section>

          <section className="project-facts" aria-label="Project facts">
            <div>
              <span>Role</span>
              <strong>{project.role}</strong>
            </div>
            <div>
              <span>Period</span>
              <strong>{project.date}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{project.location}</strong>
            </div>
          </section>

          <section className="project-story section-pad section-border">
            <div className="story-label">
              <span>01</span>
              <h2>Context</h2>
            </div>
            <div className="story-copy">
              {project.body.context.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {project.body.contextSources && project.body.contextSources.length > 0 && (
                <div className="context-sources" aria-label="Context sources">
                  <span>Context sources</span>
                  <div>
                    {project.body.contextSources.map((source) => (
                      <ExternalLink key={source.href} href={source.href}>
                        {source.label}
                        <ArrowUpRight aria-hidden="true" weight="bold" />
                      </ExternalLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="project-story section-pad section-border">
            <div className="story-label">
              <span>02</span>
              <h2>My role</h2>
            </div>
            <div className="story-copy role-summary">
              <p className="role-title">{project.role}</p>
              <p>{project.date} · {project.location}</p>
            </div>
          </section>

          <section className="project-story section-pad section-border">
            <div className="story-label">
              <span>03</span>
              <h2>What I did</h2>
            </div>
            <div className="story-copy">
              <ul className="contribution-list">
                {project.body.whatIDid.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </div>
          </section>

          {project.images && project.images.length > 0 && (
            <section className="project-gallery section-pad section-border" aria-labelledby="gallery-heading">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">Design evidence</p>
                  <h2 id="gallery-heading">Inside the course design</h2>
                </div>
                <p>Four views of the learning scaffold, a local teaching case, the course format, and the applied capstone.</p>
              </div>
              <div className="gallery-grid">
                {project.images.map((image, index) => (
                  <figure key={image.src}>
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                    <figcaption>
                      <span className="gallery-figure-label">
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        {image.label}
                      </span>
                      <p>{image.caption}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className="related-work section-pad section-border">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Published evidence</p>
                <h2>Related published work</h2>
              </div>
              <p>Published research connected to this project’s themes.</p>
            </div>
            <div className="related-grid">
              {relatedPublications.map((publication) => (
                <PublicationRow key={publication.id} publication={publication} compact />
              ))}
            </div>
          </section>

          <Link className="next-project section-border" to={`/projects/${nextProject.slug}`}>
            <span>
              Next project <small>{nextProject.number}</small>
            </span>
            <strong>{nextProject.title}</strong>
            <ArrowRight aria-hidden="true" weight="bold" />
          </Link>
        </article>
      </main>
    </Layout>
  );
}

function PublicationsPage() {
  const byNewestYear = (a: Publication, b: Publication) => b.year - a.year;
  const firstAuthorPublications = publications
    .filter((publication) => publication.leadAuthored)
    .sort(byNewestYear);
  const coAuthorPublications = publications
    .filter((publication) => !publication.leadAuthored)
    .sort(byNewestYear);

  return (
    <Layout>
      <main id="main-content" className="publications-page" tabIndex={-1}>
        <section className="publications-hero section-pad">
          <div className="publications-hero-copy">
            <p className="eyebrow">Published research</p>
            <div className="publications-title-row">
              <h1 tabIndex={-1}>Publications</h1>
              <span className="publication-count">{publications.length}</span>
            </div>
            <p>
              Peer-reviewed journal articles and a published book chapter spanning teacher AI competence,
              AI literacy, motivation, engagement, and AI-supported learning.
            </p>
          </div>
          <div className="publications-hero-visual" aria-hidden="true">
            <img src="/assets/research-editorial-collage-v2.png" alt="" />
          </div>
        </section>

        <PublicationGroup title="First-author publications" publications={firstAuthorPublications} startIndex={1} />
        <PublicationGroup title="Co-author publications" publications={coAuthorPublications} startIndex={5} />
      </main>
    </Layout>
  );
}

function PublicationGroup({
  title,
  publications: publicationGroup,
  startIndex,
}: {
  title: string;
  publications: Publication[];
  startIndex: number;
}) {
  return (
    <section className="publication-group section-pad section-border" aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}>
      <div className="group-heading">
        <h2 className="eyebrow" id={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}>{title}</h2>
        <span>{publicationGroup.length.toString().padStart(2, "0")}</span>
      </div>
      <div className="full-publication-list">
        {publicationGroup.map((publication, index) => (
          <article
            className="full-publication"
            key={publication.id}
            data-publication-status="published"
          >
            <span className="citation-number">{String(startIndex + index).padStart(2, "0")}</span>
            <div>
              <p className="citation-authors">{publication.authors} ({publication.year}).</p>
              <h3>{publication.title}.</h3>
              <p className="citation-venue">{formatPublicationVenue(publication)}.</p>
            </div>
            <ExternalLink
              className="citation-doi"
              href={publication.doi}
              ariaLabel={`Open DOI for ${publication.title} (opens in a new tab)`}
            >
              DOI <ArrowUpRight aria-hidden="true" weight="bold" />
            </ExternalLink>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <Layout>
      <main id="main-content" className="not-found section-pad" tabIndex={-1}>
        <p className="eyebrow">Page not found</p>
        <h1 tabIndex={-1}>Let’s return to the portfolio.</h1>
        <Link className="button button-primary" to="/">
          Go home <ArrowRight aria-hidden="true" weight="bold" />
        </Link>
      </main>
    </Layout>
  );
}

export function App() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
