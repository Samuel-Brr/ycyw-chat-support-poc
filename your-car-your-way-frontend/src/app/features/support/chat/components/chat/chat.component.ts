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
import {concatMap, Subject} from 'rxjs';
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
  isSending: boolean = false;
  error: string | null = null;
  agentName: string | null = null;
  chatSessionId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {
    this.chatSessionId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadChatHistoryAndSubscribeToNewMessage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadChatHistoryAndSubscribeToNewMessage() {
    // First, load message history
    this.chatService.getMessageHistory(this.chatSessionId)
      .pipe(
        // After loading history, start listening for new messages
        concatMap(history => {
          this.messages = history.payload;
          return this.chatService.subscribeToNewMessages(this.chatSessionId);
        })
      )
      .subscribe(newMessage => {
        this.messages.push(newMessage);
      });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Send the message through the same WebSocket connection
      this.chatService.sendMessage(this.chatSessionId, this.newMessage);
      this.newMessage = '';
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
