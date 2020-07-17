import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }
  baseURL: string = "https://fpslabs.herokuapp.com/api"

  login(data) {
    let url = this.baseURL + "/login";
    return this.http.post(url, data);
  }

  getBoards() {
    let url: string = this.baseURL + "/board/" + localStorage.getItem('username');
    return this.http.get(url);
  }

  addCard(board) {
    let url: string = this.baseURL + "/board/add";
    let data = {
      username: localStorage.getItem('username'),
      talks: board.talks
    }
    return this.http.post(url, data);
  }

  editCard(board) {
    let url: string = this.baseURL + "/board/edit";
    let data = {
      username: localStorage.getItem('username'),
      talks: board.talks
    }
    return this.http.put(url, data);
  }

}
