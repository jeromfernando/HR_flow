import { Injectable, signal } from '@angular/core';
import { Job, Candidate, OnboardingProcess, OffboardingProcess, Gig, CandidateStage, OnboardingTask, OffboardingTask, TeamMember, Note, GigApplicant, SuggestedEmployee } from '../models';


export interface Message {
  id: number;
  recipientEmail: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class DataService {

  messages = signal<Message[]>([
    { id: 1, recipientEmail: 'time.traveler@example.com', subject: 'Welcome!', body: 'Welcome to the HR Flow portal.', date: '12/20/2025', read: false }
  ]);

  jobs = signal<Job[]>([
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', salaryMin: 120000, salaryMax: 180000, experience: '5+ years', status: 'Published', postType: 'External', skills: ['React', 'TypeScript', 'Node.js'], applicants: 45 },
    { id: 2, title: 'Product Manager', department: 'Product', location: 'New York', salaryMin: 130000, salaryMax: 170000, experience: '4+ years', status: 'Published', postType: 'Both', skills: ['Product Strategy', 'Agile', 'Data Analysis'], applicants: 32 },
    { id: 3, title: 'UX Designer', department: 'Design', location: 'San Francisco', salaryMin: 100000, salaryMax: 140000, experience: '3+ years', status: 'Published', postType: 'External', skills: ['Figma', 'User Research', 'Prototyping'], applicants: 28 },
    { id: 4, title: 'HR Business Partner', department: 'Human Resources', location: 'Chicago', salaryMin: 90000, salaryMax: 120000, experience: '5+ years', status: 'Published', postType: 'Internal', skills: ['Employee Relations', 'HR Strategy'], applicants: 12 },
  ]);

  candidates = signal<Candidate[]>([
    { id: 1, name: 'James Wilson', email: 'james.wilson@email.com', jobId: 1, stage: 'Applied', avatar: 'https://i.pravatar.cc/150?u=james', experience: 5, skills: ['React', 'Vue.js', 'CSS'], rating: 4.1, appliedDate: '01/15/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 9, name: 'Maria Garcia', email: 'maria.garcia@email.com', jobId: 3, stage: 'Applied', avatar: 'https://i.pravatar.cc/150?u=maria', experience: 3, skills: ['User Research', 'Figma'], rating: 4.0, appliedDate: '01/16/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 2, name: 'Michael Chen', email: 'michael.chen@email.com', jobId: 1, stage: 'Screening', avatar: 'https://i.pravatar.cc/150?u=michael', experience: 4, skills: ['React', 'JavaScript'], rating: 3.8, appliedDate: '01/17/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 3, name: 'Lisa Anderson', email: 'lisa.anderson@email.com', jobId: 2, stage: 'Shortlisted', avatar: 'https://i.pravatar.cc/150?u=lisa', experience: 5, skills: ['Product Strategy', 'TypeScript'], rating: 4.2, appliedDate: '01/18/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 4, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', jobId: 1, stage: 'Interview', avatar: 'https://i.pravatar.cc/150?u=sarah', experience: 6, skills: ['React', 'TypeScript', 'Node.js', 'AWS'], rating: 4.5, appliedDate: '01/18/2024', phone: '+1(555) 123-4567', resumeUrl: 'resume.pdf', notes: [{ id: 1, author: 'John HR', date: '12/17/2025', text: 'Strong technical background.' }], interviews: [{ id: 1, type: 'Technical', date: '2/10/2024', time: 'at 05:30 AM', duration: '40 minutes', interviewer: 'Tech Lead', status: 'Completed', rating: 4.5 }], communications: [] },
    { id: 5, name: 'Anna Martinez', email: 'anna.martinez@email.com', jobId: 3, stage: 'Interview', avatar: 'https://i.pravatar.cc/150?u=anna', experience: 5, skills: ['Product Strategy', 'Agile', 'Jira'], rating: 4.3, appliedDate: '01/19/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 7, name: 'Emily Davis', email: 'emily.davis@email.com', jobId: 1, stage: 'Offer', avatar: 'https://i.pravatar.cc/150?u=emily', experience: 7, skills: ['React', 'TypeScript', 'Node.js'], rating: 4.8, appliedDate: '01/20/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 8, name: 'David Brown', email: 'david.brown@company.com', jobId: 1, stage: 'Hired', avatar: 'https://i.pravatar.cc/150?u=david', experience: 8, skills: ['React', 'Node.js', 'AWS'], rating: 4.9, appliedDate: '01/21/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 6, name: 'John Smith', email: 'john.smith@email.com', jobId: 3, stage: 'Screening', avatar: 'https://i.pravatar.cc/150?u=john', experience: 6, skills: ['Figma', 'Prototyping'], rating: 4.4, appliedDate: '01/22/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
    { id: 10, name: 'Rachel Green', email: 'rachel.green@company.com', jobId: 2, stage: 'Hired', avatar: 'https://i.pravatar.cc/150?u=rachel', experience: 4, skills: ['Marketing Strategy', 'SEO'], rating: 4.6, appliedDate: '01/23/2024', phone: '+1(555) 123-4567', resumeUrl: '#', notes: [], interviews: [], communications: [] },
  ]);

  teamMembers = signal<TeamMember[]>([
    { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice' },
    { id: 2, name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=bob' },
    { id: 3, name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?u=charlie' },
    { id: 4, name: 'Diana Miller', avatar: 'https://i.pravatar.cc/150?u=diana' }
  ]);

  onboardingProcesses = signal<OnboardingProcess[]>([
    {
      id: 1, employeeName: 'David Brown', department: 'Engineering', startDate: '02/15/2024', tasks: [
        { id: 1, name: 'Create Email Account', description: 'Set up company email', category: 'IT', status: 'Completed', completionDate: '12/6/2025' },
        { id: 2, name: 'Laptop Assignment', description: 'Assign and configure laptop', category: 'IT', status: 'Completed', completionDate: '12/6/2025' },
        { id: 3, name: 'Access Setup', description: 'Configure system access', category: 'IT', status: 'Pending' },
        { id: 4, name: 'ID Card Creation', description: 'Create employee ID card', category: 'Admin', status: 'Pending' },
        { id: 5, name: 'Compliance Training', description: 'Complete compliance forms', category: 'Compliance', status: 'Pending' }
      ]
    },
    {
      id: 2, employeeName: 'Rachel Green', department: 'Marketing', startDate: '02/20/2024', tasks: [
        { id: 1, name: 'Create email account', description: 'Set up company email', category: 'IT', status: 'Pending' },
        { id: 2, name: 'Marketing tools access', description: 'Grant access to marketing software', category: 'Manager', status: 'Pending' },
        { id: 3, name: 'Send welcome kit', description: 'Ship company swag and materials', category: 'HR', status: 'Pending' },
        { id: 4, name: 'Compliance forms', description: 'Complete all required new hire paperwork', category: 'HR', status: 'Pending' },
      ]
    }
  ]);

  offboardingProcesses = signal<OffboardingProcess[]>([
    {
      id: 1,
      employeeName: 'Tom Harris',
      department: 'Sales',
      lastDay: '02/28/2024',
      assetReturnStatus: '1/3 IT assets',
      exitInterviewScheduled: false,
      email: 'tom.harris@company.com',
      avatar: 'https://i.pravatar.cc/150?u=tomharris',
      status: 'In Progress',
      progress: 40,
      tasks: [
        { id: 1, name: 'Return Company Laptop', description: 'Return laptop and accessories to IT department', category: 'IT', status: 'Pending' },
        { id: 2, name: 'Knowledge Transfer', description: 'Complete KT session with the team', category: 'Manager', status: 'Completed', completionDate: '02/20/2024' },
        { id: 3, name: 'Conduct Exit Interview', description: 'Schedule and conduct the exit interview with HR', category: 'HR', status: 'Pending' },
        { id: 4, name: 'Revoke System Access', description: 'Revoke access to all company systems', category: 'IT', status: 'Pending' },
      ]
    }
  ]);

  gigs = signal<Gig[]>([
    {
      id: 1,
      title: 'Mobile App Development Sprint',
      department: 'Engineering',
      duration: '4 weeks',
      skills: ['React Native', 'TypeScript', 'API Integration'],
      status: 'Open',
      applicants: 2,
      description: 'Help build a new mobile app feature for our flagship product.',
      startDate: '02/15/2024',
      createdBy: 'John Manager',
      applicantsList: [
        { id: 1, name: 'Alex Turner', initials: 'AT', rating: 4.8, previousGigs: 3, appliedDate: '12/17/2025', skillMatch: 95 },
        { id: 2, name: 'Sophie Lee', initials: 'SL', rating: 4.5, previousGigs: 2, appliedDate: '12/17/2025', skillMatch: 88 },
      ],
      suggestedEmployees: [
        { id: 1, name: 'Alex Turner', avatar: 'https://i.pravatar.cc/150?u=alex', role: 'Software Engineer', skills: ['React Native', 'TypeScript', 'API Integration'], gigsCompleted: '4.8 • 3 gigs completed', skillMatch: 100, isAssigned: false },
        { id: 2, name: 'Sophie Lee', avatar: 'https://i.pravatar.cc/150?u=sophie', role: 'Frontend Developer', skills: ['React Native', 'TypeScript'], gigsCompleted: '4.5 • 2 gigs completed', skillMatch: 67, isAssigned: false },
      ]
    },
    {
      id: 2,
      title: 'Marketing Campaign Analysis',
      department: 'Marketing',
      duration: '2 weeks',
      skills: ['Data Analysis', 'Excel', 'Presentation'],
      status: 'Open',
      applicants: 1,
      description: 'Analyze Q1 marketing campaign performance and provide insights.',
      startDate: '02/20/2024',
      createdBy: 'Marketing Director',
      applicantsList: [
        { id: 3, name: 'Chris Park', initials: 'CP', rating: 4.9, previousGigs: 5, appliedDate: '12/17/2025', skillMatch: 92 },
      ],
      suggestedEmployees: [
        { id: 3, name: 'Chris Park', avatar: 'https://i.pravatar.cc/150?u=chris', role: 'Data Analyst', skills: ['Data Analysis', 'Excel', 'Presentation'], gigsCompleted: '4.9 • 5 gigs completed', skillMatch: 100, isAssigned: false },
      ]
    },
    { id: 3, title: 'Internal Training Program', department: 'Human Resources', duration: '6 weeks', skills: ['Training', 'Communication', 'Content Creation'], status: 'In Progress', applicants: 0, assignedTo: 'Maria Garcia', description: 'Develop and deliver training sessions for new hires.' },
  ]);

  sendMessage(recipientEmail: string, subject: string, body: string) {
    this.messages.update(msgs => [
      { id: Date.now(), recipientEmail, subject, body, date: new Date().toLocaleDateString(), read: false },
      ...msgs
    ]);
  }

  addCandidateNote(candidateId: number, noteText: string) {
    this.candidates.update(candidates =>
      candidates.map(c => {
        if (c.id === candidateId) {
          const newNote: Note = {
            id: Date.now(),
            author: 'HR Admin',
            date: new Date().toLocaleDateString('en-US'),
            text: noteText
          };
          const notes = c.notes ? [...c.notes, newNote] : [newNote];

          // Auto-notify candidate about new note/message
          this.sendMessage(c.email, 'New Message from HR', noteText);

          return { ...c, notes };
        }
        return c;
      })
    );
  }

  updateCandidateStage(candidateId: number, newStage: CandidateStage) {
    this.candidates.update(candidates => {
      const updated = candidates.map(c => {
        if (c.id === candidateId) {
          // Notify user of status change
          if (c.stage !== newStage) {
            this.sendMessage(
              c.email,
              `Application Update: ${newStage}`,
              `Your application for Job ID #${c.jobId} has moved to the ${newStage} stage.`
            );
          }
          return { ...c, stage: newStage };
        }
        return c;
      });
      return updated;
    });
  }

  addJob(job: Omit<Job, 'id'>) {
    this.jobs.update(jobs => [...jobs, { ...job, id: Date.now(), applicants: 0 }]);
  }

  addGig(gig: Omit<Gig, 'id' | 'applicants'>) {
    this.gigs.update(gigs => [...gigs, { ...gig, id: Date.now(), applicants: 0, status: 'Open' }]);
  }

  addGigApplicant(gigId: number, name: string) {
    this.gigs.update(gigs => gigs.map(g => {
      if (g.id === gigId) {
        const newApplicant: GigApplicant = {
          id: Date.now(),
          name,
          initials: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
          rating: 0,
          previousGigs: 0,
          appliedDate: new Date().toLocaleDateString(),
          skillMatch: 0
        };
        return {
          ...g,
          applicants: g.applicants + 1,
          applicantsList: [...(g.applicantsList || []), newApplicant]
        };
      }
      return g;
    }));
  }

  assignToGig(gigId: number, employeeId: number) {
    this.gigs.update(gigs => gigs.map(gig => {
      if (gig.id === gigId) {
        const updatedEmployees = gig.suggestedEmployees?.map(emp =>
          emp.id === employeeId ? { ...emp, isAssigned: true } : emp
        );
        return { ...gig, suggestedEmployees: updatedEmployees };
      }
      return gig;
    }));
  }

  closeGig(gigId: number) {
    this.gigs.update(gigs => gigs.map(gig =>
      gig.id === gigId ? { ...gig, status: 'Closed' } : gig
    ));
  }

  updateOnboardingTask(processId: number, updatedTask: OnboardingTask) {
    this.onboardingProcesses.update(processes =>
      processes.map(process => {
        if (process.id === processId) {
          return {
            ...process,
            tasks: process.tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            )
          };
        }
        return process;
      })
    );
  }

  addOnboardingProcess(processData: Omit<OnboardingProcess, 'id' | 'tasks' | 'email'> & { email: string }) {
    const newProcess: OnboardingProcess = {
      ...processData,
      id: Date.now(),
      tasks: [
        { id: 1, name: 'Create Email Account', description: 'Set up company email', category: 'IT', status: 'Pending' },
        { id: 2, name: 'Laptop Assignment', description: 'Assign and configure laptop', category: 'IT', status: 'Pending' },
        { id: 3, name: 'Access Setup', description: 'Configure system access', category: 'IT', status: 'Pending' },
        { id: 4, name: 'ID Card Creation', description: 'Create employee ID card', category: 'Admin', status: 'Pending' },
        { id: 5, name: 'Compliance Training', description: 'Complete compliance forms', category: 'Compliance', status: 'Pending' }
      ]
    };

    this.sendMessage(
      processData.email,
      'Onboarding Started',
      `Welcome to the team, ${processData.employeeName}! Your onboarding process has started. Please check your tasks.`
    );

    this.onboardingProcesses.update(processes => [...processes, newProcess]);
  }

  addOffboardingProcess(processData: Omit<OffboardingProcess, 'id' | 'assetReturnStatus' | 'exitInterviewScheduled' | 'avatar' | 'status' | 'progress' | 'tasks'>) {
    const newProcess: OffboardingProcess = {
      ...processData,
      id: Date.now(),
      assetReturnStatus: '0/3 IT assets',
      exitInterviewScheduled: false,
      avatar: `https://i.pravatar.cc/150?u=${processData.employeeName.replace(' ', '')}`,
      status: 'In Progress',
      progress: 10,
      tasks: [
        { id: 1, name: 'Return Company Assets', description: 'Return laptop, phone, and ID card to IT/Admin', category: 'IT', status: 'Pending' },
        { id: 2, name: 'Knowledge Transfer Session', description: 'Conduct KT with designated team member', category: 'Manager', status: 'Pending' },
        { id: 3, name: 'Exit Interview', description: 'Schedule and complete exit interview with HR', category: 'HR', status: 'Pending' },
        { id: 4, name: 'Final Payroll', description: 'Process final paycheck and benefits information', category: 'HR', status: 'Pending' },
        { id: 5, name: 'Revoke System Access', description: 'Disable all system and email access on the last day', category: 'IT', status: 'Pending' }
      ]
    };

    this.sendMessage(
      processData.email,
      'Offboarding Initiated',
      `Dear ${processData.employeeName}, your offboarding checklist is now available. Please complete required tasks before your last day.`
    );

    this.offboardingProcesses.update(processes => [...processes, newProcess]);
  }

  updateOffboardingProcess(updatedProcess: OffboardingProcess) {
    this.offboardingProcesses.update(processes =>
      processes.map(p => p.id === updatedProcess.id ? updatedProcess : p)
    );
  }

  updateOffboardingTask(processId: number, updatedTask: OffboardingTask) {
    this.offboardingProcesses.update(processes =>
      processes.map(process => {
        if (process.id === processId) {
          return {
            ...process,
            tasks: process.tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            )
          };
        }
        return process;
      })
    );
  }
  addCandidate(candidate: Omit<Candidate, 'id' | 'stage' | 'appliedDate' | 'avatar' | 'notes' | 'interviews' | 'communications'>) {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now(),
      stage: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-US'),
      avatar: `https://i.pravatar.cc/150?u=${candidate.name.replace(' ', '')}`,
      notes: [],
      interviews: [],
      communications: []
    };

    // Check if already applied? Optional check, skipping for now for simplicity

    this.candidates.update(candidates => [...candidates, newCandidate]);

    // Also update job applicant count
    this.jobs.update(jobs => jobs.map(j =>
      j.id === candidate.jobId ? { ...j, applicants: j.applicants + 1 } : j
    ));
  }
}
