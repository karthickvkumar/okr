import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';
import { Board } from '../shared/models/schema.model';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  boards: Board[];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private boardService: BoardService,
    private router: Router
  ) {
  }

  onLogout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
