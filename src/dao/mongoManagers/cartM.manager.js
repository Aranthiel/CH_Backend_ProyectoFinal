import { cartModel } from './models/cart.model.js';

class CartManagerMongoose{
    
    async mongooseGetAllCarts(){
        const response = await cartModel.find()
        return response;
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
        const response = await cartModel.create(obj)
        return response;
    };


    async mongooseUpdateCart(cid, obj) {
        const response = await cartModel.updateOne({ _id: cid }, { $set: obj });
        return response;
    };
    
    async mongooseDeleteCart(cid){
        const response = await cartModel.findByIdAndDelete(cid);
        return response;
    }; 
}

export const cartManagerMongoose = new CartManagerMongoose();
