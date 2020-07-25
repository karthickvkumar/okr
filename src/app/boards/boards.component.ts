import { Component, OnInit, HostListener, Input, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditTalkComponent } from '../edit-talk/edit-talk.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTalkComponent } from '../delete-talk/delete-talk.component';
import { BoardService } from '../board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep, maxBy, max } from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  boards: any = {
    talks: []
  };

  cardSchema: any = {
    title: "Workflow Title",
    description: "Agreed joy vanity regret met may ladies oppose who. Mile fail as left as hard eyes. Meet made call in mean four year it to.",
    author: 'Pramod George',
    image: '',
    tags: [],
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
  cardHolder: any[] = [];
  cardHolderCount: number = 0;

  COLUMNS = 'COLUMNS';
  TALKS = 'TALKS';

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
      this.getCardHolder();
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
    newCard.level = 1;

    card.talks.push(newCard);
    this.getCardHolder();

    this.boardAPI.createCard(newCard).subscribe((response) => {
      Object.assign(newCard, response);
      this.boardAPI.notification("Cards created successfully");
    },
      (error) => {
        this.boardAPI.notification();
      });
  }

  addCard(event, card, parentCard, index) {
    event.stopPropagation();
    let newCard = cloneDeep(this.cards[1]);
    newCard.boradId = this.boardId;
    newCard.parentId = parentCard[index]['_id'];
    newCard.level = parentCard[index]['level'] + 1;

    if (card.talks) card.talks.push(newCard);
    if (!card.talks) card.talks = [newCard];
    this.getCardHolder();

    this.boardAPI.createCard(newCard).subscribe((response) => {
      Object.assign(newCard, response)
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
        if (newTalkData == '') return;
        Object.assign(card, newTalkData);

        this.boardAPI.editCard(card).subscribe((response) => {
          this.boardAPI.notification("Card updated successfully");
        },
          (error) => {
            this.boardAPI.notification();
          })
      });
  }

  deleteCard(card, talks, index) {
    this._dialog.open(DeleteTalkComponent, { data: card, width: '500px' })
      .afterClosed()
      .subscribe(response => {
        if (response && card._id) {

          talks.splice(index, 1);
          this.getCardHolder();

          this.boardAPI.deleteCard(card._id).subscribe((response) => {
            this.boardAPI.notification("Card deleted successfully");
          },
            (error) => {
              this.boardAPI.notification();
            })
        }
      });
  }

  arrangeCards(cards) {
    let map = {}, node, roots = [], i;
    for (i = 0; i < cards.length; i += 1) {
      map[cards[i]._id] = i;
      cards[i].talks = [];
    }
    for (i = 0; i < cards.length; i += 1) {
      node = cards[i];
      if (node.parentId != null) {
        if (cards[map[node.parentId]]) {
          cards[map[node.parentId]].talks.push(node);
        }
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  getCardHolder() {
    const cards = this.destructor(this.boards.talks);
    if (cards.length == 0) {
      this.cardHolderCount = 0;
      this.cardHolder = [];
      return;
    }
    let maxValue = max(cards.map((card) => {
      return card.length
    }));
    this.cardHolderCount = maxValue;
    let maxLevel = cards.filter((card) => {
      return card.length == maxValue
    });
    this.cardHolder = maxLevel[0].map((index) => {
      return "workflow " + index
    })
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

  traverse(board, path = [], result = []) {
    if (!board.talks.length)
      if (board._id) result.push(path.concat(board));
    for (const child of board.talks)
      this.traverse(child, path.concat(board), result);
    return result;
  }

  destructor(boards) {
    let result = [];
    let flat = (data, prev = '') => {
      if (Array.isArray(data)) {
        data.forEach(e => flat(e, prev))
      } else {
        prev = prev + (prev.length ? '.' : '') + data.level;
        if (!data.talks.length) result.push(prev.split('.').map(Number))
        else flat(data.talks, prev)
      }
    }
    flat(boards);
    return result;
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

}

