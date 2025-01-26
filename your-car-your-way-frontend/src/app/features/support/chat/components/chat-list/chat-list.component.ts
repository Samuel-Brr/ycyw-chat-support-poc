import { Component, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import {ChatPreviewComponent} from "./chat-preview/chat-preview.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

interface ChatPreview {
  id: number;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  agentName?: string;
  lastMessage: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

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
    ChatPreviewComponent,
    MatProgressSpinnerModule
  ]
})
export class ChatListComponent implements OnInit {
  conversations: ChatPreview[] = [];
  filteredConversations: ChatPreview[] = [];
  selectedFilter: 'all' | 'active' | 'resolved' = 'all';
  searchQuery: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  isConnected: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Simulate loading conversations
    setTimeout(() => {
      this.conversations = this.getMockConversations();
      this.filterConversations();
      this.isLoading = false;
    }, 1000);
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
    // Navigate to new chat
    this.router.navigate(['/chat/new']);
  }

  openChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
  }

  getStatusSummary() {
    const active = this.conversations.filter(c => ['NEW', 'IN_PROGRESS'].includes(c.status)).length;
    const unread = this.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return { active, unread };
  }

  private getMockConversations(): ChatPreview[] {
    return [
      {
        id: 1,
        status: 'IN_PROGRESS',
        agentName: 'John Smith',
        lastMessage: {
          content: 'I understand your concern. Let me check that for you...',
          timestamp: new Date(Date.now() - 5 * 60000)
        },
        unreadCount: 2
      },
      {
        id: 2,
        status: 'NEW',
        lastMessage: {
          content: 'Hello, I need help with my order #12345',
          timestamp: new Date(Date.now() - 15 * 60000)
        },
        unreadCount: 0
      },
      {
        id: 3,
        status: 'RESOLVED',
        agentName: 'Sarah Johnson',
        lastMessage: {
          content: 'Is there anything else I can help you with?',
          timestamp: new Date(Date.now() - 24 * 60 * 60000)
        },
        unreadCount: 0
      }
    ];
  }
}
