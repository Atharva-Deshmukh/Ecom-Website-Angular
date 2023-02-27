// Ek aisa interface bnaya and then isi interface ko improt kiya har jagah (in seller-auth component)
export interface SignUp{
    name:string,
    password:string,
    email:string
}

export interface Login{
    email:string,
    password:string
}

export interface product{
    name:string,
    price:number,
    category:string,
    color:string,
    description:string,
    image:string,
    id:number,
    productId:undefined | number,
    quantity:undefined | number
}

export interface cart{
    name:string,
    price:number,
    category:string,
    color:string,
    description:string,
    image:string,
    id:number | undefined,
    quantity:undefined | number,
    userId:number,
    productId:number
}

export interface priceSummary{
    price:number,
    discount:number,
    tax:number,
    delivery:number,
    total:number
}

export interface order{
    email:string,
    address:string,
    contact:string,
    totalPrice:number,
    userId:string,
    id:number | undefined
}

export interface ordersmall{
    email:string,
    address:string,
    contact:string
}