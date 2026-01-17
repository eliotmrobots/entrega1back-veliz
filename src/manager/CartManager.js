import fs from "fs";
import path from "path";

class CartManager {
    constructor (){
        this.path = path.join(process.cwd(), "data", "carts.json");
    }

//leer todos los carritos 
getCarts(){
    try{
        const data = fs.readFileSync(this.path , "utf-8");
        return JSON.parse(data);

    }catch (error){
        return [];
    }
}

// carrito por id 
getCartById(id) {
    const carts = this.getCarts();
    return carts.find(c => c.id === parseInt (id));
}

// crear un nuevo carrito 
createCart() {
    const carts = this.getCarts();
    // generar un nuevo id 
    const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    
    const newCart = {
        id: newId,
        products: []
    };
    
    carts.push(newCart);
    this.saveCarts(carts);
    
    return newCart;
}

// agregar productos al carrito 
addProductToCart(cartId,productId){
    const carts = this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === parseInt(cartId));

    if (cartIndex === -1){
        return null;
    }
    const cart = carts[cartIndex];
        
        // Buscar si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));
        
        if (productIndex !== -1) {
            // Si existe, incrementar la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            cart.products.push({
                product: parseInt(productId),
                quantity: 1
            });
        }
        
        carts[cartIndex] = cart;
        this.saveCarts(carts);
        
        return cart;
    }

    // Guardar carritos en el archivo
    saveCarts(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
    }
}



export default CartManager;