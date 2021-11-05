import { Component, EventEmitter, Output } from '@angular/core';

enum UserRole {
  Seller = 'seller',
  Customer = 'customer'
}
type User = {
  id: string;
  role: UserRole,
  fullName: string;
}

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})

export class UsernameComponent {
  @Output() userEvent = new EventEmitter<string>();

  user: User = {
    id: '',
    role: UserRole.Customer,
    fullName: ''
  };

  constructor() { }

  setUser(): void {
    this.userEvent.emit(this.user.id);
    const randomNumber = Math.floor((Math.random() * 100) + 1);
    this.user.id = `${this.user.fullName.split(' ')[0]}-${randomNumber}`;
  }

}
