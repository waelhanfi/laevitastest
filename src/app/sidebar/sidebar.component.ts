import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';

interface User {
  id: number;
  name: string;
  surname: string;
  years: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  selectedUser: User | null = null;
  editingUser: User | null = null;
  showSidebar: boolean = false;
  originalUser: User | null = null;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.selectedUser$.subscribe(user => {
      this.selectedUser = user;
      this.showSidebar = !!user;
      this.originalUser = user ? { ...user } : null; 
    });
  
    this.sidebarService.cancelChanges$.subscribe(() => {
      this.cancelChanges();
    });
  }
  
  cancelChanges() {
    if (this.originalUser) {
      this.selectedUser = { ...this.originalUser }; 
    }
  }

  onSidebarClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
