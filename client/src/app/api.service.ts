import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {PopUpMessageComponent} from './popupmessage/pop-up-message.component';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    /** private members **/
    private Endpoint = 'http://localhost:3000/api/';
    private products = new BehaviorSubject<any>(null);
    private product = new BehaviorSubject<any>(null);
    private categories = new BehaviorSubject<any>(null);
    private shoppingCart = new BehaviorSubject<any>(null);
    private activeShoppingCart = new BehaviorSubject<any>(null);
    /** observables **/
    castActiveShoppingCart = this.activeShoppingCart.asObservable();
    castShoppingCart = this.shoppingCart.asObservable();
    castCategories = this.categories.asObservable();
    castProducts = this.products.asObservable();
    castProduct = this.product.asObservable();

    /** constructor **/
    constructor(private http: HttpClient, public dialog: MatDialog) {
    }
    /** function get list of cities **/
    getCities() {
        return this.http.get<any>(`${this.Endpoint}cities`);
    }
    /** function edit product **/
    editProduct(editProduct) {
        this.http.put<any>(`${this.Endpoint}products`, editProduct).subscribe(res => {
                this.getProducts();
                this.getCategories();
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function get active shopping cart and subscribe on event **/
    getActiveShoppingCart(id) {
        this.http.post<any>(`${this.Endpoint}shoppingcarts/get/active`, {id: id}).subscribe(
            result => {
                if (result != null) {
                    this.activeShoppingCart.next(result.result);
                } else {
                    this.activeShoppingCart.next(null);
                }
            },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
    /** function get product by product id and subscribe on event **/
    getProduct(id) {
        this.http.get<any>(`${this.Endpoint}products/id/${id}`).subscribe(result => {
                this.product.next(result);
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function return list of product by category **/
    getProductsByCategoryName(name) {
        return this.http.get<any>(`${this.Endpoint}products/name/${name}`);
    }
    /** function add product to shopping cart **/
    addProductToShoppingCart(product) {
        this.http.post<any>(`${this.Endpoint}cartitems`, product).subscribe(result => {
            if (result != null) {
                this.getActiveShoppingCart(product.user);
                this.getShoppingCart(product.user);
            }
        },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** get shopping car by user id **/
    getShoppingCart(userId) {
        this.http.post<any>(`${this.Endpoint}shoppingcarts/get/active`, {id: userId}).subscribe(result => {
            if (result != null) {
                let shoppingCart = result;
                this.getAllCartItemsFromShoppingCartByUserId(userId).subscribe(
                    res => {
                        // console.log('getShoppingCart', res);
                        if (res != null) {
                            let cartItems = res;
                            let sum = 0;
                            for (let item of res) {
                                sum += item.total_price;
                            }
                            shoppingCart.totalPrice = sum;

                            let newCart = {
                                shoppingCart: shoppingCart,
                                cartItems: cartItems
                            };

                            this.shoppingCart.next(newCart);
                        }
                    },
                    error => {
                        console.log(error);
                        this.errorsMessage('Sorry we have some problems, try latter');
                    }
                );
            } else {
                this.shoppingCart.next(null);
            }
        },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function return all item in shopping cart by user id **/
    getAllCartItemsFromShoppingCartByUserId(userId) {
        return this.http.post<any>(`${this.Endpoint}cartitems/active`, {id: userId});
    }
    /** function change active shopping cart to not active **/
    deactiveShoppingCart(id) {
        return this.http.put<any>(`${this.Endpoint}shoppingcarts/${id}`, {'active': 'false'}).subscribe(
            result => {
                if (result != null) {
                    this.shoppingCart.next(null);
                }
            },
            errors => {
                console.log(errors);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
    /** function add new product to DB **/
    addProduct(newProduct) {
        return this.http.post<any>(`${this.Endpoint}products`, newProduct).subscribe(res => {
                if (res != null) {
                    this.getProducts();
                    this.getCategories();
                }
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            });
    }
    /** function get all products from DB **/
    getProducts() {
        this.http.get<any>(`${this.Endpoint}products`).subscribe(
            result => {
                this.products.next(result);
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
    /** function return total products count from DB **/
    getTotalProducts() {
        return this.http.get<any>(`${this.Endpoint}products/totalproducts`);
    }
    /** function return total orders count from DB **/
    getTotalOrders() {
        return this.http.get<any>(`${this.Endpoint}orders/totalorders`);
    }
    /** function get all categories from DB **/
    getCategories() {
        this.http.get<any>(`${this.Endpoint}categories`).subscribe(
            result => {
                this.categories.next(result);
            },
            error => {
                console.log(error);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
    }
    /** function adding new order to DB **/
    addOrder(order) {
        return this.http.post<any>(`${this.Endpoint}orders`, order);
    }
    /** function delete cart item by id from DB **/
    deleteCartItem(id) {
        return this.http.delete<any>(`${this.Endpoint}cartitems/${id}`);
    }
    /** function return list of all ordered dates **/
    getAllOrdersDates() {
        return this.http.get<any>(`${this.Endpoint}orders/dates`);
    }
    /** function search product by name **/
    searchProducts(name) {
        return this.http.get<any>(`${this.Endpoint}products/search/${name}`);
    }
    /** function return orders of user **/
    getOrdersByUserId(id) {
        return this.http.get<any>(`${this.Endpoint}orders/user/${id}`);
    }
    /** function deleting shopping cart by id from DB **/
    deleteShoppingCart(id) {
        return this.http.delete<any>(`${this.Endpoint}shoppingcarts/${id}`).subscribe(
            result => {
                // console.log('shopping cart removed', result);
            },
            errors => {
                console.log(errors);
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
