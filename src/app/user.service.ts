import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface User {
  id: number;
  name: string;
  surname: string;
  years: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();
  private usersLoaded = false;

  constructor(private http: HttpClient) {
    this.getUsers();
  }

  getUsers(): void {
    if (this.usersLoaded) {
      return;
    }
  
    const usersJson = localStorage.getItem('users');
    const localUsers = usersJson ? JSON.parse(usersJson) : [];
  
    this.http.get<User[]>('assets/user.json').subscribe(data => {
      const fetchedUsers = data.filter(fetchedUser => !localUsers.some((localUser: User) => localUser.id === fetchedUser.id));
      const users = [...localUsers, ...fetchedUsers];
      console.log("fetchedUsers",users)

      this.usersSubject.next(users);
      this.usersLoaded = true;
      this.selectedUserSubject.next(null); 
    });
  }
  

  updateUser(user: User): void {
    const users = this.usersSubject.getValue();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
      this.usersSubject.next(users);
    }
  }

  addUser(user: User): void {
    const users = this.usersSubject.getValue();
    user.id = this.generateId(users);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    this.usersSubject.next(users);
  }

  getUsersList(): User[] {
    return this.usersSubject.getValue();
  }

  setSelectedUser(user: User | null): void {
    this.selectedUserSubject.next(user);
  }

  getOriginalUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }
  

  private generateId(users: User[]): number {
    if (users.length === 0) {
      return 1;
    }
    const lastUser = users[users.length - 1];
    return lastUser.id + 1;
  }
}
