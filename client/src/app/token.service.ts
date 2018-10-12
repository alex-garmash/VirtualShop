import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpInterceptor} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TokenService implements HttpInterceptor {
    constructor() {
    }

    private key = 'cart_token';
    private tokenService = new BehaviorSubject<any>(null);
    cast = this.tokenService.asObservable();

    set(data: any): void {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
            this.tokenService.next(data);
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }

    get() {
        try {
            // return this.tokenService.next(JSON.parse(localStorage.getItem(this.key)));
             this.tokenService.next(JSON.parse(localStorage.getItem(this.key)));
             return (JSON.parse(localStorage.getItem(this.key)));
        } catch (e) {
            console.error('Error getting data from localStorage', e);
            return null;
        }
    }

    delete() {
        try {
            localStorage.removeItem(this.key);
            this.tokenService.next(null);
        } catch (e) {
            console.error('Error deleting data from localStorage', e);
            return null;
        }
    }

    intercept(req, next) {
        const tokenFromStarage = this.get();
        if (tokenFromStarage != null) {
            const token = tokenFromStarage.token;
            const tokenizedReg = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(tokenizedReg);
        } else {
            return next.handle(req);
        }
    }
}
