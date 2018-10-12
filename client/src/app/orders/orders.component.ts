import {Component, ElementRef, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';
import {DialogModalComponent} from '../dialogmodal/dialog-modal.component';
import {MatDialog} from '@angular/material';
import {DialogOrderComponent} from '../dialogorder/dialogorder.component';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';


@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    /** members **/
    notice = '';
    dateNotification = '';
    token = null;
    user = null;
    shoppingCart = null;
    city = '';
    street = '';
    date: Date;
    creditCard = '';
    sendedDays = null;
    search = '';

    /** constructor **/
    constructor(private calendar: NgbCalendar,
                private tokenService: TokenService,
                private router: Router,
                private apiService: ApiService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.tokenService.cast.subscribe(
            result => {
                if (result != null) {
                    this.token = result.token;
                    this.user = result.user;
                    this.apiService.getShoppingCart(this.user.id);
                    this.getShoppingCart();
                    this.selectTodayDate();
                    this.getAllSendedOrdersDates();
                } else {
                    this.router.navigate(['/']);
                }
            },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );

    }
    /** function set today date **/
    selectTodayDate() {
        this.date = new Date();
    }
    /** function subscribe on shopping cart event **/
    getShoppingCart() {
        this.apiService.castShoppingCart.subscribe(result => {
            if (result != null) {
                this.shoppingCart = result;
            }
        },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function validate form **/
    validateForm() {
        let result = false;
        let errors = [];
        if (this.validateInput(this.city)) {
            errors.push('City');
        }
        if (this.validateInput(this.street)) {
            errors.push('Street');
        }
        if (this.validateInputDate()) {
            errors.push('Date');
        }
        if (this.validateInputCreditCard()) {
            errors.push('Credit Card');
        }
        if (errors.length > 0) {
            this.printNotice('Error: ' + errors.join(','));
            result = true;
        }
        return result;
    }
    /** function get all ordered dates **/
    getAllSendedOrdersDates() {
        this.apiService.getAllOrdersDates().subscribe(
            result => {
                let arr = [];
                for (let order of result) {
                    let sendDate = new Date(order.send_date);
                    let date = new Date(sendDate.getFullYear(), (sendDate.getMonth() + 1), sendDate.getDate());
                    arr.push(date.toDateString());
                }
                let dates = this.sortDates(arr);
                this.sendedDays = dates;
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
    /** function validate inputs **/
    validateInput(value) {
        let result = false;
        if (value == '' || value == null) {
            result = true;
        }
        return result;
    }
    /** function validate input date **/
    validateInputDate() {
        let result = false;
        this.dateNotification = '';
        if (this.date == null) {
            result = true;
        } else {
            let date = new Date();
            let todayDate = new Date(date.getFullYear(), (date.getMonth() + 1), date.getDate());
            let orderDate = new Date(this.date.getFullYear(), (this.date.getMonth() + 1), this.date.getDate());
            if (orderDate.getTime() < todayDate.getTime()) {
                this.dateNotification = 'Pleas choose another date';
                result = true;
            } else {
                for (let date of this.sendedDays) {
                    if (date.date == orderDate.toDateString() && date.count >= 3) {
                        result = true;
                        this.dateNotification = 'Sorry we can not send in this day, choose another day';
                        break;
                    }
                }
            }
        }
        return result;

    }
    /** function validate credit card input **/
    validateInputCreditCard() {
        this.notice = '';
        let result = false;

        if (this.creditCard.length != 4) {
            result = true;
        } else {
            let regx = /^[0-9]*$/;
            if (!this.creditCard.match(regx)) {
                result = true;
            }
        }
        if (result) {
            this.printNotice('Wrong credit card');
        }
        return result;
    }
    /** function validate form and create new order **/
    order() {
        if (!this.validateForm()) {
            const order = {
                shopping_cart: this.shoppingCart.shoppingCart.result._id,
                total_amount: this.shoppingCart.shoppingCart.totalPrice,
                send_date: this.date,
                credit_card: this.creditCard
            };
            this.createOrder(order);
        }
    }
    /** function create new order and open dialog window for download order recite **/
    createOrder(order) {
        this.apiService.addOrder(order).subscribe(result => {
                if (result != null) {
                    this.openDialog();
                }
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function sort dates in array of object (work like counting sort) **/
    sortDates(arr) {
        let array = [];
        let size = arr.length;
        let count = 1;
        if (size == 1) {
            let date = {
                date: arr[0],
                count: 1
            };
            array.push(date);
        } else if (size > 1) {
            for (let i = 0; i < size; i++) {
                if (arr[i] === arr[i + 1] && i + 1 < size) {
                    count++;
                } else {
                    let date = {
                        date: arr[i],
                        count: count
                    };
                    array.push(date);
                    count = 1;
                }
            }
        }
        return array;
    }
    /** function print notice **/
    printNotice(notice) {
        this.notice = notice;
    }
    /** function open modal window **/
    openDialog(): void {
        this.dialog.open(DialogOrderComponent,
            {
                data: this.shoppingCart
            });
    }
    /** function print errors messages in pop up window **/
    errorsMessage(message): void {
        this.dialog.open(PopUpMessageComponent,
            {
                data: message
            });
    }
    /** function auto fill inputs on double click **/
    getInputData(value) {
        if (value == 'city') {
            this.city = this.user.city;
        } else if (value == 'street') {
            this.street = this.user.street;
        }
    }
}
