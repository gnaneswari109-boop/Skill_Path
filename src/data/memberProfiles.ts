import { LifeStage } from '../types';

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  date: string;
  type: 'challenge' | 'sprint' | 'guild' | 'project';
  completed: boolean;
}

export interface OngoingActivity {
  id: string;
  title: string;
  progress: number;
  sprintWeek: string;
  details: string;
}

export interface MemberProject {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  status: 'active' | 'completed' | 'prototype';
  completionDate?: string;
  metrics?: string;
  repoUrl?: string;
  demoUrl?: string;
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
  credentialId?: string;
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

  // Task indicators (accurate count)
  tasksTotal: number;
  tasksCompletedCount: number;
  tasks: TaskItem[];
  ongoingActivities: OngoingActivity[];

  // Projects & Experience
  projectsCompletedCount: number;
  currentProjectName: string;
  projects: MemberProject[];
  experience: MemberExperience[];

  // Learning progress and future goals
  progressPercentage: number;
  currentMilestone: string;
  futureGoals: string[];

  // Certifications and accomplishments
  certifications: string[];
  achievements: MemberAchievement[];
}

export const THREE_MEMBER_PROFILES: MemberProfileData[] = [
  {
    id: 'user_member_ananya',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@student.skillpath.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    shortIntro: 'AI/ML student training predictive neural networks and data models to tackle real-world health and student success challenges.',
    roleLabel: 'AI/ML Student',
    lifeStage: 'college',
    availableHoursPerWeek: 8,
    preferredLearningStyle: 'Hands-on project sprints & notebook coding',
    profileVisibility: 'public',
    location: 'Hyderabad / Bangalore, India',
    joinedDate: 'August 2026',

    intro: 'Passionate about using AI to solve real-world problems. Currently in my third year of Computer Science with an emphasis on Data Science. I believe practical model validation and responsible AI ethics should go hand-in-hand.',
    careerGoals: 'Secure an AI/ML internship at a forward-thinking technology research lab or product company, focusing on scalable predictive modeling and intelligent decision-support pipelines.',

    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    interests: [
      'Predictive Modeling',
      'Neural Networks',
      'Explainable AI (XAI)',
      'Healthcare Analytics',
      'Feature Engineering'
    ],
    toolsAndTech: ['PyTorch', 'Scikit-Learn', 'Pandas', 'NumPy', 'PostgreSQL', 'Jupyter Lab', 'Streamlit'],

    tasksTotal: 20,
    tasksCompletedCount: 18,
    tasks: [
      { id: 'an_t1', title: 'Exploratory data analysis on Kaggle Student Performance dataset', category: 'Data Analysis', date: 'Oct 02, 2026', type: 'challenge', completed: true },
      { id: 'an_t2', title: 'Feature engineering: attendance velocity and study-hour bins', category: 'Feature Engineering', date: 'Oct 04, 2026', type: 'sprint', completed: true },
      { id: 'an_t3', title: 'Trained baseline logistic regression & decision trees', category: 'Machine Learning', date: 'Oct 06, 2026', type: 'sprint', completed: true },
      { id: 'an_t4', title: 'Cross-validated XGBoost gradient boosted trees (ROC-AUC: 0.91)', category: 'Machine Learning', date: 'Oct 08, 2026', type: 'project', completed: true },
      { id: 'an_t5', title: 'Computed SHAP feature importance values for educator interpretability', category: 'Explainable AI', date: 'Oct 10, 2026', type: 'project', completed: true },
      { id: 'an_t6', title: 'Constructed SQL aggregations for longitudinal semester tracking', category: 'SQL Querying', date: 'Oct 11, 2026', type: 'challenge', completed: true },
      { id: 'an_t7', title: 'Deployed Streamlit interactive inference playground for teachers', category: 'Deployment', date: 'Oct 13, 2026', type: 'sprint', completed: true },
      { id: 'an_t8', title: 'Cleaned medical imaging metadata for Pneumonia Chest X-Ray set', category: 'Data Cleaning', date: 'Sep 15, 2026', type: 'project', completed: true },
      { id: 'an_t9', title: 'Implemented PyTorch CNN with Transfer Learning (ResNet18)', category: 'Deep Learning', date: 'Sep 18, 2026', type: 'project', completed: true },
      { id: 'an_t10', title: 'Evaluated confusion matrix, sensitivity, and false positive rates', category: 'Model Evaluation', date: 'Sep 21, 2026', type: 'challenge', completed: true },
      { id: 'an_t11', title: 'Built Customer Churn pipeline with Random Forest on Telecom records', category: 'Machine Learning', date: 'Aug 24, 2026', type: 'project', completed: true },
      { id: 'an_t12', title: 'Handled severe class imbalance with SMOTE and focal loss', category: 'Data Prep', date: 'Aug 28, 2026', type: 'sprint', completed: true },
      { id: 'an_t13', title: 'Built automated batch scoring pipeline in Python with SQLite backend', category: 'Pipelines', date: 'Sep 02, 2026', type: 'sprint', completed: true },
      { id: 'an_t14', title: 'Scraped and parsed 12,000 course reviews for Sentiment Analysis', category: 'NLP / Text', date: 'Sep 06, 2026', type: 'challenge', completed: true },
      { id: 'an_t15', title: 'Tokenized text with HuggingFace DistilBERT model', category: 'NLP / Text', date: 'Sep 09, 2026', type: 'project', completed: true },
      { id: 'an_t16', title: 'Published project findings in Skill Path AI Guild study hall', category: 'Peer Review', date: 'Sep 12, 2026', type: 'guild', completed: true },
      { id: 'an_t17', title: 'Completed peer code review on neural network activation benchmarks', category: 'Guild Activity', date: 'Oct 14, 2026', type: 'guild', completed: true },
      { id: 'an_t18', title: 'Set up MLflow parameter tracking for hyperparameter sweeps', category: 'MLOps', date: 'Oct 16, 2026', type: 'challenge', completed: true },
      { id: 'an_t19', title: 'Containerize Student Prediction API with Docker for cloud hosting', category: 'Cloud & API', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'an_t20', title: 'Submit research artifact to Student AI Innovation Showcase', category: 'Showcase', date: 'Scheduled', type: 'project', completed: false }
    ],

    ongoingActivities: [
      {
        id: 'an_act_1',
        title: 'Student Performance Prediction — SHAP Model Explanations',
        progress: 88,
        sprintWeek: 'Week 4 of 4',
        details: 'Adding personalized study intervention recommendations based on prediction risk weights.'
      },
      {
        id: 'an_act_2',
        title: 'Mock Technical Interview Sprint — Machine Learning Algorithms',
        progress: 70,
        sprintWeek: 'Sprint 3',
        details: 'Practicing bias-variance tradeoff and matrix calculus derivation with mentor.'
      }
    ],

    projectsCompletedCount: 4,
    currentProjectName: 'Student Performance Prediction',
    projects: [
      {
        id: 'an_p1',
        name: 'Student Performance Prediction',
        description: 'End-to-end ML system that identifies students needing academic support early in the term with explainable factor graphs.',
        longDescription: 'Trained on multi-semester behavioral, quiz, and attendance patterns. Implemented with XGBoost and CatBoost with a custom Streamlit dashboard for academic advisors. Achieved an 89.4% F1-score with clear interpretability through TreeSHAP visualizations.',
        techStack: ['Python', 'XGBoost', 'Scikit-Learn', 'SHAP', 'Streamlit'],
        status: 'active',
        metrics: '89.4% F1-Score · 1,400+ test records · <30ms inference'
      },
      {
        id: 'an_p2',
        name: 'Automated Chest X-Ray Classifier',
        description: 'Deep convolutional neural network for screening pneumonia in pediatric chest radiography with Grad-CAM heatmaps.',
        longDescription: 'Utilized PyTorch to fine-tune a pre-trained ResNet18 model on 5,800 validated pediatric chest scans. Generated Grad-CAM visual explanations to verify the model attends to opacity in lung fields rather than radiographic noise.',
        techStack: ['Python', 'PyTorch', 'Torchvision', 'Grad-CAM', 'OpenCV'],
        status: 'completed',
        completionDate: 'September 2026',
        metrics: '94.2% Validation Accuracy · 0.96 ROC-AUC'
      },
      {
        id: 'an_p3',
        name: 'Customer Churn Random Forest Pipeline',
        description: 'Predictive churn prevention model for subscription services with automated feature importance ranking.',
        longDescription: 'Identified top retention drivers across 7,000 enterprise accounts. Integrated automated categorical encodings and cost-sensitive classification weights.',
        techStack: ['Python', 'Pandas', 'Scikit-Learn', 'Seaborn'],
        status: 'completed',
        completionDate: 'August 2026',
        metrics: '83% Churn Precision · Saved $14k est. pilot cost'
      },
      {
        id: 'an_p4',
        name: 'Academic Course Sentiment Pipeline',
        description: 'NLP transformer pipeline summarizing student feedback themes and qualitative sentiment polarity.',
        longDescription: 'Fine-tuned a lightweight DistilBERT tokenizer to cluster common feedback bottlenecks into actionable curriculum improvement suggestions.',
        techStack: ['Python', 'HuggingFace', 'Transformers', 'FastAPI'],
        status: 'completed',
        completionDate: 'July 2026',
        metrics: '12,000 reviews indexed · 0.91 Sentiment Agreement'
      },
      {
        id: 'an_p5',
        name: 'Air Quality Urban Telemetry Model',
        description: 'Time-series forecasting model estimating PM2.5 particulate matter levels 24 hours in advance.',
        longDescription: 'Combined municipal sensor feeds with meteorological humidity and wind velocity features using ARIMA and LightGBM.',
        techStack: ['Python', 'Statsmodels', 'LightGBM', 'Matplotlib'],
        status: 'completed',
        completionDate: 'June 2026',
        metrics: 'Mean Absolute Error < 4.8 μg/m³'
      }
    ],

    experience: [
      {
        role: 'Undergraduate AI Lab Research Assistant',
        organization: 'Department of Computer Science & Engineering',
        period: 'Jan 2026 - Present',
        summary: 'Benchmarking tabular machine learning models against deep learning architectures for structured educational data.'
      },
      {
        role: 'Data Science Peer Tutor',
        organization: 'University Learning Commons',
        period: 'Aug 2025 - Dec 2025',
        summary: 'Mentored 35+ first- and second-year students in Python fundamentals, NumPy vectorization, and SQL query syntax.'
      }
    ],

    progressPercentage: 90,
    currentMilestone: 'Sprint 4: Final Model Deployment & Presentation Prep',
    futureGoals: [
      'Present Student Performance Prediction at the National Student Innovation Summit',
      'Earn AWS Machine Learning Specialty Certification',
      'Contribute an open-source tutorial to the Scikit-Learn community documentation'
    ],

    certifications: [
      'Python Programming',
      'Machine Learning Fundamentals'
    ],
    achievements: [
      {
        title: 'Python Programming',
        issuer: 'Python Institute',
        year: '2025',
        iconType: 'cert',
        credentialId: 'PY-2025-9941'
      },
      {
        title: 'Machine Learning Fundamentals',
        issuer: 'DeepLearning.AI',
        year: '2026',
        iconType: 'cert',
        credentialId: 'DLAI-ML-4821'
      },
      {
        title: 'University Hackathon — 1st Place (AI Track)',
        issuer: 'Campus Tech Fest',
        year: '2026',
        iconType: 'award'
      }
    ]
  },
  {
    id: 'user_member_rahul',
    name: 'Rahul Varma',
    email: 'rahul.varma@student.skillpath.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    shortIntro: 'Full-stack software developer crafting modular, responsive web applications with React, Node.js, and clean API design.',
    roleLabel: 'Full-Stack Developer',
    lifeStage: 'college',
    availableHoursPerWeek: 10,
    preferredLearningStyle: 'Iterative full-stack prototyping & code reviews',
    profileVisibility: 'public',
    location: 'Pune / Mumbai, India',
    joinedDate: 'July 2026',

    intro: 'Enjoys building practical web applications and improving coding skills. Focused on full-stack architecture, clean component boundaries, resilient RESTful APIs, and responsive UI design.',
    careerGoals: 'Become a full-stack software engineer at a high-growth product company, building high-throughput user interfaces and robust microservices.',

    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    interests: [
      'Full-Stack Architecture',
      'Modern React Ecosystem',
      'REST & GraphQL APIs',
      'State Management',
      'Component Design Systems'
    ],
    toolsAndTech: ['TypeScript', 'React 19', 'Express', 'MongoDB Atlas', 'Tailwind CSS', 'Vite', 'Postman'],

    tasksTotal: 20,
    tasksCompletedCount: 12,
    tasks: [
      { id: 'rh_t1', title: 'Architected React 19 component library with reusable Tailwind primitives', category: 'Frontend', date: 'Oct 01, 2026', type: 'challenge', completed: true },
      { id: 'rh_t2', title: 'Built responsive student forum layout with dark mode toggle', category: 'UI / UX', date: 'Oct 03, 2026', type: 'sprint', completed: true },
      { id: 'rh_t3', title: 'Designed MongoDB schema with compound indexes for fast thread lookups', category: 'Database', date: 'Oct 05, 2026', type: 'sprint', completed: true },
      { id: 'rh_t4', title: 'Implemented Node.js Express router with input sanitization middleware', category: 'Backend', date: 'Oct 07, 2026', type: 'project', completed: true },
      { id: 'rh_t5', title: 'Integrated JWT authentication with HTTP-only cookies and refresh tokens', category: 'Security', date: 'Oct 09, 2026', type: 'project', completed: true },
      { id: 'rh_t6', title: 'Created real-time typing indicators with Socket.io on student chat channels', category: 'WebSockets', date: 'Oct 11, 2026', type: 'challenge', completed: true },
      { id: 'rh_t7', title: 'Built DevSnippet collaborative code editor with syntax highlighting', category: 'Full Stack', date: 'Sep 10, 2026', type: 'project', completed: true },
      { id: 'rh_t8', title: 'Optimized Monaco editor loading state and state debouncing', category: 'Performance', date: 'Sep 14, 2026', type: 'sprint', completed: true },
      { id: 'rh_t9', title: 'Created E-Commerce cart checkout microservice with Stripe payment intents', category: 'Payments', date: 'Aug 18, 2026', type: 'project', completed: true },
      { id: 'rh_t10', title: 'Implemented optimistic UI updates for cart add/remove mutations', category: 'State', date: 'Aug 22, 2026', type: 'sprint', completed: true },
      { id: 'rh_t11', title: 'Built Kanban board drag-and-drop task reordering with accessible keyboard controls', category: 'Frontend', date: 'Jul 28, 2026', type: 'project', completed: true },
      { id: 'rh_t12', title: 'Conducted frontend lighthouse audit achieving 98 performance score', category: 'Auditing', date: 'Aug 04, 2026', type: 'challenge', completed: true },
      { id: 'rh_t13', title: 'Set up automated Playwright end-to-end user login and post creation tests', category: 'Testing', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'rh_t14', title: 'Implement Redis caching layer for top campus discussion threads', category: 'Caching', date: 'Scheduled', type: 'challenge', completed: false },
      { id: 'rh_t15', title: 'Build notifications dropdown with unread badge counter', category: 'Frontend', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'rh_t16', title: 'Add rich Markdown editor with image drag-and-drop uploads to S3', category: 'Storage', date: 'Scheduled', type: 'project', completed: false },
      { id: 'rh_t17', title: 'Configure GitHub Actions CI/CD pipeline for automated staging deploy', category: 'DevOps', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'rh_t18', title: 'Add student event calendar with RSVP tracking and reminders', category: 'Features', date: 'Scheduled', type: 'challenge', completed: false },
      { id: 'rh_t19', title: 'Conduct penetration testing and CSRF header verification', category: 'Security', date: 'Scheduled', type: 'project', completed: false },
      { id: 'rh_t20', title: 'Deploy production release of Campus Connect on Render + Vercel', category: 'Deployment', date: 'Scheduled', type: 'project', completed: false }
    ],

    ongoingActivities: [
      {
        id: 'rh_act_1',
        title: 'Campus Connect Web App — Multi-club announcement channel',
        progress: 60,
        sprintWeek: 'Week 2 of 4',
        details: 'Connecting socket broadcasting so campus club officers can broadcast verified alerts.'
      },
      {
        id: 'rh_act_2',
        title: 'Algorithms & System Design Study Group',
        progress: 50,
        sprintWeek: 'Ongoing',
        details: 'Solving medium-difficulty LeetCode tree and graph problems twice weekly.'
      }
    ],

    projectsCompletedCount: 3,
    currentProjectName: 'Campus Connect Web App',
    projects: [
      {
        id: 'rh_p1',
        name: 'Campus Connect Web App',
        description: 'Comprehensive college community platform connecting 2,500+ campus students with student clubs, study groups, and notes sharing.',
        longDescription: 'Full-stack application engineered with React 19, Node.js, Express, and MongoDB. Includes role-based authorization, instant club announcement broadcasts, study room reservation calendar, and real-time messaging.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
        status: 'active',
        metrics: '2,500+ active students · <120ms API response time'
      },
      {
        id: 'rh_p2',
        name: 'DevSnippet Collaborative Code Editor',
        description: 'Cloud code snippet repository with syntax highlighting, live multi-user cursor sharing, and fork capabilities.',
        longDescription: 'Created a developer utility for quick code sharing. Integrated Monaco editor, dynamic syntax tree parsing, and GitHub Gist export.',
        techStack: ['React', 'Node.js', 'MongoDB', 'PrismJS'],
        status: 'completed',
        completionDate: 'September 2026',
        metrics: '450+ snippets created · 99.8% uptime'
      },
      {
        id: 'rh_p3',
        name: 'E-Commerce Cart Microservice',
        description: 'Modular checkout and shopping cart backend handling concurrent inventory decrements and payment intent tokens.',
        longDescription: 'Constructed resilient REST API endpoints for merchandise ordering, featuring atomic MongoDB transactions and Stripe webhook verification.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'Stripe API'],
        status: 'completed',
        completionDate: 'August 2026',
        metrics: 'Processed $8,200 in mock campus store transactions'
      },
      {
        id: 'rh_p4',
        name: 'Real-Time Kanban Project Board',
        description: 'Interactive sprint planning board featuring drag-and-drop ticket columns, task tags, and team progress meters.',
        longDescription: 'Built with React and custom hooks for optimistic offline queue updates, syncing changes automatically once back online.',
        techStack: ['JavaScript', 'React', 'HTML5 Drag & Drop', 'LocalForage'],
        status: 'completed',
        completionDate: 'July 2026',
        metrics: 'Zero external UI drag libraries · 60fps render'
      }
    ],

    experience: [
      {
        role: 'Frontend Developer Intern',
        organization: 'Kite Digital Labs',
        period: 'May 2026 - July 2026',
        summary: 'Developed 8 client-facing marketing pages and converted legacy jQuery modules to modern React functional components.'
      },
      {
        role: 'Web Master & Lead Developer',
        organization: 'Campus ACM Student Chapter',
        period: 'Aug 2025 - Present',
        summary: 'Maintained chapter portal, scheduled tech talks, and hosted three hands-on Git & Web Development workshops for 120+ attendees.'
      }
    ],

    progressPercentage: 60,
    currentMilestone: 'Sprint 2: Real-time Socket Broadcasts & Notifications',
    futureGoals: [
      'Complete production deployment of Campus Connect with 5 campus clubs',
      'Learn Docker and Kubernetes container orchestration',
      'Contribute an open-source pull request to a popular React library'
    ],

    certifications: [
      'Web Development Fundamentals'
    ],
    achievements: [
      {
        title: 'Web Development Fundamentals',
        issuer: 'freeCodeCamp Developer Certification',
        year: '2025',
        iconType: 'cert',
        credentialId: 'FCC-WEB-7731'
      },
      {
        title: 'Outstanding Open-Source Contributor',
        issuer: 'College Developer Circle',
        year: '2026',
        iconType: 'award'
      },
      {
        title: 'Skill Path Verified Milestone: Full-Stack REST Engineering',
        issuer: 'Skill Path Community',
        year: '2026',
        iconType: 'badge'
      }
    ]
  },
  {
    id: 'user_member_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.skillpath.org',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    shortIntro: 'Data analyst turning complex raw datasets into clear executive dashboards, actionable KPIs, and automated reporting systems.',
    roleLabel: 'Data Analyst',
    lifeStage: 'college',
    availableHoursPerWeek: 6,
    preferredLearningStyle: 'Case studies & interactive business intelligence dashboards',
    profileVisibility: 'public',
    location: 'Delhi / Gurgaon, India',
    joinedDate: 'September 2026',

    intro: 'Interested in discovering useful insights from data and presenting them visually. I love bridging business strategy with statistical rigor, making numbers intuitive and visually engaging for decision-makers.',
    careerGoals: 'Develop strong data analytics and visualization skills, progressing toward a high-impact business intelligence or analytics consulting role.',

    skills: ['Python', 'Excel', 'SQL', 'Power BI'],
    interests: [
      'Business Intelligence',
      'Executive Dashboards',
      'Data Storytelling',
      'Cohort Retention Analysis',
      'Statistical Hypothesis Testing'
    ],
    toolsAndTech: ['Power BI Desktop', 'Advanced Excel (VBA/DAX)', 'PostgreSQL', 'Python (Pandas / Seaborn)', 'Tableau'],

    tasksTotal: 15,
    tasksCompletedCount: 8,
    tasks: [
      { id: 'pr_t1', title: 'Collected 4 years of campus placement and salary package records', category: 'Data Collection', date: 'Oct 02, 2026', type: 'challenge', completed: true },
      { id: 'pr_t2', title: 'Cleaned messy department nomenclature and null salary brackets in Python', category: 'Data Wrangling', date: 'Oct 04, 2026', type: 'sprint', completed: true },
      { id: 'pr_t3', title: 'Calculated placement percentage by major, GPA tier, and internship count', category: 'SQL Analytics', date: 'Oct 07, 2026', type: 'sprint', completed: true },
      { id: 'pr_t4', title: 'Designed DAX measures for median package, tier-1 offer ratio, and YoY growth', category: 'Power BI / DAX', date: 'Oct 10, 2026', type: 'project', completed: true },
      { id: 'pr_t5', title: 'Built interactive department drill-down filters with Power BI bookmarks', category: 'Data Visualization', date: 'Oct 12, 2026', type: 'project', completed: true },
      { id: 'pr_t6', title: 'Analyzed Hospital Emergency Room patient triage and wait-time bottlenecks', category: 'Case Study', date: 'Sep 14, 2026', type: 'project', completed: true },
      { id: 'pr_t7', title: 'Created Excel pivot model with dynamic macros for monthly triage review', category: 'Excel Modeling', date: 'Sep 20, 2026', type: 'sprint', completed: true },
      { id: 'pr_t8', title: 'Conducted retail store customer retention cohort study (12-month window)', category: 'Customer Analytics', date: 'Sep 28, 2026', type: 'challenge', completed: true },
      { id: 'pr_t9', title: 'Calculate skill correlation matrix: programming vs placement success', category: 'Statistics', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'pr_t10', title: 'Publish Power BI Placement Insights report to web portal for placement cell', category: 'Deployment', date: 'Scheduled', type: 'project', completed: false },
      { id: 'pr_t11', title: 'Build automated email alert trigger for at-risk unplaced students', category: 'Automation', date: 'Scheduled', type: 'challenge', completed: false },
      { id: 'pr_t12', title: 'Conduct presentation to Department Chairs on key placement trends', category: 'Executive Brief', date: 'Scheduled', type: 'guild', completed: false },
      { id: 'pr_t13', title: 'Complete advanced DAX window functions sprint', category: 'Power BI', date: 'Scheduled', type: 'sprint', completed: false },
      { id: 'pr_t14', title: 'Perform A/B test analysis on student resume workshop attendance', category: 'Hypothesis Testing', date: 'Scheduled', type: 'challenge', completed: false },
      { id: 'pr_t15', title: 'Prepare final data analyst portfolio case study dossier', category: 'Portfolio', date: 'Scheduled', type: 'project', completed: false }
    ],

    ongoingActivities: [
      {
        id: 'pr_act_1',
        title: 'Student Placement Insights Dashboard — DAX Metric Optimization',
        progress: 55,
        sprintWeek: 'Week 2 of 4',
        details: 'Refining average time-to-hire calculation and filtering by industry hiring sector.'
      },
      {
        id: 'pr_act_2',
        title: 'Advanced DAX & Power BI Modeling Certification Prep',
        progress: 45,
        sprintWeek: 'Ongoing',
        details: 'Reviewing star-schema relationships and filter context propagation.'
      }
    ],

    projectsCompletedCount: 2,
    currentProjectName: 'Student Placement Insights Dashboard',
    projects: [
      {
        id: 'pr_p1',
        name: 'Student Placement Insights Dashboard',
        description: 'Comprehensive business intelligence suite analyzing campus recruitment trajectories, branch salary spreads, and top recruiter cohorts.',
        longDescription: 'Developed in Power BI with an underlying PostgreSQL database. Incorporates interactive cross-filtering, historical placement benchmarking across 4 academic cycles, and predictive indicators for branch hiring demand.',
        techStack: ['Power BI', 'SQL', 'Excel', 'Python', 'DAX'],
        status: 'active',
        metrics: '4 cohorts analyzed · 1,850 student records · 8 interactive pages'
      },
      {
        id: 'pr_p2',
        name: 'Hospital ER Wait-Time Analysis',
        description: 'Operations analysis investigating emergency department triage delays, bed availability cycles, and peak patient arrival hours.',
        longDescription: 'Utilized statistical hypothesis testing and advanced Excel formulas to uncover an average 38-minute triage bottleneck during weekend shift transitions.',
        techStack: ['Excel', 'Power Query', 'Statistical Modeling', 'VBA'],
        status: 'completed',
        completionDate: 'September 2026',
        metrics: 'Identified 38-min scheduling bottleneck · Recommended 2 staff shifts'
      },
      {
        id: 'pr_p3',
        name: 'Retail Store Cohort Retention Dashboard',
        description: '12-month cohort retention heat-map tracking repeat customer frequency and average basket size elasticity.',
        longDescription: 'Wrote complex SQL window functions to segment customer cohorts by acquisition quarter, visualizing retention degradation over time.',
        techStack: ['SQL', 'Python (Seaborn)', 'Power BI', 'Excel'],
        status: 'completed',
        completionDate: 'August 2026',
        metrics: '55,000 transactions analyzed · 24% second-purchase rate'
      }
    ],

    experience: [
      {
        role: 'Data Analytics Intern',
        organization: 'Vanguard Analytics & Advisory',
        period: 'June 2026 - August 2026',
        summary: 'Automated 14 weekly KPI client reports using Power Query and SQL, reducing manual spreadsheet compilation by 8 hours each week.'
      },
      {
        role: 'Campus Placement Cell Student Coordinator',
        organization: 'University Placement Office',
        period: 'Sept 2025 - Present',
        summary: 'Collated recruiter interview schedules and synthesized post-drive debrief surveys for 60+ visiting corporate partners.'
      }
    ],

    progressPercentage: 53,
    currentMilestone: 'Sprint 2: Multi-Page Power BI Interactive Report',
    futureGoals: [
      'Complete Microsoft PL-300: Power BI Data Analyst Certification',
      'Build automated ETL script connecting college database to cloud dashboard',
      'Publish a step-by-step tutorial on building executive cohort retention graphs'
    ],

    certifications: [
      'Data Analytics Fundamentals'
    ],
    achievements: [
      {
        title: 'Data Analytics Fundamentals',
        issuer: 'Google Career Certificate',
        year: '2025',
        iconType: 'cert',
        credentialId: 'GOOG-DA-3392'
      },
      {
        title: 'Best Data Visualization Award',
        issuer: 'Inter-College Analytics Symposium',
        year: '2026',
        iconType: 'award'
      },
      {
        title: 'Verified Milestone: SQL Data Wrangling & BI Dashboards',
        issuer: 'Skill Path Community',
        year: '2026',
        iconType: 'badge'
      }
    ]
  }
];

