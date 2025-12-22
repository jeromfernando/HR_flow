import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobsDashboardComponent } from './components/ats/jobs-dashboard/jobs-dashboard.component';
import { CandidatePipelineComponent } from './components/ats/candidate-pipeline/candidate-pipeline.component';
import { EmployeeLifecycleComponent } from './components/employee-lifecycle/employee-lifecycle.component';
import { TalentMarketplaceComponent } from './components/talent-marketplace/talent-marketplace.component';
import { CreateJobComponent } from './components/ats/create-job/create-job.component';

// Layouts
import { AdminLayoutComponent } from './components/layout/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './components/layout/user-layout/user-layout.component';
import { LoginComponent } from './components/login/login.component';

// User Components
import { UserJobsComponent } from './components/user/user-jobs/user-jobs.component';
import { UserApplicationsComponent } from './components/user/user-applications/user-applications.component';
import { UserGigsComponent } from './components/user/user-gigs/user-gigs.component';
import { UserTasksComponent } from './components/user/user-tasks/user-tasks.component';
import { UserInboxComponent } from './components/user/user-inbox/user-inbox.component';
import { AdminCandidateDetailComponent } from './components/ats/admin-candidate-detail/admin-candidate-detail.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'jobs', component: JobsDashboardComponent, title: 'Jobs Dashboard' },
      { path: 'jobs/new', component: CreateJobComponent, title: 'Create New Job' },
      { path: 'candidate/:id', component: AdminCandidateDetailComponent, title: 'Candidate Detail' },
      { path: 'pipeline', component: CandidatePipelineComponent, title: 'Candidate Pipeline' },
      { path: 'lifecycle', component: EmployeeLifecycleComponent, title: 'Employee Lifecycle' },
      { path: 'talent', component: TalentMarketplaceComponent, title: 'Talent Marketplace' },
      { path: 'talent/new', component: TalentMarketplaceComponent, title: 'Create New Gig' }, // Note: reusing component as per original
      { path: 'talent/:id', component: TalentMarketplaceComponent, title: 'Gig Details' }, // Note: reusing component
    ]
  },

  // User/Candidate Portal Routes
  {
    path: 'portal',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      { path: 'jobs', component: UserJobsComponent, title: 'Search Jobs' },
      { path: 'gigs', component: UserGigsComponent, title: 'Internal Gigs' },
      { path: 'applications', component: UserApplicationsComponent, title: 'My Applications' },
      { path: 'tasks', component: UserTasksComponent, title: 'My Tasks' },
      { path: 'inbox', component: UserInboxComponent, title: 'Inbox' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
