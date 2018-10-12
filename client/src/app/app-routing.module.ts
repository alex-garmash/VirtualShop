import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ContainerComponent} from './container/container.component';
import {MainComponent} from './main/main.component';

import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {ShoppingcartComponent} from './shoppingcart/shoppingcart.component';
import {OrdersComponent} from './orders/orders.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', component: ContainerComponent},
      {path: '', component: LoginComponent},
      {path: '', component: RegistrationComponent}
    ]
  },
    {
        path: 'shop',
        component: ShoppingcartComponent,
    },
  {
    path: 'registration',
    component: RegistrationComponent
  },
    {
        path: 'order',
        component: OrdersComponent
    },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
