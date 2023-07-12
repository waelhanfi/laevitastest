import { Component, Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { UserService } from '../user.service';
import { ViewportScroller } from '@angular/common';


interface User {
  id: number;
  name: string;
  surname: string;
  years: number;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Output() newCardAdded = new EventEmitter<void>(); // Event emitter for new card added
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;
  savingInProgress = false;

  user: User = {
    id: 0,
    name: '',
    surname: '',
    years: 0
  };

  constructor(private userService: UserService, private viewportScroller: ViewportScroller) {}


  submitForm() {
    this.savingInProgress = true;

    setTimeout(() => {
      this.userService.addUser(this.user);
      console.log('Données enregistrées avec succès.');

      this.user = {
        id: 0,
        name: '',
        surname: '',
        years: 0
      };

      this.newCardAdded.emit();

      this.savingInProgress = false;

      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    }, 2000);
  }
}

