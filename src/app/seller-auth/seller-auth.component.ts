import { Component } from '@angular/core';
import { SignUp } from '../data-type';
import { Login } from '../data-type';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {

  // seller auth component se service ko call kiya apn ne but uske pehle usko constructor me define kiya ek private property ko jiska naam seller rakha maine

  // Router ka bhi instance bnaya
  constructor(private seller:SellerService, private router:Router ) {}

  // parameter define kiya with by default false value
  showLogin=false;
  // ek property bna di for showing errors
  authError:string="";

  /*
  PEHLE YE THA

  // signUp data type is defined in data-type.ts file
  signUp(data: SignUp): void {

    // seller service ke userSignUp() ko call kiya and data pass kiya

    // service calls ek hi jagah se hoti hai but agar service ko subscribe kiya hai to uska data das jagah available hoga. abhi ek jagah pe hi kar rahe hai but baad me garaj padegi
    this.seller.userSignUp(data).subscribe((result)=>{
      
      //jaise hi result aaya tab usko redirect karwao bcoz user usi page pe to nhi hoga signup ke baad. Kuch to naya khulega n
      if(result){
        this.router.navigate(['seller-home']);
      }

    });
    
    AB NEECHEY WALA jisme subscribe hata diya hai
*/

    // signUp data type is defined in data-type.ts file
    signUp(data: SignUp): void {
      console.warn(data);
      // seller service ke userSignUp() ko call kiya and data pass kiya
      this.seller.userSignUp(data);
    }

    openLogin(){
      this.showLogin=true;
    }

    login(data: SignUp): void {

      // variable ko khaali karte jao for next login
      this.authError="";

      // console.warn(data);
      this.seller.userLogin(data);

      // koi bhi parameter chalega subscribe() me
      this.seller.isLoginError.subscribe((isError)=>{

        // show this error in HTML file as well
        if(isError){
          this.authError="Email or Password is NOT correct";
        }

      })
      
    }

    openSignUp(){
      this.showLogin=false;
    }

}
