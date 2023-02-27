/*
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  productMessage: undefined | string;
  icon = faTrash;
  iconEdit=faEdit;
  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.list();
  }

  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is deleted';

        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  list() {
    this.product.productList().subscribe((result) => {
      if (result) {
        this.productList = result;
      }
    });
  }
}
*/

import { Component, OnInit} from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

// installed font awesome package for this [DELETE ICON hai ye]
import { faTrash, faEdit} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent {

  // ek property bnai humne to list product
  productList:undefined|product[];

  // ek property bnai humne to display message
  productMessage:undefined|string;

  // using font awesome icons now
  icon=faTrash;
  editIcon=faEdit;



  constructor(private product:ProductService) {}

  ngOnInit(): void {
    this.list(); //function defined below bcoz same code was being used again and again
  }

  // function to delete product
  deleteProduct(id:number){
    console.warn("test id ->",id);

    // call product service here to delete API
    this.product.deleteProduct(id).subscribe((result)=>{
      if(result){
        this.productMessage="Product Deleted!";

        // Update the table now
        this.list();
      }
    })

    setTimeout(()=>{
      this.productMessage=undefined;
    },3000);
  }

  list(){
    this.product.productList().subscribe((result)=>{
      console.warn(result);

      this.productList=result;
    })
  }
}
