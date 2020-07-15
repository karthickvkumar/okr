import { Injectable } from '@angular/core';
import { Board } from './shared/models/schema.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private _response: any = require('./data.json');

  getBoards(): Board[] {
    return this._response.boards;
  }
}
