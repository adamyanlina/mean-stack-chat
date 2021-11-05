import { Component } from '@angular/core';
import * as io from 'socket.io-client';

enum UserRole {
  Seller = 'seller',
  Customer = 'customer'
}
type User = {
  id: string;
  role: UserRole,
  fullName: string;
}
type message = {
  message: string;
  senderId: string;
  recipientId: string;
  mine: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent {
  user: User = {
    id: '',
    role: UserRole.Customer,
    fullName: ''
  };
  message = '';
  messageList: message[] = [];
  userList: User[]  = [
    { id: `Anna-${Math.floor((Math.random() * 100) + 1)}`, role: UserRole.Customer, fullName: 'Anna Karapetyan' },
    { id: `Marry-${Math.floor((Math.random() * 100) + 1)}`, role: UserRole.Customer, fullName: 'Marry Ohanyan' },
    { id: `Lilith-${Math.floor((Math.random() * 100) + 1)}`, role: UserRole.Seller, fullName: 'Lilith Papoyan' },
    { id: `Karen-${Math.floor((Math.random() * 100) + 1)}`, role: UserRole.Customer, fullName: 'Karen Simonyan' },
    { id: `David-${Math.floor((Math.random() * 100) + 1)}`, role: UserRole.Seller, fullName: 'David Aghayan' },
  ];
  socket: any;

  constructor() { }

  userUpdate(id: string): void {
    this.socket = io.io(`localhost:3000/?id=${id}`);
    this.user.id = id;

    this.socket.on('message-broadcast', (data: {message: string, senderId: string, recipientId: string, id: string}) => {
      if (data) {
        this.messageList.push({message: data.message, senderId: data.senderId, recipientId: data.recipientId, mine: false});
      }
    });
  }

  sendMessage(): void {
    this.socket.emit('message', this.message);
    // TODO: implement recipient logic
    this.messageList.push({message: this.message, senderId: this.user.id, recipientId: this.userList[2].id, mine: true});
    this.message = '';
  }

}
