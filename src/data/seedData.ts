import {
  Interest,
  Challenge,
  Community,
  CommunityPost,
  ExpertProfile,
  UserProfile,
  DiscoveryQuestion,
  AuditLog,
  UserReport,
  Recommendation
} from '../types';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_member_ananya',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@student.skillpath.org',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Passionate about using AI to solve real-world problems. AI/ML student training predictive neural networks and data models.',
    lifeStage: 'college',
    ageRange: '20-24',
    availableHoursPerWeek: 8,
    preferredLearningStyle: 'hands_on',
    profileVisibility: 'public',
    onboardingCompleted: true,
    interestsPrimary: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    interestsSecondary: ['Healthcare AI', 'Explainable AI'],
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'user_member_rahul',
    name: 'Rahul Varma',
    email: 'rahul.varma@student.skillpath.org',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Enjoys building practical web applications and improving coding skills. Full-Stack developer crafting modular applications.',
    lifeStage: 'college',
    ageRange: '20-24',
    availableHoursPerWeek: 10,
    preferredLearningStyle: 'hands_on',
    profileVisibility: 'public',
    onboardingCompleted: true,
    interestsPrimary: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    interestsSecondary: ['REST APIs', 'WebSockets'],
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'user_member_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.skillpath.org',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    bio: 'Interested in discovering useful insights from data and presenting them visually. Data analyst building executive BI dashboards.',
    lifeStage: 'college',
    ageRange: '20-24',
    availableHoursPerWeek: 6,
    preferredLearningStyle: 'hands_on',
    profileVisibility: 'public',
    onboardingCompleted: true,
    interestsPrimary: ['Python', 'Excel', 'SQL', 'Power BI'],
    interestsSecondary: ['Business Intelligence', 'Cohort Retention'],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'user_expert_1',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@example.com',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Sports Data Analyst & Coach. Passionate about helping athletes and enthusiasts understand tactical modeling without jargon.',
    lifeStage: 'employed',
    ageRange: '35-44',
    availableHoursPerWeek: 4,
    preferredLearningStyle: 'mentored',
    profileVisibility: 'public',
    onboardingCompleted: true,
    interestsPrimary: ['Sports Analytics', 'Coaching & Mentoring', 'Applied Statistics'],
    interestsSecondary: ['Cricket Tactics', 'Youth Athletics'],
    createdAt: '2026-08-01T08:30:00Z'
  },
  {
    id: 'user_admin_1',
    name: 'Elena Rostova',
    email: 'admin.elena@skillpath.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform Governance & Safety Director. Ensuring trustworthy mentor validation and community health.',
    lifeStage: 'employed',
    ageRange: '35-44',
    availableHoursPerWeek: 20,
    preferredLearningStyle: 'collaborative',
    profileVisibility: 'public',
    onboardingCompleted: true,
    interestsPrimary: ['Community Moderation', 'Educational Safety', 'Ethics in Mentorship'],
    interestsSecondary: ['Growth Systems'],
    createdAt: '2026-07-10T09:00:00Z'
  }
];

