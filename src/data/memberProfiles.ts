import { LifeStage } from '../types';

export interface CompletedTask {
  id: string;
  title: string;
  category: string;
  date: string;
  type: 'challenge' | 'sprint' | 'guild' | 'project';
}

export interface OngoingActivity {
  id: string;
  title: string;
  progress: number;
  sprintWeek: string;
  details: string;
}

export interface MemberProject {
  name: string;
  description: string;
  techStack: string[];
  status: 'active' | 'completed' | 'prototype';
}

export interface MemberExperience {
  role: string;
  organization: string;
  period: string;
  summary: string;
}

export interface MemberAchievement {
  title: string;
  issuer: string;
  year: string;
  iconType: 'award' | 'badge' | 'cert';
}

export interface MemberProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  shortIntro: string;
  roleLabel: string;
  lifeStage: LifeStage;
  availableHoursPerWeek: number;
  preferredLearningStyle: string;
  profileVisibility: 'public' | 'connections_only' | 'private';
  location: string;
  joinedDate: string;

  // Personal introduction and career goals
  intro: string;
  careerGoals: string;

  // Skills and areas of interest
  skills: string[];
  interests: string[];
  toolsAndTech: string[];

  // Completed tasks and ongoing activities
  completedTasks: CompletedTask[];
  ongoingActivities: OngoingActivity[];

  // Projects, accomplishments, and experience
  projects: MemberProject[];
  experience: MemberExperience[];

  // Learning progress and future goals
  progressPercentage: number;
  currentMilestone: string;
  futureGoals: string[];

  // Relevant achievements, certifications, or professional experience
  achievements: MemberAchievement[];
}

