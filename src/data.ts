import type { AcademicHighlight, Project, Publication } from "./types";
import syncedPublicationUpdates from "./publication-updates.generated.json";

export const profile = {
  name: "Xinyan Zhou Jojo",
  role: "PhD Candidate in Education",
  affiliation: "The Chinese University of Hong Kong",
  location: "Hong Kong SAR",
  email: "xinyanz@link.cuhk.edu.hk",
  scholar: "https://scholar.google.com/citations?user=FZX2uYwAAAAJ&hl=en",
  linkedin: "https://www.linkedin.com/in/xinyan-zhou-b97a9a245/",
  github: "https://github.com/Jojo-Edtech",
} as const;

export const researchInterests = [
  "Teacher AI Competence",
  "Professional Well-Being for Education",
  "AI Literacy for K–12",
] as const;

const baselinePublications: Publication[] = [
  {
    id: "teacher-ai-competence-review",
    authors: "Zhou, X., Lavicza, Z., & Chiu, T. K. F.",
    year: 2026,
    title:
      "Developing teacher AI competence: A systematic review of beliefs, professional learning, and cultural factors",
    journal: "Teaching and Teacher Education",
    volumeIssuePages: "172, Article 105384",
    doi: "https://doi.org/10.1016/j.tate.2026.105384",
    leadAuthored: true,
    featured: true,
    relatedProjects: ["teacher-ai-course", "teacher-ai-workshops"],
  },
  {
    id: "epistemic-beliefs",
    authors: "Zhou, X., & Chiu, T. K. F.",
    year: 2026,
    title:
      "The role of epistemic beliefs in predicting deep learning strategies in an AI-assisted English approach",
    journal: "Language Testing in Asia",
    volumeIssuePages: "16(1), Article 2",
    doi: "https://doi.org/10.1186/s40468-025-00416-2",
    leadAuthored: true,
    featured: false,
    relatedProjects: [],
  },
  {
    id: "ai-ips",
    authors: "Zhou, X., Liu, G., & Chiu, T. K. F.",
    year: 2026,
    title:
      "A five-step AI-information problem solving (AI-IPS) model for critical, ethical, and responsible usage",
    journal: "Interactive Learning Environments",
    volumeIssuePages: "1–20. Advance online publication",
    doi: "https://doi.org/10.1080/10494820.2026.2614080",
    leadAuthored: true,
    featured: true,
    relatedProjects: ["k12-ai-curriculum", "teacher-ai-workshops"],
  },
  {
    id: "k12-ai-literacy",
    authors: "Zhou, X., Li, Y., Chai, C. S., & Chiu, T. K. F.",
    year: 2025,
    title:
      "Defining, enhancing, and assessing artificial intelligence literacy and competency in K-12 education from a systematic review",
    journal: "Interactive Learning Environments",
    volumeIssuePages: "33(10), 5766–5788",
    doi: "https://doi.org/10.1080/10494820.2025.2487538",
    leadAuthored: true,
    featured: true,
    relatedProjects: ["k12-ai-curriculum", "teacher-ai-course"],
  },
  {
    id: "switzerland-china-motivation",
    authors: "Martínez-Moreno, J., Zhou, X., Petko, D., & Chiu, T. K. F.",
    year: 2026,
    title:
      "Motivation to shape the future of education with artificial intelligence: An international comparison between Switzerland and China",
    journal: "Computers and Education Open",
    volumeIssuePages: "10, Article 100327",
    doi: "https://doi.org/10.1016/j.caeo.2025.100327",
    leadAuthored: false,
    featured: true,
    relatedProjects: [],
  },
  {
    id: "steam-ai-literacy",
    authors:
      "Niri, G., Chiu, T. K. F., Ombid, A. M. O., Ybañez, D. L. J. B., Dennerlein, S. M., Zhou, X., & Lavicza, Z.",
    year: 2026,
    title: "STEAM education for AI literacy: A systematic literature review",
    journal: "International Journal of STEM Education",
    volumeIssuePages: "13(1), Article 46",
    doi: "https://doi.org/10.1186/s40594-026-00629-8",
    leadAuthored: false,
    featured: false,
    relatedProjects: ["k12-ai-curriculum"],
  },
  {
    id: "teacher-support-genai",
    authors: "Fang, X., Yang, M., Zhou, X., Li, Y., & Chiu, T. K. F.",
    year: 2026,
    title:
      "Using self-determination theory to explain how teacher support enhances student engagement and higher-order thinking in simulation-based learning with GenAI",
    journal: "Journal of Educational Computing Research",
    volumeIssuePages: "64(4), 850–882",
    doi: "https://doi.org/10.1177/07356331261421079",
    leadAuthored: false,
    featured: false,
    relatedProjects: [],
  },
  {
    id: "chatbots-sdt",
    authors: "Li, Y., Zhou, X., & Chiu, T. K. F.",
    year: 2025,
    title:
      "Systematics review on artificial intelligence chatbots and ChatGPT for language learning and research from self-determination theory (SDT): What are the roles of teachers?",
    journal: "Interactive Learning Environments",
    volumeIssuePages: "33(3), 1850–1864",
    doi: "https://doi.org/10.1080/10494820.2024.2400090",
    leadAuthored: false,
    featured: false,
    relatedProjects: [],
  },
  {
    id: "chatbots-activity-theory",
    authors: "Li, Y., Zhou, X., Yin, H.-B., & Chiu, T. K. F.",
    year: 2025,
    title:
      "Design language learning with artificial intelligence (AI) chatbots based on activity theory from a systematic review",
    journal: "Smart Learning Environments",
    volumeIssuePages: "12(1), Article 24",
    doi: "https://doi.org/10.1186/s40561-025-00379-0",
    leadAuthored: false,
    featured: false,
    relatedProjects: [],
  },
  {
    id: "aied-opportunities",
    authors: "Chiu, T. K. F., Xia, Q., Zhou, X., Chai, C. S., & Cheng, M.",
    year: 2023,
    title:
      "Systematic literature review on opportunities, challenges, and future research recommendations of artificial intelligence in education",
    journal: "Computers and Education: Artificial Intelligence",
    volumeIssuePages: "4, Article 100118",
    doi: "https://doi.org/10.1016/j.caeai.2022.100118",
    leadAuthored: false,
    featured: false,
    relatedProjects: ["k12-ai-curriculum"],
  },
  {
    id: "community-stem",
    authors: "Chiu, T. K. F., Ismailov, M., Zhou, X., Xia, Q., Au, C. K., & Chai, C. S.",
    year: 2023,
    title:
      "Using self-determination theory to explain how community-based learning fosters student interest and identity in integrated STEM education",
    journal: "International Journal of Science and Mathematics Education",
    volumeIssuePages: "21(Suppl. 1), 109–130",
    doi: "https://doi.org/10.1007/s10763-023-10382-x",
    leadAuthored: false,
    featured: false,
    relatedProjects: [],
  },
  {
    id: "digital-learning-chapter",
    authors: "Xia, Q., Zhou, X., Weng, X., & Chiu, T. K. F.",
    year: 2023,
    title: "Teacher support and student engagement in digital learning",
    journal: "In The post-pandemic landscape of education and beyond: Innovation and transformation",
    volumeIssuePages: "pp. 137–147. Springer Singapore",
    doi: "https://doi.org/10.1007/978-981-19-9217-9_9",
    leadAuthored: false,
    featured: false,
    relatedProjects: ["k12-ai-curriculum"],
  },
];

