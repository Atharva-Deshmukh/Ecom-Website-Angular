import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, product, order } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // jab bhi add to cart karte the, tan refresh karna padta tha varna card ka vo number badhta nhi tha isliye ek event emitter bnaya
  cartData = new EventEmitter<product[] | []>();

  // to call a service, u need a http client
  constructor(private http: HttpClient) { }

  addProduct(data: product) {
    console.warn("Product service called");

    // ye ab API pe post karo
    return this.http.post('http://localhost:3000/products', data);
  }

  // function to list products
  productList() {
    // API is type ka data return karegi
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  // API to delete product
  deleteProduct(id: number) {

    // humne ye is type ka url bnaya http://.......products/2  (if id=2)
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  // service to get product
  getProduct(id: string) {

    // calling API and ensuring that service returns product type of data
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  // ye function form me change kiye hue values change karega and jo unchanged hai vo as it is rakhega
  updateProduct(product: product) {

    // call API to update
    return this.http.put<product>(`http://localhost:3000/products/${product.id}`, product);
  }

  // CALL THESE SERVICES IN HOMECOMPONENT.TS

  // to display popular products
  popularProducts() {
    // Add limit to it so that it can display only selected products

    // ye limit wala tareekaa static hai. To make it dynamic we use algorithms like flipkart but ye sab JSON server me possible ni hai
    return this.http.get<product[]>('http://localhost:3000/products?_limit=4');
  }

  // to display trending products to buy
  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=6');
  }

  // to make AUTOSUGGESTION menubar (q likha for query)
  searchProducts(query: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
    // now call this API in home function
  }

  localAddToCart(data: product) {
    let cartData = [];

    // variable to check if cart already has something
    // agar localCart ke andar kuch hai to yaha mil jaaye
    let localCart = localStorage.getItem('localCart');

    // agar localCart yaani localstorage se kuch nikal ke nhi aaya to add karo
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));

      // emit explained in else{}
      this.cartData.emit([data]);
    }
    else {

      // purana data array me bharo and naya data push karwaao
      cartData = JSON.parse(localCart);
      cartData.push(data);

      // set it in local storage too
      localStorage.setItem('localCart', JSON.stringify(cartData));

      // emit karwaao isko in order to keeptrack of latest count and subscribe it in header components.ts
      this.cartData.emit(cartData);
    }



  }

  // add to cart se hi copy kiya almost
  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');

    // agar data hai to remove kar sakte hai
    if (cartData) {
      let items: product[] = JSON.parse(cartData);

      if (items) {

        // matlab items me is product ke alaawaa sab aayga. ISKO set karo ab local storage me as new updated cart
        items = items.filter((item: product) => productId !== item.id);

        // console.warn(items);

        // set it in local storage too
        localStorage.setItem('localCart', JSON.stringify(items));

        //update header in order to update cart(value) using event emitter as done above

        this.cartData.emit(items);

      }
    }

  }

  // adds data to cart AFTER user LOGGED IN
  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }

  // maanlo user ne ek system se login karke cart me kuch add kiya and dusre system se login karke buy kiya
  // iske liye data user id ke hisab se load karna padega in whichever device user logs in
  // userId wise cart nikaalo
  getCartList(userId: number) {
    return this.http.get<product[]>(`http://localhost:3000/cart?userId=${userId}`,
      { observe: 'response' }).subscribe((result) => {
        console.warn(result);

        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      })

  }


  // cart se data remove karwaane ke liye based on cartId
  removeFromCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user'); //this data is in stringify format
    let userData = userStore && JSON.parse(userStore);

    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  // orderList(){

  //   // getting userId first
  //   let userStore=localStorage.getItem('user'); //this data is in stringify format
  //   let userData=userStore && JSON.parse(userStore);

  //   return this.http.get<order[]>('http://localhost:3000/orders=',+userData.id);
  // }
}
