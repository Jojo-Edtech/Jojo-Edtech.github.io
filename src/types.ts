export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
  label?: string;
};

export type ProjectSource = {
  label: string;
  href: string;
};

type ProjectBase = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  images?: ProjectImage[];
};

export type ActiveProject = ProjectBase & {
  status?: "active";
  role: string;
  date: string;
  location: string;
  body: {
    context: string[];
    whatIDid: string[];
    contextSources?: ProjectSource[];
  };
  relatedDois: string[];
};

export type ComingSoonProject = ProjectBase & {
  status: "coming-soon";
};

export type Project = ActiveProject | ComingSoonProject;

export type Publication = {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  volumeIssuePages: string;
  doi: string;
  leadAuthored: boolean;
  featured: boolean;
  relatedProjects: string[];
};

export type AcademicHighlight = {
  category: string;
  name: string;
  year?: string;
  location?: string;
  institution?: string;
};