export const publications: Publication[] = [
  ...baselinePublications,
  ...(syncedPublicationUpdates as Publication[]),
];

export const projects: Project[] = [
  {
    slug: "teacher-ai-course",
    number: "01",
    eyebrow: "Instructional Design",
    title: "Designing a Teacher AI Competence Course",
    summary:
      "Researching, co-designing, and piloting a self-paced course that translates teacher AI competence into practical learning for educators.",
    role: "Researcher & Course Co-Designer",
    date: "Jan 2025 – Dec 2025",
    location: "Hong Kong SAR",
    body: {
      context: [
        "AI is reshaping education, yet teachers still need structured opportunities to build the knowledge and judgement required for responsible classroom use. This project asks how teacher AI competence can be translated into a practical learning experience.",
        "The resulting self-paced course was shaped through stakeholder consultation and iterative co-design. It has completed its first pilot in the Faculty of Education, with feedback informing the next iteration.",
      ],
      whatIDid: [
        "Interviewed 40 frontline teachers, researchers, and teacher educators, then translated their recommendations into course-design priorities.",
        "Worked with two senior instructional designers to move the course from first draft to a pilot-ready version, integrating Hong Kong cases and a structured learning scaffold.",
        "Contributed to the first pilot in the Faculty of Education and used participant feedback to guide the next design iteration.",
      ],
      contextSources: [
        {
          label: "UNESCO AI Competency Framework for Teachers",
          href: "https://www.unesco.org/en/articles/ai-competency-framework-teachers",
        },
        {
          label: "OECD TALIS 2024: Developing teacher expertise",
          href: "https://www.oecd.org/en/publications/results-from-talis-2024_90df6235-en/full-report/developing-teacher-expertise_f95ff343.html",
        },
      ],
    },
    relatedDois: [
      "https://doi.org/10.1016/j.tate.2026.105384",
      "https://doi.org/10.1080/10494820.2025.2487538",
    ],
  },
  {
    slug: "teacher-ai-workshops",
    number: "02",
    eyebrow: "Professional Learning",
    title: "Teacher AI Workshops across the Greater Bay Area",
    summary:
      "Delivering school-based professional development that creates space for teachers to engage with AI in practice.",
    role: "Workshop Lead & Speaker",
    date: "Nov 2025 – May 2026",
    location: "Greater Bay Area",
    body: {
      context: [
        "School-based professional development offers teachers a context-sensitive space to examine how AI relates to everyday educational practice.",
        "The workshops were delivered for schools across the Greater Bay Area between November 2025 and May 2026.",
      ],
      whatIDid: [
        "Designed the workshop content and structure for school-based professional development.",
        "Delivered the sessions as the workshop speaker.",
        "Liaised directly with schools across the Greater Bay Area on planning and coordination.",
        "Connected workshop conversations with teacher AI competence and AI literacy.",
      ],
    },
    relatedDois: [
      "https://doi.org/10.1016/j.tate.2026.105384",
      "https://doi.org/10.1080/10494820.2026.2614080",
    ],
  },
  {
    slug: "k12-ai-curriculum",
    number: "03",
    eyebrow: "Schools & Universities",
    title: "AIED in Schools and Universities",
    summary:
      "An umbrella for AIED across schools and universities; this page currently documents the school-facing work.",
    role: "Research Assistant",
    date: "Sep 2021 – Jul 2023",
    location: "Hong Kong SAR",
    body: {
      context: [
        "AIED in Schools and Universities is a broader portfolio area. This page currently documents the school-facing component; university-facing cases can be added once they are selected for public display.",
        "This work brought together two school-facing initiatives: a Quality Education Fund Project from September 2021 to August 2022 and the AI for the Future Project from September 2022 to July 2023.",
        "The projects combined field engagement, research support, curriculum work, and the development of AI learning resources.",
      ],
      whatIDid: [
        "Supported school visits and interview data collection.",
        "Conducted literature reviews and supported data analysis.",
        "Contributed to systematic-review and book writing.",
        "Supported AI curriculum and module development.",
      ],
    },
    relatedDois: [
      "https://doi.org/10.1080/10494820.2025.2487538",
      "https://doi.org/10.1080/10494820.2026.2614080",
      "https://doi.org/10.1016/j.caeai.2022.100118",
      "https://doi.org/10.1007/978-981-19-9217-9_9",
    ],
  },
  {
    slug: "vibe-coded-products",
    number: "04",
    eyebrow: "Product Design & Development",
    title: "Building AI Education Products through Vibe Coding",
    summary:
      "A developing portfolio of AI education tools and prototypes created through iterative, AI-assisted design and development.",
    status: "coming-soon",
  },
];

