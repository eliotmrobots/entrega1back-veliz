import {Router} from "express";
import CartManager  from "../manager/CartManager.js";



const router = Router ();
const cartManager = new CartManager();

// POST / crear nuevo carrito 
router.post("/", (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);

});
// GET / Listar productos del carrito
router.get('/:cid', (req, res) => {
    const cart = cartManager.getCartById(req.params.cid);
    
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.json(cart);
});

// POST / Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cart = cartManager.addProductToCart(req.params.cid, req.params.pid);
    
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.json(cart);
});



export default router;