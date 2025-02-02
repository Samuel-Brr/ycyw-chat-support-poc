import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ChatPreview, ChatMessage } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private connectionStatus = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatus.asObservable();

  // Keep track of current chat
  private currentChat = new BehaviorSubject<ChatMessage[]>([]);
  currentChat$ = this.currentChat.asObservable();

  constructor() {
    // Simulate initial connection
    setTimeout(() => this.connectionStatus.next(true), 1000);
  }

  getConversations(): Observable<ChatPreview[]> {
    return of(this.getMockConversations()).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        if (!this.connectionStatus.value) {
          throw new Error('Not connected to chat service');
        }
      })
    );
  }

  startNewChat(): Observable<number> {
    // Simulate creating a new chat and returning its ID
    return of(Math.floor(Math.random() * 1000) + 1).pipe(delay(500));
  }

  getChatById(chatId: string): Observable<ChatMessage[]> {
    // Simulate loading chat messages
    return of(this.getMockChatMessages()).pipe(
      delay(1000),
      tap(messages => this.currentChat.next(messages))
    );
  }

  sendMessage(content: string): Observable<ChatMessage> {
    const newMessage: ChatMessage = {
      id: Math.floor(Math.random() * 1000),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'SENDING'
    };

    // Add message to current chat
    const currentMessages = this.currentChat.value;
    this.currentChat.next([...currentMessages, newMessage]);

    // Simulate message sending
    return of(newMessage).pipe(
      delay(1000),
      tap(() => {
        newMessage.status = 'SENT';
        this.currentChat.next([...this.currentChat.value]);

        // Simulate delivery status
        setTimeout(() => {
          newMessage.status = 'DELIVERED';
          this.currentChat.next([...this.currentChat.value]);

          // Simulate agent response
          setTimeout(() => {
            const agentResponse: ChatMessage = {
              id: Math.floor(Math.random() * 1000),
              content: this.getRandomAgentResponse(),
              sender: 'agent',
              timestamp: new Date(),
              status: 'READ'
            };
            this.currentChat.next([...this.currentChat.value, agentResponse]);
          }, 2000);
        }, 1000);
      })
    );
  }

  private getMockConversations(): ChatPreview[] {
    return [
      {
        id: 1,
        status: 'IN_PROGRESS',
        agentName: 'John Smith',
        lastMessage: {
          id: 1,
          content: 'I understand your concern. Let me check that for you...',
          timestamp: new Date(Date.now() - 5 * 60000),
          sender: 'agent',
          status: 'READ'
        },
        unreadCount: 2
      },
      {
        id: 2,
        status: 'NEW',
        lastMessage: {
          id: 2,
          content: 'Hello, I need help with my order #12345',
          timestamp: new Date(Date.now() - 15 * 60000),
          sender: 'user',
          status: 'DELIVERED'
        },
        unreadCount: 0
      },
      {
        id: 3,
        status: 'RESOLVED',
        agentName: 'Sarah Johnson',
        lastMessage: {
          id: 3,
          content: 'Is there anything else I can help you with?',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          sender: 'agent',
          status: 'READ'
        },
        unreadCount: 0
      }
    ];
  }

  private getMockChatMessages(): ChatMessage[] {
    return [
      {
        id: 1,
        content: 'Hello, how can I help you today?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 5 * 60000),
        status: 'READ'
      },
      {
        id: 2,
        content: 'I have a question about my recent order',
        sender: 'user',
        timestamp: new Date(Date.now() - 4 * 60000),
        status: 'DELIVERED'
      }
    ];
  }

  private getRandomAgentResponse(): string {
    const responses = [
      'I understand your concern. Let me check that for you...',
      'Thank you for providing that information. How else can I assist you?',
      'Ill be happy to help you with that.',
      'Could you please provide more details about your issue?',
      'Im looking into this right now.',
      'Is there anything else you like to know?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
