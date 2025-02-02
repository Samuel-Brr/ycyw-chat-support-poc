import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatPreviewComponent } from './chat-preview/chat-preview.component';
import { ChatService } from '../../services/chat.service';
import { ChatPreview } from '../../models/chat.models';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ChatPreviewComponent
  ]
})
export class ChatListComponent implements OnInit, OnDestroy {
  conversations: ChatPreview[] = [];
  filteredConversations: ChatPreview[] = [];
  selectedFilter: 'all' | 'active' | 'resolved' = 'all';
  searchQuery: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  isConnected: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.loadConversations();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConversations() {
    this.isLoading = true;
    this.error = null;

    this.chatService.getSupportRequestPreviews()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conversations) => {
          this.conversations = conversations.support_requests;
          this.filterConversations();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load conversations. Please try again.';
          this.isLoading = false;
          console.error('Error loading conversations:', err);
        }
      });
  }

  filterConversations() {
    let filtered = this.conversations;

    if (this.selectedFilter === 'active') {
      filtered = filtered.filter(conv => ['NEW', 'IN_PROGRESS'].includes(conv.status));
    } else if (this.selectedFilter === 'resolved') {
      filtered = filtered.filter(conv => ['RESOLVED', 'CLOSED'].includes(conv.status));
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.lastMessage.content.toLowerCase().includes(query) ||
        (conv.agentName && conv.agentName.toLowerCase().includes(query))
      );
    }

    this.filteredConversations = filtered;
  }

  onFilterChange(filter: 'all' | 'active' | 'resolved') {
    this.selectedFilter = filter;
    this.filterConversations();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.filterConversations();
  }

  startNewChat() {
    this.chatService.postNewSupportRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chatId) => {
          this.router.navigate(['/chat', chatId]);
        },
        error: (err) => {
          console.error('Error starting new chat:', err);
          // Handle error (show snackbar, etc.)
        }
      });
  }

  openChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
    console.log('Opening chat', chatId);
  }

  getStatusSummary() {
    const active = this.conversations.filter(c => ['NEW', 'IN_PROGRESS'].includes(c.status)).length;
    const unread = this.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return { active, unread };
  }

  retryConnection() {
    this.loadConversations();
  }
}