export const SEED_EXPERTS: ExpertProfile[] = [
  {
    userId: 'user_expert_1',
    name: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: 'Senior Sports Data Scientist & High-Performance Athletic Consultant',
    bio: '12+ years translating on-field performance metrics into actionable tactical training plans. Experience with national cricket leagues and football academies.',
    areasOfExpertise: ['Sports Analytics', 'Tactical Match Analysis', 'Data Visualization', 'Athlete Feedback'],
    qualifications: 'Ph.D. in Applied Biomechanics & Sports Science, University of Leeds. Certified High Performance Analyst.',
    verified: true,
    verificationBadgeDate: '2026-08-15',
    availability: 'open',
    languages: ['English', 'Spanish'],
    preferredMenteeGoals: ['Career transition into sports analytics', 'Beginner sports modeling', 'Portfolio projects'],
    menteesCount: 7,
    ratingAverage: 4.9
  },
  {
    userId: 'expert_2',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    headline: 'Principal Interactive Experience Designer & Creative Technologist',
    bio: 'Former creative technologist at MIT Media Lab. Focuses on turning abstract coding into tangible physical computing, playful interfaces, and generative art.',
    areasOfExpertise: ['Creative Technology', 'Interactive Design', 'Prototyping', 'Generative Media'],
    qualifications: 'M.S. in Media Arts and Sciences. 8+ published interactive installations in Tokyo and New York.',
    verified: true,
    verificationBadgeDate: '2026-09-02',
    availability: 'limited',
    languages: ['English', 'Mandarin'],
    preferredMenteeGoals: ['Building first interactive prototype', 'Cross-disciplinary design thinking'],
    menteesCount: 5,
    ratingAverage: 5.0
  },
  {
    userId: 'expert_3',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    headline: 'Indie Game Director & Narrative Systems Architect',
    bio: 'Independent developer behind three successful narrative indie titles. Dedicated to guiding beginners in game loops, scope management, and empathetic storytelling.',
    areasOfExpertise: ['Game Design', 'World Building', 'Interactive Fiction', 'Indie Publishing'],
    qualifications: 'BA in Creative Writing. IndieCade finalist 2024. Over 10 years of self-taught game production.',
    verified: true,
    verificationBadgeDate: '2026-09-20',
    availability: 'open',
    languages: ['English'],
    preferredMenteeGoals: ['Developing a game concept document', 'Learning lightweight game development tools'],
    menteesCount: 9,
    ratingAverage: 4.8
  },
  {
    userId: 'expert_4',
    name: 'Kavita Iyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    headline: 'Social Enterprise Strategist & Community Organizer',
    bio: 'Helps people turn their care for local neighborhoods and environment into sustainable, grassroots impact initiatives.',
    areasOfExpertise: ['Social Impact', 'Community Organizing', 'Grant Writing', 'Non-profit Leadership'],
    qualifications: 'Master of Public Policy. Founder of Clean Watersheds Collective (500+ volunteers).',
    verified: false, // In verification queue for admin!
    availability: 'open',
    languages: ['English', 'Hindi', 'Tamil'],
    preferredMenteeGoals: ['Starting a local environmental project', 'Volunteer management'],
    menteesCount: 2,
    ratingAverage: 4.7
  }
];

