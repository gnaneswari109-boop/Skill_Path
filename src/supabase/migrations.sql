-- ====================================================================
-- SKILL PATH: MASTER DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- PostgreSQL / Supabase Migration
-- Tables: 28 Core Relational Entities
-- ====================================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  age_range TEXT,
  life_stage TEXT CHECK (life_stage IN ('school', 'college', 'employed', 'career_transition', 'exploring')),
  bio TEXT,
  language_preference TEXT DEFAULT 'en',
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'connections_only', 'private')),
  available_hours_per_week INT DEFAULT 5,
  preferred_learning_style TEXT DEFAULT 'hands_on',
  onboarding_status TEXT DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'expert', 'admin')),
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  assigned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. INTERESTS CATALOG
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  beginner_activities JSONB DEFAULT '[]'::jsonb,
  skills_developed JSONB DEFAULT '[]'::jsonb,
  materials_needed JSONB DEFAULT '[]'::jsonb,
  starter_challenges JSONB DEFAULT '[]'::jsonb,
  career_connections JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER INTERESTS
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  interest_type TEXT DEFAULT 'exploring' CHECK (interest_type IN ('primary', 'secondary', 'exploring')),
  preference_level INT DEFAULT 3 CHECK (preference_level BETWEEN 1 AND 5),
  evidence_source TEXT,
  confidence_explanation TEXT,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, interest_id)
);

-- 5. DISCOVERY SESSIONS
CREATE TABLE IF NOT EXISTS public.discovery_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_status TEXT DEFAULT 'in_progress' CHECK (session_status IN ('in_progress', 'completed', 'paused')),
  current_step INT DEFAULT 1,
  clarity_checkpoint TEXT CHECK (clarity_checkpoint IN ('direction', 'possibilities', 'unsure')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. DISCOVERY QUESTIONS
CREATE TABLE IF NOT EXISTS public.discovery_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_content TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  question_type TEXT DEFAULT 'single' CHECK (question_type IN ('single', 'multi', 'scale', 'text')),
  answer_options JSONB DEFAULT '[]'::jsonb,
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE
);

-- 7. DISCOVERY ANSWERS
CREATE TABLE IF NOT EXISTS public.discovery_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.discovery_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.discovery_questions(id) ON DELETE CASCADE,
  answer_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Discovery Dialogue',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USER MEMORIES
CREATE TABLE IF NOT EXISTS public.user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('interest', 'preference', 'rejection', 'goal', 'reflection')),
  label TEXT NOT NULL,
  detail TEXT NOT NULL,
  source_reference TEXT,
  is_confirmed BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('hobby', 'skill', 'career', 'project', 'community', 'mentor', 'challenge')),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  why_it_fits TEXT NOT NULL,
  supporting_answers JSONB DEFAULT '[]'::jsonb,
  what_youll_enjoy JSONB DEFAULT '[]'::jsonb,
  potential_challenges JSONB DEFAULT '[]'::jsonb,
  beginner_experiment TEXT,
  time_commitment TEXT,
  required_resources TEXT,
  suggested_next_action TEXT,
  confidence_score INT DEFAULT 80,
  confidence_explanation TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'saved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RECOMMENDATION FEEDBACK
CREATE TABLE IF NOT EXISTS public.recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('interested', 'maybe_later', 'not_for_me', 'already_tried', 'need_info')),
  rejection_reason_type TEXT CHECK (rejection_reason_type IN ('activity', 'difficulty', 'lifestyle', 'social', 'resources', 'other')),
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ROADMAPS
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  interest_slug TEXT,
  interest_name TEXT,
  category TEXT,
  rationale TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  target_weeks INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ROADMAP MILESTONES
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  focus_area TEXT,
  tasks JSONB DEFAULT '[]'::jsonb,
  reflection_question TEXT,
  user_reflection TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_timestamp TIMESTAMPTZ
);

-- 15. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Beginner',
  estimated_duration TEXT NOT NULL,
  objective TEXT NOT NULL,
  materials JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  reflection_prompt TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Compass',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CHALLENGE ATTEMPTS
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  submission_notes TEXT,
  enjoyment_rating INT CHECK (enjoyment_rating BETWEEN 1 AND 5),
  difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
  retry_willingness INT CHECK (retry_willingness BETWEEN 1 AND 5),
  learning_takeaway TEXT,
  want_to_explore_further BOOLEAN DEFAULT TRUE
);

-- 17. EXPERT PROFILES
CREATE TABLE IF NOT EXISTS public.expert_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  areas_of_expertise TEXT[] NOT NULL DEFAULT '{}',
  qualifications TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge_date TIMESTAMPTZ,
  availability TEXT DEFAULT 'open' CHECK (availability IN ('open', 'limited', 'busy')),
  languages TEXT[] DEFAULT '{"en"}',
  preferred_mentee_goals TEXT[] DEFAULT '{}',
  mentees_count INT DEFAULT 0,
  rating_average NUMERIC(3, 2) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CONNECTIONS
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  connection_type TEXT DEFAULT 'mentorship' CHECK (connection_type IN ('mentorship', 'peer')),
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- 19. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. COMMUNITIES
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES public.profiles(id),
  visibility TEXT DEFAULT 'public',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. COMMUNITY MEMBERS
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  membership_role TEXT DEFAULT 'member' CHECK (membership_role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 23. COMMUNITY POSTS
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  is_reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. COMMUNITY COMMENTS
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. COMMUNITY REACTIONS
CREATE TABLE IF NOT EXISTS public.community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reaction_type TEXT DEFAULT 'insightful' CHECK (reaction_type IN ('insightful', 'helpful', 'inspiring')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id, reaction_type)
);

-- 26. USER REPORTS
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_entity_id TEXT NOT NULL,
  reported_entity_type TEXT NOT NULL CHECK (reported_entity_type IN ('post', 'user', 'message')),
  entity_summary TEXT,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view public profiles; users can only edit their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Discovery Answers: strictly private to the user
CREATE POLICY "Users can read own discovery answers" ON public.discovery_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own discovery answers" ON public.discovery_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Roadmaps: strictly private or authorized
CREATE POLICY "Users can manage own roadmaps" ON public.roadmaps
  FOR ALL USING (auth.uid() = user_id);

-- Messages: only connection participants can view/send
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Participants can insert messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Admin Privileges: Only verified admins can read/write audit logs and process reports
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin' 
      AND user_roles.approval_status = 'approved'
    )
  );
