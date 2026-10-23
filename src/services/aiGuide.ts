import { GoogleGenAI } from '@google/genai';
import { store } from './store';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: string }[];
}

export class AIGuideService {
  private static instance: AIGuideService;
  private aiClient: GoogleGenAI | null = null;

  private constructor() {
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? (process as any).env?.GEMINI_API_KEY : undefined);
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        this.aiClient = new GoogleGenAI({ apiKey });
      }
    } catch {
      this.aiClient = null;
    }
  }

  public static getInstance(): AIGuideService {
    if (!AIGuideService.instance) {
      AIGuideService.instance = new AIGuideService();
    }
    return AIGuideService.instance;
  }

  public async getGuideResponse(
    userQuery: string,
    history: { sender: 'user' | 'assistant'; text: string }[]
  ): Promise<{ text: string; actions?: { label: string; actionType: string; payload?: string }[] }> {
    const user = store.currentUser;
    const memories = store.userMemories.filter((m) => m.userId === user.id);
    const activeRoadmaps = store.roadmaps.filter((r) => r.userId === user.id && r.status === 'active');
    const recentChallenges = store.challengeAttempts.filter((c) => c.userId === user.id);
    const report = store.discoveryReport;

    const memoryContext = memories
      .map((m) => `- [${m.category}] ${m.label}: ${m.detail}`)
      .join('\n');

    const promptContext = `
You are the "Skill Path Guide", an empathetic, thoughtful personal growth companion for Skill Path.
Your mission: Help people understand what genuinely moves them, explore possibilities without premature career anxiety, reflect on experiments, and take clear next steps.

USER PROFILE:
- Name: ${user.name}
- Current Life Stage: ${user.lifeStage}
- Available Hours/Week: ${user.availableHoursPerWeek}
- Learning Style: ${user.preferredLearningStyle}
- Stated Primary Interests: ${user.interestsPrimary?.join(', ') || 'Exploring'}
- Active Roadmaps: ${activeRoadmaps.map((r) => r.title).join(', ') || 'None yet'}
- Challenges Attempted: ${recentChallenges.length}
- Discovery Clarity Checkpoint: ${report?.clarityCheckpoint || 'Not completed yet'}

AUTHORIZED PERSONALIZATION MEMORIES (source of truth):
${memoryContext || 'No stored memories yet.'}

USER'S MESSAGE: "${userQuery}"

GUIDELINES:
1. Speak in warm, human, grounded language. No corporate buzzwords or generic cheerleader clichés.
2. If the user mentions cricket, gaming, writing, or another hobby, do not jump straight to "You should become a professional X." Instead explore the underlying facets (e.g., tactical strategy, storytelling, physical flow, team dynamics, community building).
3. If referencing prior user information, explicitly ground it in their actual stored answers or reflections.
4. Keep answers concise: 2 to 3 focused paragraphs, followed by 1 or 2 concrete low-friction next experiments they can do this week.
`;

    if (this.aiClient) {
      try {
        const response = await this.aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptContext
        });

        const text = response.text || '';
        if (text.trim().length > 0) {
          return {
            text: text.trim(),
            actions: this.extractSuggestedActions(userQuery, text)
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent deterministic guide engine:', err);
      }
    }

    // Intelligent Deterministic Guide Engine
    return this.generateDeterministicGuideResponse(userQuery, memories, report, activeRoadmaps);
  }

  private generateDeterministicGuideResponse(
    query: string,
    memories: any[],
    report: any,
    activeRoadmaps: any[]
  ): { text: string; actions?: { label: string; actionType: string; payload?: string }[] } {
    const q = query.toLowerCase();

    if (q.includes('cricket') || q.includes('sports')) {
      return {
        text: `When people think of an interest like cricket or football, conventional career advice often assumes you want to become an athlete. In Skill Path, we look at the underlying verbs that energize you.\n\nYour profile highlights a natural appetite for pattern recognition and tactical modeling. You enjoy deconstructing *why* certain decisions tilt match momentum. You don't have to quit everything to test this: you can analyze 5 overs of a weekend game, chart dot-ball frequency in a free spreadsheet, or write a short tactical breakdown for your peers in the Sports Analytics Guild.\n\nWhich facet feels most interesting right now: the quantitative tactical charts, coaching communication, or hands-on match observation?`,
        actions: [
          { label: 'Try 45-Min Match Challenge', actionType: 'navigate', payload: 'challenges' },
          { label: 'View Dr. Thorne’s Profile', actionType: 'navigate', payload: 'mentors' }
        ]
      };
    }

    if (q.includes('reject') || q.includes('not for me') || q.includes('recommendation')) {
      const rejections = memories.filter((m) => m.category === 'rejection');
      const rejectionCount = rejections.length;

      return {
        text: `Rejection is one of the most useful signals in discovery. Finding out what drains you or what feels misaligned narrows down the space faster than vague enthusiasm.\n\n${
          rejectionCount > 0
            ? `Your recorded notes show that you disliked recommendations with excessive bureaucratic overhead or high difficulty hurdles.`
            : `When you dismiss a suggestion, we calibrate your profile immediately so you aren't served recycled variations of the same idea.`
        }\n\nWould you like to try a lower-friction creative experiment this week, or explore an entirely different category like creative coding or non-fiction storytelling?`,
        actions: [
          { label: 'Explore Exploration Library', actionType: 'navigate', payload: 'explore' },
          { label: 'Inspect AI Stored Memories', actionType: 'open_memory_modal' }
        ]
      };
    }

    if (q.includes('roadmap') || q.includes('next step') || q.includes('plan')) {
      if (activeRoadmaps.length > 0) {
        const road = activeRoadmaps[0];
        const nextMilestone = road.milestones.find((m: any) => !m.completed) || road.milestones[0];
        return {
          text: `You have an active roadmap: **${road.title}**.\n\nYour current focus is **Week ${nextMilestone.weekNumber}: ${nextMilestone.title}**. The goal here is simple: "${nextMilestone.description}".\n\nRemember, milestones are not rigid deadlines—they are checkpoints to ask yourself: "Am I still having fun with this process?" How did the last mini-task feel?`,
          actions: [
            { label: 'Open My Roadmap', actionType: 'navigate', payload: 'roadmaps' },
            { label: 'Log a Milestone Reflection', actionType: 'navigate', payload: 'roadmaps' }
          ]
        };
      } else {
        return {
          text: `You haven't activated a roadmap yet. Roadmaps in Skill Path are flexible 4-week learning sprints designed around testing whether an interest holds up in reality.\n\nWould you like to build a roadmap from your discovery report, or pick an interest from the library?`,
          actions: [
            { label: 'Create First Roadmap', actionType: 'navigate', payload: 'roadmaps' },
            { label: 'View Discovery Report', actionType: 'navigate', payload: 'discovery' }
          ]
        };
      }
    }

    if (q.includes('unsure') || q.includes('don\'t know') || q.includes('lost')) {
      return {
        text: `It is completely normal to feel unsure. The traditional model forces people into choosing a rigid identity before they've even had a chance to experiment.\n\nLet’s start with a low-pressure rule: you don't need a 5-year plan right now. You only need a 30-minute experiment this weekend to discover what *doesn't* feel like a chore.\n\nWould you prefer a hands-on tactile exercise (like building an interactive rule), an analytical exercise (tracking a game's momentum), or a creative observation exercise?`,
        actions: [
          { label: 'Browse Beginner Challenges', actionType: 'navigate', payload: 'challenges' },
          { label: 'Restart Guided Discovery', actionType: 'navigate', payload: 'discovery' }
        ]
      };
    }

    // Default thoughtful overview
    return {
      text: `Hello ${store.currentUser.name}. I'm here to help you reflect on your interests, explore alternatives, or break down a new project into manageable experiments.\n\nBased on your profile, your primary interests revolve around **${
        store.currentUser.interestsPrimary.join(' and ') || 'curious exploration'
      }**.\n\nWhat would feel most helpful to talk through today? We can brainstorm ideas for a weekend project, discuss why a previous experiment didn't click, or prepare questions for a mentor.`,
      actions: [
        { label: 'Suggest a Weekend Experiment', actionType: 'guide_prompt', payload: 'Suggest a 1-hour experiment for me' },
        { label: 'Review My Saved Interests', actionType: 'navigate', payload: 'explore' }
      ]
    };
  }

  private extractSuggestedActions(
    query: string,
    response: string
  ): { label: string; actionType: string; payload?: string }[] {
    const actions: { label: string; actionType: string; payload?: string }[] = [];
    if (response.toLowerCase().includes('challenge') || query.toLowerCase().includes('challenge')) {
      actions.push({ label: 'Browse Challenges', actionType: 'navigate', payload: 'challenges' });
    }
    if (response.toLowerCase().includes('roadmap') || query.toLowerCase().includes('roadmap')) {
      actions.push({ label: 'Open Roadmaps', actionType: 'navigate', payload: 'roadmaps' });
    }
    if (response.toLowerCase().includes('mentor') || query.toLowerCase().includes('mentor')) {
      actions.push({ label: 'Find a Mentor', actionType: 'navigate', payload: 'mentors' });
    }
    if (actions.length === 0) {
      actions.push({ label: 'Explore Interests', actionType: 'navigate', payload: 'explore' });
      actions.push({ label: 'View Discovery Report', actionType: 'navigate', payload: 'discovery' });
    }
    return actions.slice(0, 2);
  }
}

export const aiGuide = AIGuideService.getInstance();
