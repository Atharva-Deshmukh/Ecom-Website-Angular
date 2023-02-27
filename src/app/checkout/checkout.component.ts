import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { order ,ordersmall} from '../data-type';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  totalPrice:number|undefined;

  constructor(private product:ProductService, private router:Router) {}

  ngOnInit() : void {
    this.product.currentCart().subscribe((result)=>{
      // total 
      let total=0;

      result.forEach((item)=>{

        if(item.quantity){
          // (+ string) -> converts string to numeric value
          total=total+ (+item.price* +item.quantity);
        }
      });
      this.totalPrice=total + (total/10) +(100) -(total/10);

      console.warn(this.totalPrice);
      
    });

  }

  orderNow(data:ordersmall){
    // console.warn(data);

    // now make an object for this data in order to send it properly
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if(this.totalPrice){

      // ek order data naam ka objcet bnaya jisme data ke sab fields honge and rest are added by us
      let orderData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
        id:undefined
      }

      this.product.orderNow(orderData)
      .subscribe((result)=>{
        if(result){
          alert("ORDER HAS BEEN PLACED SUCCESSFULLY!!");

          // redirect to my-orders page now
          this.router.navigate(['/my-orders']);
        }
      });
    }

    
  }

}
