import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';

// to autofill form
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent {

  // ek variable bnaya to store product data to PREFILL form
  // ya to undefined hoga ya fir product type ka hoga
  productData:undefined|product;

  // ek flag liya
  productMessage:undefined|string;

  constructor(private route:ActivatedRoute, private product:ProductService,private http:HttpClient) {}

  ngOnInit():void {

    // route module me dekho vaha humne kaha tha ek id chaiye url ke aage
    let productId=this.route.snapshot.paramMap.get('id');
    console.warn(productId);
    
    // call service and make sure that productId is not NULL
    productId && this.product.getProduct(productId).subscribe((data)=>{
      console.warn(data);

      this.productData=data;
    })
  }

  submit(data:product){
    // check kiya kya mil raha hai
    console.warn(data);

    // id ko forcefully push kiya bcoz error aara tha
    if(this.productData){
      data.id=this.productData.id;
    }

    // pass kiya us data ko API ke andar
    this.product.updateProduct(data).subscribe((result)=>{
      if(result){
        this.productMessage="Product has been Updated";
      }

    });
    setTimeout(()=>{
      this.productMessage=undefined;
    },3000);

  }

}
