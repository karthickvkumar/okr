import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  isLoading: boolean = false;
  constructor(private router: Router, private boardAPI: BoardService, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('userId');
    if (userLoggedIn) {
      this.router.navigateByUrl('/boards');
    }
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  onLogin() {
    const user = { username: this.formGroup.get('username').value };
    this.isLoading = true;
    this.boardAPI.login(user).subscribe(
      (response: any) => {
        this.isLoading = false;
        localStorage.setItem('userId', response._id);
        this.router.navigateByUrl('/boards');
      },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification();
      });
  }

}
