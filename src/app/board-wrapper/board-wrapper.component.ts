import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-board-wrapper',
  templateUrl: './board-wrapper.component.html',
  styleUrls: ['./board-wrapper.component.css']
})
export class BoardWrapperComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('userId');
    if (!userLoggedIn) {
      this.router.navigateByUrl('/');
    }
  }

}
