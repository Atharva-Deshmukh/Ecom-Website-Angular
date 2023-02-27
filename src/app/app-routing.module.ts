import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';
import { SearchComponent } from './search/search.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  // objects bnaye humne and then gave path and component to load with that path
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'seller-auth',
    component:SellerAuthComponent,

  },
  // ye ek route bna abhi and ab iske upar redirect karwaana padega
  {
    component: SellerHomeComponent,
    path: 'seller-home',

    //for user authentication (AuthGuard ke liye)
    canActivate:[AuthGuard]
  },
  {
    component:SellerAddProductComponent,
    path:'seller-add-product',
    //for user authentication (AuthGuard ke liye)
    canActivate:[AuthGuard]
  },
  {
    component:SellerUpdateProductComponent,
    path:'seller-update-product/:id', //ek id bhi aaygi baadme usko pehle hi bta do

    //for user authentication (AuthGuard ke liye)
    canActivate:[AuthGuard]
  },
  {
    component:SearchComponent,
    path: 'search/:query' //kuch bhi search kar sakte ho jaise price,color, hence we write query/id
  },
  {
    component:ProductDetailsComponent,
    path:'details/:productId'
  },
  {
    component:UserAuthComponent,
    path:'user-auth'
  },
  {
    component:CartPageComponent,
    path: 'cart-page'
  },
  {
    component:CheckoutComponent,
    path: 'checkout'
  },
  {
    component:MyOrdersComponent,
    path: 'my-orders'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
