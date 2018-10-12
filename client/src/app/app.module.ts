import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {FooterComponent} from './footer/footer.component';
import {NavigationBarComponent} from './navbar/navigation-bar.component';
import {ContainerComponent} from './container/container.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {MainComponent} from './main/main.component';
import {ApiService} from './api.service';
import {InfoComponent} from './info/info.component';
import {ShoppingcartComponent} from './shoppingcart/shoppingcart.component';
import {TokenService} from './token.service';
import {MatDialogModule, MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DialogModalComponent } from './dialogmodal/dialog-modal.component';
import { OrdersComponent } from './orders/orders.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import { DialogOrderComponent } from './dialogorder/dialogorder.component';
import { PopUpMessageComponent } from './popupmessage/pop-up-message.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavigationBarComponent,
    ContainerComponent,
    LoginComponent,
    RegistrationComponent,
    MainComponent,
    InfoComponent,
    ShoppingcartComponent,
    DialogModalComponent,
    OrdersComponent,
    DialogOrderComponent,
    PopUpMessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    AppRoutingModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule
  ],
  providers: [ApiService, {
    provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
  }],
  bootstrap: [AppComponent],
    entryComponents: [DialogModalComponent, DialogOrderComponent, PopUpMessageComponent]
})
export class AppModule {
}
