import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../api.service';

@Component({
    selector: 'app-dialogmodal',
    templateUrl: './dialog-modal.component.html',
    styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent {
/** private members **/
    private count = 0;
    form: FormGroup = new FormGroup({
        count: new FormControl()
    });
/** constructor **/
    constructor(public dialogRef: MatDialogRef<DialogModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private apiService: ApiService) {
    }

/** function saving new product data and adding to cart **/
    save(data) {
        if (this.form.value.count === null) {
            this.count = 1;
        } else {
            this.count = this.form.value.count;
        }
        const newProduct = {
            user: data.userId,
            product: data.product._id,
            amount: this.count,
            total_price: (data.product.price * this.count)
        };
        this.apiService.addProductToShoppingCart(newProduct);
        this.dialogRef.close(data);
    }
/** function close modal window **/
    close() {
        this.dialogRef.close();
    }
}
