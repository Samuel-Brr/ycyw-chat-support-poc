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
}
