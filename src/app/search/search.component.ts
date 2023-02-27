import { Component, OnInit} from '@angular/core';

// import a service of angular to get URL of the route
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searchResult:undefined|product[];

constructor(private activeRoute:ActivatedRoute, private product:ProductService) {}

ngOnInit():void{

  // getting URL's query part. Recall that in routing module, we gave URL of search component as search/:query. We want only that query part of URL and from that part we will search our product
  let query=this.activeRoute.snapshot.paramMap.get('query'); 
  // console.warn(query);

  // ensure query NULL na ho. Call API now to pass this query and get desired result
  query && this.product.searchProducts(query).subscribe((result)=>{
    this.searchResult=result;

  });
}

}