export const SEED_INTERESTS: Interest[] = [
  {
    id: 'int_1',
    name: 'Sports Analytics & Tactical Modeling',
    slug: 'sports-analytics',
    category: 'Sports & Fitness',
    description: 'Transforming matches, player tracking, and strategy into actionable visual insights and predictive performance experiments.',
    beginnerActivities: [
      'Chart pass maps or cricket shot distributions by hand during a live match',
      'Download free open dataset from StatsBomb or cricsheet and calculate run rates',
      'Write a 3-paragraph tactical breakdown of a memorable comeback victory'
    ],
    skillsDeveloped: ['Data Analysis', 'Pattern Recognition', 'Visual Communication', 'Statistical Reasoning'],
    materialsNeeded: ['Spreadsheet program (Google Sheets / Excel)', 'Free public match data', 'Notepad'],
    starterChallenges: ['5-Match Tactical Breakdown Challenge', 'Match Momentum Chart Exercise'],
    careerConnections: ['Sports Data Analyst', 'Performance Coach', 'Sports Journalist', 'Broadcast Statistician'],
    tags: ['Cricket', 'Football', 'Analytics', 'Tactics', 'Strategy'],
    iconName: 'Activity',
    popularityCount: 420
  },
  {
    id: 'int_2',
    name: 'Indie Game Design & Systems',
    slug: 'game-design',
    category: 'Gaming & Esports',
    description: 'Creating playful interactive rules, intuitive player experiences, and memorable mechanics without needing a large studio.',
    beginnerActivities: [
      'Deconstruct a favorite card game and modify one rule to observe how behavior changes',
      'Design a playable one-page pen-and-paper maze RPG with dice',
      'Prototype a simple dialogue choice tree in Twine or Bitsy'
    ],
    skillsDeveloped: ['Systemic Thinking', 'User Experience Empathy', 'Rapid Prototyping', 'Iterative Testing'],
    materialsNeeded: ['Pen and paper', 'Twine or Bitsy (free browser tools)', 'Index cards'],
    starterChallenges: ['One-Page Rulebook Challenge', 'Core Gameplay Loop Deconstruction'],
    careerConnections: ['Game Systems Designer', 'Level Designer', 'Interactive Narrative Writer', 'UX Designer'],
    tags: ['Game Dev', 'Play Design', 'Storytelling', 'Prototyping'],
    iconName: 'Gamepad2',
    popularityCount: 512
  },
  {
    id: 'int_3',
    name: 'Creative Coding & Interactive Tools',
    slug: 'creative-coding',
    category: 'Technology & Programming',
    description: 'Building small, delightful web experiments, generative animations, and personal software tools that bring ideas to life.',
    beginnerActivities: [
      'Generate algorithmic geometric patterns using p5.js in your web browser',
      'Build a simple interactive habit or mood tracker with basic HTML/JS',
      'Customize a personal portfolio page with playful micro-interactions'
    ],
    skillsDeveloped: ['Algorithmic Thinking', 'Interface Construction', 'Debugging', 'Creative Confidence'],
    materialsNeeded: ['Web browser', 'Online code editor (p5.js web editor / CodePen)'],
    starterChallenges: ['Interactive Sound Canvas', 'Generative Wall Art in 20 Lines'],
    careerConnections: ['Frontend Engineer', 'Creative Technologist', 'Tooling Developer', 'Design Systems Specialist'],
    tags: ['Code', 'Generative Art', 'Web', 'Interactive'],
    iconName: 'Code',
    popularityCount: 680
  },
  {
    id: 'int_4',
    name: 'Reflective Non-Fiction & Storytelling',
    slug: 'creative-writing',
    category: 'Writing & Storytelling',
    description: 'Observing everyday life, extracting universal human insights, and shaping essays, investigative articles, or memoirs.',
    beginnerActivities: [
      'Write a 250-word scene capturing the soundscape of a neighborhood market',
      'Conduct a 15-minute oral history interview with an elder or craftsperson',
      'Draft a personal essay reflecting on an unexpected failure that taught a lesson'
    ],
    skillsDeveloped: ['Close Observation', 'Editing & Voice', 'Narrative Arc', 'Empathy'],
    materialsNeeded: ['Journal or minimalist text editor', 'Curiosity and active listening'],
    starterChallenges: ['Micro-Essay Flash Observation', 'Sensory Scene Experiment'],
    careerConnections: ['Essayist', 'Content Strategist', 'Investigative Journalist', 'Narrative Non-Fiction Author'],
    tags: ['Writing', 'Essays', 'Observation', 'Literature'],
    iconName: 'PenTool',
    popularityCount: 390
  },
  {
    id: 'int_5',
    name: 'Sound Design & Field Recording',
    slug: 'sound-design',
    category: 'Music & Performance',
    description: 'Capturing ambient acoustic environments, sculpting synthesizers, and creating emotional soundscapes for media and games.',
    beginnerActivities: [
      'Record 5 distinct household sounds on a phone voice memo and layer them in Audacity',
      'Re-score a 30-second silent film clip using everyday acoustic Foley sounds',
      'Create an ambient meditation drone with a free virtual synthesizer'
    ],
    skillsDeveloped: ['Critical Listening', 'Frequency Balancing', 'Audio Editing', 'Emotional Pacing'],
    materialsNeeded: ['Smartphone voice recorder', 'Free Audacity audio editor', 'Headphones'],
    starterChallenges: ['Kitchen Foley Soundscape', '30-Second Atmosphere Crafting'],
    careerConnections: ['Audio Engineer', 'Podcast Producer', 'Game Sound Designer', 'Composer'],
    tags: ['Audio', 'Sound', 'Acoustics', 'Foley', 'Music'],
    iconName: 'Music',
    popularityCount: 295
  },
  {
    id: 'int_6',
    name: 'Community Organizing & Grassroots Impact',
    slug: 'community-organizing',
    category: 'Social Impact & Volunteering',
    description: 'Bringing neighbors together around shared causes, municipal improvements, and mutual aid collectives.',
    beginnerActivities: [
      'Map 3 unaddressed public space issues in your immediate 500-meter radius',
      'Host an informal 45-minute neighborhood walk to gather feedback',
      'Draft a 1-page action proposal for a local library or park committee'
    ],
    skillsDeveloped: ['Stakeholder Facilitation', 'Coalition Building', 'Public Speaking', 'Campaign Planning'],
    materialsNeeded: ['Notepad', 'Local community directory or municipal bulletin'],
    starterChallenges: ['Neighborhood Needs Audit', 'First Community Meetup Blueprint'],
    careerConnections: ['Nonprofit Program Manager', 'Policy Advocate', 'Community Manager', 'Urban Planner'],
    tags: ['Civic', 'Community', 'Volunteering', 'Grassroots'],
    iconName: 'Users',
    popularityCount: 310
  },
  {
    id: 'int_7',
    name: 'Mindful Strength & Athletic Movement',
    slug: 'mindful-fitness',
    category: 'Sports & Fitness',
    description: 'Building sustainable lifelong physical durability, joint mobility, and body awareness without extreme burnout.',
    beginnerActivities: [
      'Perform a 10-minute daily joint mobility routine focusing on ankle and thoracic spine',
      'Log RPE (Rate of Perceived Exertion) and energy levels across 3 light bodyweight workouts',
      'Practice rhythmic breath pacing during steady aerobic movement'
    ],
    skillsDeveloped: ['Body Kinesthesia', 'Progressive Overload Planning', 'Recovery Discipline'],
    materialsNeeded: ['Exercise mat', 'Timer or stopwatch', 'Comfortable attire'],
    starterChallenges: ['14-Day Joint Mobility Experiment', 'Pacing & Breath Endurance Log'],
    careerConnections: ['Mobility Coach', 'Physical Therapist Assistant', 'Strength & Conditioning Trainer'],
    tags: ['Movement', 'Strength', 'Health', 'Mobility'],
    iconName: 'HeartPulse',
    popularityCount: 460
  },
  {
    id: 'int_8',
    name: 'Scientific Experimentation & Bio-Curiosity',
    slug: 'scientific-experimentation',
    category: 'Science & Experimentation',
    description: 'Formulating hypotheses, measuring variables, and discovering ecological patterns through home and citizen science.',
    beginnerActivities: [
      'Catalog 10 local flora species using iNaturalist citizen science platform',
      'Run a kitchen fermentation experiment observing yeast carbon dioxide rates under temperature variations',
      'Analyze public meteorological air quality data for your region'
    ],
    skillsDeveloped: ['Hypothesis Testing', 'Variable Isolation', 'Measurement Rigor', 'Data Logging'],
    materialsNeeded: ['Mason jars', 'Sugar/yeast', 'Digital notebook or spreadsheet'],
    starterChallenges: ['Microbiome Kitchen Observation', 'Local Biodiversity Audit'],
    careerConnections: ['Laboratory Analyst', 'Environmental Consultant', 'Science Communicator', 'Research Assistant'],
    tags: ['Biology', 'Ecology', 'Experiments', 'Citizen Science'],
    iconName: 'FlaskConical',
    popularityCount: 275
  }
];

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: 'chal_1',
    title: 'Match Momentum & Pressure Breakdown',
    category: 'Sports & Fitness',
    difficulty: 'Beginner',
    estimatedDuration: '45 mins',
    objective: 'Watch 20 minutes of any competitive match and record momentum shifts to test your analytical instincts.',
    materials: ['A recorded or live sporting event', 'Notepad or spreadsheet', 'Pen'],
    instructions: [
      'Choose a 20-minute segment of a match (cricket over 15-20, football 60th-80th min, or tennis set 2).',
      'Every 2 minutes, rate which team or player holds the psychological momentum on a scale of -5 to +5.',
      'Jot down the specific triggers (e.g. unforced error, tactical substitution, aggressive line) that caused shifts.',
      'Reflect on whether tracking the underlying structure felt engaging or tedious.'
    ],
    reflectionPrompt: 'Did focusing on the tactical patterns increase or decrease your enjoyment of the match?',
    iconName: 'BarChart2'
  },
  {
    id: 'chal_2',
    title: 'The 1-Page Rulebook: Invent a Card Variant',
    category: 'Gaming & Esports',
    difficulty: 'Beginner',
    estimatedDuration: '30 mins',
    objective: 'Modify standard playing cards by changing one constraint to experience game mechanic design.',
    materials: ['Standard 52-card deck', 'Index card or scrap paper'],
    instructions: [
      'Take a standard card game you know well (e.g. Crazy Eights, War, or Uno).',
      'Introduce ONE new rule (e.g., Red 7s allow a player to steal a card, or players must whisper their bids).',
      'Play 2 rounds with a friend or simulate 2 turns yourself.',
      'Observe what emergent behavior arose from your single constraint.'
    ],
    reflectionPrompt: 'What was the most surprising unintended consequence of your new rule?',
    iconName: 'Sparkles'
  },
  {
    id: 'chal_3',
    title: 'The 250-Word Sensory Snapshot',
    category: 'Writing & Storytelling',
    difficulty: 'Beginner',
    estimatedDuration: '25 mins',
    objective: 'Describe a single physical location using 4 of the 5 senses without naming the location explicitly.',
    materials: ['Pen and notebook', 'Timer set for 20 minutes'],
    instructions: [
      'Pick a location you visited recently (a subway station, a bakery, a wet field, a tool shed).',
      'List at least 1 sound, 1 smell, 1 physical texture, and 1 lighting detail.',
      'Write a 200 to 250-word paragraph describing the scene without ever stating what place it is.',
      'Read it aloud to test the rhythm of your sentences.'
    ],
    reflectionPrompt: 'Did you enjoy searching for precise sensory words, or did you feel impatient with descriptive details?',
    iconName: 'BookOpen'
  },
  {
    id: 'chal_4',
    title: 'The 10-Line Micro Interactive Toy',
    category: 'Technology & Programming',
    difficulty: 'Beginner',
    estimatedDuration: '35 mins',
    objective: 'Build a playful mouse-reactive geometric sketch in your browser to feel immediate code feedback.',
    materials: ['Computer with internet connection', 'Browser open to editor.p5js.org'],
    instructions: [
      'Open the free p5.js web editor at editor.p5js.org.',
      'In the draw() loop, replace the code with a circle following `mouseX` and `mouseY`.',
      'Change the fill color dynamically based on distance or time.',
      'Tweak size, speed, and transparency until the visual motion feels satisfying.'
    ],
    reflectionPrompt: 'When you tweaked variables and saw instant visual changes, did you feel a spark of curiosity to push further?',
    iconName: 'Terminal'
  }
];

