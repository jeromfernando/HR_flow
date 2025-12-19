import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobsDashboardComponent } from './components/ats/jobs-dashboard/jobs-dashboard.component';
import { CandidatePipelineComponent } from './components/ats/candidate-pipeline/candidate-pipeline.component';
import { EmployeeLifecycleComponent } from './components/employee-lifecycle/employee-lifecycle.component';
import { TalentMarketplaceComponent } from './components/talent-marketplace/talent-marketplace.component';
import { CreateJobComponent } from './components/ats/create-job/create-job.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'jobs', component: JobsDashboardComponent, title: 'Jobs Dashboard' },
  { path: 'jobs/new', component: CreateJobComponent, title: 'Create New Job' },
  { path: 'pipeline', component: CandidatePipelineComponent, title: 'Candidate Pipeline' },
  { path: 'lifecycle', component: EmployeeLifecycleComponent, title: 'Employee Lifecycle' },
  { path: 'talent', component: TalentMarketplaceComponent, title: 'Talent Marketplace', pathMatch: 'full' },
  { path: 'talent/new', component: TalentMarketplaceComponent, title: 'Create New Gig' },
  { path: 'talent/:id', component: TalentMarketplaceComponent, title: 'Gig Details' },
  { path: '**', redirectTo: 'dashboard' } // Wildcard route
];
