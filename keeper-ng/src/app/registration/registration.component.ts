import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  password;
  repeatPassword;
  adminPassword;
  admin = 'ibodullo';

  adminAlert = false;
  passwordAlert = false;
  repeatPasswordAlert = false;

  checkAdminPassword() {
    this.adminAlert = this.admin !== this.adminPassword;
  }

  checkPassword() {
    this.passwordAlert = this.password !== undefined && this.password.length < 6;
  }

  checkRepeatPassword() {
    this.repeatPasswordAlert = this.repeatPassword !== this.password;
  }

  registNewKeeper() {
    localStorage.setItem('password', JSON.stringify(this.password));
    window.location.reload();
  }

  constructor() {
  }

  ngOnInit() {
  }

}
