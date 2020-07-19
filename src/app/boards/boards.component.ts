import { Component, OnInit, HostListener, Input, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditTalkComponent } from '../edit-talk/edit-talk.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTalkComponent } from '../delete-talk/delete-talk.component';
import { BoardService } from '../board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep } from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  boards: any = {
    title: 'Requirement Management',
    talks: []
  };

  cardSchema: any = {
    id: '',
    title: "Workflow Title",
    text: "Agreed joy vanity regret met may ladies oppose who. Mile fail as left as hard eyes. Meet made call in mean four year it to.",
    speaker: 'Pramod George',
    image: '',
    tags: [],
    cardType: '',
    status: 'ToDo',
    createdAt: '',
    selectedDate: {
      start: moment(new Date),
      end: moment(new Date)
    },
    color: '',
    talks: []
  };

  cardConfig = [
    {
      cardType: 'Epic',
      color: 'blue'
    }, {
      cardType: 'Release',
      color: 'yellow'
    }
  ];

  cards: any;
  cardList: any[] = [];
  boardId: string;
  innerWidth: any;
  innerHeight: any;
  isLoading: boolean = true;
  heightOffset: number = 65;

  constructor(private _dialog: MatDialog, private boardAPI: BoardService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.cards = this.cardConfig.map((card) => {
      return { ...this.cardSchema, cardType: card.cardType, color: card.color };
    });
    this.boardId = this.route.snapshot.params['id'];
    this.listCards();
  }

  listCards() {
    this.isLoading = true;
    this.boardAPI.getCards(this.boardId).subscribe((response) => {
      this.isLoading = false;
      this.boards.talks = this.arrangeCards(response);
      if (this.boards.talks.length > 0) this.boardAPI.notification("Cards are loaded successfully")
      if (this.boards.talks.length == 0) this.boardAPI.notification("There is no cards to display")
    },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification();
      })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  newCard(card) {
    let newCard = cloneDeep(this.cards[0]);
    newCard.boradId = this.boardId;
    newCard.parentId = null;
    card.talks.push(newCard);
    this.boardAPI.createCard(newCard).subscribe((response) => {
      console.log(response)
      this.boardAPI.notification("Cards created successfully");
    },
      (error) => {
        this.boardAPI.notification();
      });
  }

  addCard(card, parentCard, index) {
    let newCard = cloneDeep(this.cards[1]);
    newCard.boradId = this.boardId;
    newCard.parentId = parentCard[index]['_id'];
    console.log(newCard.parentId);

    if (card.talks) card.talks.push(newCard);
    if (!card.talks) card.talks = [newCard];

    this.boardAPI.createCard(newCard).subscribe((response) => {
      console.log(response)
      this.boardAPI.notification("Cards created successfully");
    },
      (error) => {
        this.boardAPI.notification();
      });
  }

  editCard(event, card, talks, index) {
    event.stopPropagation();
    this._dialog.open(EditTalkComponent, { data: { card }, width: '500px' })
      .afterClosed()
      .subscribe((newTalkData) => {
        Object.assign(card, newTalkData);
      });
  }

  deleteCard(card, talks, index) {
    this._dialog.open(DeleteTalkComponent, { data: card, width: '500px' })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          talks.splice(index, 1);
        }
      });
  }

  arrangeCards(cards) {
    let map = {}, node, roots = [], i;

    for (i = 0; i < cards.length; i += 1) {
      map[cards[i]._id] = i; // initialize the map
      cards[i].talks = []; // initialize the talks
    }

    for (i = 0; i < cards.length; i += 1) {
      node = cards[i];
      if (node.parentId != null) {
        // if you have dangling branches check that map[node.parentId] exists
        cards[map[node.parentId]].talks.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  generateGuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

  getByID(board, id) {
    let result = null
    if (id === board.id) {
      return board
    } else {
      if (board.talks) {
        board.talks.some(card => result = this.getByID(card, id));
      }
      return result;
    }
  }

  goBack() {
    this.router.navigateByUrl('/boards');
  }

  export() {
    console.log(this.boards.talks)
  }

}

