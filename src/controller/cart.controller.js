import { cartManagerMongoose } from "../dao/mongoManagers/cartM.manager.js";

async function getCartByIdC(req, res){
    const {cid}=req.params;
    console.log(`Tipo de productId en routes: ${typeof cid}, Valor de productId: ${cid}`);
    
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


async function addCartC(req, res) {
    try {
        const { products } = req.body;
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


async function addProductToCartC(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log(`En controller: cartId: ${cid}, productId: ${pid}, quantity: ${quantity}`);
    
    if (typeof quantity !== 'number' || isNaN(quantity)) {
        quantity = 1;
    }
    try {
        const newProduct = { id: pid, quantity: quantity };
        console.log('newProduct', newProduct);

        const cartToUpdate = await cartManagerMongoose.mongooseGetCartById(cid);
        console.log('cartToUpdate', cartToUpdate);
        const cartToUpdateProducts = cartToUpdate.products;
        console.log('cartToUpdateProducts', cartToUpdateProducts);

        
        cartToUpdateProducts.push(newProduct);
        console.log('cartToUpdateProducts actualizado', cartToUpdateProducts);

        const updatedCart = await cartManagerMongoose.mongooseUpdateCart(cid, { products: cartToUpdateProducts });
        res.status(200).json({ message: 'Producto agregado al carrito con éxito', updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}






export {
    getCartByIdC,
    addCartC,
    addProductToCartC
    } 