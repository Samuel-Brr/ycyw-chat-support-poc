import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatPreview } from '../../../models/chat.models';

@Component({
  selector: 'app-chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class ChatPreviewComponent {
  @Input() conversation!: ChatPreview;

  getStatusColor(): string {
    switch (this.conversation.status) {
      case 'NEW': return 'primary';
      case 'IN_PROGRESS': return 'accent';
      case 'RESOLVED': return 'default';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  }

  getStatusLabel(): string {
    return this.conversation.status.replace('_', ' ');
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return minutes === 0 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
} 