export type UserRole = 'member' | 'expert' | 'admin';

export type LifeStage = 'school' | 'college' | 'employed' | 'career_transition' | 'exploring';

export type ClarityLevel = 'direction' | 'possibilities' | 'unsure';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  lifeStage: LifeStage;
  ageRange?: string;
  availableHoursPerWeek: number;
  preferredLearningStyle: 'hands_on' | 'reading_research' | 'mentored' | 'collaborative';
  profileVisibility: 'public' | 'connections_only' | 'private';
  onboardingCompleted: boolean;
  interestsPrimary: string[];
  interestsSecondary: string[];
  createdAt: string;
}

export type InterestCategory =
  | 'Sports & Fitness'
  | 'Gaming & Esports'
  | 'Art & Illustration'
  | 'Music & Performance'
  | 'Writing & Storytelling'
  | 'Technology & Programming'
  | 'Science & Experimentation'
  | 'Business & Entrepreneurship'
  | 'Teaching & Mentoring'
  | 'Social Impact & Volunteering'
  | 'Nature & Outdoors'
  | 'Communication & Media'
  | 'Design & Architecture'
  | 'Analytical Thinking'
  | 'Crafts & Hands-On Skills';

export interface Interest {
  id: string;
  name: string;
  slug: string;
  category: InterestCategory;
  description: string;
  beginnerActivities: string[];
  skillsDeveloped: string[];
  materialsNeeded: string[];
  starterChallenges: string[];
  careerConnections: string[];
  tags: string[];
  iconName: string;
  popularityCount: number;
}

export interface DiscoveryQuestion {
  id: string;
  title: string;
  subtitle: string;
  category: 'core' | 'tradeoff' | 'environment' | 'energy' | 'reflection';
  type: 'single' | 'multi' | 'scale' | 'text';
  options?: {
    value: string;
    label: string;
    description?: string;
  }[];
}

export interface DiscoveryAnswer {
  questionId: string;
  questionTitle: string;
  value: string | string[];
}

export interface DiscoveryReport {
  id: string;
  userId: string;
  createdAt: string;
  primaryThemes: string[];
  secondaryInterests: string[];
  enjoyedActivities: string[];
  tentativeStrengths: {
    strength: string;
    evidence: string;
    status: 'tentative' | 'demonstrated';
  }[];
  unexploredQuestions: string[];
  suggestedExperiments: {
    title: string;
    description: string;
    duration: string;
    domain: string;
  }[];
  confidenceExplanation: string;
  clarityCheckpoint: ClarityLevel;
}

export type RecommendationCategory =
  | 'hobby'
  | 'skill'
  | 'career'
  | 'project'
  | 'community'
  | 'mentor'
  | 'challenge';

export interface Recommendation {
  id: string;
  userId: string;
  category: RecommendationCategory;
  title: string;
  subtitle: string;
  description: string;
  whyItFits: string;
  supportingAnswers: string[];
  whatYoullEnjoy: string[];
  potentialChallenges: string[];
  beginnerExperiment: string;
  timeCommitment: string;
  requiredResources: string;
  suggestedNextAction: string;
  confidenceScore: number;
  confidenceExplanation: string;
  status: 'active' | 'saved' | 'rejected' | 'completed';
  rejectionReason?: {
    reasonType: 'activity' | 'difficulty' | 'lifestyle' | 'social' | 'resources' | 'other';
    userNotes?: string;
  };
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  timeEstimate?: string;
}

export interface RoadmapMilestone {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  focusArea: string;
  tasks: RoadmapTask[];
  reflectionQuestion: string;
  userReflection?: string;
  completed: boolean;
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  goal: string;
  interestSlug: string;
  interestName: string;
  category: string;
  rationale: string;
  status: 'active' | 'paused' | 'completed';
  targetWeeks: number;
  milestones: RoadmapMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: InterestCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Deep Dive';
  estimatedDuration: string;
  objective: string;
  materials: string[];
  instructions: string[];
  reflectionPrompt: string;
  iconName: string;
}

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  submissionNotes: string;
  reflection: {
    enjoyment: number; // 1 to 5
    difficulty: number; // 1 to 5
    retryWillingness: number; // 1 to 5
    learningTakeaway: string;
    wantToExploreFurther: boolean;
  };
}

export interface ExpertProfile {
  userId: string;
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  areasOfExpertise: string[];
  qualifications: string;
  verified: boolean;
  verificationBadgeDate?: string;
  availability: 'open' | 'limited' | 'busy';
  languages: string[];
  preferredMenteeGoals: string[];
  menteesCount: number;
  ratingAverage: number;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderBio: string;
  recipientId: string;
  recipientName: string;
  type: 'mentorship' | 'peer';
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  connectionId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  userLiked: boolean;
  comments: CommunityComment[];
  createdAt: string;
  isReported?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  category: InterestCategory;
  description: string;
  rules: string[];
  memberCount: number;
  postCount: number;
  joined: boolean;
}

export interface UserMemory {
  id: string;
  userId: string;
  category: 'interest' | 'preference' | 'rejection' | 'goal' | 'reflection';
  label: string;
  detail: string;
  source: string;
  confirmed: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  timestamp: string;
  details: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedEntityId: string;
  reportedEntityType: 'post' | 'user' | 'message';
  entitySummary: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
