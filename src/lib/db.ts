
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface Project {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  projectUrl?: string;
  tags: string[];
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactEntry {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'reviewed' | 'responded';
  createdAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Review {
  id?: string;
  _id?: string;
  clientName: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  service: string;
  createdAt?: string;
}

export interface TeamMember {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  createdAt?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  clientName: string;
  email: string;
  phone: string;
  projectName: string;
  value: number;
  paidAmount: number;
  status: 'pending' | 'active' | 'completed' | 'on-hold';
  stage: 'Initiated' | '30% Advance' | '40% Mid-Project' | '30% Final';
  progress: number;
  trackingKey?: string;
  startDate: string;
  deadline?: string;
}

export async function getProjectByTrackKey(key: string): Promise<any> {
  return fetchAPI(`/track/${key}`);
}

// Admin Email Templates
export async function sendAdminTemplate(data: {
  type: 'welcome' | 'contract' | 'payment';
  email: string;
  name: string;
  projectName?: string;
  amount?: number;
  stage?: string;
}) {
  return fetchAPI('/admin/send-template', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUsers(): Promise<User[]> {
  return fetchAPI('/admin/users');
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('nexus_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }
  return response.json();
}

// Auth
export async function register(data: any) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyOTP(data: any) {
  return fetchAPI('/auth/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: any) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<User | null> {
  const token = localStorage.getItem('nexus_token');
  if (!token) return null;
  try {
    return await fetchAPI('/auth/me');
  } catch {
    localStorage.removeItem('nexus_token');
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await fetchAPI('/projects');
    return projects.map((p: any) => ({ ...p, id: p._id }));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(project: Omit<Project, 'id' | '_id' | 'createdAt' | 'updatedAt'>) {
  return fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export async function editProject(id: string, project: Partial<Project>) {
  return fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
}

export async function removeProject(id: string) {
  return fetchAPI(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export async function getContactInquiries(): Promise<ContactEntry[]> {
  try {
    const entries = await fetchAPI('/contact');
    return entries.map((e: any) => ({ ...e, id: e._id }));
  } catch (error) {
    console.error('Failed to fetch contact inquiries:', error);
    return [];
  }
}

export async function createContactInquiry(entry: Omit<ContactEntry, 'id' | '_id' | 'createdAt' | 'status'>) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

// New features: Reviews
export async function getReviews(): Promise<Review[]> {
  try {
    const reviews = await fetchAPI('/reviews');
    return reviews.map((r: any) => ({ ...r, id: r._id }));
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function createReview(review: Omit<Review, 'id' | '_id' | 'createdAt'>) {
  return fetchAPI('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
}

// New features: Team
export async function getTeam(): Promise<TeamMember[]> {
  try {
    const team = await fetchAPI('/team');
    return team.map((t: any) => ({ ...t, id: t._id }));
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return [];
  }
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | '_id' | 'createdAt'>) {
  return fetchAPI('/team', {
    method: 'POST',
    body: JSON.stringify(member),
  });
}

export async function removeTeamMember(id: string) {
  return fetchAPI(`/team/${id}`, {
    method: 'DELETE',
  });
}

// New features: Orders
export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await fetchAPI('/orders');
    return orders.map((o: any) => ({ ...o, id: o._id }));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function createOrder(order: Omit<Order, 'id' | '_id'>) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function updateOrder(id: string, order: Partial<Order>) {
  return fetchAPI(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  });
}

// Image Upload via Cloudinary
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Upload failed');
  const data = await response.json();
  return data.url;
}

// Placeholder for subscriptions (could be implemented with polling or WebSockets)
export function subscribeToProjects(callback: (projects: Project[]) => void) {
  getProjects().then(callback);
  const interval = setInterval(() => getProjects().then(callback), 10000);
  return () => clearInterval(interval);
}

export function subscribeToContact(callback: (entries: ContactEntry[]) => void) {
  getContactInquiries().then(callback);
  const interval = setInterval(() => getContactInquiries().then(callback), 10000);
  return () => clearInterval(interval);
}
