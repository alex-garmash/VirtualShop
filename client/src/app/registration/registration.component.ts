import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {TokenService} from '../token.service';
import {AuthService} from '../auth.service';
import {MatDialog} from '@angular/material';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
/** private members **/
    private ID: String = '';
    private password: String = '';
    private passwordConfirmation: String = '';
    private firstName: String = '';
    private lastName: String = '';
    private street: String = '';
    private cities = null;
    private city: String = '';
    private step: Boolean = true;
    private notice: String = '';
    private email = '';
/** constructor **/
    constructor(private tokenService: TokenService,
                private authService: AuthService,
                private apiService: ApiService,
                private router: Router,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.getCities();
        this.tokenService.cast.subscribe(
            result => {
                if (result != null) {
                    this.router.navigate(['']);
                }
            },
            err => {
                console.log('Error: login in nav', err);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
/** check all fields in step one **/
    registrationStepOne() {
        this.notice = '';
        let err = [];

        if (!this.validateEmail()) {
            err.push('email');
        }
        if (!this.validateInputs(this.ID)) {
            err.push('ID');
        }
        if (!this.validateInputs(this.password)) {
            err.push('password');
        }
        if (!this.validateInputs(this.passwordConfirmation)) {
            err.push('password confirmation');
        }
        if (this.password !== this.passwordConfirmation) {
            err.push('password not match');
        }
        if (err.length > 0) {
            this.notice = 'Missing: ' + err.join(',');
        } else {
            this.authService.checkLogin({ID: this.ID, email: this.email}).subscribe(
                result => {
                    if (result) {
                        if (result.email) {
                            err.push('email already exist');
                        }
                        if (result.ID) {
                            err.push('ID already exist');
                        }
                        if (err.length > 0) {
                            this.notice = 'Error: ' + err.join(',');
                        } else {
                            this.step = false;
                        }
                    }
                },
                error => {
                    console.log('Error: registration step one', error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                    // this.router.navigate(['']);
                }
            );
        }
    }
    /** check all fields in step two **/
    registrationStepTwo() {
        this.notice = '';
        let err = [];
        if (!this.validateInputs(this.firstName)) {
            err.push('First Name');
        }
        if (!this.validateInputs(this.lastName)) {
            err.push('Last Name');
        }
        if (!this.validateInputs(this.street)) {
            err.push('Street');
        }
        if (this.city === '') {
            err.push('City');
        }
        if (err.length > 0) {
            this.notice = 'Missing: ' + err.join(',');
        } else {
            let newUser = {
                ID: this.ID,
                email: this.email,
                password: this.password,
                first_name: this.firstName,
                last_name: this.lastName,
                street: this.street,
                city: this.city
            };
            // this.step = true;
            this.authService.registerUser(newUser).subscribe(
                result => {
                    if (result) {
                        this.tokenService.set(result);
                    }
                },
                error => {
                    console.log('Error: registration step two', error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
            this.router.navigate(['']);
        }
    }
/** get Israel cities from Api for drop down**/
    getCities() {
        this.apiService.getCities().subscribe(
            result => {
                if (!result.length) {
                    console.log('Waiting');
                }
                this.cities = result;
            },
            err => {
                console.log('Error: ', err);
                this.errorsMessage('Sorry we have some problems, try latter');
                this.router.navigate(['']);
            }
        );
    }
/** validations **/
    validateEmail() {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    }
    validateInputs(value) {
        let answer = true;
        if (value.trim() === '') {
            answer = false;
        }
        return answer;
    }
    /** function print errors messages in pop up window **/
    errorsMessage(message): void {
        this.dialog.open(PopUpMessageComponent,
            {
                data: message
            });
    }
}