export const THREE_MEMBER_PROFILES: MemberProfileData[] = [
  {
    id: 'user_member_1',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    shortIntro: 'Sports analytics enthusiast exploring tactical match modeling, spatial tracking, and interactive journalism.',
    roleLabel: 'Community Member',
    lifeStage: 'career_transition',
    availableHoursPerWeek: 6,
    preferredLearningStyle: 'Hands-on project sprints',
    profileVisibility: 'public',
    location: 'Chicago, IL',
    joinedDate: 'September 2026',

    intro: 'I combine athletic performance intuition with modern data science. Having competed in collegiate athletics, I am passionate about uncovering patterns hidden in spatial coordinate data, pass network graphs, and athlete recovery telemetry.',
    careerGoals: 'Transition into a professional athletic intelligence department or club analytics group, translating pitch tracking data into intuitive tactical briefings for coaches and athletes.',

    skills: [
      'Event-Data Processing',
      'Spatial Pitch Control',
      'Expected Goals (xG) Modeling',
      'Python (Pandas / Matplotlib)',
      'Tableau Visualizations',
      'SQL Querying'
    ],
    interests: [
      'Tactical Soccer Analysis',
      'Basketball Shot Distribution',
      'Athlete Recovery & Load',
      'Interactive Data Journalism'
    ],
    toolsAndTech: ['StatsBomb Open Data', 'Python 3.12', 'Streamlit', 'Figma', 'Jupyter Notebooks'],

    completedTasks: [
      {
        id: 't_1',
        title: 'Analyzed Expected Goals (xG) Shot Map distribution in Premier League',
        category: '30-min Micro-Challenge',
        date: 'Oct 12, 2026',
        type: 'challenge'
      },
      {
        id: 't_2',
        title: 'Built pass-network graphing notebook with directional pass flow',
        category: 'Sprint 1 Project',
        date: 'Oct 02, 2026',
        type: 'sprint'
      },
      {
        id: 't_3',
        title: 'Published tactical teardown paper on high-press triggers in tournament play',
        category: 'Guild Publication',
        date: 'Sep 24, 2026',
        type: 'guild'
      },
      {
        id: 't_4',
        title: 'Verified and cleaned raw event tracking feeds from Opta & StatsBomb',
        category: 'Data Pipeline',
        date: 'Sep 18, 2026',
        type: 'project'
      }
    ],
    ongoingActivities: [
      {
        id: 'a_1',
        title: 'Spatial Pitch Control & Voronoi Tessellation experiment',
        progress: 75,
        sprintWeek: 'Week 3 of 4',
        details: 'Calculating player space ownership frames during counter-attacks.'
      },
      {
        id: 'a_2',
        title: 'Mentorship dialogue with Dr. Aris Thorne on load metrics',
        progress: 60,
        sprintWeek: 'Ongoing',
        details: 'Reviewing heart-rate variance and sprint velocity correlations.'
      },
      {
        id: 'a_3',
        title: 'Peer review in Sports Analytics Guild',
        progress: 90,
        sprintWeek: 'This Week',
        details: 'Reviewing two community member tactical breakdown drafts.'
      }
    ],

    projects: [
      {
        name: 'ShotMatrix Studio',
        description: 'Interactive web dashboard visualizing expected goals (xG) distributions with shot angles and defender proximity calculations.',
        techStack: ['Python', 'Streamlit', 'Matplotlib', 'StatsBomb API'],
        status: 'active'
      },
      {
        name: 'Tactical Press Breakdown',
        description: 'Published deep-dive multimedia essay evaluating midfield counter-press velocity during set-piece transitions.',
        techStack: ['Datawrapper', 'Figma', 'VideoSync'],
        status: 'completed'
      }
    ],
    experience: [
      {
        role: 'Collegiate Track & Field Captain & Analyst',
        organization: 'Midwest Athletic Conference',
        period: '2023 - 2025',
        summary: 'Led team performance tracking sessions, analyzing split times and stride cadence for 24 sprinters.'
      },
      {
        role: 'Junior Data Analyst Intern',
        organization: 'Apex Sports Media',
        period: 'Summer 2025',
        summary: 'Built automated pre-match stat cards and graphic overlays for live broadcast talent.'
      }
    ],

    progressPercentage: 68,
    currentMilestone: 'Sprint 2: Spatial Pitch Control Notebook & Interactive Replay',
    futureGoals: [
      'Publish open-source Python wrapper for sports tracking dataset cleaning',
      'Complete mock tactical interview with professional club analyst',
      'Speak at the Midwest Sports Analytics Community Showcase'
    ],

    achievements: [
      {
        title: 'Certified Data Science Associate',
        issuer: 'Python Institute',
        year: '2025',
        iconType: 'cert'
      },
      {
        title: 'Sports Analytics Hackathon Finalist',
        issuer: 'StatsPerform Guild',
        year: '2026',
        iconType: 'award'
      },
      {
        title: 'Verified Milestone: Tactical Event Modeling',
        issuer: 'Skill Path Community',
        year: '2026',
        iconType: 'badge'
      }
    ]
  },
  {
    id: 'user_member_2',
    name: 'Julian Sterling',
    email: 'julian.sterling@example.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    shortIntro: 'Creative technologist and frontend engineer exploring generative audio, WebGL shaders, and accessibility.',
    roleLabel: 'Community Member',
    lifeStage: 'employed',
    availableHoursPerWeek: 8,
    preferredLearningStyle: 'Collaborative prototyping',
    profileVisibility: 'public',
    location: 'Austin, TX',
    joinedDate: 'August 2026',

    intro: 'Self-taught developer and musician passionate about multisensory digital experiences. I believe digital products should be expressive, engaging, and genuinely inclusive for neurodivergent and disabled users.',
    careerGoals: 'Direct interactive experience engineering at a creative studio, building accessible web installations, audio-reactive tools, and modular design systems.',

    skills: [
      'TypeScript / React 19',
      'Three.js & WebGL Shaders',
      'Web Audio API',
      'WCAG 2.2 AA Accessibility',
      'Audio DSP Basics',
      'GLSL Fragment Shaders'
    ],
    interests: [
      'Creative Coding',
      'Generative Ambient Music',
      'Kinetic Typography',
      'Hardware Synths & MIDI'
    ],
    toolsAndTech: ['Vite', 'Three.js', 'Web Audio API', 'Figma Tokens', 'Tailwind CSS'],

    completedTasks: [
      {
        id: 't_201',
        title: 'Synthesized polyphonic oscillator with custom ADSR envelopes',
        category: '30-min Micro-Challenge',
        date: 'Oct 16, 2026',
        type: 'challenge'
      },
      {
        id: 't_202',
        title: 'Refactored web portfolio for full screen-reader & keyboard compliance',
        category: 'Sprint 2 Project',
        date: 'Oct 08, 2026',
        type: 'sprint'
      },
      {
        id: 't_203',
        title: 'Presented WebGL shader lighting & bloom workshop in Creative Tech Guild',
        category: 'Guild Workshop',
        date: 'Sep 29, 2026',
        type: 'guild'
      },
      {
        id: 't_204',
        title: 'Published reusable React hook for live audio FFT frequency spectrum analysis',
        category: 'Open Source',
        date: 'Sep 14, 2026',
        type: 'project'
      }
    ],
    ongoingActivities: [
      {
        id: 'a_201',
        title: 'Polyphonic Web Synth with customizable audio filters',
        progress: 85,
        sprintWeek: 'Week 4 of 4',
        details: 'Fine-tuning low-pass resonance and filter sweep curves.'
      },
      {
        id: 'a_202',
        title: 'Auditing color contrast algorithms for high-contrast dark themes',
        progress: 65,
        sprintWeek: 'Sprint 3',
        details: 'Testing APCA contrast calculations across OLED display profiles.'
      },
      {
        id: 'a_203',
        title: 'Collaborative audio jam session preparation with guild members',
        progress: 40,
        sprintWeek: 'This Weekend',
        details: 'Building networked WebRTC audio synchronizer prototype.'
      }
    ],

    projects: [
      {
        name: 'AmbientWave',
        description: 'Real-time generative ambient soundscape generator driven by open weather API atmospheric pressure and wind readings.',
        techStack: ['Web Audio API', 'TypeScript', 'Canvas2D'],
        status: 'active'
      },
      {
        name: 'AccessibleShaders UI',
        description: 'Open-source sandbox demonstrating high-performance WebGL shaders with built-in prefers-reduced-motion fallbacks.',
        techStack: ['React', 'Three.js', 'GLSL Shaders'],
        status: 'completed'
      }
    ],
    experience: [
      {
        role: 'Frontend Experience Engineer',
        organization: 'Prism Creative Studio',
        period: '2023 - Present',
        summary: 'Building dynamic interactive web applications, client micro-sites, and custom marketing animations.'
      },
      {
        role: 'Audio Producer & Sound Designer',
        organization: 'Freelance Studio',
        period: '2021 - 2023',
        summary: 'Produced original sound libraries and game audio cues for four indie mobile releases.'
      }
    ],

    progressPercentage: 82,
    currentMilestone: 'Sprint 3: Web Audio Modular Synthesizer Architecture',
    futureGoals: [
      'Publish npm package for accessible canvas keyboard controls',
      'Host community workshop on WebGL creative coding for beginners',
      'Launch interactive generative music album directly on the web'
    ],

    achievements: [
      {
        title: 'Certified Professional in Web Accessibility (CPWA)',
        issuer: 'IAAP International',
        year: '2025',
        iconType: 'cert'
      },
      {
        title: 'Awwwards Site of the Day Honors',
        issuer: 'Awwwards Design Board',
        year: '2024',
        iconType: 'award'
      },
      {
        title: 'Verified Milestone: Web Audio DSP Foundations',
        issuer: 'Skill Path Community',
        year: '2026',
        iconType: 'badge'
      }
    ]
  },
  {
    id: 'user_member_3',
    name: 'Nia Westbrook',
    email: 'nia.westbrook@example.com',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    shortIntro: 'Environmental researcher exploring climate data modeling, IoT micro-sensors, and community policy.',
    roleLabel: 'Community Member',
    lifeStage: 'exploring',
    availableHoursPerWeek: 5,
    preferredLearningStyle: 'Research & field telemetry',
    profileVisibility: 'public',
    location: 'Seattle, WA',
    joinedDate: 'July 2026',

    intro: 'Environmental systems researcher dedicated to democratizing ecological data. I focus on turning complex satellite feeds and low-cost IoT sensor networks into clear, actionable community resilience tools.',
    careerGoals: 'Lead community-driven climate resilience initiatives, partnering with municipal planning boards and educational institutions to deploy open environmental monitoring networks.',

    skills: [
      'Geographic Information Systems (GIS)',
      'Python (Geopandas / Rasterio)',
      'IoT Sensor Calibration',
      'Environmental Policy',
      'Air Quality Telemetry',
      'Statistical Analysis (R)'
    ],
    interests: [
      'Urban Heat Islands',
      'Hyperlocal Air Quality',
      'Canopy Deficit Mapping',
      'Citizen Science Initiatives'
    ],
    toolsAndTech: ['QGIS', 'OpenAQ API', 'ESP32 IoT Sensors', 'Jupyter Lab', 'PostGIS'],

    completedTasks: [
      {
        id: 't_301',
        title: 'Interpolated Urban Heat Island satellite thermal band against land-cover raster',
        category: '30-min Micro-Challenge',
        date: 'Oct 18, 2026',
        type: 'challenge'
      },
      {
        id: 't_302',
        title: 'Field calibrated 5 particulate matter sensor nodes against EPA reference monitor',
        category: 'Field Experiment',
        date: 'Oct 05, 2026',
        type: 'sprint'
      },
      {
        id: 't_303',
        title: 'Published open GIS notebook mapping neighborhood tree canopy disparities',
        category: 'Research Brief',
        date: 'Sep 22, 2026',
        type: 'guild'
      },
      {
        id: 't_304',
        title: 'Conducted workshop on low-cost IoT air monitoring for high school science teachers',
        category: 'Community Education',
        date: 'Sep 09, 2026',
        type: 'project'
      }
    ],
    ongoingActivities: [
      {
        id: 'a_301',
        title: 'Microclimate variance map of local transit corridors',
        progress: 50,
        sprintWeek: 'Week 2 of 4',
        details: 'Overlaying bus stop shelter heat indexes with pedestrian density.'
      },
      {
        id: 'a_302',
        title: 'Drafting policy memorandum for city council environmental committee',
        progress: 45,
        sprintWeek: 'Drafting Phase',
        details: 'Providing empirical sensor evidence for urban greening funding.'
      },
      {
        id: 'a_303',
        title: 'Coordinating monthly citizen-science sensor calibration drive',
        progress: 70,
        sprintWeek: 'Upcoming Week',
        details: 'Distributing 10 new solar sensor kits to neighborhood volunteers.'
      }
    ],

    projects: [
      {
        name: 'BreatheNeighborhood',
        description: 'Open-source hyperlocal air quality dashboard pulling from community particulate sensors with SMS threshold alerts.',
        techStack: ['Python', 'Leaflet', 'FastAPI', 'OpenAQ'],
        status: 'active'
      },
      {
        name: 'CanopyVulnerability Index',
        description: 'Spatial correlation study linking neighborhood surface temperatures with historic urban planning and tree coverage.',
        techStack: ['QGIS', 'R Language', 'PostGIS'],
        status: 'completed'
      }
    ],
    experience: [
      {
        role: 'Environmental Research Associate',
        organization: 'Pacific Climate Studies Institute',
        period: '2024 - Present',
        summary: 'Analyzing microclimate variations across urban topographies; managing multi-node sensor deployments.'
      },
      {
        role: 'Environmental Education Coordinator',
        organization: 'Urban Ecology Center',
        period: '2022 - 2024',
        summary: 'Organized public watershed monitoring and youth citizen science field excursions.'
      }
    ],

    progressPercentage: 55,
    currentMilestone: 'Sprint 2: Hyperlocal Microclimate Correlation Mapping',
    futureGoals: [
      'Deploy 25-node open telemetry network across regional greenways',
      'Present canopy equity study at National Environmental GIS Conference',
      'Publish accessible citizen science handbook for neighborhood groups'
    ],

    achievements: [
      {
        title: 'GIS Professional Certification (GISP)',
        issuer: 'GIS Certification Institute',
        year: '2024',
        iconType: 'cert'
      },
      {
        title: 'Clean Air Community Ambassador Award',
        issuer: 'Pacific Clean Air Agency',
        year: '2025',
        iconType: 'award'
      },
      {
        title: 'Verified Milestone: Spatial Telemetry & GIS Analysis',
        issuer: 'Skill Path Community',
        year: '2026',
        iconType: 'badge'
      }
    ]
  }
];
