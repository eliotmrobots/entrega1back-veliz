
import { json, Router } from "express";
import ProductManager from "../manager/ProductManager.js"; 

const router = Router();
const productManager = new  ProductManager

// GET/ listar todos los productos 
router.get ("/" , (req, res)=> {
    const products = productManager.getProducts();
    res.json(products);
});

// GET/ Buscar producto por id 
router.get ("/:pid", (req,res)=> {
    const product = productManager.getProductsById(req.params.pid);
    
    if (!product){
        return res.status(404).json({error: "el producto no se encuentra"});
        }
        res.json(product);

    });

    //POST/ Agrega producto nuevo 

    router.post("/",(req,res) => {
        try{
        const newProduct = productManager.addProduct(req.body);
        res.status(201).json(newProduct);
        }catch(error){
            res.status(400).json({error: error.message});
        }
    });

    // PUT/actualizar producto

    router.put("/:pid", (req, res) => {
        try{
            const updatedProduct = productManager.updateProduct(req.params.pid, req.body);
            if (!updatedProduct){
                return res.status(404).json({error:"producto no encontrado"});
            }
            res.json(updatedProduct);
        }catch(error){
            res.status(400).json({error: error.message});
        }
    });

    // DELETE/ :pid eliminar producto
    router.delete("/:pid" , (req, res) =>{
        const deleteProduct = productManager.deleteProduct(req.params.pid);

        if(!deleteProduct){
            return res.status(404).json({error: "el producto no encontrado"});
            
        }
        res.json({message: "producto eliminado", product:deleteProduct});
    });


export default router;