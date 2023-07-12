import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserService } from '../user.service';
import { SidebarService } from '../sidebar.service';

interface User {
  id: number;
  name: string;
  surname: string;
  years: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  @Input() newCardAdded: boolean = false;

  users: User[] = [];
  animateCardIndex: number | null = null; 
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;
 
  greenBlinkCounter: number = 0; 

  newCardIndex: number | null = null; 
  modifiedCardIndexes: number[] = []; 
  savingInProgress: boolean = false; 
  selectAllCards: boolean = false;
  cancelingInProgress: boolean = false; 
  loadingInProgress: boolean = false; 
  constructor(private userService: UserService, private sidebarService: SidebarService,private elementRef: ElementRef) {}


  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.loadUsers();
  }

  droppedCardIndex: number | null = null; 
  targetCardIndex: number | null = null; 
  
  highlightedCards: number[] | null = null; 



  onCardDrop(event: CdkDragDrop<User[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedUser = event.previousContainer.data[event.previousIndex];
      const targetIndex = event.currentIndex;
      const targetPosition = targetIndex < this.users.length ? targetIndex : this.users.length;
  
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(targetPosition, 0, droppedUser);
  
      this.animateCardIndex = targetPosition - 1;
      this.highlightedCards = [event.previousIndex, targetPosition];
  
      setTimeout(() => {
        this.animateCardIndex = null; 
        this.highlightedCards = null;
      }, 1000);
  
      this.droppedCardIndex = targetPosition;
      setTimeout(() => {
        this.droppedCardIndex = null; 
      }, 2000);
  
      setTimeout(() => {
        const newCard = document.querySelector('.card-grid .card:last-child');
        if (newCard) {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 0);
    }
  }
  
  
  
    onNewCardAdded(): void {
      this.newCardIndex = this.users.length - 1; 
      setTimeout(() => {
        this.newCardIndex = null; 
      }, 2000);

      this.greenBlinkCounter = 0; 

    }
  

saveUser(user: User) {
  const index = this.users.indexOf(user);
  if (index !== -1) {
    if (!this.modifiedCardIndexes.includes(index)) {
      this.modifiedCardIndexes.push(index); 
    }
    this.userService.updateUser(user);
  }
}


blinkCards(): void {
  
  if (this.highlightedCards) {
    this.greenBlinkCounter++; 
    if (this.greenBlinkCounter >= 3) {
      this.highlightedCards = null;
    }
  }
}
saveAllUsers() {

  const cardElements = this.cardContainer.nativeElement.querySelectorAll('.card');
  const lastSelectedCardElement = cardElements[this.modifiedCardIndexes[this.modifiedCardIndexes.length - 1]];
  if (lastSelectedCardElement) {
    lastSelectedCardElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }


  this.savingInProgress = true; 

  for (const index of this.modifiedCardIndexes) {
    const user = this.users[index];
    if (user) {
      this.userService.updateUser(user);
    }
  }
  this.modifiedCardIndexes = []; 


  setTimeout(() => {
    this.savingInProgress = false; 

    const blinkDuration = 200; 

    this.highlightedCards = this.modifiedCardIndexes;

    setTimeout(() => {
      this.highlightedCards = null; 
    }, blinkDuration);

    const lastSelectedCard = this.cardContainer.nativeElement.querySelector('.card.highlighted:last-child');
    if (lastSelectedCard) {
      lastSelectedCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 2000);


  this.greenBlinkCounter = 0;

}

 ngAfterViewInit() {
    const cardElements = this.cardContainer.nativeElement.querySelectorAll('.card');
    const lastSelectedCardElement = cardElements[this.modifiedCardIndexes[this.modifiedCardIndexes.length - 1]];
    if (lastSelectedCardElement) {
      lastSelectedCardElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }
isCardModified(index: number): boolean {
  return this.modifiedCardIndexes.includes(index) || (this.newCardIndex === index && this.users[index]?.years !== this.userService.getOriginalUsers()[index]?.years);
}

cancelChanges() {
  this.cancelingInProgress = true;

  setTimeout(() => {
    this.cancelingInProgress = false; 

    this.selectAllCards = true; 

    const blinkDuration = 200; 
    const cards = Array.from(this.cardContainer.nativeElement.querySelectorAll('.card'));

    cards.forEach((card: any, index: number) => {
      card.classList.add('cancel-highlight');

      setTimeout(() => {
        card.classList.remove('cancel-highlight');
      }, blinkDuration + index * blinkDuration);
    });

    this.modifiedCardIndexes = [];

    this.highlightedCards = [];

    this.newCardIndex = null;

    this.users = this.userService.getOriginalUsers();
  }, 2000);
}


loadUsers() {
  this.loadingInProgress = true; 
  this.users = this.userService.getOriginalUsers();


  setTimeout(() => {
   


    this.loadingInProgress = false; 
  }, 2000);
}



  

  showCardDetails(user: User) {
    this.sidebarService.setSelectedUser(user);
    this.sidebarService.toggleSidebar(true);
  
    const index = this.users.indexOf(user);
    if (index !== -1 && !this.modifiedCardIndexes.includes(index)) {
      this.modifiedCardIndexes.push(index); 
      this.newCardIndex = index; 
    }

    this.greenBlinkCounter = 0; 
  }
  

  isCardBlinking(index: number): boolean {
    return this.highlightedCards?.includes(index) || this.highlightedCards?.includes(index + 1) || false;
  }
  
  isCardBlinkingGreen(index: number): boolean {
    return !!this.highlightedCards?.includes(index) && this.greenBlinkCounter < 3;
  }
  

deleteUser(event: Event, user: User) {
  event.stopPropagation(); 
  const index = this.users.indexOf(user);
  if (index !== -1) {
    const deletedCard = this.cardContainer.nativeElement.children[index];
    deletedCard.classList.add('delete-highlight');
    setTimeout(() => {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
    }, 1000);
  }
}

  
  
}
