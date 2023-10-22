import {Schema, model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

//paginacion
productSchema.plugin(mongoosePaginate);

//crear modelo
export const productModel = model (productsColletion, productSchema);
