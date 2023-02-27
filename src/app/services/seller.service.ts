import { EventEmitter, Injectable } from '@angular/core';

// http se call karne ke liye (api ke liye) ye import karna hota hai
// ye directly use nhi kar sakte, iska pehle instance bnana padta hai constructor me
import {HttpClient} from '@angular/common/http';
import { SignUp } from '../data-type';
import { Login } from '../data-type';
import { ResourceLoader } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class SellerService {

// for applying redirect logic.Agar true goga guard ka value to redirect hoga varna agar false hoga to ni hoga. HUm yaha se authgyard ke true false ko control karke change karenge. Import it in auth-guard.ts
isSellerLoggedIn=new BehaviorSubject<boolean>(false);

// ye ek event emitter hai that will be used when login fails
isLoginError=new EventEmitter<boolean>(false);


  // naam http rakho ye jaruri nhi and http ka ek instance bnaya humne sabse pehle
  constructor(private http:HttpClient, private router:Router) { }

  // Services can be used to store API calls or just store helper functions

  //data: any tha pehle par vo datatype baad me problem dega hence humne ek datatype naam ki separate file bnayi and usi me is datatype ko import kiya (just like a flobal variable)

  userSignUp(data:SignUp){

    this.http.post('http://localhost:3000/seller', data, {observe:'response'}).subscribe((result)=>{

    // data bhejne ke baad(After signUp) usko true kiya, then authguard value gets true and it allows us to go. Now redirect
      this.isSellerLoggedIn.next(true);

    // reload karne pe wapis home me dhakal raha hai. For this reason, I need  to store data locally. 
    localStorage.setItem('seller',JSON.stringify(result.body))
    
    // Ab yaha se redirect karna padega jiske liye router lagega
      this.router.navigate(['seller-home']);
    });
    
  }

  reloadSeller(){
    if(localStorage.getItem('seller')){
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
  

  userLogin(data:Login){

    // for warning purpose
    console.warn(data);

    //API call 

    // calling get API here
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,{observe:'response'}
    ).subscribe((result:any)=>{
      console.warn(result);

      // console me jaake body dekho and if anything matches with already exixting users, it comes in body as Array(1) or something, this means user exist karta hai.Nahi to new user ke liye body empty hogi
      if(result && result.body && result.body.length){
        console.warn("user LOGGED IN");

        //data ko set karo and redirect karwaao
        localStorage.setItem('seller',JSON.stringify(result.body))
        this.router.navigate(['seller-home']);
      }
      else{
        console.warn("login FAILED!");
        this.isLoginError.emit(true);
      }
    })
  }
}