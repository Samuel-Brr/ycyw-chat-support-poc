import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ChatMessage, ChatMessages, SupportRequests} from '../models/chat.models';
import {HttpClient} from '@angular/common/http';
import {RxStomp} from '@stomp/rx-stomp';
import {Message} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = 'api';
  private rxStomp: RxStomp;

  constructor(private http: HttpClient) {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: 'ws://localhost:3003/chat-websocket',
      connectHeaders: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    this.rxStomp.activate();
  }

  getSupportRequestPreviews(): Observable<SupportRequests> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<SupportRequests>(`${this.API_URL}/support_requests/user/${userId}`);
  }

  // Get message history through REST API
  getMessageHistory(chatSessionId: string): Observable<ChatMessages> {
    return this.http.get<ChatMessages>(`${this.API_URL}/support_requests/${chatSessionId}/messages`);
  }

  // Subscribe to new messages through WebSocket
  subscribeToNewMessages(sessionId: string): Observable<ChatMessage> {
    return this.rxStomp.watch(`/topic/chat/${sessionId}`).pipe(
      map(message => JSON.parse(message.body))
    );
  }

  sendMessage(sessionId: string, content: string): void {
    // Send message to the same endpoint we're listening to
    this.rxStomp.publish({
      destination: `/app/chat/${sessionId}/message`,
      body: JSON.stringify({
        content: content,
        timestamp: new Date(),
        // Add other message properties
      })
    });
  }

  postNewSupportRequest(): Observable<number> {
    const userId = localStorage.getItem('user_id');
    return this.http.post<number>(`${this.API_URL}/support_requests`, {userId: userId});
  }

  private getAuthToken() {
    return localStorage.getItem('TOKEN');
  }
}
