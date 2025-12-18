import { GoogleGenAI } from "@google/genai";
import { Project, User, AiChatMessage } from '../types';
import { MOCK_USERS } from '../constants';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

// Helper to format project data for the LLM based on user permissions
const formatProjectContext = (project: Project, user: User) => {
  const users = project.assignedUsers.map(id => MOCK_USERS[id]?.name || id).join(', ');
  
  // PERMISSION CHECK
  const isAssigned = project.assignedUsers.includes(user.id);
  const isAdmin = user.role === 'Admin';
  const hasFullAccess = isAdmin || isAssigned;

  const basicStr = `
    Project Name: ${project.name}
    Project Code: ${project.code}
    Status: ${project.status}
    Progress: ${project.progress}%
    Due Date: ${project.dueDate}
    Team Members: ${users}
    Description: ${project.description}
    
    === MILESTONES (High Level) ===
    ${project.phases.map(p => `Phase: ${p.name}`).join('\n')}
  `;

  if (!hasFullAccess) {
    return `
    ${basicStr}

    *** ACCESS RESTRICTED ***
    The user asking this question is NOT assigned to this project and is NOT an Admin.
    
    You CANNOT access:
    - Detailed Tasks
    - Project Brief / Requirements
    - Internal Notes & Decisions
    - Team Chat History
    
    You CAN ONLY answer questions about:
    - Overall Progress
    - Project Status
    - Who is working on it
    - High-level Milestone names
    
    If the user asks for details you don't have access to, politely explain that they do not have the required permissions to view sensitive project details.
    `;
  }

  // FULL ACCESS DATA
  const briefStr = `
    Client: ${project.clientName}
    Goal: ${project.brief.clientGoal}
    Problem: ${project.brief.problemStatement}
    Requirements: ${project.brief.requestedFeatures}
    Constraints: ${project.brief.constraints}
    Open Questions: ${project.brief.openQuestions}
  `;

  const notesStr = project.notes.map(n => 
    `[${n.type}] ${n.title}: ${n.content}`
  ).join('\n');

  // Take last 20 messages to stay concise
  const chatStr = project.messages.slice(-20).map(m => {
    const user = MOCK_USERS[m.userId]?.name || 'Unknown';
    return `${user}: ${m.text}`;
  }).join('\n');

  const tasksStr = project.phases.map(p => 
    `Phase ${p.name}: ${p.tasks.map(t => `- ${t.title} (${t.isCompleted ? 'Done' : 'Pending'})`).join(', ')}`
  ).join('\n');

  return `
    ${basicStr}
    
    === BRIEF & REQUIREMENTS ===
    ${briefStr}
    
    === DETAILED TASKS ===
    ${tasksStr}

    === NOTES & DECISIONS ===
    ${notesStr}
    
    === RECENT TEAM CHAT ===
    ${chatStr}
  `;
};

export interface RiskItem {
  requirement: string;
  issue: string;
  suggestion: string;
}

export interface ActionItem {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  source: string;
}

// Changed to generator for streaming
export const streamProjectChat = async function* (project: Project, history: AiChatMessage[], userMessage: string, user: User) {
  const context = formatProjectContext(project, user);
  
  // Format history for the model
  const historyContext = history.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');

  const prompt = `
    You are an expert Technical Project Manager assistant for the project "${project.name}".
    
    CONTEXT DATA:
    ${context}

    CONVERSATION HISTORY:
    ${historyContext}

    USER REQUEST:
    ${userMessage}

    INSTRUCTIONS:
    - Answer specifically based on the project data provided.
    - **EXTREME CONCISENESS**: Do not write long paragraphs. 
    - **FORMAT**: Use strict Markdown.
    - **LIMITS**: Maximum 3 bullet points per section. Maximum 1 sentence per bullet point.
    
    STRUCTURE FOR STATUS UPDATES (If applicable):
    ### Phase Breakdown
    * **[Phase Name]**: [Status]
    
    ### Status & Activity
    * [Key Update 1]
    * [Key Update 2]
    
    ### Next Steps
    1. [Step 1]
    2. [Step 2]

    If the user asks a simple question (e.g. "Who is the client?"), ignore the structure above and answer in one sentence.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("AI Error:", error);
    yield "I encountered an error while processing your request.";
  }
};

// Keep the non-streaming version for other potential uses
export const chatWithProjectAI = async (project: Project, history: AiChatMessage[], userMessage: string): Promise<string> => {
    return ""; 
};