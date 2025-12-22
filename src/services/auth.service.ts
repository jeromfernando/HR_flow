import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'Admin' | 'Candidate' | 'None';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);

    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'Admin');
    isCandidate = computed(() => this.currentUser()?.role === 'Candidate');

    constructor(private router: Router) {
        // Restore session if exists
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
        }
    }

    loginAsAdmin() {
        const user: User = {
            id: 1,
            name: 'HR Admin',
            email: 'admin@hrflow.com',
            role: 'Admin',
            avatar: 'https://i.pravatar.cc/150?u=hradmin'
        };
        this.currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/admin/dashboard']);
    }

    loginAsCandidate(email: string, name: string) {
        const user: User = {
            id: Date.now(),
            name: name,
            email: email,
            role: 'Candidate',
            avatar: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`
        };
        this.currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/portal/jobs']);
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
