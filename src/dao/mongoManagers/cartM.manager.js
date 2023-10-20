import { cartModel } from './models/cart.model.js';

class CartManagerMongoose{
    
    async mongooseGetAllCarts(limit){
        limit ? limit  : undefined;
        const allCarts = await cartModel.find().limit(limit);
        console.log('allCarts', allCarts);
        return allCarts;
    }

    //obj={user:"Fulanito"}
    async mongooseFindOneCart(obj){
        const response= await cartModel.findOne(obj);
        return response;
    }

    async mongooseGetCartById(cid){
        const response = await cartModel.findById(cid);
        return response;
    };

    async mongooseAddCart(obj){
        console.log('obj recibido en cartM.manager', obj);
        try {
            const response = await cartModel.create(obj);
            console.log('response mongooseAddCart', response);
            return response;
        } catch (error) {
            console.error('Error en mongooseAddCart:', error);
            throw error; // O maneja el error de alguna otra forma
        }
        
    };


    async mongooseUpdateCart(cid, obj) {
        const response = await cartModel.updateOne({ _id: cid }, { $set: obj });
        return response;
    };
    
    async mongooseDeleteCart(cid){
        const cartToDelete = await cartModel.findByIdAndDelete(cid);
        return cartToDelete;
    }; 
}

export const cartManagerMongoose = new CartManagerMongoose();
