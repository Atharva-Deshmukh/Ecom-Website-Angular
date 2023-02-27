import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Login, SignUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // event emitter to carry errors. Acts as a flag. GET THIS EMITTER IN userAuth file
  InValiduserAuth=new EventEmitter<boolean>(false);

  constructor(private http:HttpClient, private router:Router) { }

  // User se data lengi ye service sign up ke time and then it calls API to put data on server.But to use that service we need to create instance of HTTP client
  userSignUp(user: SignUp){
    // console.warn(user);

    // has 3 things, URL, object that is being sent and then if we have to check its response here itsef, we use observer. [[//.subscribe next line me likha]] 
    this.http.post("http://localhost:3000/users",user,{observe:'response'})
    .subscribe((result)=>{
      // console.warn(result);

      // this data has header and body in it but we need to store only body hence this data needs to be stringified and then stored in local storage. 
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));

        //now redirect it to home
        this.router.navigate(['/']);
      }
    })

  }

  //URL ko dynamic bnaake apn ne login kiya. Sabse pehle to aise hi ek random user ko access karke dekho with URL and uske name, email,password ko dynamic bnao

  // Ex: a sample URL -> http://localhost:3000/users?email=b&password=c

  // make it dynamic. WE DID SAME IN SELLER LOGIN SERVICE
  userLogin(data:Login){

    // ye API signup type ka data return karega
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,{observe:'response'})
    .subscribe((result)=>{
      if(result && result.body?.length){  //body bhi NULL ho sakti hai and uski koi length honi chaiye
        // console.warn(result);

        // GET THIS EMITTER IN userAuth file
        this.InValiduserAuth.emit(false);

        // this data has header and body in it but we need to store only body hence this data needs to be stringified and then stored in local storage. 
          localStorage.setItem('user',JSON.stringify(result.body[0]));

          //now redirect it to home
          this.router.navigate(['/']);
      }

      // ERROR show karna hai using evenemitter
      // GET THIS EMITTER IN userAuth file
      else{
        this.InValiduserAuth.emit(true);

      }
          
    });

    
  }

  //to reload the page
  userAuthReload(){
    //if localstorage ke andar user hai log in karke abhi bhi to usko redirect kar do
    if(localStorage.getItem('user')){
      this.router.navigate(['home']);
    }
  }
}
