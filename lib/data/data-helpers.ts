import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Projects
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured: boolean;
  createdAt: string;
}

export function getProjects(): Project[] {
  const filePath = path.join(DATA_DIR, 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function saveProjects(projects: Project[]): void {
  const filePath = path.join(DATA_DIR, 'projects.json');
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

export function getProjectById(id: number): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getProjects();
  const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
  const newProject: Project = {
    ...project,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(id: number, updates: Partial<Project>): Project | null {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  projects[index] = { ...projects[index], ...updates, id }; // Keep original ID
  saveProjects(projects);
  return projects[index];
}

export function deleteProject(id: number): boolean {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  
  saveProjects(filtered);
  return true;
}

// Skills
export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  description?: string;
  order: number;
}

export function getSkills(): Skill[] {
  const filePath = path.join(DATA_DIR, 'skills.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function saveSkills(skills: Skill[]): void {
  const filePath = path.join(DATA_DIR, 'skills.json');
  fs.writeFileSync(filePath, JSON.stringify(skills, null, 2));
}

export function getSkillById(id: number): Skill | undefined {
  const skills = getSkills();
  return skills.find((s) => s.id === id);
}

export function createSkill(skill: Omit<Skill, 'id'>): Skill {
  const skills = getSkills();
  const newId = skills.length > 0 ? Math.max(...skills.map((s) => s.id)) + 1 : 1;
  const newSkill: Skill = {
    ...skill,
    id: newId,
  };
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
}

export function updateSkill(id: number, updates: Partial<Skill>): Skill | null {
  const skills = getSkills();
  const index = skills.findIndex((s) => s.id === id);
  if (index === -1) return null;
  
  skills[index] = { ...skills[index], ...updates, id }; // Keep original ID
  saveSkills(skills);
  return skills[index];
}

export function deleteSkill(id: number): boolean {
  const skills = getSkills();
  const filtered = skills.filter((s) => s.id !== id);
  if (filtered.length === skills.length) return false;
  
  saveSkills(filtered);
  return true;
}

// Profile
export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  updatedAt: string;
}

export function getProfile(): Profile {
  const filePath = path.join(DATA_DIR, 'profile.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function updateProfile(updates: Partial<Profile>): Profile {
  const profile = getProfile();
  const updatedProfile = {
    ...profile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  const filePath = path.join(DATA_DIR, 'profile.json');
  fs.writeFileSync(filePath, JSON.stringify(updatedProfile, null, 2));
  return updatedProfile;
}

// Contact messages
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

function ensureContactMessagesFile(): string {
  const filePath = path.join(DATA_DIR, 'contact-messages.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  return filePath;
}

export function getContactMessages(): ContactMessage[] {
  const filePath = ensureContactMessagesFile();
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function saveContactMessages(messages: ContactMessage[]): void {
  const filePath = ensureContactMessagesFile();
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

export function createContactMessage(
  input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): ContactMessage {
  const messages = getContactMessages();
  const newId = messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 1;

  const newMessage: ContactMessage = {
    ...input,
    id: newId,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  saveContactMessages(messages);
  return newMessage;
}

export function getContactMessageById(id: number): ContactMessage | undefined {
  const messages = getContactMessages();
  return messages.find((m) => m.id === id);
}

export function updateContactMessage(id: number, updates: Partial<ContactMessage>): ContactMessage | null {
  const messages = getContactMessages();
  const index = messages.findIndex((m) => m.id === id);

  if (index === -1) {
    return null;
  }

  messages[index] = {
    ...messages[index],
    ...updates,
    id,
  };

  saveContactMessages(messages);
  return messages[index];
}
