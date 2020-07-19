import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
  baseURL: string = "https://fpslabs.herokuapp.com/api"

  login(data) {
    let url: string = this.baseURL + "/login";
    return this.http.post(url, data);
  }

  createBoard(board) {
    let url: string = this.baseURL + "/board/add";
    return this.http.post(url, board);
  }

  getBoards(userId) {
    let url: string = this.baseURL + "/boards/" + userId;
    return this.http.get(url);
  }

  getCards(boardId) {
    let url: string = this.baseURL + "/cards/" + boardId;
    return this.http.get(url);
  }

  createCard(card) {
    let url: string = this.baseURL + "/card/add";
    return this.http.post(url, card);
  }

  notification(message = "Server Error, Please try again later") {
    this.snackBar.open(message, 'close', {
      duration: 1000,
    });
  }

}
