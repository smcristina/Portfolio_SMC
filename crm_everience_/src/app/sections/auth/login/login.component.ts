import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  error = false;
  invalid: boolean = false;
  noServer: boolean = false;
  emailSent: boolean = false;
  invalidEmail: boolean = false;
  regex: RegExp = /[^@ \t\r\n]+@everience\.com/;
  showPassword: boolean = false;
  noEmail: boolean = false;
  users: any = [];

  constructor(private userService: UserService, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  login() {
    this.userService
      .login(this.formLogin.value)
      .then((response: any) => {
        console.log(response);
        this.router.navigate(['/home']);
      })
      .catch((error: any) => console.log(error));
  }

  forgotPassword() {
    if (this.formLogin.value.email) {
      this.userService
        .passwordReset(this.formLogin.value.email)
        .then((response: any) => {
          this.emailSent = true;
        })
        .catch((error) => error);
      this.invalid = false;
    } else {
      this.noEmail = true;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
