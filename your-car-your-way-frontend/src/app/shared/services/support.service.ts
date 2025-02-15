import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ChatMessage, ChatMessageDTO, ChatMessages, SupportRequests} from '../../features/support/chat/models/chat.models';
import {HttpClient} from '@angular/common/http';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private readonly API_URL = 'api';
  private rxStomp: RxStomp;

  constructor(private http: HttpClient) {
    this.rxStomp = new RxStomp();
    this.activateStomp();
  }

  private activateStomp() {

    const stompConfig: RxStompConfig = {
      brokerURL: 'ws://localhost:3003/chat-websocket',

      connectHeaders: {
        Authorization: `Bearer ${this.getAuthToken()}`
      },

      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,

      debug: (msg: string): void => {
        console.log(new Date(), msg);
      }
    };

    this.rxStomp.configure(stompConfig);

    // Add connection status handlers
    this.rxStomp.connected$.subscribe(() => {
      console.log('Connected to WebSocket');
    });

    this.rxStomp.connectionState$.subscribe(state => {
      console.log('WebSocket connection state:', state);
    });

    // Handle connection errors
    this.rxStomp.stompErrors$.subscribe(error => {
      console.error('STOMP error:', error);
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
    const messageDTO: ChatMessageDTO = {
      content: content,
      timestamp: new Date().toISOString(),
    };

    this.rxStomp.publish({
      destination: `/app/chat/${sessionId}/message`,
      body: JSON.stringify(messageDTO),
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
