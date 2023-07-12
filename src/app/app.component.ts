import { Component } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'laevitas';
  showSidebar: boolean = true;
  newCardAdded: boolean = false;

  handleNewCardAdded() {
    this.newCardAdded = true;
    setTimeout(() => {
      this.newCardAdded = false;
    }, 2000);
  }


  
  constructor(private sidebarService: SidebarService) {
    this.sidebarService.showSidebar$.subscribe(show => {
      this.showSidebar = show;
    });
  }
}
