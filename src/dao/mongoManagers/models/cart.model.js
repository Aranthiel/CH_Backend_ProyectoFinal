import { Schema, model } from "mongoose";

// Crear esquema
const cartSchema = new Schema({
    products: [
        {
            productoId: {
                type: Schema.Types.ObjectId,
                ref: 'Productos', // Nombre de la colección a la que haces referencia
            },
            quantity: Number,
        },
    ],
});


// Crear modelo
export const cartModel = model('Carritos', cartSchema);
