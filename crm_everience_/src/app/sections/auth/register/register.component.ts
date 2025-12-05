import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  formReg: FormGroup;
  invalidRegister: boolean = false;
  userExists: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
  regex: RegExp = /[^@ \t\r\n]+@everience\.com/;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordMatches: boolean = false;
  validEmail: boolean = false;
  invalidEmailPopUp: boolean = false;
  invalidPasswordPopUp: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  newUser: any = {};

  onSubmit() {
    this.validEmail = this.regex.test(this.formReg.value.email);
    if (this.validEmail) {
      this.validatePassword();
      if (this.passwordMatches) {
        this.userService
          .register(this.formReg.value)
          .then((response) => {
            // Save Firebase UID
            sessionStorage.setItem('uid', response.user.uid);

            const [firstName, lastName] =
              response.user.email?.split('@')[0].split('.') || [];
            this.newUser = {
              username: this.formReg.value.email,
              first_name: firstName || '',
              last_name: lastName || '',
              uid: response.user.uid,
            };

            this.userService
              .registerInDb(this.newUser)
              .then(() => {
                this.router.navigate(['/new-user']);
              })
              .catch((err) => {
                console.error('Error adding user to DB:', err);
              });
          })
          .catch((error) => {
            this.invalidRegister = true;
            if (error.code === 'auth/email-already-in-use') {
              this.userExists = true;
            }
          });
      }
    } else {
      this.invalidEmailPopUp = true;
      setTimeout(() => {
        this.invalidEmailPopUp = false;
      }, 3000);
    }
  }

  validatePassword() {
    if (this.formReg.value.password === this.formReg.value.confirmPassword) {
      this.passwordMatches = true;
    } else {
      this.invalidPasswordPopUp = true;
      setTimeout(() => {
        this.invalidPasswordPopUp = false;
      }, 3000);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
