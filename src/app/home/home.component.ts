import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router'; 
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // ye default carousal ki images thi
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  // declaring a property for displaying popular products
  popularProducts:undefined|product[];

  // declaring a property for displaying trendy products
  trendyProducts:undefined|product[];

  constructor(private product:ProductService) {}

  ngOnInit():void{

    // calling service here to get most popular products (limit is set to 4)
    this.product.popularProducts().subscribe((data)=>{

      // Just to check ki data aaya ya nhi
      // console.warn(data);

      // store them in the variable/property declared above
      this.popularProducts=data;

      // now plot this data in HTML
    });

    // calling service here to get trendy products (limit is set to 6)
    this.product.trendyProducts().subscribe((data)=>{
      // store them in the variable/property declared above
      
      this.trendyProducts=data;

    });
  }

}
