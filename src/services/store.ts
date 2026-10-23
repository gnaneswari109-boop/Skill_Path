import {
  UserProfile,
  ExpertProfile,
  Interest,
  Challenge,
  Community,
  CommunityPost,
  Recommendation,
  Roadmap,
  ChallengeAttempt,
  ConnectionRequest,
  DirectMessage,
  UserMemory,
  AuditLog,
  UserReport,
  DiscoveryAnswer,
  DiscoveryReport,
  ClarityLevel
} from '../types';
import {
  SEED_USERS,
  SEED_EXPERTS,
  SEED_INTERESTS,
  SEED_CHALLENGES,
  SEED_COMMUNITIES,
  SEED_COMMUNITY_POSTS,
  SEED_RECOMMENDATIONS,
  SEED_AUDIT_LOGS,
  SEED_REPORTS
} from '../data/seedData';

const STORAGE_PREFIX = 'skill_path_v1_';

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export class SkillPathStore {
  private static instance: SkillPathStore;

  // State caches
  public currentUser: UserProfile;
  public users: UserProfile[];
  public experts: ExpertProfile[];
  public interests: Interest[];
  public challenges: Challenge[];
  public communities: Community[];
  public posts: CommunityPost[];
  public recommendations: Recommendation[];
  public roadmaps: Roadmap[];
  public challengeAttempts: ChallengeAttempt[];
  public connectionRequests: ConnectionRequest[];
  public directMessages: DirectMessage[];
  public userMemories: UserMemory[];
  public auditLogs: AuditLog[];
  public reports: UserReport[];
  public discoveryAnswers: Record<string, DiscoveryAnswer>;
  public discoveryReport: DiscoveryReport | null;
  public supabaseConfig: SupabaseConfig;

  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.users = getStoredItem('users', SEED_USERS);
    this.currentUser = getStoredItem('current_user', this.users[0]);
    this.experts = getStoredItem('experts', SEED_EXPERTS);
    this.interests = getStoredItem('interests', SEED_INTERESTS);
    this.challenges = getStoredItem('challenges', SEED_CHALLENGES);
    this.communities = getStoredItem('communities', SEED_COMMUNITIES);
    this.posts = getStoredItem('posts', SEED_COMMUNITY_POSTS);
    this.recommendations = getStoredItem('recommendations', SEED_RECOMMENDATIONS);
    this.roadmaps = getStoredItem('roadmaps', this.getInitialRoadmaps());
    this.challengeAttempts = getStoredItem('challenge_attempts', []);
    this.connectionRequests = getStoredItem('connection_requests', this.getInitialConnections());
    this.directMessages = getStoredItem('direct_messages', this.getInitialMessages());
    this.userMemories = getStoredItem('user_memories', this.getInitialMemories());
    this.auditLogs = getStoredItem('audit_logs', SEED_AUDIT_LOGS);
    this.reports = getStoredItem('reports', SEED_REPORTS);
    this.discoveryAnswers = getStoredItem('discovery_answers', {
      q_free_time: {
        questionId: 'q_free_time',
        questionTitle: 'Unstructured Free Time Choice',
        value: 'analyzing_investigating'
      },
      q_drive_nature: {
        questionId: 'q_drive_nature',
        questionTitle: 'Curiosity Driver',
        value: 'system_design'
      },
      q_work_style: {
        questionId: 'q_work_style',
        questionTitle: 'Thinking Environment',
        value: 'small_tight_team'
      },
      q_draining: {
        questionId: 'q_draining',
        questionTitle: 'Draining Task',
        value: 'rigid_repetition'
      },
      q_tried_and_enjoyed: {
        questionId: 'q_tried_and_enjoyed',
        questionTitle: 'Enjoyed Activity Recently',
        value: 'Charted ball-by-ball momentum during a weekend tournament with friends.'
      }
    });
    this.discoveryReport = getStoredItem('discovery_report', this.generateInitialReport());
    this.supabaseConfig = getStoredItem('supabase_config', {
      url: '',
      anonKey: '',
      isConnected: false
    });
  }

  public static getInstance(): SkillPathStore {
    if (!SkillPathStore.instance) {
      SkillPathStore.instance = new SkillPathStore();
    }
    return SkillPathStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  private getInitialRoadmaps(): Roadmap[] {
    return [
      {
        id: 'road_1',
        userId: 'user_member_1',
        title: 'Sports Analytics Foundation & Tactical Modeling',
        goal: 'Produce a 5-match tactical insights portfolio and present to a mentor',
        interestSlug: 'sports-analytics',
        interestName: 'Sports Analytics & Tactical Modeling',
        category: 'Sports & Fitness',
        rationale: 'Created from your verified curiosity in game strategy, pattern recognition, and hands-on data storytelling.',
        status: 'active',
        targetWeeks: 4,
        createdAt: '2026-10-18T10:00:00Z',
        updatedAt: '2026-10-21T18:00:00Z',
        milestones: [
          {
            id: 'm1',
            weekNumber: 1,
            title: 'Foundational Observation & Manual Tracking',
            description: 'Experience game deconstruction by manually recording events during a live match without software.',
            focusArea: 'Observation Skills',
            completed: true,
            reflectionQuestion: 'Did recording manual data make you feel more engaged in the match?',
            userReflection: 'Yes, I noticed subtle shifts in bowler field placements that I previously took for granted.',
            tasks: [
              { id: 't1_1', title: 'Pick 1 match and choose 3 specific variables to record', completed: true },
              { id: 't1_2', title: 'Complete the 45-minute Match Momentum Breakdown challenge', completed: true },
              { id: 't1_3', title: 'Compare your notes with the post-match summary', completed: true }
            ]
          },
          {
            id: 'm2',
            weekNumber: 2,
            title: 'Lightweight Spreadsheets & Pattern Visuals',
            description: 'Turn your handwritten match tally into a clean Google Sheet with 2 clear comparison charts.',
            focusArea: 'Basic Data Modeling',
            completed: false,
            reflectionQuestion: 'What unexpected correlation emerged once you visualized the data?',
            tasks: [
              { id: 't2_1', title: 'Import a free open dataset from cricsheet or StatsBomb', completed: true },
              { id: 't2_2', title: 'Calculate run rate variance and dot ball percentage', completed: false },
              { id: 't2_3', title: 'Create a clean 2-axis chart highlighting pivotal moments', completed: false }
            ]
          },
          {
            id: 'm3',
            weekNumber: 3,
            title: 'Narrative Translation & The 1-Page Brief',
            description: 'Translate numbers into human language that a non-technical coach or peer can instantly grasp.',
            focusArea: 'Data Storytelling',
            completed: false,
            reflectionQuestion: 'Could a teammate understand your recommendation in under 30 seconds?',
            tasks: [
              { id: 't3_1', title: 'Write a 3-bullet match tactical takeaway', completed: false },
              { id: 't3_2', title: 'Draft an informal post in the Sports Analytics Guild community', completed: false }
            ]
          },
          {
            id: 'm4',
            weekNumber: 4,
            title: 'Mentor Review & Path Reflection',
            description: 'Share your 1-page visual brief with Dr. Aris Thorne and decide your next learning step.',
            focusArea: 'Human Connection & Next Step',
            completed: false,
            reflectionQuestion: 'Do you want to continue this interest as a weekly hobby or explore professional certifications?',
            tasks: [
              { id: 't4_1', title: 'Send your brief in a direct message to Dr. Aris Thorne', completed: false },
              { id: 't4_2', title: 'Complete the Clarity Checkpoint reflection', completed: false }
            ]
          }
        ]
      }
    ];
  }

  private getInitialConnections(): ConnectionRequest[] {
    return [
      {
        id: 'conn_1',
        senderId: 'user_member_1',
        senderName: 'Maya Lin',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderBio: 'Exploring sports strategy and visual analytics.',
        recipientId: 'user_expert_1',
        recipientName: 'Dr. Aris Thorne',
        type: 'mentorship',
        note: 'Hello Dr. Thorne, I enjoyed your tactical match analysis framework. I completed my first 5-match run rate breakdown and would love your brief review on my charts.',
        status: 'accepted',
        createdAt: '2026-10-19T11:00:00Z'
      },
      {
        id: 'conn_2',
        senderId: 'user_p3',
        senderName: 'Liam O’Connor',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        senderBio: 'Indie game audio enthusiast and field recordist.',
        recipientId: 'user_member_1',
        recipientName: 'Maya Lin',
        type: 'peer',
        note: 'Hey Maya! Saw your post in the guild. I’m also pairing creative writing with game systems. Would love to stay connected as study partners!',
        status: 'pending',
        createdAt: '2026-10-21T15:30:00Z'
      }
    ];
  }

  private getInitialMessages(): DirectMessage[] {
    return [
      {
        id: 'msg_1',
        connectionId: 'conn_1',
        senderId: 'user_member_1',
        recipientId: 'user_expert_1',
        text: 'Hi Dr. Thorne, thank you for accepting my mentorship connection! I finished my first chart on dot-ball pressure in death overs.',
        timestamp: '2026-10-19T11:05:00Z',
        read: true
      },
      {
        id: 'msg_2',
        connectionId: 'conn_1',
        senderId: 'user_expert_1',
        recipientId: 'user_member_1',
        text: 'Great to meet you, Maya. That dot-ball chart is a fantastic start. Notice how bowler change frequency affected economy in over 16? Take a look at that next!',
        timestamp: '2026-10-19T14:20:00Z',
        read: true
      }
    ];
  }

  private getInitialMemories(): UserMemory[] {
    return [
      {
        id: 'mem_1',
        userId: 'user_member_1',
        category: 'interest',
        label: 'Sports Strategy & Data Curiosity',
        detail: 'User enjoys analyzing match patterns, dot-ball ratios, and tactical turning points rather than passive viewing.',
        source: 'Discovery Session & Milestone 1',
        confirmed: true,
        updatedAt: '2026-10-20T10:00:00Z'
      },
      {
        id: 'mem_2',
        userId: 'user_member_1',
        category: 'preference',
        label: 'Hands-on Learning in Small Teams',
        detail: 'Dislikes isolated deep coding with zero human feedback; prefers tangible visual feedback and bouncing ideas in small pairs.',
        source: 'Onboarding Questionnaire',
        confirmed: true,
        updatedAt: '2026-10-18T10:00:00Z'
      },
      {
        id: 'mem_3',
        userId: 'user_member_1',
        category: 'preference',
        label: 'Allergic to Repetitive Bureaucracy',
        detail: 'Drained by clerical paperwork and endless meetings; motivated by creative freedom and tangible mini-projects.',
        source: 'Discovery Session Step 2',
        confirmed: true,
        updatedAt: '2026-10-18T10:00:00Z'
      }
    ];
  }

  private generateInitialReport(): DiscoveryReport {
    return {
      id: 'rep_init',
      userId: 'user_member_1',
      createdAt: '2026-10-18T10:30:00Z',
      primaryThemes: [
        'Tactical Sports Modeling & Strategy',
        'Data Storytelling & Visual Communication'
      ],
      secondaryInterests: [
        'Playful Systems & Game Design',
        'Reflective Non-Fiction Writing'
      ],
      enjoyedActivities: [
        'Tracking game momentum shifts in real time',
        'Translating complex spreadsheets into clean, digestible charts',
        'Exploring how small rule changes alter player behavior'
      ],
      tentativeStrengths: [
        {
          strength: 'Pattern Recognition in Competitive Scenarios',
          evidence: 'Identified pivotal turnaround moments from manual match tally.',
          status: 'demonstrated'
        },
        {
          strength: 'Cross-Disciplinary Synthesis',
          evidence: 'Bridges numbers and human storytelling without jargon.',
          status: 'tentative'
        }
      ],
      unexploredQuestions: [
        'Would you prefer building automated scripts or acting as the narrative communicator?',
        'Do you enjoy tracking athletic physiological data or tactical set-pieces more?'
      ],
      suggestedExperiments: [
        {
          title: 'The 45-Minute Match Momentum Challenge',
          description: 'Chart tactical shifts during a live or recorded match segment.',
          duration: '45 minutes',
          domain: 'Sports & Fitness'
        },
        {
          title: 'The 1-Page Card Game Rule Modification',
          description: 'Experience game systems by altering a single rule in standard cards.',
          duration: '30 minutes',
          domain: 'Gaming & Esports'
        },
        {
          title: 'The 250-Word Sensory Snapshot',
          description: 'Describe an everyday location using 4 non-visual sensory markers.',
          duration: '25 minutes',
          domain: 'Writing & Storytelling'
        }
      ],
      confidenceExplanation: 'High clarity based on consistent multi-choice responses and verified challenge completion.',
      clarityCheckpoint: 'direction'
    };
  }

  // --- ACTIONS ---

  public setCurrentUser(user: UserProfile): void {
    this.currentUser = user;
    setStoredItem('current_user', user);
    this.recordAuditLog('SWITCH_USER', user.name, `Active session switched to ${user.name} (${user.role})`);
    this.notify();
  }

  public updateCurrentUserProfile(updates: Partial<UserProfile>): void {
    this.currentUser = { ...this.currentUser, ...updates };
    this.users = this.users.map((u) => (u.id === this.currentUser.id ? this.currentUser : u));
    setStoredItem('current_user', this.currentUser);
    setStoredItem('users', this.users);
    this.notify();
  }

  public saveDiscoveryAnswer(questionId: string, questionTitle: string, value: string | string[]): void {
    this.discoveryAnswers[questionId] = {
      questionId,
      questionTitle,
      value
    };
    setStoredItem('discovery_answers', this.discoveryAnswers);
    this.notify();
  }

  public completeDiscoverySession(clarityCheckpoint: ClarityLevel): DiscoveryReport {
    // Generate tailored report from current answers
    const report = this.generateReportFromAnswers(clarityCheckpoint);
    this.discoveryReport = report;
    setStoredItem('discovery_report', report);

    this.currentUser.onboardingCompleted = true;
    this.updateCurrentUserProfile({ onboardingCompleted: true });

    // Add memory
    this.addUserMemory({
      category: 'interest',
      label: 'Primary Discovery Output',
      detail: `User completed guided discovery with clarity: "${clarityCheckpoint}". Identified primary themes: ${report.primaryThemes.join(', ')}.`,
      source: 'Discovery Session Completion'
    });

    this.recordAuditLog('COMPLETE_DISCOVERY', this.currentUser.name, `Discovery session completed with clarity level: ${clarityCheckpoint}`);
    this.notify();
    return report;
  }

  public generateReportFromAnswers(clarity: ClarityLevel = 'direction'): DiscoveryReport {
    const answers = this.discoveryAnswers;
    const freeTime = answers['q_free_time']?.value || 'analyzing_investigating';
    const driveNature = answers['q_drive_nature']?.value || 'system_design';

    const themes: string[] = [];
    const secondary: string[] = [];
    const activities: string[] = [];

    if (freeTime === 'analyzing_investigating' || driveNature === 'system_design') {
      themes.push('Tactical Sports Modeling & Strategy');
      themes.push('Data Storytelling & Visual Analytics');
      secondary.push('Playful Interactive Tools');
      secondary.push('Reflective Research');
      activities.push('Charting momentum shifts and evaluating tactical tradeoffs');
      activities.push('Deconstructing why specific decisions flipped match probabilities');
    } else if (freeTime === 'building_making') {
      themes.push('Creative Technology & Physical Computing');
      themes.push('Playful Interface Systems');
      secondary.push('Digital Craftsmanship');
      activities.push('Tinkering with small, reactive web prototypes');
      activities.push('Building tools that solve everyday friction');
    } else if (freeTime === 'creating_expressing') {
      themes.push('Narrative Non-Fiction & Human Essays');
      themes.push('Sound Design & Acoustic Landscapes');
      secondary.push('Community Storytelling');
      activities.push('Writing focused observations of real-world interactions');
      activities.push('Capturing field recordings and ambient soundscapes');
    } else {
      themes.push('Community Organizing & Grassroots Impact');
      themes.push('Collaborative Learning & Coaching');
      secondary.push('Public Dialogue');
      activities.push('Bringing people together around shared local causes');
      activities.push('Facilitating beginner workshops and mutual aid');
    }

    return {
      id: 'rep_' + Date.now(),
      userId: this.currentUser.id,
      createdAt: new Date().toISOString(),
      primaryThemes: themes,
      secondaryInterests: secondary,
      enjoyedActivities: activities,
      tentativeStrengths: [
        {
          strength: 'Systemic Thinking & Context Sensitivity',
          evidence: 'Identified trade-offs between speed, clarity, and user enjoyment.',
          status: 'demonstrated'
        },
        {
          strength: 'Empathetic Visual Communication',
          evidence: 'Desire to express insights cleanly without overwhelming peers with technical jargon.',
          status: 'tentative'
        }
      ],
      unexploredQuestions: [
        'Would you prefer building automated workflows or focusing on human coaching/mentorship?',
        'How many hours per week feels replenishing rather than demanding?'
      ],
      suggestedExperiments: [
        {
          title: 'The Match Momentum & Pressure Breakdown',
          description: 'Test your tactical analytical appetite by logging momentum across a 20-minute match segment.',
          duration: '45 mins',
          domain: 'Sports & Fitness'
        },
        {
          title: 'The 1-Page Rulebook Variant Challenge',
          description: 'Modify one rule in a standard card deck to see how emergent strategies develop.',
          duration: '30 mins',
          domain: 'Gaming & Esports'
        },
        {
          title: 'The 10-Line Micro Interactive Toy',
          description: 'Build an instant mouse-reactive visual toy in a free browser canvas.',
          duration: '35 mins',
          domain: 'Technology & Programming'
        }
      ],
      confidenceExplanation: 'Grounded in your structured self-assessment, reflection notes, and energy calibration.',
      clarityCheckpoint: clarity
    };
  }

  // --- RECOMMENDATION ENGINE & ADAPTIVE REJECTION ---

  public rejectRecommendation(
    recId: string,
    reasonType: 'activity' | 'difficulty' | 'lifestyle' | 'social' | 'resources' | 'other',
    userNotes?: string
  ): Recommendation {
    const target = this.recommendations.find((r) => r.id === recId);
    if (!target) throw new Error('Recommendation not found');

    target.status = 'rejected';
    target.rejectionReason = { reasonType, userNotes };

    // Record user memory
    this.addUserMemory({
      category: 'rejection',
      label: `Rejected: ${target.title}`,
      detail: `Mismatch category: [${reasonType}]. Reason: ${userNotes || 'No specific notes'}. Updated preference model to avoid identical suggestions.`,
      source: 'Adaptive Rejection Engine'
    });

    // Generate a genuinely different alternative recommendation!
    const alternative = this.generateAdaptiveAlternative(target, reasonType);
    this.recommendations.unshift(alternative);

    setStoredItem('recommendations', this.recommendations);
    this.recordAuditLog('REJECT_RECOMMENDATION', this.currentUser.name, `Rejected "${target.title}" due to ${reasonType}. Generated alternative "${alternative.title}".`);
    this.notify();
    return alternative;
  }

  private generateAdaptiveAlternative(
    rejected: Recommendation,
    reason: 'activity' | 'difficulty' | 'lifestyle' | 'social' | 'resources' | 'other'
  ): Recommendation {
    if (reason === 'activity' || reason === 'difficulty') {
      return {
        id: 'rec_alt_' + Date.now(),
        userId: this.currentUser.id,
        category: 'project',
        title: 'Micro-Essay: The Psychology of a Comeback',
        subtitle: 'Narrative storytelling alternative to heavy data charts',
        description: 'Instead of spreadsheet tables, explore sports strategy through human psychology. Write a short 300-word piece dissecting the mental resilience of an athlete under extreme pressure.',
        whyItFits: 'Pivots away from dense quantitative tracking toward human-centered narrative storytelling while keeping the sports domain.',
        supportingAnswers: ['Adapted from rejection feedback indicating difficulty/activity mismatch with raw numeric modeling.'],
        whatYoullEnjoy: ['Focusing on emotions, body language, and resilience', 'No spreadsheet formulas required'],
        potentialChallenges: ['Selecting the right evocative adjectives'],
        beginnerExperiment: 'Draft 3 bullet points describing what you saw in an athlete’s eyes before the deciding play.',
        timeCommitment: '45 minutes',
        requiredResources: 'Notebook and pen',
        suggestedNextAction: 'Read example micro-essay in community',
        confidenceScore: 84,
        confidenceExplanation: 'Calibrated based on your preference for human resonance over rigid numerical tables.',
        status: 'active'
      };
    }

    if (reason === 'lifestyle' || reason === 'resources') {
      return {
        id: 'rec_alt_' + Date.now(),
        userId: this.currentUser.id,
        category: 'skill',
        title: '15-Minute Daily Match Reflection Protocol',
        subtitle: 'Low-friction, zero-software observation habit',
        description: 'A pocket-sized observation method requiring only 15 minutes of quiet reflection during or after any game you already watch.',
        whyItFits: 'Designed specifically to eliminate resource hurdles and fit tight time constraints.',
        supportingAnswers: ['Adapted from rejection feedback noting lifestyle/time constraints.'],
        whatYoullEnjoy: ['Fits seamlessly into normal recreational viewing', 'Zero new tools or accounts to install'],
        potentialChallenges: ['Remembering to pause and jot down 2 bullet points'],
        beginnerExperiment: 'At halftime or tea break, answer one question: What adjustment did the trailing team make?',
        timeCommitment: '15 minutes per match',
        requiredResources: 'Any phone notes app or scrap paper',
        suggestedNextAction: 'Try during next weekend broadcast',
        confidenceScore: 88,
        confidenceExplanation: 'Direct response to your stated preference for lower time overhead.',
        status: 'active'
      };
    }

    // Default social/other alternative
    return {
      id: 'rec_alt_' + Date.now(),
      userId: this.currentUser.id,
      category: 'community',
      title: 'Solo Exploration in Interactive p5.js Sketches',
      subtitle: 'Self-paced private creative sandbox',
      description: 'Explore visual rhythm and design independently at your own pace without pressure from group meetings or peer reviews.',
      whyItFits: 'Provides a safe, autonomous creative sandbox without collaborative overhead.',
      supportingAnswers: ['Adapted from rejection feedback requesting a more independent working environment.'],
      whatYoullEnjoy: ['Complete privacy to experiment and make mistakes', 'Instant visual satisfaction'],
      potentialChallenges: ['Staying motivated without an external deadline'],
      beginnerExperiment: 'Open p5.js web editor and change one color variable to see it respond.',
      timeCommitment: '30 minutes',
      requiredResources: 'Web browser',
      suggestedNextAction: 'Open free browser editor',
      confidenceScore: 82,
      confidenceExplanation: 'Tailored for independent, low-pressure exploration.',
      status: 'active'
    };
  }

  public saveRecommendation(recId: string): void {
    const rec = this.recommendations.find((r) => r.id === recId);
    if (rec) {
      rec.status = 'saved';
      setStoredItem('recommendations', this.recommendations);
      this.notify();
    }
  }

  // --- ROADMAP OPERATIONS ---

  public createRoadmap(title: string, goal: string, interestName: string, category: string, rationale: string): Roadmap {
    const newRoadmap: Roadmap = {
      id: 'road_' + Date.now(),
      userId: this.currentUser.id,
      title,
      goal,
      interestSlug: interestName.toLowerCase().replace(/\s+/g, '-'),
      interestName,
      category,
      rationale,
      status: 'active',
      targetWeeks: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [
        {
          id: 'm_1_' + Date.now(),
          weekNumber: 1,
          title: 'Try a Beginner Experiment',
          description: 'Complete one small, zero-stakes activity to test whether the process feels engaging.',
          focusArea: 'Initial Exploration',
          completed: false,
          reflectionQuestion: 'Did this activity feel like play or like a chore?',
          tasks: [
            { id: 't_1_1', title: `Complete first beginner starter activity in ${interestName}`, completed: false },
            { id: 't_1_2', title: 'Record a 2-sentence note on your emotional state during the task', completed: false }
          ]
        },
        {
          id: 'm_2_' + Date.now(),
          weekNumber: 2,
          title: 'Learn One Foundational Skill',
          description: 'Focus on one specific technique or vocabulary term that unlocks deeper appreciation.',
          focusArea: 'Foundational Knowledge',
          completed: false,
          reflectionQuestion: 'What surprised you about how the fundamentals actually work?',
          tasks: [
            { id: 't_2_1', title: 'Read or watch one high-quality beginner tutorial', completed: false },
            { id: 't_2_2', title: 'Apply the technique to a mini-project', completed: false }
          ]
        },
        {
          id: 'm_3_' + Date.now(),
          weekNumber: 3,
          title: 'Build a Tangible Mini-Artifact',
          description: 'Produce a simple project (chart, essay, code snippet, sketch) you can share or archive.',
          focusArea: 'Hands-on Creation',
          completed: false,
          reflectionQuestion: 'How does it feel to see a finished tangible output?',
          tasks: [
            { id: 't_3_1', title: 'Complete your first shareable artifact', completed: false },
            { id: 't_3_2', title: 'Post in the community or share with a peer', completed: false }
          ]
        },
        {
          id: 'm_4_' + Date.now(),
          weekNumber: 4,
          title: 'Reflect on Enjoyment & Choose Next Action',
          description: 'Determine whether you wish to deepen this interest, keep it casual, or explore an alternative.',
          focusArea: 'Path Calibration',
          completed: false,
          reflectionQuestion: 'Do you want to continue this journey next month?',
          tasks: [
            { id: 't_4_1', title: 'Complete the milestone reflection questionnaire', completed: false },
            { id: 't_4_2', title: 'Decide: deepen, pause, or transition', completed: false }
          ]
        }
      ]
    };

    this.roadmaps.unshift(newRoadmap);
    setStoredItem('roadmaps', this.roadmaps);
    this.recordAuditLog('CREATE_ROADMAP', this.currentUser.name, `Created roadmap "${title}"`);
    this.notify();
    return newRoadmap;
  }

  public toggleRoadmapTask(roadmapId: string, milestoneId: string, taskId: string): void {
    const roadmap = this.roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;

    const milestone = roadmap.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const task = milestone.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    milestone.completed = milestone.tasks.every((t) => t.completed);

    roadmap.updatedAt = new Date().toISOString();
    setStoredItem('roadmaps', this.roadmaps);
    this.notify();
  }

  public saveMilestoneReflection(roadmapId: string, milestoneId: string, reflection: string): void {
    const roadmap = this.roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;

    const milestone = roadmap.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.userReflection = reflection;
    roadmap.updatedAt = new Date().toISOString();
    setStoredItem('roadmaps', this.roadmaps);

    // Save reflection memory
    this.addUserMemory({
      category: 'reflection',
      label: `Milestone ${milestone.weekNumber} Reflection (${roadmap.title})`,
      detail: reflection,
      source: 'Roadmap Milestone Reflection'
    });

    this.notify();
  }

  // --- CHALLENGE ATTEMPTS ---

  public submitChallengeAttempt(
    challengeId: string,
    submissionNotes: string,
    reflection: {
      enjoyment: number;
      difficulty: number;
      retryWillingness: number;
      learningTakeaway: string;
      wantToExploreFurther: boolean;
    }
  ): ChallengeAttempt {
    const attempt: ChallengeAttempt = {
      id: 'att_' + Date.now(),
      challengeId,
      userId: this.currentUser.id,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      submissionNotes,
      reflection
    };

    this.challengeAttempts.unshift(attempt);
    setStoredItem('challenge_attempts', this.challengeAttempts);

    const challenge = this.challenges.find((c) => c.id === challengeId);
    const title = challenge?.title || 'Challenge';

    this.addUserMemory({
      category: 'reflection',
      label: `Completed Challenge: ${title}`,
      detail: `Rated enjoyment: ${reflection.enjoyment}/5, difficulty: ${reflection.difficulty}/5. Key takeaway: "${reflection.learningTakeaway}". Explore further: ${reflection.wantToExploreFurther ? 'Yes' : 'No'}.`,
      source: 'Interactive Challenge Attempt'
    });

    this.recordAuditLog('COMPLETE_CHALLENGE', this.currentUser.name, `Submitted challenge attempt for "${title}"`);
    this.notify();
    return attempt;
  }

  // --- CONNECTIONS & MESSAGES ---

  public sendConnectionRequest(recipientId: string, note: string, type: 'mentorship' | 'peer'): ConnectionRequest {
    const recipient = this.users.find((u) => u.id === recipientId);
    const recipientName = recipient ? recipient.name : 'Recipient';

    const req: ConnectionRequest = {
      id: 'conn_' + Date.now(),
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      senderAvatar: this.currentUser.avatar,
      senderBio: this.currentUser.bio,
      recipientId,
      recipientName,
      type,
      note,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.connectionRequests.unshift(req);
    setStoredItem('connection_requests', this.connectionRequests);
    this.recordAuditLog('SEND_CONNECTION_REQUEST', this.currentUser.name, `Sent ${type} request to ${recipientName}`);
    this.notify();
    return req;
  }

  public respondToConnectionRequest(requestId: string, status: 'accepted' | 'declined'): void {
    const req = this.connectionRequests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = status;
    setStoredItem('connection_requests', this.connectionRequests);
    this.recordAuditLog('RESPOND_CONNECTION_REQUEST', this.currentUser.name, `${status.toUpperCase()} request from ${req.senderName}`);
    this.notify();
  }

  public sendDirectMessage(connectionId: string, recipientId: string, text: string): DirectMessage {
    const msg: DirectMessage = {
      id: 'msg_' + Date.now(),
      connectionId,
      senderId: this.currentUser.id,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      read: true
    };

    this.directMessages.push(msg);
    setStoredItem('direct_messages', this.directMessages);
    this.notify();
    return msg;
  }

  // --- COMMUNITIES ---

  public toggleCommunityJoin(communityId: string): void {
    const comm = this.communities.find((c) => c.id === communityId);
    if (!comm) return;

    comm.joined = !comm.joined;
    comm.memberCount += comm.joined ? 1 : -1;
    setStoredItem('communities', this.communities);
    this.recordAuditLog(comm.joined ? 'JOIN_COMMUNITY' : 'LEAVE_COMMUNITY', this.currentUser.name, `Community: ${comm.name}`);
    this.notify();
  }

  public createCommunityPost(communityId: string, title: string, content: string, tags: string[]): CommunityPost {
    const comm = this.communities.find((c) => c.id === communityId);
    const post: CommunityPost = {
      id: 'post_' + Date.now(),
      communityId,
      authorId: this.currentUser.id,
      authorName: this.currentUser.name,
      authorRole: this.currentUser.role,
      authorAvatar: this.currentUser.avatar,
      title,
      content,
      tags,
      likes: 1,
      userLiked: true,
      createdAt: new Date().toISOString(),
      comments: []
    };

    this.posts.unshift(post);
    if (comm) comm.postCount += 1;

    setStoredItem('posts', this.posts);
    setStoredItem('communities', this.communities);
    this.recordAuditLog('CREATE_POST', this.currentUser.name, `Post "${title}" in ${comm?.name}`);
    this.notify();
    return post;
  }

  public togglePostLike(postId: string): void {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    post.userLiked = !post.userLiked;
    post.likes += post.userLiked ? 1 : -1;
    setStoredItem('posts', this.posts);
    this.notify();
  }

  public addPostComment(postId: string, content: string): void {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    post.comments.push({
      id: 'comm_' + Date.now(),
      authorName: this.currentUser.name,
      authorAvatar: this.currentUser.avatar,
      authorRole: this.currentUser.role,
      content,
      createdAt: new Date().toISOString()
    });

    setStoredItem('posts', this.posts);
    this.notify();
  }

  // --- ADMIN & MODERATION ---

  public reportContent(
    reportedEntityId: string,
    reportedEntityType: 'post' | 'user' | 'message',
    entitySummary: string,
    reason: string
  ): void {
    const rep: UserReport = {
      id: 'rep_' + Date.now(),
      reporterId: this.currentUser.id,
      reporterName: this.currentUser.name,
      reportedEntityId,
      reportedEntityType,
      entitySummary,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.reports.unshift(rep);
    setStoredItem('reports', this.reports);
    this.recordAuditLog('REPORT_CONTENT', this.currentUser.name, `Reported ${reportedEntityType} (${reportedEntityId}) for: ${reason}`);
    this.notify();
  }

  public resolveReport(reportId: string, action: 'dismiss' | 'resolved' | 'remove'): void {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return;

    rep.status = action === 'dismiss' ? 'dismissed' : 'resolved';

    if (action === 'remove' && rep.reportedEntityType === 'post') {
      this.posts = this.posts.filter((p) => p.id !== rep.reportedEntityId);
      setStoredItem('posts', this.posts);
    }

    setStoredItem('reports', this.reports);
    this.recordAuditLog('RESOLVE_REPORT', this.currentUser.name, `Action [${action}] on report ${reportId}`);
    this.notify();
  }

  public verifyExpert(expertUserId: string, approved: boolean): void {
    const expert = this.experts.find((e) => e.userId === expertUserId);
    if (!expert) return;

    expert.verified = approved;
    expert.verificationBadgeDate = approved ? new Date().toISOString() : undefined;
    setStoredItem('experts', this.experts);
    this.recordAuditLog(
      approved ? 'APPROVE_EXPERT' : 'REJECT_EXPERT',
      this.currentUser.name,
      `Expert verification status updated for ${expert.name}`
    );
    this.notify();
  }

  // --- MEMORY ARCHITECTURE & PRIVACY ---

  public addUserMemory(mem: Omit<UserMemory, 'id' | 'userId' | 'confirmed' | 'updatedAt'>): void {
    const newMem: UserMemory = {
      id: 'mem_' + Date.now(),
      userId: this.currentUser.id,
      category: mem.category,
      label: mem.label,
      detail: mem.detail,
      source: mem.source,
      confirmed: true,
      updatedAt: new Date().toISOString()
    };

    this.userMemories.unshift(newMem);
    setStoredItem('user_memories', this.userMemories);
    this.notify();
  }

  public deleteUserMemory(memoryId: string): void {
    this.userMemories = this.userMemories.filter((m) => m.id !== memoryId);
    setStoredItem('user_memories', this.userMemories);
    this.recordAuditLog('DELETE_MEMORY', this.currentUser.name, `Deleted memory item ${memoryId}`);
    this.notify();
  }

  public resetUserMemories(): void {
    this.userMemories = this.userMemories.filter((m) => m.userId !== this.currentUser.id);
    setStoredItem('user_memories', this.userMemories);
    this.recordAuditLog('RESET_ALL_MEMORIES', this.currentUser.name, 'Cleared all personalized memory records');
    this.notify();
  }

  public exportUserData(): string {
    const data = {
      profile: this.currentUser,
      discoveryAnswers: this.discoveryAnswers,
      discoveryReport: this.discoveryReport,
      memories: this.userMemories.filter((m) => m.userId === this.currentUser.id),
      roadmaps: this.roadmaps.filter((r) => r.userId === this.currentUser.id),
      challenges: this.challengeAttempts.filter((c) => c.userId === this.currentUser.id),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  public recordAuditLog(action: string, targetEntity: string, details: string): void {
    const log: AuditLog = {
      id: 'log_' + Date.now(),
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action,
      targetEntity,
      timestamp: new Date().toISOString(),
      details
    };
    this.auditLogs.unshift(log);
    setStoredItem('audit_logs', this.auditLogs);
  }

  public setSupabaseConfig(config: SupabaseConfig): void {
    this.supabaseConfig = config;
    setStoredItem('supabase_config', config);
    this.notify();
  }

  public resetToDefaults(): void {
    localStorage.clear();
    window.location.reload();
  }
}

export const store = SkillPathStore.getInstance();
