import { cartModel } from './models/cart.model.js';

class CartManagerMongoose{
    
    //GET
    async mongooseGetAllCarts(limit){
        console.log('cartM.Manager.js metodo mongooseGetAllCarts')
        limit ? limit  : undefined;
        const allCartsCM = await cartModel.find().limit(limit).populate();
        console.log('cartM.Manager.js metodo mongooseGetAllCarts allCartsCM ', typeof(allCartsCM));
        return allCartsCM;
    }

    //obj={user:"Fulanito"}
    async mongooseFindOneCart(obj){
        console.log('cartM.Manager.hjs metodo mongooseFindOneCart')
        const response= await cartModel.findOne(obj);
        return response;
    }

    async mongooseGetCartById(cid){
        console.log('cartM.Manager.hjs metodo mongooseGetCartById')
        const response = await cartModel.findById(cid).populate(`Productos`);
        return response;
    };

    //POST
    async mongooseAddCart(obj){
        console.log('cartM.Manager.hjs metodo mongooseAddCart')
        console.log('obj recibido en cartM.manager', obj);
        try {
            const response = await cartModel.create(obj);
            console.log('response mongooseAddCart', response);
            return response;
        } catch (error) {
            console.error('Error en mongooseAddCart', error);
            throw error; // O maneja el error de alguna otra forma
        }
        
    };

    async mongooseAddProductToCart(cid, obj){
        console.log('cartM.Manager.hjs metodo mongooseAddProductToCart')
        const response = await cartModel.updateOne({ _id: cid }, { $set: obj });
        return response;
    };
    
    //PUT


    //DELETE
    async mongooseDeleteCart(cid){
        const cartToDelete = await cartModel.findByIdAndDelete(cid);
        return cartToDelete;
    }; 

    async mongooseCleareCart(cid){
        const cartToClear = await cartModel.replaceOne({ _id: cid }, {products: []});
        console.log('cartToClear', cartToClear);
        return cartToClear;
    };

}

export const cartManagerMongoose = new CartManagerMongoose();
