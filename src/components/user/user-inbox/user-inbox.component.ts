import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Message } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-user-inbox',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h1 class="text-xl font-bold text-gray-900">Inbox</h1>
        <span class="text-sm text-gray-500">{{ messages().length }} messages</span>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <!-- Message List -->
        <div class="w-1/3 border-r border-gray-200 overflow-y-auto">
           <div class="divide-y divide-gray-200">
               @for (msg of messages(); track msg.id) {
                   <button (click)="selectMessage(msg)" [class]="'w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none transition-colors ' + (selectedMessage()?.id === msg.id ? 'bg-blue-50' : '') + (msg.read ? '' : ' border-l-4 border-blue-500')">
                       <div class="flex justify-between items-baseline">
                           <span [class]="'text-sm font-medium ' + (msg.read ? 'text-gray-900' : 'text-blue-600')">{{ msg.subject }}</span>
                           <span class="text-xs text-gray-500">{{ msg.date }}</span>
                       </div>
                       <p class="mt-1 text-sm text-gray-500 truncate">{{ msg.body }}</p>
                   </button>
               }
               @if (messages().length === 0) {
                   <div class="px-4 py-8 text-center text-gray-500">
                       No messages found.
                   </div>
               }
           </div>
        </div>

        <!-- Message Detail -->
        <div class="flex-1 overflow-y-auto bg-white">
            @if (selectedMessage(); as msg) {
                <div class="p-8">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ msg.subject }}</h2>
                        <div class="flex items-center text-sm text-gray-500">
                            <span>From: HR Admin</span>
                            <span class="mx-2">•</span>
                            <span>{{ msg.date }}</span>
                        </div>
                    </div>
                    <div class="prose max-w-none text-gray-700">
                        {{ msg.body }}
                    </div>
                </div>
            } @else {
                <div class="h-full flex flex-col items-center justify-center text-gray-500">
                    <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <p>Select a message to read</p>
                </div>
            }
        </div>
      </div>
    </div>
  `
})
export class UserInboxComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);

    selectedMessageId = signal<number | null>(null);

    messages = computed(() => {
        const email = this.auth.currentUser()?.email;
        return this.dataService.messages().filter(m => m.recipientEmail === email);
    });

    selectedMessage = computed(() => {
        const id = this.selectedMessageId();
        return this.messages().find(m => m.id === id) || null;
    });

    selectMessage(msg: Message) {
        this.selectedMessageId.set(msg.id);
        // Mark as read logic would go here
        this.dataService.messages.update(msgs =>
            msgs.map(m => m.id === msg.id ? { ...m, read: true } : m)
        );
    }

    // Need to import signal
    protected readonly signal = signal;
}
import { signal } from '@angular/core'; 
