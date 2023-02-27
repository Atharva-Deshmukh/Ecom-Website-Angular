import { Component ,OnInit} from '@angular/core';
import { cart, Login, product, SignUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  //to toggle between userLogin and userSignUp form
  showLogin:boolean=true;

  // to show errors in LOGGING IN
  authError:string="";

  // make instance of the service defined in services folder before using it.
  constructor(private user:UserService, private product:ProductService) {}

  ngOnInit():void{
    this.user.userAuthReload();
  }

  signUp(data: SignUp) {
    // console.warn(data);
    this.user.userSignUp(data);
  }

  login(data: Login){
    this.user.userLogin(data);

    this.user.InValiduserAuth.subscribe((result)=>{
      // if value is true means user is INVALID
      if(result){
        this.authError="Please enter VALID credentials";
      }
      // us user ke corresponsing ek cart bhi bnao
      else{
        this.localCartToRemoteCart();
      }
    })
  }

  openSignUp(){
    this.showLogin=false;
  }

  openLogin(){
    this.showLogin=true;

  }

  localCartToRemoteCart(){
    let data = localStorage.getItem("localCart");

    let user = localStorage.getItem("user");
    let userId=user && JSON.parse(user).id;
    
    // Agar cart me atleast kuch to hai
    if(data){

      // user ko get karo, parse karke id nikaalo
      let cartDataList:product[]=JSON.parse(data);

      cartDataList.forEach((product:product,index) => {

        // ek cart object bnaya
        let cartData: cart={
          ...product,   
          productId:product.id,
          userId,
        };

        // since cart wala data apni id khud bnayga
        delete cartData.id;

       setTimeout(() => {

        // agar koi normal programming language hoti to ye code bhakaabhak load hota lekin JSON server weak hai hence kabhi kabhi error dega agar itni fastly data load kiya to. Hence thode thode time baad data do to prevent errors
        this.product.addToCart(cartData).subscribe((result)=> {
          if(result){
            console.warn("Items stored in DB! ",);
          }
        });

        // ab local storage bhi khaali karna hai

        // index + 1 yaani sabse last item aa chuka hai
        if(cartDataList.length===index+1){
          localStorage.removeItem("localCart");
        }
       }, 500);

      });
    }


    // again use set time out here so that multiple APIs don't hit together
    setTimeout(() => {
      
      // ab user specific cart nikalo
      this.product.getCartList(userId);

    }, 2000);



  }


}
