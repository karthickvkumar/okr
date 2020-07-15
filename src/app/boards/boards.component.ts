import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { cloneDeep } from "lodash";

import { EditTalkComponent } from '../edit-talk/edit-talk.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTalkComponent } from '../delete-talk/delete-talk.component';
import { Board, Talk, Track } from '../shared/models/schema.model';


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

  sampleCard = {
    "text": "Agreed joy vanity regret met may ladies oppose who. Mile fail as left as hard eyes. Meet made call in mean four year it to.",
    "speaker": "Developer",
    "image": "",
    "tags": [],
    "issueType": "",
    "createdAt": "2020-06-29T14:24:04.055Z",
    "id": "67F29845-E217-D6E3-4D38-49542A8DC598"
  }

  cardSchema: any = {
    id: '',
    title: "",
    text: "Agreed joy vanity regret met may ladies oppose who. Mile fail as left as hard eyes. Meet made call in mean four year it to.",
    speaker: 'Developer',
    image: '',
    tags: '',
    cardType: '',
    createdAt: '',
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
    }, {
      cardType: 'Feature',
      color: 'green'
    }, {
      cardType: 'User Story',
      color: 'orange'
    }, {
      cardType: 'Task',
      color: 'pink'
    }
  ];

  cards: any;

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.cards = this.cardConfig.map((card) => {
      let title = 'Workflow - ' + card.cardType;
      return { ...this.cardSchema, cardType: card.cardType, color: card.color, title };
    });
  }

  addCard(card, index) {
    let newCard = cloneDeep(this.cards[index]);
    newCard.id = this.generateGuid();
    card.talks.push(newCard);
  }

  editCard(card, talks, index) {
    this._dialog.open(EditTalkComponent, { data: { card }, width: '500px' })
      .afterClosed()
      .subscribe((newTalkData) => {
        Object.assign(talks[index], newTalkData)
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

