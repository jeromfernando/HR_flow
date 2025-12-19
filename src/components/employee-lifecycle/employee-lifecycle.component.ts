import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { OnboardingProcess, OnboardingTask, OnboardingTaskCategory, TeamMember, Candidate, OffboardingProcess, OffboardingTask, OffboardingTaskCategory } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

type OnboardingProcessWithDetails = OnboardingProcess & { avatar: string; email: string };

@Component({
  selector: 'app-employee-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-lifecycle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeLifecycleComponent implements OnInit {
  dataService = inject(DataService);
  route = inject(ActivatedRoute);
  
  activeTab = signal<'onboarding' | 'offboarding'>('onboarding');
  viewMode = signal<'list' | 'tasks'>('list');
  
  showOnboardingModal = signal(false);
  showOffboardingModal = signal(false);
  
  onboardingSearchTerm = signal('');
  offboardingSearchTerm = signal('');
  selectedOnboardingProcess = signal<OnboardingProcessWithDetails | null>(null);
  selectedOffboardingProcess = signal<OffboardingProcess | null>(null);
  toast = signal<{ message: string; details: string } | null>(null);

  // For "Assign to" feature
  teamMembers = this.dataService.teamMembers;
  activeAssigneeMenu = signal<number | null>(null);

  // For "Start Onboarding" modal
  newOnboardingForm = signal({
    selectedCandidateId: '' as string | number,
    employeeName: '',
    email: '',
    department: '',
    startDate: ''
  });

  // For "Start Offboarding" modal
  newOffboardingForm = signal({
    employeeName: '',
    email: '',
    department: '',
    lastDay: ''
  });

  hiredCandidates = computed(() => 
    this.dataService.candidates().filter(c => c.stage === 'Hired')
  );

  departments = computed(() => {
    const allJobs = this.dataService.jobs();
    return [...new Set(allJobs.map(job => job.department))];
  });


  onboardingProcessesWithDetails = computed(() => {
    const processes = this.dataService.onboardingProcesses();
    const candidates = this.dataService.candidates();
    return processes.map(process => {
        const candidate = candidates.find(c => c.name === process.employeeName);
        return {
            ...process,
            avatar: candidate?.avatar || `https://i.pravatar.cc/150?u=${process.employeeName.replace(' ', '')}`,
            email: candidate?.email || `${process.employeeName.toLowerCase().replace(' ', '.')}@company.com`
        };
    });
  });

  filteredOnboardingProcesses = computed(() => {
    const processes = this.onboardingProcessesWithDetails();
    const term = this.onboardingSearchTerm().toLowerCase();
    if (!term) {
        return processes;
    }
    return processes.filter(p => p.employeeName.toLowerCase().includes(term));
  });

  filteredOffboardingProcesses = computed(() => {
    const processes = this.dataService.offboardingProcesses();
    const term = this.offboardingSearchTerm().toLowerCase();
    if (!term) return processes;
    return processes.filter(p => p.employeeName.toLowerCase().includes(term));
  });

  // Onboarding stats
  inProgressCount = computed(() => this.dataService.onboardingProcesses().filter(p => this.getOnboardingStatus(p) === 'In Progress').length);
  completedCount = computed(() => this.dataService.onboardingProcesses().filter(p => this.getOnboardingStatus(p) === 'Completed').length);
  pendingTasksCount = computed(() => this.dataService.onboardingProcesses().reduce((acc, curr) => acc + curr.tasks.filter(t => t.status === 'Pending').length, 0));

  // Offboarding stats
  offboardingInProgressCount = computed(() => this.dataService.offboardingProcesses().filter(p => p.status === 'In Progress').length);
  offboardingCompletedCount = computed(() => this.dataService.offboardingProcesses().filter(p => p.status === 'Completed').length);
  pendingExitInterviewsCount = computed(() => this.dataService.offboardingProcesses().filter(p => !p.exitInterviewScheduled && p.status === 'In Progress').length);


  groupedTasks = computed(() => {
    const process = this.selectedOnboardingProcess();
    if (!process) return {};
    return process.tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
    }, {} as Record<OnboardingTaskCategory, OnboardingTask[]>);
  });

  taskCategories = computed(() => {
    return Object.keys(this.groupedTasks()) as OnboardingTaskCategory[];
  });

  groupedOffboardingTasks = computed(() => {
    const process = this.selectedOffboardingProcess();
    if (!process || !process.tasks) return {};
    return process.tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<OffboardingTaskCategory, OffboardingTask[]>);
  });

  offboardingTaskCategories = computed(() => {
    return Object.keys(this.groupedOffboardingTasks()) as OffboardingTaskCategory[];
  });

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'offboarding') {
        this.activeTab.set('offboarding');
      } else {
        this.activeTab.set('onboarding');
      }
    });
  }

  viewTasks(process: OnboardingProcessWithDetails): void {
    this.selectedOnboardingProcess.set(process);
    this.viewMode.set('tasks');
  }

  viewOffboardingTasks(process: OffboardingProcess): void {
    this.selectedOffboardingProcess.set(process);
    this.viewMode.set('tasks');
  }

  goBackToList(): void {
    this.viewMode.set('list');
    this.selectedOnboardingProcess.set(null);
    this.selectedOffboardingProcess.set(null);
  }
  
  sendWelcomeEmail(process: OnboardingProcessWithDetails): void {
    this.toast.set({
      message: 'Welcome email sent',
      details: `Welcome email has been sent to ${process.employeeName}.`
    });
    setTimeout(() => this.toast.set(null), 4000);
  }

  scheduleExitInterview(process: OffboardingProcess) {
    const updatedProcess = { 
      ...process, 
      exitInterviewScheduled: true, 
      exitInterviewDate: new Date().toLocaleDateString('en-US')
    };
    this.dataService.updateOffboardingProcess(updatedProcess);
    this.toast.set({
      message: 'Exit interview scheduled',
      details: `Exit interview has been scheduled for ${process.employeeName}.`
    });
    setTimeout(() => this.toast.set(null), 4000);
  }

  sendExitEmail(process: OffboardingProcess) {
    this.toast.set({
      message: 'Exit email sent',
      details: `Exit information email has been sent to ${process.employeeName}.`
    });
    setTimeout(() => this.toast.set(null), 4000);
  }
  
  toggleTaskStatus(task: OnboardingTask) {
    const process = this.selectedOnboardingProcess();
    if (!process) return;

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    const newCompletionDate = newStatus === 'Completed' ? new Date().toLocaleDateString('en-US') : undefined;

    const updatedTask: OnboardingTask = { 
      ...task, 
      status: newStatus,
      completionDate: newCompletionDate
    };

    this.dataService.updateOnboardingTask(process.id, updatedTask);
    
    const updatedProcess = this.onboardingProcessesWithDetails().find(p => p.id === process.id);
    if (updatedProcess) {
      this.selectedOnboardingProcess.set(updatedProcess);
    }
  }

  toggleOffboardingTaskStatus(task: OffboardingTask) {
    const process = this.selectedOffboardingProcess();
    if (!process) return;

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    const newCompletionDate = newStatus === 'Completed' ? new Date().toLocaleDateString('en-US') : undefined;

    const updatedTask: OffboardingTask = { 
      ...task, 
      status: newStatus,
      completionDate: newCompletionDate
    };

    this.dataService.updateOffboardingTask(process.id, updatedTask);
    
    const updatedProcess = this.dataService.offboardingProcesses().find(p => p.id === process.id);
    if (updatedProcess) {
      this.selectedOffboardingProcess.set(updatedProcess);
    }
  }

  toggleAssigneeMenu(taskId: number, event: Event) {
    event.stopPropagation();
    this.activeAssigneeMenu.update(currentId => currentId === taskId ? null : taskId);
  }

  assignTask(task: OnboardingTask, assignee: TeamMember) {
    const process = this.selectedOnboardingProcess();
    if (!process) return;

    const updatedTask: OnboardingTask = { ...task, assignee };
    this.dataService.updateOnboardingTask(process.id, updatedTask);

    const updatedProcess = this.onboardingProcessesWithDetails().find(p => p.id === process.id);
    if (updatedProcess) {
      this.selectedOnboardingProcess.set(updatedProcess);
    }
    
    this.activeAssigneeMenu.set(null);
  }

  onCandidateSelect(candidateId: string) {
    const id = parseInt(candidateId, 10);
    const candidate = this.hiredCandidates().find(c => c.id === id);
    if (candidate) {
      const job = this.dataService.jobs().find(j => j.id === candidate.jobId);
      this.newOnboardingForm.update(form => ({
        ...form,
        selectedCandidateId: candidate.id,
        employeeName: candidate.name,
        email: candidate.email,
        department: job?.department || ''
      }));
    }
  }

  initiateOnboarding() {
    const form = this.newOnboardingForm();
    if (form.employeeName && form.department && form.startDate) {
      this.dataService.addOnboardingProcess({
        employeeName: form.employeeName,
        email: form.email,
        department: form.department,
        startDate: new Date(form.startDate).toLocaleDateString('en-US')
      });
      this.closeOnboardingModal();
    }
  }

  initiateOffboarding() {
    const form = this.newOffboardingForm();
    if (form.employeeName && form.department && form.lastDay) {
      this.dataService.addOffboardingProcess({
        employeeName: form.employeeName,
        email: form.email,
        department: form.department,
        lastDay: new Date(form.lastDay).toLocaleDateString('en-US')
      });
      this.closeOffboardingModal();
    }
  }

  openOnboardingModal() {
    this.newOnboardingForm.set({
      selectedCandidateId: '',
      employeeName: '',
      email: '',
      department: '',
      startDate: ''
    });
    this.showOnboardingModal.set(true);
  }

  closeOnboardingModal() {
    this.showOnboardingModal.set(false);
  }

  openOffboardingModal() {
    this.newOffboardingForm.set({ employeeName: '', email: '', department: '', lastDay: '' });
    this.showOffboardingModal.set(true);
  }

  closeOffboardingModal() {
    this.showOffboardingModal.set(false);
  }


  getTaskProgress(process: OnboardingProcess): number {
    if (!process.tasks || process.tasks.length === 0) return 100;
    const completedTasks = process.tasks.filter(t => t.status === 'Completed').length;
    return (completedTasks / process.tasks.length) * 100;
  }
  
  getOffboardingTaskProgress(process: OffboardingProcess): number {
    if (!process.tasks || process.tasks.length === 0) return 100;
    const completedTasks = process.tasks.filter(t => t.status === 'Completed').length;
    return (completedTasks / process.tasks.length) * 100;
  }

  getCompletedTasksCount(process: OnboardingProcess): number {
    return process.tasks.filter(t => t.status === 'Completed').length;
  }
  
  getCompletedOffboardingTasksCount(process: OffboardingProcess): number {
    if (!process.tasks) return 0;
    return process.tasks.filter(t => t.status === 'Completed').length;
  }

  getCompletedTasksInCategory(tasks: OnboardingTask[]): number {
      if (!tasks) return 0;
      return tasks.filter(t => t.status === 'Completed').length;
  }

  getCompletedOffboardingTasksInCategory(tasks: OffboardingTask[]): number {
      if (!tasks) return 0;
      return tasks.filter(t => t.status === 'Completed').length;
  }

  getOnboardingStatus(process: OnboardingProcess): 'Not Started' | 'In Progress' | 'Completed' {
    const totalTasks = process.tasks.length;
    if (totalTasks === 0) return 'Completed';
    const completedTasks = this.getCompletedTasksCount(process);
    if (completedTasks === totalTasks) return 'Completed';
    const hasInProgress = process.tasks.some(t => t.status === 'In Progress');
    if (completedTasks > 0 || hasInProgress) return 'In Progress';
    return 'Not Started';
  }
}
