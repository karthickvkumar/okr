import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditTalkComponent } from '../edit-talk/edit-talk.component';
import { DeleteTalkComponent } from '../delete-talk/delete-talk.component';
import { BoardService } from '../board.service';
import { cloneDeep } from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {

  userId: string;
  boardList: any[] = [];
  innerWidth: any;
  innerHeight: any;
  isLoading: boolean = true;
  heightOffset: number = 65;

  constructor(private _dialog: MatDialog, private boardAPI: BoardService, private router: Router) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.userId = localStorage.getItem('userId');
    this.listBoards();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  listBoards() {
    this.isLoading = true;
    this.boardAPI.getBoards(this.userId).subscribe((response: any[]) => {
      this.isLoading = false;
      this.boardList = response;
      if (this.boardList.length > 0) this.boardAPI.notification("Board are loaded successfully");
      if (this.boardList.length == 0) this.boardAPI.notification("There are no boards to display");
    },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification()
      })
  }

  newBoard() {
    const board = {
      title: "Board Title",
      description: "Lorem ipsum dolor sit amet elit nisi, adipiscing consectetur.",
      userId: this.userId
    }
    this.boardList.push(board);
    this.boardAPI.createBoard(board).subscribe((response: any) => {
      console.log(response)
      Object.assign(board, response)
      this.boardAPI.notification("Board created successfully");
    },
      (error) => {
        this.boardList.pop();
        this.boardAPI.notification()
      });
  }

  loadBoard(board) {
    if (board._id) {
      this.router.navigateByUrl('/boards/' + board._id);
    } else {
      this.boardAPI.notification()
    }
  }

  export() {
    console.log(this.boardList)
  }

}