export const academicHighlights: AcademicHighlight[] = [
  {
    category: "Academic Visit",
    name: "Visiting Scholar, Educational/Instructional Technology",
    year: "May 2026",
    institution: "Johannes Kepler University Linz",
    location: "Austria",
  },
  {
    category: "Academic Visit",
    name: "Summer Exchange, Educational/Instructional Technology",
    year: "Jul 2021",
    institution: "Peking University",
    location: "Beijing",
  },
  {
    category: "Academic Visit",
    name: "Summer Exchange, Applied Linguistics",
    year: "Jul 2019",
    institution: "The University of Hong Kong",
    location: "Hong Kong SAR",
  },
  {
    category: "Academic Visit",
    name: "Summer Exchange, Environmental Policy",
    year: "Jul 2018",
    institution: "Duke Kunshan University",
    location: "Kunshan",
  },
  {
    category: "Selected Conferences",
    name: "GCCCE 2026",
    year: "May 2026",
    location: "Hong Kong",
  },
  {
    category: "Selected Conferences",
    name: "The 2nd Reimagining STEAM Education",
    year: "May 2026",
    location: "Linz",
  },
  {
    category: "Selected Conferences",
    name: "American Educational Research Association Annual Meeting",
    year: "Apr 2026",
    location: "Los Angeles",
  },
  {
    category: "Selected Conferences",
    name: "British Educational Research Association Conference",
    year: "Sep 2025",
    location: "Brighton",
  },
  {
    category: "Selected Conferences",
    name: "American Educational Research Association Annual Meeting",
    year: "Apr 2025",
    location: "Denver",
  },
  { category: "Peer Review Service", name: "International Journal of Educational Technology in Higher Education" },
  { category: "Peer Review Service", name: "AI & Society" },
  { category: "Peer Review Service", name: "Humanities and Social Sciences Communications" },
  { category: "Peer Review Service", name: "The Australian Educational Researcher" },
  { category: "Peer Review Service", name: "Interactive Learning Environments" },
  { category: "Peer Review Service", name: "International Journal of STEM Education" },
  { category: "Peer Review Service", name: "English Teaching & Learning" },
  {
    category: "Awards & Distinctions",
    name: "Academic Award Scholarship, Master of Education Programme",
    year: "2020–2021",
  },
  { category: "Awards & Distinctions", name: "Dean’s Honour List", year: "2021" },
  { category: "Awards & Distinctions", name: "Master of Education with Distinction", year: "2021" },
  {
    category: "Awards & Distinctions",
    name: "Outstanding Graduate and Outstanding Undergraduate Thesis",
    year: "2020",
  },
];
