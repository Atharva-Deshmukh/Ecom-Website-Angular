import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  
  // fetched from URL's id
  productData:undefined|product;

  // vo - + wala dabba handle karne ke liye
  productQuantity:number=1;

  // to remove CART items
  removeCart=false;

  cartData:product|undefined;

  // activated route isliye taaki URL link ke upar se apan id nikal sake and using that id we will display product corresponding to that id on html page
  constructor(private activeRoute:ActivatedRoute, private product:ProductService) {}

  ngOnInit():void{
    
    // getting product id from URL itself. Recall, in the URL in routing module, we have given productId in its URL. We are just fetching that
    let productId=this.activeRoute.snapshot.paramMap.get('productId');
    // console.warn(productId);

    // based on above got product id, call API to get product details corresponsing to that id. Make sure id is not blank
    productId && this.product.getProduct(productId).subscribe((result)=>{
      // console.warn(result);

      // store product data in the variable and pass it on to API
      this.productData=result;

      //Remove cart option ka part
      let cartData=localStorage.getItem('localCart');
      if(productId && cartData){
        let items=JSON.parse(cartData);

        // agar vo productId already hai items[] me hai to remove from cart ka option dikhao
        // filter() is used to get values of keys of any keys of object
        // here in local storage we had object stored as items and we needed to find ki same id wala koi product exist karra ky usme. Karra to remove cart ka option dikhao us repeated product ke liye
        // item naam ki ek key bna li apn ne
        items=items.filter((item:product)=>productId==item.id.toString());
        if(items.length){
          this.removeCart=true;
        }
        else{
          this.removeCart=false;
        }

      }

      let user=localStorage.getItem('user');

      // agar user undefined nhi hai means vo logged in hai
      if(user){
        let userId=user && JSON.parse(user).id;
        // taaki refresh hone ke baad list firse update ho jaaye
        this.product.getCartList(userId);

        // subscribe karne se data update ho jaat hai jaha jaha uski jarurat hoti hai
        this.product.cartData.subscribe((result)=>{
          
            // item ki id database ke productId se match honi chaiye
            // jitne bhi items db se match karenge unki list
            // productId? means agar vo NULL nhi hai ya undefined nhi hai to
            let item=result.filter((item:product) => productId?.toString()===item.productId?.toString());
            
            if(item.length){

              // item[] ke andar hmara user ke corresponding cart hai usko store kiya for remove cart function later
              this.cartData=item[0];
              this.removeCart=true;
            }
        })
      }

    });


  }

  handleQuantity(val:string){
    if(this.productQuantity<20 && val==='plus'){
      this.productQuantity+=1;
    }else if(this.productQuantity>1 && val==='min'){
      this.productQuantity-=1;
    }

  }

  // Jitni exixting quanitity hai usme aur add kardo
  AddToCart(){
    // agar product ka data hai. yaani API thik se chal raha hai to
    if(this.productData){

      // us box me jo number hai vo us product ki quantity property me add karo
      this.productData.quantity=this.productQuantity;

      // check if user is logged in or not
      //agar logged in nhi hai to
      if(!localStorage.getItem('user')){
        // console.warn(this.productData);
        this.product.localAddToCart(this.productData);

        // turant vaha remove ka bhi option leke aao
        this.removeCart=true;
      }

      // USER LOGGED IN HAI TO
      else{
        // get id of the user from user who is logged in
        let user=localStorage.getItem('user');
        let userId=user && JSON.parse(user).id;
        // console.warn(userId);

        // now get cart data by making its object
        
        // Objects in typescript
        /*
        var object_name = { 
          key1: “value1”, //scalar value 
          key2: “value”,  
          key3: function() {
             //functions 
          }, 
          key4:[“content1”, “content2”] //collection  
       };
       */
       
        let cartData:cart={
          ...this.productData,
          userId,
          productId:this.productData.id,
          }

          // id se confuse hora tha hence cart ka interface bnaya datatypes.ts me and usme id ko productId me badal diya and id ko delete kar diya
          delete cartData.id;
         
          // now call an API and send this data on API. make cart[] in db.json file

          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){

              //alert se ek box aata hai as a popup on the webpage
              alert('Product Added to cart');
              this.product.getCartList(userId);

              this.removeCart=true;
            }
          });

      }
      
    }

  }

  RemoveFromCart(productId:number){

    // check if user is logged in or not
      //agar logged in nhi hai to local storage se udaao
      if(!localStorage.getItem('user')){
        this.product.removeItemFromCart(productId);
    }
    // agar user logged in hai to API call karo
    else{
      let user=localStorage.getItem('user');
      let userId=user && JSON.parse(user).id;

      // send this cartData to API
      console.warn(this.cartData);
      this.cartData && this.product.removeFromCart(this.cartData.id)
      .subscribe((result)=>{
        if(result){
          // call another API to update cart
          this.product.getCartList(userId);

        }
      });
    }
    // turant vaha add ka bhi option leke aao
    this.removeCart=false;
}
}
