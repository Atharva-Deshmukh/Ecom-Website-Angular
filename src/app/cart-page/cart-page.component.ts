import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {

  cartData:cart[]|undefined;
  priceSummary:priceSummary={
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0
  };

  constructor(private product:ProductService, private router:Router) {}

  ngOnInit(): void {
    this.product.currentCart().subscribe((result)=>{
      // console.warn(result);

      this.cartData=result;

      // total 
      let total=0;

      result.forEach((item)=>{

        if(item.quantity){
          // (+ string) -> converts string to numeric value
          total=total+ (+item.price* +item.quantity);
        }
      });
      this.priceSummary.price=total;
      this.priceSummary.discount=total/10;
      this.priceSummary.tax=total/10;
      this.priceSummary.delivery=100;
      this.priceSummary.total = this.priceSummary.tax + this.priceSummary.delivery - this.priceSummary.discount +  this.priceSummary.price;

      console.warn(this.priceSummary);
    });
  }

  checkout(){
    this.router.navigate(['checkout']);
  }

}
