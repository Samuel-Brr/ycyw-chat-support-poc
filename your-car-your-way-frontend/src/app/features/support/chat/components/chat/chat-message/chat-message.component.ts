import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {ChatMessage} from "../../../models/chat.models";

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
  @Input() message: ChatMessage = {} as ChatMessage;
  currentUserId: string | null;

  constructor() {
    this.currentUserId = localStorage.getItem('user_id');
  }

  isCurrentUser(message: ChatMessage): boolean {
    return message.sender.toString() === this.currentUserId;
  }

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
