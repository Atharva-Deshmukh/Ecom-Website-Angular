import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // ek type bnaya for checking ki hum seller pe hai ya user pe. THIS will be used for conditions on HTML page
  menuType:string="default";

  // another property for seller name & user name
  sellerName:string="";
  userName:string="";

  // property for auto Suggestion data storing
  searchedResult:undefined|product[];

  // keeps track of number of items in the cart. Displayed in cart() [[top right]].
  // Data in it comes from local storage
  cartItems=0;

  constructor(private router:Router, private product:ProductService) {}

  ngOnInit():void {

    // kabhi bhi agar router ke event me change aata hai to uski value subscribe ke andar milegi hume. Hume hum exactly konse route pe hai vo pta karna hai
    this.router.events.subscribe((val:any)=>{

      //ye value kabhi NULL/undefined nhi honi chaiye

      if(val.url){

        // isse url likha hua aayga
        // console.warn(val.url);

        // check if existing user logged in and check ki url me kahi seller likha hai kya which means hum seller page pe hai
        if(localStorage.getItem('seller') && val.url.includes('seller')){
          console.warn("In seller area now");

          // us variable ko seller bna lo
          this.menuType="seller";

          // check if local storage has data
          if(localStorage.getItem('seller')){
            let sellerStore=localStorage.getItem('seller');

            // check if that data is empty and convert it to json from string
            let sellerData=sellerStore && JSON.parse(sellerStore)[0]; //0th index pe hoga

            // print it in HTML part now
            this.sellerName=sellerData.name;
          }
        }
        // local storage me agar user hai matlab user logged in hai bcoz logout ke time user remove ho jaata hai local storage se
        else if(localStorage.getItem('user')){
          let userStore=localStorage.getItem('user'); //this data is in stringify format
          console.warn("UserStore --> "+ userStore);

          let userData=userStore && JSON.parse(userStore);
          console.warn("UserData --> "+ userData);

          //get user's name as we have to display that on login screen top right
          this.userName=userData.name;
          console.warn("User name --> "+ this.userName);

          // Ab menu bhi change karwaa lo as ye user hai abhi
          this.menuType="user";

          this.product.getCartList(userData.id);
        }
        else{
          console.warn("Outside seller area now");

          // Ab menu bhi change karwaa lo as ye user hai abhi
          this.menuType="default";
        }
      }

    });

// //////////CART WALA PART

    //to check if add to cart is pressed. It gets stored under localCart key
    let cartData=localStorage.getItem('localCart');

    // agar vo khali nhi hai
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }

    // subscribing event emitter of product services
    this.product.cartData.subscribe((items)=>{
      this.cartItems=items.length;
    });

  }

  
  //For seller logout
  sellerLogout(){
  // local storage khali karo. Inspect me application me jao and goto local storage. Login ke baad vaha data hota hai key me usko khali karna hoga
    localStorage.removeItem('seller');

  // redirect to home
  this.router.navigate(['home']);

  }

  //For user logout
  userLogout(){

    // local storage khali karo. Inspect me application me jao and goto local storage. Login ke baad vaha data hota hai key me usko khali karna hoga
    localStorage.removeItem('user');

    // redirect to home
    this.router.navigate(['home']);

    // logout hone ke baad cart me us user ke values bach jaare
    // cart bhi update karo. emit a empty value
    this.product.cartData.emit([]);

  }

  // Applying AUTOSERACH

  // query ya data likha to bhi chalega
  searchedProduct(query:KeyboardEvent){
    if(query){

      // keyboard se jo type kiya usko capture kiya and element me store kiya and Pass this value to API
      const element=query.target as HTMLInputElement;
      // console.warn(element.value);

      this.product.searchProducts(element.value).subscribe((result)=>{
        // console.warn(result);

        //fix length of result
        if(result.length>5){
          result.length=5;
        }

        this.searchedResult=result;
      });
    }
  }

  hideSearch(){
    this.searchedResult=undefined;
  }

  // get value of search and then redirect to our desired product
  submitSearch(val:string){
    // console.warn(val);

    // redirect karwaaya hamne yaha pe isko
    this.router.navigate([`search/${val}`]); //searches values we entered. URL dekhna submit hone ke baad, URL changes
  }

  //autogesstions me se redirect hone wala function
  redirectToDetails(id:number){
    this.router.navigate(['/details/'+id])
  }

}
