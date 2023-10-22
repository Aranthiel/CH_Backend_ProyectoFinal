import { Schema, model } from "mongoose";

const cartColletion = 'cartsColletion'
const cartSchema = new Schema({
    products: {
        type:[
            {
                productoId: {
                    type: Schema.Types.ObjectId, 
                    ref: 'productModel' // Nombre de la colección a la que haces referencia
                },
                quantity: Number,
            },
        ],
        default:[]
    }
});

export const cartModel = model (cartColletion, cartSchema);

