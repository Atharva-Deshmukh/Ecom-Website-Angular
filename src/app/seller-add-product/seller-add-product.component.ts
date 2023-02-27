import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  addProductMessage:string|undefined;

  // maine define kiya to call service here
  constructor(private http:HttpClient, private product:ProductService) {}

  submit(data:product){
    console.warn(data);
    this.product.addProduct(data).subscribe((result)=>{
      console.warn(result);

      if(result){

        // display it for some time using settimeout()
        this.addProductMessage="Product added successfully";
      }

      setTimeout(()=>this.addProductMessage=undefined,3000);
      
    });
  }

}