export const SEED_COMMUNITIES: Community[] = [
  {
    id: 'comm_1',
    name: 'Sports Analytics & Tactical Guild',
    slug: 'sports-analytics-guild',
    category: 'Sports & Fitness',
    description: 'A welcoming space for cricket, football, basketball, and athletics fans experimenting with stats, modeling, and match strategy.',
    rules: [
      'Be respectful when disagreeing about tactics or teams.',
      'Share your data sources when posting charts.',
      'Beginner questions are warmly welcomed.'
    ],
    memberCount: 284,
    postCount: 42,
    joined: true
  },
  {
    id: 'comm_2',
    name: 'Indie Game Creators & Concept Artists',
    slug: 'indie-game-creators',
    category: 'Gaming & Esports',
    description: 'Discussing game loops, narrative pacing, pixel art, and solo development journeys. No experience required.',
    rules: [
      'Constructive feedback only on game prototypes.',
      'Credit asset creators when posting inspiration.',
      'Celebrate small shipped experiments.'
    ],
    memberCount: 341,
    postCount: 56,
    joined: false
  },
  {
    id: 'comm_3',
    name: 'Quiet Writers & Field Observers',
    slug: 'quiet-writers',
    category: 'Writing & Storytelling',
    description: 'Daily micro-writing prompts, peer constructive critique, and essay drafting discussions.',
    rules: [
      'Respect personal lived experiences shared in essays.',
      'Keep critiques focused on clarity and voice.',
      'No plagiarism or uncredited text.'
    ],
    memberCount: 198,
    postCount: 38,
    joined: true
  },
  {
    id: 'comm_4',
    name: 'Creative Coders & Tool Makers',
    slug: 'creative-coders',
    category: 'Technology & Programming',
    description: 'Sharing visual p5 sketches, generative algorithms, micro-SaaS prototypes, and browser experiments.',
    rules: [
      'Provide open-source links or snippets when sharing visual sketches.',
      'Support beginners with gentle debugging hints.'
    ],
    memberCount: 412,
    postCount: 89,
    joined: false
  }
];

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    communityId: 'comm_1',
    authorId: 'user_member_1',
    authorName: 'Maya Lin',
    authorRole: 'member',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'First attempt charting death-over run rates in T20: What I learned',
    content: 'I completed the 45-minute match breakdown challenge on yesterday’s game. Charting dot-ball percentage against bowler economy revealed how two bad deliveries in the 18th over completely flipped expected win probability. For anyone starting out: don’t worry about complex Python models yet, simple Excel scatter plots were eye-opening!',
    tags: ['Cricket', 'Beginner', 'MatchBreakdown'],
    likes: 24,
    userLiked: true,
    createdAt: '2026-10-20T14:15:00Z',
    comments: [
      {
        id: 'comm_c1',
        authorName: 'Dr. Aris Thorne',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'expert',
        content: 'Terrific takeaway, Maya. Understanding dot-ball pressure is often 80% of tactical captaincy. Keep this chart in your roadmap portfolio!',
        createdAt: '2026-10-20T16:00:00Z'
      }
    ]
  },
  {
    id: 'post_2',
    communityId: 'comm_3',
    authorId: 'user_p2',
    authorName: 'Julian Ray',
    authorRole: 'member',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Prompt: Describe your childhood kitchen only through scent and sound',
    content: 'Here is a 15-minute challenge for today. Write 100 words where you can only mention sounds (kettle hiss, wooden spoon knocking) and aromas (cardamom, burnt toast). Let’s see what memories bubble up.',
    tags: ['MicroPrompt', 'SensoryWriting'],
    likes: 31,
    userLiked: false,
    createdAt: '2026-10-21T09:30:00Z',
    comments: [
      {
        id: 'comm_c2',
        authorName: 'Maya Lin',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'member',
        content: 'The clatter of yellow enamel cups at 6 AM, accompanied by the sharp tang of ginger simmering in whole milk. Love this exercise!',
        createdAt: '2026-10-21T11:20:00Z'
      }
    ]
  }
];

