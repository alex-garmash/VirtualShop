import {Component, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {MatDialog} from '@angular/material';
import {DialogModalComponent} from '../dialogmodal/dialog-modal.component';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';

@Component({
    selector: 'app-shoppingcart',
    templateUrl: './shoppingcart.component.html',
    styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {
    /** members **/
    token: any = null;
    notice: any = '';
    product = {
        productId: null,
        productName: '',
        productPrice: '',
        productPicture: '',
        productCategoryName: '',
        productCategoryId: ''
    };
    previewImage: any = '';
    selectedFile: File = null;
    categories: any = null;
    products: any = null;
    user: any = null;
    hidenBar: Boolean = false;
    shoppingCart = null;
    search: any = '';
    edit: Boolean = false;
    /** constructor **/
    constructor(private tokenService: TokenService,
                private router: Router,
                private apiService: ApiService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.tokenService.cast.subscribe(
            result => {
                // console.log('token', result);
                if (result != null) {
                    this.token = result.token;
                    this.user = result.user;
                    this.apiService.getShoppingCart(this.user.id);
                    this.apiService.getCategories();
                    this.apiService.getProducts();
                    this.getProducts();
                    this.getShoppingCart();
                    this.getCategories();
                    this.getProduct();
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

    /** function subscribe on shopping cart event **/
    getShoppingCart() {
        this.apiService.castShoppingCart.subscribe(result => {
            if (result != null) {
                this.shoppingCart = result;
            } else {
                this.shoppingCart = null;
            }
        });
    }
    /** function show/hide cart **/
    hideBar(arrow) {
        if (!arrow) {
            this.hidenBar = false;
        } else {
            this.hidenBar = true;
        }
        console.log('arrow', this.hidenBar);

    }
    /** function filtering products by name of product category **/
    filterCategory(name) {
        this.apiService.getProductsByCategoryName(name).subscribe(res => {
            this.products = res;
        },
            errors => {
                this.errorsMessage('Sorry we have some problems, try latter');
                console.log(errors);
            });
    }
    /** function open dialog window with choose amount of item **/
    openDialog(product): void {
        this.dialog.open(DialogModalComponent,
            {
                data: product
            });
    }
    /** function subscribe on all products event **/
    getProducts() {
        this.apiService.castProducts
            .subscribe(
                result => {
                    if (result != null) {
                        this.products = result;
                    }
                },
                error => {
                    console.log(error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
    }
    /** function get all categories **/
    getCategories() {
        this.apiService.castCategories.subscribe(res => {
            this.categories = res;
        },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function get product **/
    getProductById(id) {
        this.apiService.getProduct(id);
    }
    /** function subscribe on product event**/
    getProduct() {
        this.apiService.castProduct
            .subscribe(
                result => {
                    if (result != null) {
                        this.product.productId = result._id;
                        this.product.productCategoryName = result.category.name;
                        this.product.productName = result.name;
                        this.product.productPrice = result.price;
                        this.product.productPicture = result.url_img;
                        this.product.productCategoryId = result.category._id;
                        this.previewImage = '';
                        this.selectedFile = null;
                    }
                },
                error => {
                    console.log(error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
    }
    /** function remove item from shopping cart **/
    removeItem(itemId, shoppingCartId) {
        this.apiService.deleteCartItem(itemId)
            .subscribe(
                result => {
                    if (result != null) {
                        this.apiService.getShoppingCart(this.user.id);
                        if ((this.shoppingCart.cartItems.length - 1) === 0) {
                            this.apiService.deleteShoppingCart(shoppingCartId);
                            // this.apiService.getShoppingCart(this.user.id);
                        }
                    }
                },
                error => {
                    console.log(error);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
    }
    /** function get file from form and check if it's picture valid **/
    readPicture(event: any) {
        this.notice = '';
        const fileSizeSupported = 5000000;
        const imageSupported = ['jpeg', 'jpg', 'gif', 'png'];
        const file = event.target.files[0];
        const fileName = file.name.split('.')[1];
        const errors = [];
        const fileSize = file.size;
        if (event.target.files && file) {
            if (fileSize <= fileSizeSupported) {
                if (imageSupported.includes(fileName)) {
                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        this.previewImage = event.target.result;
                    };
                    this.selectedFile = event.target.files[0];
                    reader.readAsDataURL(event.target.files[0]);
                } else {
                    errors.push('Image format not supported');
                }
            } else {
                errors.push('Image size too big');
            }
        }
        if (errors.length > 0) {
            this.notice = 'Error: ' + errors.join(',');
        }
    }
    /** function search product by name **/
    searchProducts() {
        if (this.search !== '') {
            this.apiService.searchProducts(this.search).subscribe(
                result => {
                    if (result != null) {
                        this.products = result;
                    }
                },
                errors => {
                    console.log(errors);
                    this.errorsMessage('Sorry we have some problems, try latter');
                }
            );
        }
    }
    /** Administrator functions **/
    /** function creating new product **/
    createNewProduct() {
        if (!this.validateForm()) {
            const fd = new FormData();
            fd.append('url_img', this.selectedFile, this.selectedFile.name);
            const newProduct = {
                name: this.product.productName,
                price: this.product.productPrice,
                category: this.product.productCategoryName
            };
            fd.append('product', JSON.stringify(newProduct));
            this.apiService.addProduct(fd);
            // this.ProductResetFields();
        }
    }
    /** function edit product **/
    editProduct() {
        console.log(this.product.productPicture);
        if (!this.validateForm()) {
            const fd2 = new FormData();
            fd2.append('url_img', this.selectedFile, this.selectedFile.name);
            const editProduct = {
                id: this.product.productId,
                name: this.product.productName,
                price: this.product.productPrice,
                url_img: this.product.productPicture,
                category: {
                    _id: this.product.productCategoryId,
                    name: this.product.productCategoryName
                }
            };
            fd2.append('product', JSON.stringify(editProduct));
            this.apiService.editProduct(fd2);
        }
    }
    /** function reset input fields **/
    ProductResetFields() {
        this.product = {
            productId: null,
            productName: '',
            productPrice: '',
            productPicture: '',
            productCategoryName: '',
            productCategoryId: ''
        };
        this.previewImage = 'http://localhost:3000/api/uploads/no-thumb.png';
    }

    /** Validations **/
    /** function validate form **/
    validateForm() {
        let errors = false;
        this.notice = '';
        const err = [];
        if (!this.validateInputs(this.product.productName)) {
            err.push('Name');
        }
        if (!this.validateInputs(this.product.productPrice)) {
            err.push('Price');
        }
        if (!this.selectedFile) {
            err.push('Picture');
        }
        if (!this.validateInputs(this.product.productCategoryName)) {
            err.push('Category');
        }
        if (err.length > 0) {
            this.notice = 'Missing: ' + err.join(',');
            errors = true;
        } else {
            errors = false;
        }
        return errors;
    }
    /** function validate inputs **/
    validateInputs(value) {
        let answer = true;
        if (value === '') {
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
