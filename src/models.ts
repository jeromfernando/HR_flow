export type CandidateStage = 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Note {
  id: number;
  author: string;
  date: string;
  text: string;
}

export interface Interview {
  id: number;
  type: 'Technical' | 'Screening' | 'HR' | 'Final';
  date: string;
  time: string;
  duration: string;
  interviewer: string;
  status: 'Completed' | 'Scheduled';
  rating?: number;
}

export interface Communication {
  id: number;
  type: 'Email' | 'Call';
  date: string;
  subject: string;
  body: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  jobId: number;
  stage: CandidateStage;
  appliedDate?: string;
  avatar: string;
  experience: number;
  skills: string[];
  rating: number;
  resumeUrl?: string;
  notes?: Note[];
  interviews?: Interview[];
  communications?: Communication[];
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  status: 'Published' | 'Draft';
  postType: 'Internal' | 'External' | 'Both';
  skills: string[];
  applicants: number;
  description?: string;
  currency?: string;
}

export type OnboardingTaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type OnboardingTaskCategory = 'IT' | 'Admin' | 'Compliance' | 'HR' | 'Manager';

export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

export interface OnboardingTask {
  id: number;
  name: string;
  description: string;
  category: OnboardingTaskCategory;
  status: OnboardingTaskStatus;
  completionDate?: string;
  assignee?: TeamMember;
}

export interface OnboardingProcess {
  id: number;
  employeeName: string;
  department: string;
  startDate: string;
  tasks: OnboardingTask[];
}

export type OffboardingTaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type OffboardingTaskCategory = 'IT' | 'Admin' | 'HR' | 'Manager';

export interface OffboardingTask {
  id: number;
  name: string;
  description: string;
  category: OffboardingTaskCategory;
  status: OffboardingTaskStatus;
  completionDate?: string;
  assignee?: TeamMember;
}

export interface OffboardingProcess {
  id: number;
  employeeName: string;
  department: string;
  lastDay: string;
  assetReturnStatus: string;
  exitInterviewScheduled: boolean;
  email: string;
  avatar: string;
  status: 'In Progress' | 'Completed';
  exitInterviewDate?: string;
  progress: number;
  tasks: OffboardingTask[];
}

export interface GigApplicant {
  id: number;
  name: string;
  initials: string;
  rating: number;
  previousGigs: number;
  appliedDate: string;
  skillMatch: number;
}

export interface SuggestedEmployee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  gigsCompleted: string;
  skillMatch: number;
  isAssigned?: boolean;
}

export interface Gig {
  id: number;
  title: string;
  department: string;
  duration: string;
  skills: string[];
  status: 'Open' | 'In Progress' | 'Closed';
  applicants: number;
  description?: string;
  startDate?: string;
  createdBy?: string;
  assignedTo?: string;
  applicantsList?: GigApplicant[];
  suggestedEmployees?: SuggestedEmployee[];
}