export const SEED_DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    id: 'q_free_time',
    title: 'What do you naturally gravitate toward when you have unstructured free time?',
    subtitle: 'Pay attention to where your attention wanders without external pressure or obligation.',
    category: 'core',
    type: 'single',
    options: [
      { value: 'building_making', label: 'Building or making something with my hands or computer', description: 'Crafting, coding, designing, assembling physical or digital items' },
      { value: 'analyzing_investigating', label: 'Analyzing patterns, scores, numbers, or mysteries', description: 'Diving deep into stats, tactical breakdowns, historical rabbit holes' },
      { value: 'collaborating_helping', label: 'Connecting with people, listening, teaching, or organizing', description: 'Coaching, mentoring, bringing friends together for a common event' },
      { value: 'creating_expressing', label: 'Writing, illustrating, making sound, or storytelling', description: 'Expressing ideas through words, visuals, performances or essays' },
      { value: 'competing_moving', label: 'Physical movement, sports, outdoor adventure, or testing limits', description: 'Moving your body, athletic strategy, fitness challenges' }
    ]
  },
  {
    id: 'q_drive_nature',
    title: 'Which of these core activities would make you curious enough to keep learning?',
    subtitle: 'Think about what keeps you in a state of absorbed focus (flow).',
    category: 'tradeoff',
    type: 'single',
    options: [
      { value: 'system_design', label: 'Designing a system or framework that operates smoothly', description: 'Rules, algorithms, strategic plans, logistical flows' },
      { value: 'human_resonance', label: 'Understanding why people feel or react the way they do', description: 'Psychology, community dynamics, storytelling, communication' },
      { value: 'problem_tinkering', label: 'Fixing, troubleshooting, and testing broken mechanics', description: 'Diagnosing why an experiment or script failed and iterating' },
      { value: 'sensory_craft', label: 'Polishing visual aesthetics, sounds, or physical textures', description: 'Refining details until they evoke an emotional or tactile satisfaction' }
    ]
  },
  {
    id: 'q_work_style',
    title: 'In what environment do you do your best thinking and exploration?',
    subtitle: 'Be honest about your natural social rhythm—there is no right or wrong answer.',
    category: 'environment',
    type: 'single',
    options: [
      { value: 'deep_solo', label: 'Quiet, independent focus where I control my pace', description: 'Uninterrupted deep work blocks, personal experiments' },
      { value: 'small_tight_team', label: 'A small, trusted pair or 3-person team bouncing ideas', description: 'Collaborative partnership with rapid feedback and camaraderie' },
      { value: 'vibrant_community', label: 'An active guild or community with many voices and energy', description: 'Shared showcases, lively chat channels, peer workshops' }
    ]
  },
  {
    id: 'q_draining',
    title: 'Which kind of task do you find most exhausting or draining?',
    subtitle: 'Knowing what saps your motivation is just as valuable as knowing what fuels it.',
    category: 'energy',
    type: 'single',
    options: [
      { value: 'endless_meetings', label: 'Superficial small talk, endless circular meetings with no action', description: 'Low substance, performative social interaction' },
      { value: 'rigid_repetition', label: 'Repetitive clerical paperwork with zero creative freedom', description: 'Filing, monotonous data entry, strict adherence to bureaucracy' },
      { value: 'high_stakes_isolation', label: 'Being stranded completely alone with no one to sanity-check ideas', description: 'Total sensory isolation without collaborative touchpoints' },
      { value: 'vague_directionless', label: 'Total ambiguity with zero feedback or measurable milestones', description: 'Not knowing whether progress is actually being made' }
    ]
  },
  {
    id: 'q_tried_and_enjoyed',
    title: 'What is something you enjoyed trying recently, even if you were not good at it yet?',
    subtitle: 'A short sentence or thought on an activity where the process itself felt rewarding.',
    category: 'reflection',
    type: 'text'
  }
];

