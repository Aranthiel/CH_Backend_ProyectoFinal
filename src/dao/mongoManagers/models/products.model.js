import {Schema, model} from "mongoose";

//crear esquema
const productsColletion = 'productsColletion'
const productSchema = new Schema({

    title:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true,
        unique:true 
    },
    price:{
        type:Number,
        required:true
    },
    status: {
        type:Boolean
    },
    stock:{
        type:Number,        
    },
    category:{
        type:String,
        required:false,
    }, 
});


//crear modelo
export const productModel = model (productsColletion, productSchema);
