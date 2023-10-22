import { cartManagerMongoose } from "../dao/mongoManagers/cartM.manager.js";


//GET
async function getCartByIdC(req, res){
    console.log('cart.controller.js metodo getCartByIdC')
    const {cid}=req.params;
    
    try {
        const cartById= await cartManagerMongoose.mongooseGetCartById(cid)
        if(cartById !== null){
            res.status(200).json({message: 'Carrito encontrado:', cartById})
        }  else {
            res.status(404).json({message: `No se encontro el carrito con el id ${+cid}`})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

async function getCartsC(req, res){
    console.log('cart.controller.js metodo getCartsC')
    const limit = req.query.limit ? req.query.limit : undefined;  
    //mongooseGetAllCarts
    try {
        const allCarts = await cartManagerMongoose.mongooseGetAllCarts(limit);
        //console.log("controller allCarts" ,allCarts);
        if (!allCarts.length) {
            res.status(404).json({ success: false, message: 'No se encontraron carritos'});            
            /* const error = new Error('No se encontraron carritos');
            error.statusCode = 404;
            throw error; */
        } else{
            res.status(200).json({success: true, message: 'Carritos encontrados ', allCarts});            
            return allCarts;
        };
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    };
};


//POST
async function addCartC(req, res){
    console.log('cart.controller.js metodo addCartC')
    try { 
        const { products } = req.body;
        //console.log("addCartC cartM.controller products", products);

        if (products && Array.isArray(products)) {
            const nuevoCarrito = await cartManagerMongoose.mongooseAddCart({ products: products });
            res.status(201).json({ message: `Carrito creado con éxito con id: ${nuevoCarrito._id}`, nuevoCarrito });
        } else {
            res.status(400).json({ message: 'Carrito vacío o datos incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addProductToCartC(req, res){
    console.log('cart.controller.js metodo addProductToCartC')
    // ¿deberia usar     
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log(`En controller: cartId: ${cid}, productId: ${pid}, quantity: ${quantity}`);
    
    if (typeof quantity !== 'number' || isNaN(quantity)) {
        quantity = 1;
    }
    try {
        const newProduct = { id: pid, quantity: quantity };
        //console.log('newProduct', newProduct);

        const cartToUpdate = await cartManagerMongoose.mongooseGetCartById(cid);
        //console.log('cartToUpdate', cartToUpdate);
        const cartToUpdateProducts = cartToUpdate.products;
        //console.log('cartToUpdateProducts', cartToUpdateProducts);

        
        cartToUpdateProducts.push(newProduct);
        console.log('cartToUpdateProducts actualizado', cartToUpdateProducts);

        const updatedCart = await cartManagerMongoose.mongooseAddProductToCart(cid, { products: cartToUpdateProducts });
        res.status(200).json({ message: 'Producto agregado al carrito con éxito', updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//PUT
async function updateCartC(req, res){
    console.log('cart.controller.js metodo updateCartC')
    //actualiza carrito cn arreglo de productos especificado arriba
    const {cid} =req.params;
    const arrayProducts = req.body;

}

async function updateProductFromCartC(req, res){
    console.log('cart.controller.js metodo updateProductFromCartC')
    //solo permitre actualizar la cantidad de ese producto por la pasada desde query.body
    const { cid, pid } = req.params;
    const updateQ = req.body;

}

//DELETE
async function deleteCartC(req, res){
    console.log('cart.controller.js metodo deleteCartC')
    //DELETE api/carts/:cid elimina los productos del carrito
    const { cid } = req.params;
    try {
        const response = await cartManagerMongoose.mongooseDeleteCart(cid);
        if (response) {
            res.status(200).json({ success: true, message: 'Carrito eliminado con éxito', product: response });
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el carrito con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

async function deleteAllProductsFromCartC(req, res){
    console.log('cart.controller.js metodo deleteAllProductsFromCartC')
    //DELETE api/carts/:cid elimina los productos del carrito
    const { cid } = req.params;
    try {
        const response = await cartManagerMongoose.mongooseCleareCart(cid);
        if (response) {
            res.status(200).json({ success: true, message: 'Carrito eliminado con éxito', product: response });
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el carrito con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
async function delteProductFromCartC(req, res){
    console.log('cart.controller.js metodo delteProductFromCartC')
    // eliminar del carrito el producto seleccionado
    const { cid, pid } = req.params;
    try {
        const response = await cartManagerMongoose.mongooseCleareCart(cid);
        if (response) {
            res.status(200).json({ success: true, message: 'Carrito eliminado con éxito', product: response });
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el carrito con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export {
    getCartByIdC,     
    getCartsC,
    addCartC,
    addProductToCartC,
    updateCartC,
    updateProductFromCartC,
    deleteCartC,
    deleteAllProductsFromCartC,
    delteProductFromCartC
    } 