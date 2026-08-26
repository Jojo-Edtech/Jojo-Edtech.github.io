import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowsOut,
  Books,
  Brain,
  CaretLeft,
  CaretRight,
  ChalkboardTeacher,
  ChartLineUp,
  Code,
  EnvelopeSimple,
  Eye,
  GithubLogo,
  Handshake,
  Heart,
  LinkedinLogo,
  List,
  MagnifyingGlass,
  MapPin,
  Student,
  X,
} from "@phosphor-icons/react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { academicHighlights, profile, projects, publications, researchInterests } from "./data";
import type { ComingSoonProject, Project, ProjectImage, ProjectProduct, Publication } from "./types";

type PreviewMedia = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  href?: string;
  tags?: string[];
};

function normalisePathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function ScrollAndTitle() {
  const location = useLocation();
  const initialLocationKey = useRef(location.key);

  useLayoutEffect(() => {
    const pathname = normalisePathname(location.pathname);
    const matchedProject = pathname.startsWith("/projects/")
      ? projects.find((project) => pathname.endsWith(project.slug))
      : undefined;
    const routeTitle =
      pathname === "/publications"
        ? "Published Work | Xinyan Zhou Jojo"
        : pathname.startsWith("/projects/")
          ? matchedProject
            ? `${matchedProject.title} | Xinyan Zhou Jojo`
            : "Page Not Found | Xinyan Zhou Jojo"
          : pathname === "/"
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
  const pathname = normalisePathname(location.pathname);
  const isKnownProjectPage = projects.some((project) => pathname === `/projects/${project.slug}`);

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
          aria-current={pathname === "/" && !location.hash ? "page" : undefined}
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
          <Link to="/publications" aria-current={pathname === "/publications" ? "page" : undefined}>
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
          <Link to="/publications" aria-current={pathname === "/publications" ? "page" : undefined}>
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
    <footer id="contact" className="site-footer texture-surface texture-charcoal" tabIndex={-1}>
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

function DialogShell({
  eyebrow,
  title,
  onClose,
  returnFocusRef,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const requestClose = () => dialogRef.current?.close();

  const handleClosed = () => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus({ preventScroll: true }));
  };

  return (
    <dialog
      ref={dialogRef}
      className={`preview-dialog ${className}`.trim()}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          requestClose();
        }
      }}
      onClose={handleClosed}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className="preview-dialog-panel">
        <header className="preview-dialog-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={headingId}>{title}</h2>
          </div>
          <button className="icon-button dialog-close" type="button" onClick={requestClose} autoFocus>
            <X aria-hidden="true" weight="bold" />
            <span className="sr-only">Close preview</span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

function ProjectQuickView({
  project,
  onClose,
  returnFocusRef,
}: {
  project: Project;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const previewImage = project.images?.[0]
    ? { src: project.images[0].src, alt: project.images[0].alt }
    : project.products?.[0]
      ? { src: project.products[0].imageSrc, alt: project.products[0].imageAlt }
      : {
          src: "/assets/research-editorial-collage-v2.png",
          alt: "Editorial collage representing education research, analysis, and digital learning.",
        };
  const isComingSoon = project.status === "coming-soon";

  return (
    <DialogShell
      eyebrow={`Project ${project.number} · ${project.eyebrow}`}
      title={project.title}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      className="project-quick-dialog"
    >
      <div className="project-quick-layout">
        <div className="project-quick-image">
          <img src={previewImage.src} alt={previewImage.alt} />
        </div>
        <div className="project-quick-copy">
          <p>{project.summary}</p>
          {!isComingSoon && (
            <dl className="project-quick-facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{project.date}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
            </dl>
          )}
          <Link className="button button-primary" to={`/projects/${project.slug}`} onClick={onClose}>
            {isComingSoon ? "View preview" : "Open full project"}
            <ArrowRight aria-hidden="true" weight="bold" />
          </Link>
        </div>
      </div>
    </DialogShell>
  );
}

function MediaLightbox({
  items,
  activeIndex,
  onChange,
  onClose,
  returnFocusRef,
}: {
  items: PreviewMedia[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const item = items[activeIndex];
  const hasMultiple = items.length > 1;
  const previous = () => onChange((activeIndex - 1 + items.length) % items.length);
  const next = () => onChange((activeIndex + 1) % items.length);

  useEffect(() => {
    if (!hasMultiple) return;
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };
    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  });

  return (
    <DialogShell
      eyebrow={`${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`}
      title={item.label}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      className="media-lightbox"
    >
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Preview {activeIndex + 1} of {items.length}: {item.label}
      </p>
      <div className="media-lightbox-image">
        <img src={item.src} alt={item.alt} />
      </div>
      <div className="media-lightbox-footer">
        <div>
          <p>{item.caption}</p>
          {item.tags && (
            <div className="media-lightbox-tags" aria-label={`${item.label} tags`}>
              {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </div>
        <div className="media-lightbox-actions">
          {hasMultiple && (
            <div className="media-lightbox-nav" aria-label="Preview navigation">
              <button className="icon-button" type="button" onClick={previous} aria-label="Previous image">
                <CaretLeft aria-hidden="true" weight="bold" />
              </button>
              <button className="icon-button" type="button" onClick={next} aria-label="Next image">
                <CaretRight aria-hidden="true" weight="bold" />
              </button>
            </div>
          )}
          {item.href && (
            <ExternalLink
              className="button button-primary"
              href={item.href}
              ariaLabel={`Visit ${item.label} (opens in a new tab)`}
            >
              Visit live <ArrowUpRight aria-hidden="true" weight="bold" />
            </ExternalLink>
          )}
        </div>
      </div>
    </DialogShell>
  );
}

function projectImagesToPreviewMedia(images: ProjectImage[]): PreviewMedia[] {
  return images.map((image) => ({
    src: image.src,
    alt: image.alt,
    label: image.label ?? "Project image",
    caption: image.caption,
  }));
}

function productsToPreviewMedia(products: ProjectProduct[]): PreviewMedia[] {
  return products.map((product) => ({
    src: product.imageSrc,
    alt: product.imageAlt,
    label: product.title,
    caption: product.description,
    href: product.href,
    tags: product.tags,
  }));
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
    name: "Mainland China",
    note: "Cross-regional research context",
    tone: "yellow",
    region: "Asia",
  },
  {
    name: "Switzerland",
    note: "Comparative research",
    tone: "purple",
    region: "Europe",
  },
  {
    name: "Austria",
    note: "Academic visit and research exchange",
    tone: "blue",
    region: "Europe",
  },
  {
    name: "Japan",
    note: "Research collaboration",
    tone: "coral",
    region: "Asia",
  },
  {
    name: "Canada",
    note: "Research collaboration",
    tone: "green",
    region: "North America",
  },
  {
    name: "United States",
    note: "Research collaboration",
    tone: "orange",
    region: "North America",
  },
] as const;

function CollaborationMap() {
  const [selectedLocationName, setSelectedLocationName] = useState<string>(collaborationLocations[1].name);
  const selectedLocation =
    collaborationLocations.find((location) => location.name === selectedLocationName) ?? collaborationLocations[0];

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
      <p className="collaboration-map-instruction">Select a location to trace one connection.</p>

      <div className="collaboration-network" aria-label="International research collaboration network">
        <div className="collaboration-network-hub">
          <span>Research base</span>
          <strong>Hong Kong</strong>
          <small>Connecting research across three regions</small>
        </div>

        <ul className="collaboration-location-list" aria-label="Collaboration locations">
          {collaborationLocations.map((location) => (
            <li
              key={location.name}
              className={`collaboration-location collaboration-location-${location.tone}${
                selectedLocation.name === location.name ? " collaboration-location-active" : ""
              }`}
            >
              <span className="collaboration-connector" aria-hidden="true" />
              <button
                className="collaboration-location-control"
                type="button"
                aria-pressed={selectedLocation.name === location.name}
                aria-controls="collaboration-detail"
                onClick={() => setSelectedLocationName(location.name)}
              >
                <MapPin aria-hidden="true" weight="fill" />
                <span>
                  <strong>{location.name}</strong>
                  <small>{location.note}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div id="collaboration-detail" className="collaboration-detail" role="status" aria-live="polite" aria-atomic="true">
          <span>Selected connection</span>
          <strong>Hong Kong ↔ {selectedLocation.name}</strong>
          <p>{selectedLocation.note} · {selectedLocation.region}</p>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projectPreviewTriggerRef = useRef<HTMLElement | null>(null);
  const featuredPublications = publications.filter((publication) => publication.featured);
  const highlightCategories = [...new Set(academicHighlights.map((highlight) => highlight.category))];
  const projectIcons = [ChalkboardTeacher, Handshake, Books, Code];
  const interestIcons = [Brain, Heart, Student];

  return (
    <Layout>
      <main id="main-content" tabIndex={-1}>
        <section className="hero texture-surface texture-paper-fibre">
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

        <section
          className="interest-panel section-pad texture-surface texture-paper-fibre"
          aria-labelledby="research-interests-heading"
        >
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

        <section
          id="projects"
          className="projects section-pad section-border texture-surface texture-paper-crumple"
          tabIndex={-1}
        >
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
                <article className={`project-card project-card-${index + 1}`} key={project.slug}>
                  <Link className="project-card-main" to={`/projects/${project.slug}`}>
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
                  </Link>
                  <div className="project-card-controls">
                    <button
                      className="project-quick-view"
                      type="button"
                      aria-haspopup="dialog"
                      onClick={(event) => {
                        projectPreviewTriggerRef.current = event.currentTarget;
                        setSelectedProject(project);
                      }}
                    >
                      Quick view <Eye aria-hidden="true" weight="bold" />
                    </button>
                    <Link className="project-card-action" to={`/projects/${project.slug}`}>
                      {isComingSoon ? "View preview" : "View project"}
                      <ArrowRight aria-hidden="true" weight="bold" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <CollaborationMap />

        <section
          className="featured-publications section-pad section-border texture-surface texture-paper-fibre"
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

        <section
          id="highlights"
          className="highlights section-pad section-border texture-surface texture-paper-crumple"
          tabIndex={-1}
        >
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
      {selectedProject && (
        <ProjectQuickView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          returnFocusRef={projectPreviewTriggerRef}
        />
      )}
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
        <section className="project-hero section-pad texture-surface texture-paper-fibre">
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
  const [lightbox, setLightbox] = useState<{ kind: "gallery" | "products"; index: number } | null>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
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
  const galleryMedia = projectImagesToPreviewMedia(project.images ?? []);
  const productMedia = productsToPreviewMedia(project.products ?? []);
  const lightboxItems = lightbox?.kind === "gallery" ? galleryMedia : productMedia;

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

          <nav className="project-section-nav" aria-label="Project sections">
            <span>Explore this project</span>
            <a href="#project-context">Context</a>
            <a href="#project-role">My role</a>
            <a href="#project-contributions">What I did</a>
            {galleryMedia.length > 0 && <a href="#project-gallery">Visual evidence</a>}
            {productMedia.length > 0 && <a href="#project-products">Products</a>}
            {relatedPublications.length > 0 && <a href="#project-publications">Published work</a>}
          </nav>

          <section id="project-context" className="project-story section-pad section-border" tabIndex={-1}>
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

          <section id="project-role" className="project-story section-pad section-border" tabIndex={-1}>
            <div className="story-label">
              <span>02</span>
              <h2>My role</h2>
            </div>
            <div className="story-copy role-summary">
              <p className="role-title">{project.role}</p>
              <p>{project.date} · {project.location}</p>
            </div>
          </section>

          <section id="project-contributions" className="project-story section-pad section-border" tabIndex={-1}>
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
            <section
              id="project-gallery"
              className="project-gallery section-pad section-border texture-surface texture-paper-crumple"
              aria-labelledby="gallery-heading"
              tabIndex={-1}
            >
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">{project.slug === "teacher-ai-course" ? "Design evidence" : "Visual evidence"}</p>
                  <h2 id="gallery-heading">
                    {project.slug === "teacher-ai-course" ? "Inside the course design" : "Project snapshots"}
                  </h2>
                </div>
                <p>
                  {project.slug === "teacher-ai-course"
                    ? "Four views of the learning scaffold, a local teaching case, the course format, and the applied capstone."
                    : "Selected public-facing visuals connected to this project."}
                </p>
              </div>
              <div className="gallery-grid">
                {project.images.map((image, index) => (
                  <figure key={image.src}>
                    <button
                      className="gallery-trigger"
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Open image ${index + 1} of ${project.images?.length}: ${image.label ?? image.alt}`}
                      onClick={(event) => {
                        lightboxTriggerRef.current = event.currentTarget;
                        setLightbox({ kind: "gallery", index });
                      }}
                    >
                      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                      <span className="gallery-expand-cue">
                        <ArrowsOut aria-hidden="true" weight="bold" /> View full image
                      </span>
                    </button>
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

          {project.products && project.products.length > 0 && (
            <section
              id="project-products"
              className="product-showcase section-pad section-border texture-surface texture-technical-grid"
              aria-labelledby="product-showcase-heading"
              tabIndex={-1}
            >
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">Public prototypes</p>
                  <h2 id="product-showcase-heading">Products of vibe coding</h2>
                </div>
                <p>Working websites and prototypes that turn AI education ideas into inspectable public interfaces.</p>
              </div>
              <div className="product-grid">
                {project.products.map((product, index) => (
                  <ProductCard
                    key={product.href}
                    product={product}
                    index={index}
                    total={project.products?.length ?? 0}
                    onPreview={(trigger) => {
                      lightboxTriggerRef.current = trigger;
                      setLightbox({ kind: "products", index });
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {relatedPublications.length > 0 && (
            <section
              id="project-publications"
              className="related-work section-pad section-border"
              tabIndex={-1}
            >
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
          )}

          <Link className="next-project section-border" to={`/projects/${nextProject.slug}`}>
            <span>
              Next project <small>{nextProject.number}</small>
            </span>
            <strong>{nextProject.title}</strong>
            <ArrowRight aria-hidden="true" weight="bold" />
          </Link>
        </article>
      </main>
      {lightbox && lightboxItems.length > 0 && (
        <MediaLightbox
          items={lightboxItems}
          activeIndex={lightbox.index}
          onChange={(index) => setLightbox({ ...lightbox, index })}
          onClose={() => setLightbox(null)}
          returnFocusRef={lightboxTriggerRef}
        />
      )}
    </Layout>
  );
}

function ProductCard({
  product,
  index,
  total,
  onPreview,
}: {
  product: ProjectProduct;
  index: number;
  total: number;
  onPreview: (trigger: HTMLElement) => void;
}) {
  return (
    <article className="product-card">
      <button
        className="product-image-button"
        type="button"
        aria-haspopup="dialog"
        aria-label={`Open screenshot ${index + 1} of ${total}: ${product.title}`}
        onClick={(event) => onPreview(event.currentTarget)}
      >
        <span className="product-image-frame">
        <img src={product.imageSrc} alt={product.imageAlt} loading="lazy" decoding="async" />
        </span>
        <span className="product-preview-cue"><Eye aria-hidden="true" weight="bold" /> Quick view</span>
      </button>
      <span className="product-card-copy">
        <span className="product-title-row">
          <strong>{product.title}</strong>
        </span>
        <span>{product.description}</span>
      </span>
      <span className="product-tags" aria-label={`${product.title} tags`}>
        {product.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </span>
      <span className="product-card-actions">
        <button className="product-quick-view" type="button" onClick={(event) => onPreview(event.currentTarget)}>
          Preview <ArrowsOut aria-hidden="true" weight="bold" />
        </button>
        <ExternalLink className="product-live-link" href={product.href} ariaLabel={`Visit ${product.title} (opens in a new tab)`}>
          Visit live <ArrowUpRight aria-hidden="true" weight="bold" />
        </ExternalLink>
      </span>
    </article>
  );
}

function PublicationsPage() {
  const [query, setQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState<"all" | "first" | "co">("all");
  const [yearFilter, setYearFilter] = useState<"all" | number>("all");
  const byNewestYear = (a: Publication, b: Publication) => b.year - a.year;
  const publicationYears = [...new Set(publications.map((publication) => publication.year))].sort((a, b) => b - a);
  const normalisedQuery = query.trim().toLocaleLowerCase();
  const filteredPublications = publications.filter((publication) => {
    const matchesQuery = !normalisedQuery || [
      publication.title,
      publication.authors,
      publication.journal,
      String(publication.year),
    ].some((value) => value.toLocaleLowerCase().includes(normalisedQuery));
    const matchesAuthor =
      authorFilter === "all" ||
      (authorFilter === "first" && publication.leadAuthored) ||
      (authorFilter === "co" && !publication.leadAuthored);
    const matchesYear = yearFilter === "all" || publication.year === yearFilter;
    return matchesQuery && matchesAuthor && matchesYear;
  });
  const firstAuthorPublications = filteredPublications
    .filter((publication) => publication.leadAuthored)
    .sort(byNewestYear);
  const coAuthorPublications = filteredPublications
    .filter((publication) => !publication.leadAuthored)
    .sort(byNewestYear);
  const filtersActive = Boolean(normalisedQuery) || authorFilter !== "all" || yearFilter !== "all";
  const resetFilters = () => {
    setQuery("");
    setAuthorFilter("all");
    setYearFilter("all");
  };

  return (
    <Layout>
      <main id="main-content" className="publications-page" tabIndex={-1}>
        <section className="publications-hero section-pad texture-surface texture-paper-fibre">
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

        <section className="publication-explorer" aria-labelledby="publication-explorer-heading">
          <div className="publication-explorer-heading">
            <div>
              <p className="eyebrow">Find published work</p>
              <h2 id="publication-explorer-heading">Search and filter</h2>
            </div>
            <p>Search the public record by title, author, journal, or year.</p>
          </div>

          <form className="publication-filters" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="publication-search">
              <span>Search publications</span>
              <span className="publication-search-control">
                <MagnifyingGlass aria-hidden="true" weight="bold" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Title, author, journal, or year"
                  aria-controls="publication-results"
                />
              </span>
            </label>

            <fieldset className="publication-role-filter">
              <legend>Authorship</legend>
              <div className="filter-chip-row">
                {([
                  ["all", "All"],
                  ["first", "First-author"],
                  ["co", "Co-author"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className="filter-chip"
                    aria-pressed={authorFilter === value}
                    aria-controls="publication-results"
                    onClick={() => setAuthorFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="publication-year-filter">
              <span>Year</span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value === "all" ? "all" : Number(event.target.value))}
                aria-controls="publication-results"
              >
                <option value="all">All years</option>
                {publicationYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </form>

          <div className="publication-filter-summary">
            <p role="status" aria-live="polite" aria-atomic="true">
              {filteredPublications.length} {filteredPublications.length === 1 ? "publication" : "publications"} found
            </p>
            {filtersActive && (
              <button className="clear-filters" type="button" onClick={resetFilters}>
                Clear filters <X aria-hidden="true" weight="bold" />
              </button>
            )}
          </div>
        </section>

        <div id="publication-results">
          {firstAuthorPublications.length > 0 && (
            <PublicationGroup title="First-author publications" publications={firstAuthorPublications} startIndex={1} />
          )}
          {coAuthorPublications.length > 0 && (
            <PublicationGroup
              title="Co-author publications"
              publications={coAuthorPublications}
              startIndex={firstAuthorPublications.length + 1}
            />
          )}
          {filteredPublications.length === 0 && (
            <section className="publication-empty" aria-labelledby="publication-empty-heading">
              <p className="eyebrow">No matching record</p>
              <h2 id="publication-empty-heading">Try a broader search.</h2>
              <p>Only verified published work is included in this public portfolio.</p>
              <button className="button button-primary" type="button" onClick={resetFilters}>
                Clear filters <X aria-hidden="true" weight="bold" />
              </button>
            </section>
          )}
        </div>
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
