import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {TokenService} from '../token.service';
import {AuthService} from '../auth.service';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    /** private members **/
    private email: String = '';
    private password: String = '';
    private notice: String = '';
    private logged: Boolean = false;
    private btnName: String = 'Start Shopping';
    private userID: String = null;

    /** constructor **/
    constructor(private tokenService: TokenService,
                private authService: AuthService,
                private apiService: ApiService,
                private router: Router,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.tokenService.get();
        this.tokenService.cast.subscribe(
            result => {
                if (result != null) {
                    this.logged = true;
                    this.userID = result.user.id;
                    this.apiService.getActiveShoppingCart(this.userID);
                } else {
                    this.logged = false;
                }
                if (this.logged) {
                    this.findActiveShoppingCartByUser();
                }
            },
            err => {
                console.log('Error token login: ', err);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }

    /** function check email and password to login **/
    login() {
        this.notice = '';
        let err = [];
        if (!this.validateInputs(this.email)) {
            err.push('First Name');
        }
        if (!this.validateInputs(this.password)) {
            err.push('Last Name');
        }
        if (err.length > 0) {
            this.notice = 'Missing: ' + err.join(',');
        } else {
            this.authService.login({email: this.email, password: this.password}).subscribe(
                result => {
                    if (result.token != null) {
                        this.tokenService.set(result);
                        this.userID = result.user.id;
                        this.apiService.getActiveShoppingCart(this.userID);
                        this.apiService.getOrdersByUserId(this.userID);
                        this.findActiveShoppingCartByUser();
                        if (result.user.role === 'Administrator') {
                            this.router.navigate(['/shop']);
                        }
                    } else {
                        this.notice = 'Error: User or password incorrect';
                    }
                },
                error => {
                    console.log('Error: login', error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
        }
    }

    /** function check if user have active shopping cart**/
    findActiveShoppingCartByUser() {
        this.apiService.castActiveShoppingCart.subscribe(result => {
                if (result != null) {
                    this.btnName = 'Resume Shopping';
                } else {
                    this.btnName = 'Start Shopping';
                }
            },
            error => {
                console.log('Error: ', error);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }

    /** function validate inputs **/
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
