import {Component, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {ApiService} from '../api.service';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
/** private members **/
    private numbersOfProducts: Number = 0;
    private numbersOfOrders: Number = 0;
    private token: Object = null;
    private user: any = null;
    private notice: String = '';
/** constructor **/
    constructor(private tokenService: TokenService, private apiService: ApiService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.tokenService.cast.subscribe(
            result => {
                if (result != null) {
                    this.token = result.token;
                    this.user = result.user;
                    this.getActiveShoppingCart();
                } else {
                    this.token = null;
                    this.notice = '';
                }
            },
            err => {
                console.log('Error: login in nav', err);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
        this.getTotalProducts();
        this.getTotalOrders();
    }
/** **/
    getActiveShoppingCart() {
        this.apiService.castActiveShoppingCart.subscribe(
            result => {
                if (result != null) {
                    const date: Date = new Date(result.created);
                    this.notice = `You have open cart from date: ${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;

                } else {
                    this.apiService.getOrdersByUserId(this.user.id).subscribe(
                        res => {
                            if (res != null) {
                                const date: Date = new Date(res[(res.length - 1)].ordered_date);
                                this.notice = `Your last purchase was on date: ${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
                            } else {
                                this.notice = `Welcome ${this.user.first_name} ${this.user.last_name}`;
                            }
                        },
                        errors => {
                            console.log(errors);
                            this.errorsMessage('Sorry we have some problems, try latter');
                        }
                    );
                }
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
/** function get total count of all products in store **/
    getTotalProducts() {
        this.apiService.getTotalProducts().subscribe(
            result => {
                if (result != null) {
                    this.numbersOfProducts = result;
                }
            },
            error => {
                console.log(error);
            }
        );
    }
/** function get total orders in shop **/
    getTotalOrders() {
        this.apiService.getTotalOrders().subscribe(
            result => {
                if (result != null) {
                    this.numbersOfOrders = result;
                }
            },
            error => {
                console.log(error);
            }
        );
    }
/** function print errors messages in pop up window **/
    errorsMessage(message): void {
        this.dialog.open(PopUpMessageComponent,
            {
                data: message
            });
    }
}
