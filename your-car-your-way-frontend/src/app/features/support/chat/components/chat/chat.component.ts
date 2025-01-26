import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ChatMessageComponent
  ]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  messages: any[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  isLoading: boolean = true;
  isSending: boolean = false;
  error: string | null = null;
  agentName: string | null = null;

  ngOnInit() {
    // Simulate initial loading
    setTimeout(() => {
      this.isLoading = false;
      this.isConnected = true;
      this.agentName = 'John Smith';
      this.messages = [
        { id: 1, content: 'Hello, how can I help you today?', sender: 'agent', timestamp: new Date(), status: 'READ' }
      ];
    }, 2000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() && !this.isSending) {
      this.isSending = true;
      const message = {
        id: this.messages.length + 1,
        content: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'SENDING',
        isNew: true
      };
      
      this.messages.push(message);
      this.newMessage = '';

      // Simulate message sending
      setTimeout(() => {
        message.status = 'SENT';
        this.isSending = false;
        
        // Simulate delivery status
        setTimeout(() => {
          message.status = 'DELIVERED';
        }, 1000);
      }, 1000);
    }
  }

  retryConnection() {
    this.error = null;
    this.isLoading = true;
    // Add your reconnection logic here
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
