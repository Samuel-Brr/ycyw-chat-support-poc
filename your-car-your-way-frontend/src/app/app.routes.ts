import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat/:id',
    loadComponent: () => import('./features/support/chat/components/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'chatlist',
    loadComponent: () => import('./features/support/chat/components/chat-list/chat-list.component').then(m => m.ChatListComponent)
  }
];
