import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.models';

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
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  isLoading: boolean = true;
  isSending: boolean = false;
  error: string | null = null;
  agentName: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isConnected = status;
        if (status) {
          this.loadChat();
        }
      });

    this.chatService.currentChat$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadChat() {
    const chatSessionId = this.route.snapshot.paramMap.get('id');
    if (!chatSessionId) {
      this.error = 'Invalid chat ID';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.chatService.getChatSessionById(chatSessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load chat messages';
          this.isLoading = false;
          console.error('Error loading chat:', err);
        }
      });
  }

  sendMessage() {
    if (this.newMessage.trim() && !this.isSending) {
      this.isSending = true;

      this.chatService.sendMessage(this.newMessage.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.newMessage = '';
            this.isSending = false;
          },
          error: (err) => {
            this.error = 'Failed to send message';
            this.isSending = false;
            console.error('Error sending message:', err);
          }
        });
    }
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  retryConnection() {
  }
}
