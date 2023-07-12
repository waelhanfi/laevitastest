import { Injectable } from '@angular/core';
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
export class SidebarService {
  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();
  private showSidebarSubject = new BehaviorSubject<boolean>(false);
  showSidebar$ = this.showSidebarSubject.asObservable();
  public cancelChangesSubject = new BehaviorSubject<void>(undefined);
  cancelChanges$ = this.cancelChangesSubject.asObservable();
  
  constructor() {}

  setSelectedUser(user: User | null) {
    this.selectedUserSubject.next(user);
  }

  toggleSidebar(show: boolean) {
    this.showSidebarSubject.next(show);
  }

  cancelChanges() {
    this.cancelChangesSubject.next();
  }
}
