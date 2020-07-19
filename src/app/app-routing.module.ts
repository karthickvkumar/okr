import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../app/login/login.component';
import { BoardsComponent } from '../app/boards/boards.component';
import { BoardListComponent } from '../app/board-list/board-list.component';
import { BoardWrapperComponent } from '../app/board-wrapper/board-wrapper.component';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  {
    path: 'boards', component: BoardWrapperComponent, children: [
      { path: '', component: BoardListComponent },
      { path: ':id', component: BoardsComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
