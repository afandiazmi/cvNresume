import { DocumentType, TemplateType, ResumeData, PhotoConfig, NameConfig } from './types';

export const DEFAULT_PHOTO_CONFIG: PhotoConfig = {
  shape: 'circle',
  size: 128, // 32 * 4 = 128px (approx standard w-32)
  border: true,
  grayscale: false
};

export const DEFAULT_NAME_CONFIG: NameConfig = {
  size: 48, // approx 3rem
  bold: true,
  uppercase: false,
  align: 'left'
};

export const INITIAL_DATA: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  photoUrl: '',
  photoConfig: DEFAULT_PHOTO_CONFIG,
  nameConfig: DEFAULT_NAME_CONFIG,
  summary: '',
  skills: [],
  languages: [],
  experience: [],
  education: [],
  projects: [],
  publications: [],
  awards: [],
  researchInterests: [],
  references: [],
  memberships: []
};

export const MOCK_USER_DATA: ResumeData = {
  fullName: 'Alex J. Mercer',
  email: 'alex.mercer@example.com',
  phone: '+1 (415) 555-0123',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexmercer',
  website: 'alexmercer.dev',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  photoConfig: DEFAULT_PHOTO_CONFIG,
  nameConfig: { ...DEFAULT_NAME_CONFIG, uppercase: true }, // Example variation
  summary: 'Innovative Senior Software Engineer and Researcher with 7+ years of experience in distributed systems and artificial intelligence. Proven track record of leading cross-functional teams to deliver scalable solutions improving system efficiency by 40%. Passionate about bridging the gap between academic research and practical industry applications.',
  skills: [
    'React', 'TypeScript', 'Node.js', 'Python', 'Go', 
    'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 
    'System Design', 'Agile Leadership', 'CI/CD'
  ],
  languages: ['English (Native)', 'Spanish (Professional Working)', 'Mandarin (Conversational)'],
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Architected and led the migration of a legacy monolith to a microservices architecture using Go and gRPC, reducing deployment time by 60%.\n• Spearheaded the development of a real-time analytics dashboard using React and D3.js, processing 1M+ events per second.\n• Mentored 4 junior engineers, conducting weekly code reviews and technical workshops to foster team growth.'
    },
    {
      id: '2',
      title: 'Software Developer',
      company: 'Innovate Corp',
      location: 'Austin, TX',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Developed high-performance RESTful APIs using Node.js and Express, supporting a user base of 500k+ active monthly users.\n• Collaborated with product managers and UX designers to implement responsive UI components, improving mobile conversion rates by 25%.\n• Automated testing pipelines using Jest and CircleCI, increasing code coverage from 45% to 85%.'
    },
    {
      id: '3',
      title: 'Graduate Research Assistant',
      company: 'University of Texas AI Lab',
      location: 'Austin, TX',
      startDate: '2016-08',
      endDate: '2018-05',
      current: false,
      description: '• Conducted research on reinforcement learning algorithms for autonomous systems under Dr. Sarah Connor.\n• Published 2 peer-reviewed papers in top-tier conferences (NeurIPS, ICML).\n• Assisted in teaching "Intro to Machine Learning" to a class of 150+ undergraduate students.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'M.S. Computer Science (Artificial Intelligence)',
      location: 'Stanford, CA',
      graduationDate: '2020',
      details: 'Thesis: "Optimizing Neural Networks for Edge Computing Devices"\nGPA: 3.9/4.0'
    },
    {
      id: '2',
      institution: 'University of Texas at Austin',
      degree: 'B.S. Computer Science',
      location: 'Austin, TX',
      graduationDate: '2018',
      details: 'Magna Cum Laude, Dean\'s List (All Semesters)\nPresident of Computer Science Student Association'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'EcoTrack',
      role: 'Lead Developer',
      link: 'github.com/alexmercer/ecotrack',
      description: 'Open-source React Native application tracking carbon footprints. Featured on Product Hunt with 2,000+ active users. Integrated Google Maps API to visualize local recycling centers.'
    },
    {
      id: '2',
      name: 'NeuralVis',
      role: 'Creator',
      link: 'neuralvis.io',
      description: 'Interactive web tool for visualizing neural network layers and activations in real-time. Built with WebGL and Three.js to help students understand deep learning concepts.'
    }
  ],
  publications: [
    {
      id: '1',
      citation: 'Mercer, A., & Connor, S. (2020). "Efficient Edge Inference for Deep Learning Models." Proceedings of the International Conference on Machine Learning (ICML).',
      link: 'doi.org/10.1145/example1'
    },
    {
      id: '2',
      citation: 'Mercer, A. (2019). "A Comparative Study of Reinforcement Learning Policies." Journal of Artificial Intelligence Research, 45(2), 112-125.',
      link: 'doi.org/10.1145/example2'
    }
  ],
  awards: [
    'TechFlow Employee of the Year (2022)',
    'ACM Best Paper Award (ICML Student Track 2020)',
    'National Merit Scholar (2014)'
  ],
  researchInterests: [
    'Distributed Systems',
    'Edge Computing',
    'Reinforcement Learning',
    'Human-Computer Interaction'
  ],
  references: [
    {
      id: '1',
      name: 'Dr. Sarah Connor',
      position: 'Professor of Computer Science, UT Austin',
      contact: 'sarah.connor@utexas.edu'
    },
    {
      id: '2',
      name: 'James Wright',
      position: 'CTO, TechFlow Solutions',
      contact: 'j.wright@techflow.com'
    }
  ],
  memberships: [
    'Association for Computing Machinery (ACM)',
    'IEEE Computer Society'
  ]
};

export const TEMPLATES = [
  { id: TemplateType.MODERN, name: 'Modern', description: 'Clean, two-column layout ideal for industry.' },
  { id: TemplateType.CLASSIC, name: 'Classic', description: 'Traditional, single-column suitable for Academic CVs.' },
  { id: TemplateType.MINIMAL, name: 'Minimal', description: 'Simple and elegant, focus on content.' },
];

export const THEME_COLORS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Fuchsia', hex: '#c026d3' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Black', hex: '#000000' },
];