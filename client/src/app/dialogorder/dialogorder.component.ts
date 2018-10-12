import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as jsPDF from 'jspdf';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';

@Component({
    selector: 'app-dialogorder',
    templateUrl: './dialogorder.component.html',
    styleUrls: ['./dialogorder.component.css']
})
export class DialogOrderComponent implements OnInit {
    shoppingCart = null;
/** constructor **/
    constructor(public dialogRef: MatDialogRef<DialogOrderComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private apiService: ApiService) {
    }

    ngOnInit() {
        this.shoppingCart = this.data;
    }
/** function download order as PDF **/
    downloadOrderPdf() {
        let doc = new jsPDF();
        let y = 10;
        let text = 20;
        let counter = 0;
        let receipt = new Date().getTime().toString();

        for (let item of this.shoppingCart.cartItems) {
            if (counter == 0) {
                doc.text(20, 20, 'Your Order Receipt Number: ' + receipt);
                y = 30;
            }
            counter++;
            if (counter < 7) {
                doc.text(text, y, 'Product Name: ' + item.product.name);
                doc.text(text, (y + 10), 'Price: ' + item.product.price.toString());
                doc.text(text, (y + 20), 'Amount: ' + item.amount.toString());
            }
            y += 40;
            if (counter == 8) {
                doc.addPage();
                counter = 0;
                y = 10;
            }
        }
        doc.addPage();
        doc.text(20, 20, 'Your Order Receipt Number: ' + receipt);
        doc.text(20, 30, 'Total Price is: ' + this.shoppingCart.shoppingCart.totalPrice.toString() + '$');
        doc.text(20, 40, 'Thank You For Buying');
        doc.text(20, 50, 'Have a good day :)');
        doc.save('Order.pdf');
    }
/** function change shopping cart from active to not active, navigate to shop page, and close modal window **/
    ok() {
        this.apiService.deactiveShoppingCart(this.shoppingCart.shoppingCart.result._id);
        this.apiService.getActiveShoppingCart(this.shoppingCart.shoppingCart.result._id);
        this.router.navigate(['/shop']);
        this.close();
    }
/** function close modal window **/
    close() {
        this.dialogRef.close();
    }
}