export const SKILL_RESOURCES_MAP: Record<string, {
  skill: string;
  category: string;
  summary: string;
  topResources: { title: string; type: 'doc' | 'course' | 'tutorial'; url: string; duration: string }[];
  relatedTopics: string[];
}> = {
  'Python': {
    skill: 'Python',
    category: 'Programming & Scripting',
    summary: 'The universal language for machine learning, data engineering, backend APIs, and automation.',
    topResources: [
      { title: 'Official Python Documentation & Tutorial', type: 'doc', url: 'https://docs.python.org/3/tutorial/', duration: 'Self-paced' },
      { title: 'Python for Data Analysis by Wes McKinney', type: 'tutorial', url: 'https://wesmckinney.com/book/', duration: '4 hours' },
      { title: 'freeCodeCamp Python Full Course', type: 'course', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '4h 26m' }
    ],
    relatedTopics: ['Pandas', 'NumPy', 'FastAPI', 'PyTorch']
  },
  'Machine Learning': {
    skill: 'Machine Learning',
    category: 'Artificial Intelligence',
    summary: 'Algorithms and statistical models that computer systems use to perform tasks without explicit instructions.',
    topResources: [
      { title: 'Scikit-Learn Official User Guide', type: 'doc', url: 'https://scikit-learn.org/stable/user_guide.html', duration: 'Self-paced' },
      { title: 'StatQuest Machine Learning Video Series', type: 'tutorial', url: 'https://statquest.org/', duration: '3 hours' },
      { title: 'Google Machine Learning Crash Course', type: 'course', url: 'https://developers.google.com/machine-learning/crash-course', duration: '15 hours' }
    ],
    relatedTopics: ['Feature Engineering', 'Cross-Validation', 'XGBoost', 'Deep Learning']
  },
  'SQL': {
    skill: 'SQL',
    category: 'Data Querying & Relational DBs',
    summary: 'Standard language for storing, querying, aggregating, and analyzing structured database records.',
    topResources: [
      { title: 'PostgreSQL Official Documentation', type: 'doc', url: 'https://www.postgresql.org/docs/', duration: 'Reference' },
      { title: 'Mode Analytics SQL Tutorial for Data Analysis', type: 'tutorial', url: 'https://mode.com/sql-tutorial/', duration: '3 hours' },
      { title: 'SQLBolt Interactive SQL Lessons', type: 'course', url: 'https://sqlbolt.com/', duration: '2 hours' }
    ],
    relatedTopics: ['Joins', 'Window Functions', 'Query Optimization', 'Indexes']
  },
  'Data Analysis': {
    skill: 'Data Analysis',
    category: 'Analytics & Insights',
    summary: 'Inspecting, cleansing, transforming, and modeling data with the goal of discovering useful information.',
    topResources: [
      { title: 'Kaggle Learn: Data Cleaning & Exploratory Analysis', type: 'tutorial', url: 'https://www.kaggle.com/learn', duration: '5 hours' },
      { title: 'Pandas 2.0 Cookbook & Practice Recipes', type: 'doc', url: 'https://pandas.pydata.org/docs/', duration: 'Reference' }
    ],
    relatedTopics: ['Exploratory Data Analysis', 'Hypothesis Testing', 'Data Storytelling']
  },
  'JavaScript': {
    skill: 'JavaScript',
    category: 'Web Development',
    summary: 'The dynamic programming language powering modern interactive client and server web applications.',
    topResources: [
      { title: 'MDN Web Docs: JavaScript Guide', type: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', duration: 'Comprehensive' },
      { title: 'JavaScript.info: The Modern JavaScript Tutorial', type: 'tutorial', url: 'https://javascript.info/', duration: 'Self-paced' }
    ],
    relatedTopics: ['ES6+ Syntax', 'Async/Await', 'Event Loop', 'DOM Manipulation']
  },
  'React': {
    skill: 'React',
    category: 'Frontend Frameworks',
    summary: 'Component-based library for building user interfaces with declarative state and virtual DOM diffing.',
    topResources: [
      { title: 'React 19 Official Documentation', type: 'doc', url: 'https://react.dev/', duration: 'Comprehensive' },
      { title: 'React Crash Course for Beginners', type: 'tutorial', url: 'https://react.dev/learn', duration: '3 hours' }
    ],
    relatedTopics: ['Hooks', 'State Management', 'Server Components', 'Tailwind CSS']
  },
  'Node.js': {
    skill: 'Node.js',
    category: 'Backend Runtimes',
    summary: 'Chrome V8-powered asynchronous JavaScript runtime for scalable network and backend API services.',
    topResources: [
      { title: 'Node.js Official Documentation', type: 'doc', url: 'https://nodejs.org/en/docs', duration: 'Reference' },
      { title: 'Express.js Application Architecture Guide', type: 'tutorial', url: 'https://expressjs.com/', duration: '2 hours' }
    ],
    relatedTopics: ['Express', 'REST APIs', 'Middleware', 'Streams']
  },
  'MongoDB': {
    skill: 'MongoDB',
    category: 'NoSQL Databases',
    summary: 'Document-oriented database providing high scalability, flexibility, and JSON-like BSON schemas.',
    topResources: [
      { title: 'MongoDB University Free Developer Path', type: 'course', url: 'https://learn.mongodb.com/', duration: '6 hours' },
      { title: 'Mongoose ODM Documentation', type: 'doc', url: 'https://mongoosejs.com/docs/', duration: 'Reference' }
    ],
    relatedTopics: ['Document Modeling', 'Aggregation Pipeline', 'Indexes', 'Atlas Cloud']
  },
  'Excel': {
    skill: 'Excel',
    category: 'Spreadsheets & Financial Modeling',
    summary: 'Industry-standard spreadsheet software for pivot tables, formula modeling, Power Query, and ad-hoc analysis.',
    topResources: [
      { title: 'Microsoft Excel Support & Formula Handbook', type: 'doc', url: 'https://support.microsoft.com/en-us/excel', duration: 'Reference' },
      { title: 'Excel Exposure Free Structured Training', type: 'tutorial', url: 'https://excelexposure.com/', duration: '4 hours' }
    ],
    relatedTopics: ['XLOOKUP', 'Pivot Tables', 'Power Query', 'DAX Measures']
  },
  'Power BI': {
    skill: 'Power BI',
    category: 'Business Intelligence',
    summary: 'Business analytics service by Microsoft providing interactive visualizations and business intelligence capabilities.',
    topResources: [
      { title: 'Microsoft Learn: Power BI Analyst Path', type: 'course', url: 'https://learn.microsoft.com/en-us/power-bi/', duration: '12 hours' },
      { title: 'DAX Guide & Pattern Library', type: 'doc', url: 'https://dax.guide/', duration: 'Reference' }
    ],
    relatedTopics: ['DAX Calculations', 'Star Schema', 'Power Query M', 'Drill-Through']
  }
};
