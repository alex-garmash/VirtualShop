import {Component, OnInit} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {PopUpMessageComponent} from '../popupmessage/pop-up-message.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

    token = null;

    constructor(private tokenService: TokenService, private router: Router, public dialog: MatDialog) {
    }

    ngOnInit() {

        this.tokenService.cast.subscribe(
            result => {
                if (result != null) {
                    this.token = result;
                    if (result.user.role === 'Administrator') {
                        this.router.navigate(['/shop']);
                    }
                } else {
                    this.token = null;
                }
            },
            err => {
                console.log('Error: login in nav', err);
                this.errorsMessage('Sorry we have some problems, try latter');
            }
        );
        this.tokenService.get();
    }
/** function log out deleting token in LocalStorage **/
    logOut() {
        this.tokenService.delete();
    }
    /** function print errors messages in pop up window **/
    errorsMessage(message): void {
        this.dialog.open(PopUpMessageComponent,
            {
                data: message
            });
    }
}