export const SEED_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_1',
    userId: 'user_member_1',
    category: 'project',
    title: '5-Match Cricket Momentum Visualizer',
    subtitle: 'Hands-on beginner sports data experiment',
    description: 'Create an easy 1-page visual dashboard analyzing how run-rate variance and bowling pressure created turnaround moments across 5 recent cricket matches.',
    whyItFits: 'Matches your interest in sports strategy, pattern recognition, and hands-on data storytelling without requiring heavy code.',
    supportingAnswers: [
      'Indicated curiosity in tactical analysis and sports during free time',
      'Preferred hands-on learning with immediate visual feedback',
      'Expressed desire to connect analytical thinking with real games'
    ],
    whatYoullEnjoy: [
      'Uncovering unseen tactical turning points that television commentators missed',
      'Creating clean charts that friends can instantly understand',
      'Testing your hypotheses against real match outcomes'
    ],
    potentialChallenges: [
      'Gathering consistent match scores (we provide pre-cleaned public datasets)',
      'Resisting the urge to overcomplicate the metrics too early'
    ],
    beginnerExperiment: 'Chart the balls-per-boundary ratio for the winning vs losing team in 1 match using a basic Google Sheet.',
    timeCommitment: '2 to 3 hours over one weekend',
    requiredResources: 'Google Sheets or spreadsheet tool, free cricsheet data link.',
    suggestedNextAction: 'Add to Roadmap as Week 1 Project Challenge',
    confidenceScore: 92,
    confidenceExplanation: 'High correlation with your self-reported analytical curiosity and interest in sports tactics.',
    status: 'active'
  },
  {
    id: 'rec_2',
    userId: 'user_member_1',
    category: 'skill',
    title: 'Data Storytelling & Executive Summaries',
    subtitle: 'Translating raw numbers into human narratives',
    description: 'Learn how to present three key insights from a complex table so that a coach, teammate, or stakeholder immediately understands the next step.',
    whyItFits: 'Bridges analytical curiosity with narrative communication, ensuring your insights drive real decisions.',
    supportingAnswers: [
      'Interested in both analytical frameworks and creative expression',
      'Enjoys small-team feedback loops'
    ],
    whatYoullEnjoy: [
      'Crafting compelling 3-sentence takeaways',
      'Stripping away chart junk to spotlight the core message'
    ],
    potentialChallenges: [
      'Editing down findings to only what matters most'
    ],
    beginnerExperiment: 'Write a 150-word game debrief to a friend explaining why the final overs succeeded.',
    timeCommitment: '1 hour per week',
    requiredResources: 'Notepad or digital document',
    suggestedNextAction: 'Explore article and practice writing 1 match debrief',
    confidenceScore: 86,
    confidenceExplanation: 'Strong synergy between your creative writing curiosity and tactical analysis interests.',
    status: 'active'
  },
  {
    id: 'rec_3',
    userId: 'user_member_1',
    category: 'mentor',
    title: 'Dr. Aris Thorne (Sports Data Scientist)',
    subtitle: 'Tactical analysis & sports modeling mentor',
    description: 'Connect with Dr. Thorne for 1-on-1 feedback on your match analysis charts and advice on sports analytics pathways.',
    whyItFits: 'Verified expert in sports performance modeling who actively supports career transitions and beginner portfolio building.',
    supportingAnswers: [
      'Open to guided mentorship for practical feedback',
      'Curious about non-traditional sports paths'
    ],
    whatYoullEnjoy: [
      'Direct constructive review on your tactical match chart',
      'Real-world perspectives on working with teams and coaches'
    ],
    potentialChallenges: [
      'Preparing specific questions in advance to maximize mentor time'
    ],
    beginnerExperiment: 'Draft a short 2-sentence mentorship request referencing your interest in tactical match momentum.',
    timeCommitment: '30-minute monthly check-in + asynchronous notes',
    requiredResources: 'Skill Path in-app messaging',
    suggestedNextAction: 'Send a Mentorship Request',
    confidenceScore: 89,
    confidenceExplanation: 'Direct expertise alignment with high mentor responsiveness.',
    status: 'saved'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    actorName: 'Elena Rostova',
    actorRole: 'admin',
    action: 'VERIFY_EXPERT_CREDENTIALS',
    targetEntity: 'Dr. Aris Thorne (user_expert_1)',
    timestamp: '2026-08-15T11:20:00Z',
    details: 'Verified Ph.D. degree credentials and sports consultancy portfolio.'
  },
  {
    id: 'log_2',
    actorName: 'Elena Rostova',
    actorRole: 'admin',
    action: 'PUBLISH_INTEREST_CATALOG_ENTRY',
    targetEntity: 'Sports Analytics & Tactical Modeling',
    timestamp: '2026-08-20T14:05:00Z',
    details: 'Approved public interest curriculum and beginner challenge sequence.'
  },
  {
    id: 'log_3',
    actorName: 'Elena Rostova',
    actorRole: 'admin',
    action: 'REVIEW_COMMUNITY_REPORT',
    targetEntity: 'Post #992 (Disputed match statistics claim)',
    timestamp: '2026-09-10T09:45:00Z',
    details: 'Resolved report: determined post adhered to civil debate guidelines. No action needed.'
  }
];

export const SEED_REPORTS: UserReport[] = [
  {
    id: 'rep_1',
    reporterId: 'user_42',
    reporterName: 'Carlos M.',
    reportedEntityId: 'post_spam_test',
    reportedEntityType: 'post',
    entitySummary: 'Commercial third-party betting link posted in Guild',
    reason: 'Contains unauthorized commercial promotional links contrary to guild rules.',
    status: 'pending',
    createdAt: '2026-10-22T19:40:00Z'
  }
];
