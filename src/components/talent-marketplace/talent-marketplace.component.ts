import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Gig, SuggestedEmployee } from '../../models';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-talent-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './talent-marketplace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentMarketplaceComponent implements OnInit {
  dataService = inject(DataService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  viewMode = signal<'list' | 'detail' | 'create'>('list');
  selectedGig = signal<Gig | null>(null);
  toast = signal<{ message: string; details?: string } | null>(null);

  // For List view
  gigs = this.dataService.gigs;
  activeTab = signal('All Gigs');

  // For Create view
  newGig = signal<Omit<Gig, 'id' | 'applicants' | 'status'>>({
    title: '',
    department: '',
    duration: '',
    skills: [],
    startDate: '',
    description: '',
    createdBy: 'John Manager'
  });
  skillsInput = signal('');
  departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'];
  durations = ['1 week', '2 weeks', '4 weeks', '6 weeks', '8 weeks', '3 months'];

  ngOnInit() {
    this.route.url.subscribe(() => {
      const path = this.router.url;
      const params = this.route.snapshot.paramMap;

      if (path.includes('/new')) {
        this.viewMode.set('create');
        this.resetForm();
      } else if (params.has('id')) {
        const id = Number(params.get('id'));
        // We need to re-fetch from the service to get the latest state
        const gig = this.dataService.gigs().find(g => g.id === id);
        if (gig) {
          this.selectedGig.set(gig);
          this.viewMode.set('detail');
        } else {
          this.router.navigate(['/talent']);
        }
      } else {
        this.viewMode.set('list');
        if (this.route.snapshot.queryParams['published']) {
          this.showToast({ message: 'Gig published successfully', details: 'The gig is now visible to employees.' });
          this.router.navigate([], { relativeTo: this.route, queryParams: { published: null }, queryParamsHandling: 'merge' });
        }
      }
    });
  }

  showToast(toast: { message: string; details?: string }) {
    this.toast.set(toast);
    setTimeout(() => this.toast.set(null), 4000);
  }

  // --- Methods for Create View ---
  addSkill() {
    const skill = this.skillsInput().trim();
    if (skill) {
      this.newGig.update(gig => ({ ...gig, skills: [...gig.skills, skill] }));
      this.skillsInput.set('');
    }
  }

  removeSkill(skillToRemove: string) {
    this.newGig.update(gig => ({ ...gig, skills: gig.skills.filter(s => s !== skillToRemove) }));
  }

  saveGig(status: 'Draft' | 'Open') {
    const gigData = this.newGig();
    if (gigData.title && gigData.department && gigData.duration) {
      this.dataService.addGig({ ...gigData, status });
      if (status === 'Open') {
        this.router.navigate(['/talent'], { queryParams: { published: true } });
      } else {
        this.router.navigate(['/talent']);
      }
    }
  }

  cancelCreate() {
    this.router.navigate(['/talent']);
  }
  
  resetForm() {
    this.newGig.set({
      title: '', department: '', duration: '', skills: [],
      startDate: '', description: '', createdBy: 'John Manager'
    });
    this.skillsInput.set('');
  }

  // --- Methods for Detail View ---
  assignToGig(gig: Gig, employee: SuggestedEmployee) {
    this.dataService.assignToGig(gig.id, employee.id);
    // Refresh the selected gig to show updated state
    const updatedGig = this.dataService.gigs().find(g => g.id === gig.id);
    this.selectedGig.set(updatedGig ?? null);
    this.showToast({ message: 'Employee assigned', details: `${employee.name} has been assigned to "${gig.title}".` });
  }

  closeGig(gig: Gig) {
    this.dataService.closeGig(gig.id);
    const updatedGig = this.dataService.gigs().find(g => g.id === gig.id);
    this.selectedGig.set(updatedGig ?? null);
    this.showToast({ message: 'Gig closed', details: `"${gig.title}" has been closed.` });
  }
}
