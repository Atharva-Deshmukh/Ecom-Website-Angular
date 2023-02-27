import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SellerService } from './services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // isSellerLoggedIn ko use karne liye ek constructor laana hoga so that I can import it
  constructor(private sellerService:SellerService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // agar seller ka data pehele hi hai to login karwao
      if(localStorage.getItem('seller')){return true;}

      // yaha lagi condition jo agar true rahi to true return hoga and voce versa
    return this.sellerService.isSellerLoggedIn;

    // Ye bas allow karega. Ab isko redirect bhi karna hoga hume
  }
  
}
