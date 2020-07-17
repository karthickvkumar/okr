import { Component, OnInit, HostListener, Input, QueryList, ViewChildren } from '@angular/core';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { cloneDeep } from "lodash";
import * as moment from 'moment';

import { EditTalkComponent } from '../edit-talk/edit-talk.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTalkComponent } from '../delete-talk/delete-talk.component';
import { BoardService } from '../board.service';

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
    tags: [{ name: 'okr' }, { name: 'research' }],
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
  innerWidth: any;
  innerHeight: any;
  isLoading: boolean = false;
  heightOffset: number = 65;

  constructor(private _dialog: MatDialog, private boardAPI: BoardService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.cards = this.cardConfig.map((card) => {
      return { ...this.cardSchema, cardType: card.cardType, color: card.color };
    });
    this.getBoard();
  }

  getBoard() {
    this.isLoading = true;
    this.boardAPI.getBoards().subscribe((response: any) => {
      this.isLoading = false;
      if (response?.error?.text) {
        console.error(response.error.text)
        return;
      }
      this.boards = response;
      if (response?.talks.length == 0) {
        console.log("There is not card to display")
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  newCard(card, index) {
    let newCard = cloneDeep(this.cards[index]);
    newCard.id = this.generateGuid();
    card.talks.push(newCard);
    this.isLoading = true;
    this.boardAPI.addCard(this.boards).subscribe((response) => {
      this.isLoading = false;
    });
  }

  addCard(card) {
    let newCard = cloneDeep(this.cards[1]);
    newCard.id = this.generateGuid();
    card.talks.push(newCard);
    this.boardAPI.addCard(this.boards).subscribe((response) => {
      this.isLoading = false;
    });
  }

  editCard(event, card, talks, index) {
    event.stopPropagation();
    this._dialog.open(EditTalkComponent, { data: { card }, width: '500px' })
      .afterClosed()
      .subscribe((newTalkData) => {
        Object.assign(card, newTalkData);
        this.boardAPI.editCard(this.boards).subscribe((response) => {
          this.isLoading = false;

        });
      });
  }

  deleteCard(card, talks, index) {
    this._dialog.open(DeleteTalkComponent, { data: card, width: '500px' })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          talks.splice(index, 1);
        }
        this.boardAPI.editCard(this.boards).subscribe((response) => {
          this.isLoading = false;

        });
      });
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

  export() {
    console.log(this.boards.talks)
  }

}

