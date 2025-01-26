import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class ChatMessageComponent {
  @Input() message: any;

  getStatusIcon(): string {
    switch (this.message.status) {
      case 'SENDING': return 'schedule';
      case 'SENT': return 'check';
      case 'DELIVERED': return 'done_all';
      case 'READ': return 'done_all';
      default: return 'check';
    }
  }
} 